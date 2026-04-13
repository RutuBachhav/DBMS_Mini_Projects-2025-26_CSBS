import express from 'express';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// Get all users (admin only) — supports ?search=keyword
router.get('/', authenticate, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search && search.trim()) {
      const regex = { $regex: search.trim(), $options: 'i' };
      filter = { $or: [{ name: regex }, { email: regex }] };
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role (admin only)
router.patch('/:id/role', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;

    if (!['reader', 'staff'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either reader or staff' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot modify admin role' });
    }

    user.role = role;
    await user.save();

    res.json({
      message: `Role updated to ${role}`,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete own account (any authenticated user, mainly for readers)
router.delete('/me', authenticate, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admin account cannot be deleted' });
    }

    // Check for unreturned books
    const activeTransactions = await Transaction.find({
      readerId: req.user._id,
      status: 'issued',
    });

    if (activeTransactions.length > 0) {
      return res.status(400).json({ message: 'Return all books before deleting your account' });
    }

    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user by ID (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    // Admin cannot delete themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete another admin account' });
    }

    // Check for unreturned books
    const activeTransactions = await Transaction.find({
      readerId: user._id,
      status: 'issued',
    });

    if (activeTransactions.length > 0) {
      return res.status(400).json({ message: 'User has unreturned books. Cannot delete.' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
