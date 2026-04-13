const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { queryGet } = require('../database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Check in admins table first
    const admin = queryGet('SELECT * FROM admins WHERE email = ?', [email]);
    if (admin) {
      const validPassword = bcrypt.compareSync(password, admin.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = jwt.sign(
        { id: admin.admin_id, email: admin.email, role: 'admin', name: admin.name },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: admin.admin_id,
          email: admin.email,
          role: 'admin',
          name: admin.name
        }
      });
    }

    // Check in employees table
    const employee = queryGet('SELECT * FROM employees WHERE email = ?', [email]);
    if (!employee) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = bcrypt.compareSync(password, employee.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      {
        id: employee.employee_id,
        email: employee.email,
        role: 'employee',
        name: employee.name,
        department: employee.department
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: employee.employee_id,
        email: employee.email,
        role: 'employee',
        name: employee.name,
        department: employee.department
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
