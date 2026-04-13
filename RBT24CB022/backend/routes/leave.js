const express = require('express');
const { queryAll, queryGet, runSql } = require('../database');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/leave - Submit leave request (employee)
router.post('/', verifyToken, requireRole('employee'), (req, res) => {
  try {
    const { leave_type, start_date, end_date, reason } = req.body;
    const employeeId = req.user.id;

    if (!leave_type || !start_date || !end_date) {
      return res.status(400).json({ error: 'Leave type, start date, and end date are required.' });
    }

    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({ error: 'Start date cannot be after end date.' });
    }

    const result = runSql(
      'INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
      [employeeId, leave_type, start_date, end_date, reason || '', 'pending']
    );

    res.status(201).json({
      message: 'Leave request submitted successfully.',
      leave_id: result.lastInsertRowid
    });
  } catch (err) {
    console.error('Submit leave error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/leave/my - Employee's own leave requests
router.get('/my', verifyToken, requireRole('employee'), (req, res) => {
  try {
    const employeeId = req.user.id;
    const requests = queryAll(
      'SELECT * FROM leave_requests WHERE employee_id = ? ORDER BY created_at DESC', [employeeId]
    );
    res.json(requests);
  } catch (err) {
    console.error('Get my leaves error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/leave - Admin: all leave requests
router.get('/', verifyToken, requireRole('admin'), (req, res) => {
  try {
    const { status, department } = req.query;
    let query = `
      SELECT lr.*, e.name, e.department, e.email 
      FROM leave_requests lr 
      JOIN employees e ON lr.employee_id = e.employee_id 
      WHERE 1=1
    `;
    const params = [];

    if (status) { query += ' AND lr.status = ?'; params.push(status); }
    if (department) { query += ' AND e.department = ?'; params.push(department); }

    query += ' ORDER BY lr.created_at DESC';
    const requests = queryAll(query, params);
    res.json(requests);
  } catch (err) {
    console.error('Get all leaves error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/leave/:id - Admin: approve/reject
router.put('/:id', verifyToken, requireRole('admin'), (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "approved" or "rejected".' });
    }

    const leave = queryGet('SELECT * FROM leave_requests WHERE leave_id = ?', [parseInt(req.params.id)]);
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found.' });
    }

    runSql('UPDATE leave_requests SET status = ? WHERE leave_id = ?', [status, parseInt(req.params.id)]);

    // Send notification to employee
    const message = `Your ${leave.leave_type} request (${leave.start_date} to ${leave.end_date}) has been ${status}.`;
    runSql('INSERT INTO notifications (message, employee_id, title) VALUES (?, ?, ?)',
      [message, leave.employee_id, `Leave ${status.charAt(0).toUpperCase() + status.slice(1)}`]);

    res.json({ message: `Leave request ${status} successfully.` });
  } catch (err) {
    console.error('Update leave error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
