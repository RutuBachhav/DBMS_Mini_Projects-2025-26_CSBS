const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function forceInit() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });

  try {
    console.log('--- REBUILDING DATABASE ---');
    await connection.query('DROP DATABASE IF EXISTS stockup_db');
    await connection.query('CREATE DATABASE stockup_db');
    await connection.query('USE stockup_db');

    console.log('--- APPLYING SCHEMA ---');
    const schemaSql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
    await connection.query(schemaSql);

    console.log('--- SUCCESS: SYSTEM STABILIZED ---');
    process.exit(0);
  } catch (err) {
    console.error('Initialization error:', err.message);
    process.exit(1);
  } finally {
    connection.end();
  }
}

forceInit();
