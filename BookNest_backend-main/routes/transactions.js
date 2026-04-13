import express from 'express';
import Transaction from '../models/Transaction.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// Issue book (staff/admin only)
router.post('/issue', authenticate, authorize('staff', 'admin'), async (req, res) => {
  try {
    const { readerEmail, bookId, dueDays } = req.body;

    if (!readerEmail || !bookId) {
      return res.status(400).json({ message: 'Reader email and book ID are required' });
    }

    const reader = await User.findOne({ email: readerEmail });
    if (!reader) {
      return res.status(404).json({ message: 'No user found with that email' });
    }

    if (reader.role !== 'reader') {
      return res.status(400).json({ message: 'Books can only be issued to readers' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available for this book' });
    }

    // Prevent duplicate active issue
    const existing = await Transaction.findOne({
      readerId: reader._id,
      bookId: book._id,
      status: 'issued',
    });

    if (existing) {
      return res.status(400).json({ message: 'This reader already has this book issued' });
    }

    const days = dueDays && Number(dueDays) > 0 ? Number(dueDays) : 14;
    const dueDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const transaction = new Transaction({
      readerId: reader._id,
      bookId: book._id,
      issueDate: new Date(),
      dueDate,
      status: 'issued',
    });

    book.availableCopies -= 1;
    await book.save();
    await transaction.save();

    const populated = await Transaction.findById(transaction._id)
      .populate('readerId', 'name email')
      .populate('bookId', 'title author isbn');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Request a book (reader only)
router.post('/request', authenticate, authorize('reader'), async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available for this book' });
    }

    // Prevent duplicate pending request
    const existingRequest = await Transaction.findOne({
      readerId: req.user._id,
      bookId: book._id,
      type: 'request',
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this book' });
    }

    // Prevent requesting a book already issued to this reader
    const existingIssue = await Transaction.findOne({
      readerId: req.user._id,
      bookId: book._id,
      status: { $in: ['issued', 'approved'] },
    });

    if (existingIssue) {
      return res.status(400).json({ message: 'You already have this book issued' });
    }

    const transaction = new Transaction({
      readerId: req.user._id,
      bookId: book._id,
      type: 'request',
      status: 'pending',
    });

    await transaction.save();

    const populated = await Transaction.findById(transaction._id)
      .populate('readerId', 'name email')
      .populate('bookId', 'title author isbn');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending requests (staff/admin only)
router.get('/requests/pending', authenticate, authorize('staff', 'admin'), async (req, res) => {
  try {
    const requests = await Transaction.find({ type: 'request', status: 'pending' })
      .populate('readerId', 'name email')
      .populate('bookId', 'title author isbn')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve a request (staff/admin only)
router.put('/:id/approve', authenticate, authorize('staff', 'admin'), async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.type !== 'request' || transaction.status !== 'pending') {
      return res.status(400).json({ message: 'This transaction is not a pending request' });
    }

    const book = await Book.findById(transaction.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available for this book' });
    }

    // Approve: change type to issue, status to approved, set dates
    transaction.type = 'issue';
    transaction.status = 'approved';
    transaction.issueDate = new Date();
    transaction.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await transaction.save();

    book.availableCopies -= 1;
    await book.save();

    const populated = await Transaction.findById(transaction._id)
      .populate('readerId', 'name email')
      .populate('bookId', 'title author isbn');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Return book (staff/admin only)
router.post('/return/:id', authenticate, authorize('staff', 'admin'), async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status === 'returned') {
      return res.status(400).json({ message: 'Book has already been returned' });
    }

    const returnDate = new Date();
    let fine = 0;

    // Calculate fine: ₹5 per day overdue
    if (returnDate > transaction.dueDate) {
      const diffMs = returnDate - transaction.dueDate;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      fine = diffDays * 5;
    }

    transaction.returnDate = returnDate;
    transaction.fine = fine;
    transaction.status = 'returned';
    await transaction.save();

    // Restore book copy
    const book = await Book.findById(transaction.bookId);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    const populated = await Transaction.findById(transaction._id)
      .populate('readerId', 'name email')
      .populate('bookId', 'title author isbn');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my transactions (any authenticated user — for readers)
router.get('/my', authenticate, async (req, res) => {
  try {
    const transactions = await Transaction.find({ readerId: req.user._id })
      .populate('bookId', 'title author isbn')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my pending requests (reader)
router.get('/my/requests', authenticate, async (req, res) => {
  try {
    const requests = await Transaction.find({
      readerId: req.user._id,
      type: 'request',
      status: 'pending',
    })
      .populate('bookId', 'title author isbn')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all transactions (staff/admin)
router.get('/', authenticate, authorize('staff', 'admin'), async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('readerId', 'name email')
      .populate('bookId', 'title author isbn')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
