const express = require('express');
const bcrypt = require('bcryptjs');
const { queryAll, queryGet, runSql } = require('../database');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/employees - List all employees (admin only)
router.get('/', verifyToken, requireRole('admin'), (req, res) => {
  try {
    const { department, search } = req.query;
    let query = 'SELECT employee_id, name, department, email, role, created_at FROM employees WHERE 1=1';
    const params = [];

    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';
    const employees = queryAll(query, params);
    res.json(employees);
  } catch (err) {
    console.error('Get employees error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/employees/departments - Get unique departments
router.get('/departments', verifyToken, (req, res) => {
  try {
    const departments = queryAll('SELECT DISTINCT department FROM employees ORDER BY department');
    res.json(departments.map(d => d.department));
  } catch (err) {
    console.error('Get departments error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/employees/:id - Get single employee
router.get('/:id', verifyToken, (req, res) => {
  try {
    const employee = queryGet('SELECT employee_id, name, department, email, role, created_at FROM employees WHERE employee_id = ?', [parseInt(req.params.id)]);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }
    res.json(employee);
  } catch (err) {
    console.error('Get employee error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/employees - Add employee (admin only)
router.post('/', verifyToken, requireRole('admin'), (req, res) => {
  try {
    const { name, department, email, password } = req.body;

    if (!name || !department || !email || !password) {
      return res.status(400).json({ error: 'Name, department, email, and password are required.' });
    }

    const existing = queryGet('SELECT email FROM employees WHERE email = ?', [email]);
    if (existing) {
      return res.status(409).json({ error: 'An employee with this email already exists.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = runSql(
      'INSERT INTO employees (name, department, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, department, email, hashedPassword, 'employee']
    );

    res.status(201).json({
      message: 'Employee added successfully.',
      employee_id: result.lastInsertRowid
    });
  } catch (err) {
    console.error('Add employee error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/employees/:id - Edit employee (admin only)
router.put('/:id', verifyToken, requireRole('admin'), (req, res) => {
  try {
    const { name, department, email, password } = req.body;
    const employee = queryGet('SELECT * FROM employees WHERE employee_id = ?', [parseInt(req.params.id)]);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    if (email && email !== employee.email) {
      const existing = queryGet('SELECT email FROM employees WHERE email = ? AND employee_id != ?', [email, parseInt(req.params.id)]);
      if (existing) {
        return res.status(409).json({ error: 'An employee with this email already exists.' });
      }
    }

    const updatedName = name || employee.name;
    const updatedDept = department || employee.department;
    const updatedEmail = email || employee.email;
    const updatedPassword = password ? bcrypt.hashSync(password, 10) : employee.password;

    runSql(
      'UPDATE employees SET name = ?, department = ?, email = ?, password = ? WHERE employee_id = ?',
      [updatedName, updatedDept, updatedEmail, updatedPassword, parseInt(req.params.id)]
    );

    res.json({ message: 'Employee updated successfully.' });
  } catch (err) {
    console.error('Update employee error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/employees/:id - Delete employee (admin only)
router.delete('/:id', verifyToken, requireRole('admin'), (req, res) => {
  try {
    const employee = queryGet('SELECT * FROM employees WHERE employee_id = ?', [parseInt(req.params.id)]);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    runSql('DELETE FROM employees WHERE employee_id = ?', [parseInt(req.params.id)]);
    res.json({ message: 'Employee deleted successfully.' });
  } catch (err) {
    console.error('Delete employee error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
