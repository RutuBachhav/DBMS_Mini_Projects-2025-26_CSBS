const db = require('./config/db');

async function checkProductsTable() {
  try {
    const [desc] = await db.execute('DESCRIBE products');
    console.log('Products Table Structure:', desc);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkProductsTable();
