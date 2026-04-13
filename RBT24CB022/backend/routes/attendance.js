const express = require('express');
const { queryAll, queryGet, runSql } = require('../database');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/attendance/checkin - Employee check-in
router.post('/checkin', verifyToken, requireRole('employee'), (req, res) => {
  try {
    const employeeId = req.user.id;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(' ')[0].substring(0, 5);

    const existing = queryGet('SELECT * FROM attendance_records WHERE employee_id = ? AND date = ?', [employeeId, today]);
    if (existing) {
      return res.status(400).json({ error: 'Already checked in today.' });
    }

    const hour = parseInt(now.split(':')[0]);
    const status = hour >= 10 ? 'late' : 'present';

    runSql(
      'INSERT INTO attendance_records (employee_id, date, check_in_time, status) VALUES (?, ?, ?, ?)',
      [employeeId, today, now, status]
    );

    res.json({ message: 'Checked in successfully.', check_in_time: now, status });
  } catch (err) {
    console.error('Check-in error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/attendance/checkout - Employee check-out
router.post('/checkout', verifyToken, requireRole('employee'), (req, res) => {
  try {
    const employeeId = req.user.id;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(' ')[0].substring(0, 5);

    const existing = queryGet('SELECT * FROM attendance_records WHERE employee_id = ? AND date = ?', [employeeId, today]);
    if (!existing) {
      return res.status(400).json({ error: 'You have not checked in today.' });
    }
    if (existing.check_out_time) {
      return res.status(400).json({ error: 'Already checked out today.' });
    }

    const checkInParts = existing.check_in_time.split(':');
    const checkOutParts = now.split(':');
    const hoursWorked = (parseInt(checkOutParts[0]) + parseInt(checkOutParts[1]) / 60) -
                         (parseInt(checkInParts[0]) + parseInt(checkInParts[1]) / 60);

    const status = hoursWorked < 4 ? 'half-day' : existing.status;

    runSql('UPDATE attendance_records SET check_out_time = ?, status = ? WHERE id = ?', [now, status, existing.id]);

    res.json({
      message: 'Checked out successfully.',
      check_out_time: now,
      hours_worked: hoursWorked.toFixed(1),
      status
    });
  } catch (err) {
    console.error('Check-out error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/attendance/today - Get today's status for employee
router.get('/today', verifyToken, requireRole('employee'), (req, res) => {
  try {
    const employeeId = req.user.id;
    const today = new Date().toISOString().split('T')[0];
    const record = queryGet('SELECT * FROM attendance_records WHERE employee_id = ? AND date = ?', [employeeId, today]);
    res.json(record || null);
  } catch (err) {
    console.error('Get today attendance error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/attendance/my - Employee's own attendance history
router.get('/my', verifyToken, requireRole('employee'), (req, res) => {
  try {
    const employeeId = req.user.id;
    const { from, to } = req.query;
    let query = 'SELECT * FROM attendance_records WHERE employee_id = ?';
    const params = [employeeId];

    if (from) { query += ' AND date >= ?'; params.push(from); }
    if (to) { query += ' AND date <= ?'; params.push(to); }

    query += ' ORDER BY date DESC LIMIT 100';
    const records = queryAll(query, params);
    res.json(records);
  } catch (err) {
    console.error('Get my attendance error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/attendance/report - Admin: attendance analytics (MUST be before /:anything)
router.get('/report', verifyToken, requireRole('admin'), (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const totalEmployees = queryGet('SELECT COUNT(*) as count FROM employees').count;
    const presentToday = queryGet("SELECT COUNT(*) as count FROM attendance_records WHERE date = ? AND status IN ('present', 'late')", [today]).count;
    const lateToday = queryGet("SELECT COUNT(*) as count FROM attendance_records WHERE date = ? AND status = 'late'", [today]).count;
    const absentToday = totalEmployees - presentToday;
    const pendingLeaves = queryGet("SELECT COUNT(*) as count FROM leave_requests WHERE status = 'pending'").count;

    // Last 7 days attendance trend
    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      const count = queryGet("SELECT COUNT(*) as count FROM attendance_records WHERE date = ? AND status IN ('present', 'late')", [d]).count;
      trend.push({ date: d, present: count });
    }

    // Department-wise breakdown
    const deptBreakdown = queryAll(`
      SELECT e.department, COUNT(DISTINCT e.employee_id) as total,
        SUM(CASE WHEN ar.date = ? AND ar.status IN ('present', 'late') THEN 1 ELSE 0 END) as present_today
      FROM employees e
      LEFT JOIN attendance_records ar ON e.employee_id = ar.employee_id AND ar.date = ?
      GROUP BY e.department
    `, [today, today]);

    res.json({ totalEmployees, presentToday, lateToday, absentToday, pendingLeaves, trend, deptBreakdown });
  } catch (err) {
    console.error('Attendance report error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/attendance - Admin: all attendance records
router.get('/', verifyToken, requireRole('admin'), (req, res) => {
  try {
    const { date, department, from, to } = req.query;
    let query = `
      SELECT ar.*, e.name, e.department, e.email 
      FROM attendance_records ar 
      JOIN employees e ON ar.employee_id = e.employee_id 
      WHERE 1=1
    `;
    const params = [];

    if (date) { query += ' AND ar.date = ?'; params.push(date); }
    if (from) { query += ' AND ar.date >= ?'; params.push(from); }
    if (to) { query += ' AND ar.date <= ?'; params.push(to); }
    if (department) { query += ' AND e.department = ?'; params.push(department); }

    query += ' ORDER BY ar.date DESC, e.name ASC LIMIT 500';
    const records = queryAll(query, params);
    res.json(records);
  } catch (err) {
    console.error('Get all attendance error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
