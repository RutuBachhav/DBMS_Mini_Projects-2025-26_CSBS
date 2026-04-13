const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Reach for the backend .env
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

async function forceInit() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Payalpr10$',
    multipleStatements: true
  });

  try {
    console.log('DROPPING AND RE-CREATING DATABASE...');
    await connection.query('DROP DATABASE IF EXISTS stockup_db');
    await connection.query('CREATE DATABASE stockup_db');
    await connection.query('USE stockup_db');

    console.log('APPLYING SCHEMA FROM schema.sql...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Using multipleStatements: true allows us to run the whole file at once
    await connection.query(schemaSql);

    console.log('SUCCESS: Database is now in sync with the latest schema.');
    process.exit(0);
  } catch (err) {
    console.error('CRITICAL ERROR during database initialization:', err.message);
    process.exit(1);
  } finally {
    connection.end();
  }
}

forceInit();
