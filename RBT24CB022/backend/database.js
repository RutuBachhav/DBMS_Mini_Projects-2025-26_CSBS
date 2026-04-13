const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'attendance.db');

let db = null;

function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

// Auto-save every 5 seconds
setInterval(saveDb, 5000);

async function initDatabase() {
  const SQL = await initSqlJs();

  // Load existing database or create new one
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT DEFAULT 'admin',
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT 'Admin'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      department TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'employee',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS attendance_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      check_in_time TEXT,
      check_out_time TEXT,
      status TEXT DEFAULT 'present',
      FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS leave_requests (
      leave_id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      leave_type TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      reason TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL,
      sent_time TEXT DEFAULT (datetime('now')),
      employee_id INTEGER NOT NULL,
      is_read INTEGER DEFAULT 0,
      title TEXT DEFAULT 'Notification',
      FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
    )
  `);

  // Seed default data
  seedData();
  saveDb();

  console.log('✅ Database initialized');
  return db;
}

function seedData() {
  const result = db.exec('SELECT COUNT(*) as count FROM admins');
  const adminCount = result[0].values[0][0];

  if (adminCount === 0) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.run('INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Super Admin', 'admin@company.com', hashedPassword, 'admin']);
    console.log('✅ Default admin seeded: admin@company.com / admin123');
  }

  const empResult = db.exec('SELECT COUNT(*) as count FROM employees');
  const empCount = empResult[0].values[0][0];

  if (empCount === 0) {
    const hashedPassword = bcrypt.hashSync('emp123', 10);

    const employees = [
      ['John Smith', 'Engineering', 'john@company.com', hashedPassword, 'employee'],
      ['Jane Doe', 'Design', 'jane@company.com', hashedPassword, 'employee'],
      ['Mike Johnson', 'Engineering', 'mike@company.com', hashedPassword, 'employee'],
      ['Sarah Williams', 'Marketing', 'sarah@company.com', hashedPassword, 'employee'],
      ['David Brown', 'HR', 'david@company.com', hashedPassword, 'employee'],
    ];

    for (const emp of employees) {
      db.run('INSERT INTO employees (name, department, email, password, role) VALUES (?, ?, ?, ?, ?)', emp);
    }
    console.log('✅ Default employees seeded');

    // Seed some attendance records for demo
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

    const attendanceData = [
      [1, yesterday, '09:00', '17:30', 'present'],
      [2, yesterday, '09:15', '17:00', 'present'],
      [3, yesterday, '10:05', '17:45', 'late'],
      [1, twoDaysAgo, '08:55', '17:20', 'present'],
      [2, twoDaysAgo, '09:00', '13:00', 'half-day'],
      [4, yesterday, '09:00', '17:00', 'present'],
      [5, yesterday, null, null, 'absent'],
    ];
    for (const r of attendanceData) {
      db.run('INSERT INTO attendance_records (employee_id, date, check_in_time, check_out_time, status) VALUES (?, ?, ?, ?, ?)', r);
    }
    console.log('✅ Sample attendance records seeded');

    // Seed some leave requests
    db.run('INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
      [1, 'Sick Leave', '2026-04-01', '2026-04-02', 'Not feeling well', 'pending']);
    db.run('INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
      [2, 'Vacation', '2026-04-10', '2026-04-15', 'Family trip', 'approved']);
    db.run('INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
      [3, 'Personal', '2026-03-30', '2026-03-30', 'Personal work', 'pending']);
    console.log('✅ Sample leave requests seeded');

    // Seed some notifications
    db.run('INSERT INTO notifications (message, employee_id, title) VALUES (?, ?, ?)',
      ['Welcome to the Attendance Management System!', 1, 'Welcome']);
    db.run('INSERT INTO notifications (message, employee_id, title) VALUES (?, ?, ?)',
      ['Welcome to the Attendance Management System!', 2, 'Welcome']);
    db.run('INSERT INTO notifications (message, employee_id, title) VALUES (?, ?, ?)',
      ['Please update your profile details.', 1, 'Profile Update']);
    console.log('✅ Sample notifications seeded');
  }
}

// Helper functions to provide a similar API to better-sqlite3
function getDb() {
  return db;
}

// Prepare-like helper that returns objects for SELECT queries
function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function queryGet(sql, params = []) {
  const results = queryAll(sql, params);
  return results.length > 0 ? results[0] : null;
}

function runSql(sql, params = []) {
  db.run(sql, params);
  saveDb();
  const lastId = db.exec('SELECT last_insert_rowid() as id');
  const changes = db.exec('SELECT changes() as changes');
  return {
    lastInsertRowid: lastId[0]?.values[0]?.[0] || 0,
    changes: changes[0]?.values[0]?.[0] || 0
  };
}

module.exports = { initDatabase, getDb, queryAll, queryGet, runSql, saveDb };
