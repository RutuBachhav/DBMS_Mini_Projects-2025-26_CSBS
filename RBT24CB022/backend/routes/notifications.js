const express = require('express');
const { queryAll, queryGet, runSql } = require('../database');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/notifications - Admin: send notification
router.post('/', verifyToken, requireRole('admin'), (req, res) => {
  try {
    const { message, employee_id, title } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const notifTitle = title || 'Notification';

    if (employee_id === 'all' || !employee_id) {
      const employees = queryAll('SELECT employee_id FROM employees');
      for (const emp of employees) {
        runSql('INSERT INTO notifications (message, employee_id, title) VALUES (?, ?, ?)',
          [message, emp.employee_id, notifTitle]);
      }
      res.status(201).json({ message: `Notification sent to ${employees.length} employees.` });
    } else {
      const employee = queryGet('SELECT employee_id FROM employees WHERE employee_id = ?', [parseInt(employee_id)]);
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found.' });
      }

      runSql('INSERT INTO notifications (message, employee_id, title) VALUES (?, ?, ?)',
        [message, parseInt(employee_id), notifTitle]);
      res.status(201).json({ message: 'Notification sent successfully.' });
    }
  } catch (err) {
    console.error('Send notification error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/notifications - Get notifications for current user
router.get('/', verifyToken, (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const notifications = queryAll(`
        SELECT n.*, e.name as employee_name 
        FROM notifications n 
        JOIN employees e ON n.employee_id = e.employee_id 
        ORDER BY n.sent_time DESC LIMIT 100
      `);
      return res.json(notifications);
    }

    const notifications = queryAll(
      'SELECT * FROM notifications WHERE employee_id = ? ORDER BY sent_time DESC LIMIT 50',
      [req.user.id]
    );
    res.json(notifications);
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/notifications/unread-count - Get unread count
router.get('/unread-count', verifyToken, (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.json({ count: 0 });
    }
    const result = queryGet(
      'SELECT COUNT(*) as count FROM notifications WHERE employee_id = ? AND is_read = 0',
      [req.user.id]
    );
    res.json({ count: result.count });
  } catch (err) {
    console.error('Get unread count error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/notifications/read-all - Mark all as read (MUST be before /:id routes)
router.put('/read-all', verifyToken, (req, res) => {
  try {
    if (req.user.role === 'employee') {
      runSql('UPDATE notifications SET is_read = 1 WHERE employee_id = ?', [req.user.id]);
    }
    res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    console.error('Mark all read error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/notifications/:id/read - Mark as read
router.put('/:id/read', verifyToken, (req, res) => {
  try {
    runSql('UPDATE notifications SET is_read = 1 WHERE notification_id = ?', [parseInt(req.params.id)]);
    res.json({ message: 'Marked as read.' });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
