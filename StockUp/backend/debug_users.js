const db = require('./config/db');

async function checkUsers() {
  try {
    const [rows] = await db.execute('SELECT user_id, name, email, password FROM users');
    console.log('--- USERS IN DATABASE ---');
    rows.forEach(user => {
      console.log(`ID: ${user.user_id} | Name: ${user.name} | Email: ${user.email} | Hash Length: ${user.password.length}`);
    });
    console.log('-------------------------');
    process.exit(0);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    process.exit(1);
  }
}

checkUsers();
