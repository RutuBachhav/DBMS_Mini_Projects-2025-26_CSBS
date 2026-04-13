const db = require('./config/db');

async function checkSchema() {
  try {
    const [tables] = await db.execute('SHOW TABLES');
    console.log('Tables:', tables);
    
    if (tables.length > 0) {
      const [desc] = await db.execute('DESCRIBE users');
      console.log('Users Table Description:', desc);
    } else {
      console.log('NO TABLES FOUND!');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkSchema();
