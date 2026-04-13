const db = require('../config/db');

// Create Transaction (SALE or PURCHASE)
const createTransaction = async (req, res) => {
  const userId = req.user.user_id;
  const { type, items } = req.body; // type: 'SALE' or 'PURCHASE', items: [{product_id, quantity, price}]

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items provided for transaction.' });
  }

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    let totalAmount = 0;

    // 1. Calculate totals and Validate items
    for (const item of items) {
      const [productRows] = await conn.execute(
        'SELECT quantity, name FROM products WHERE product_id = ? AND user_id = ?',
        [item.product_id, userId]
      );

      if (productRows.length === 0) {
        throw new Error(`Product ID ${item.product_id} not found or unauthorized.`);
      }

      const product = productRows[0];
      if (type === 'SALE' && product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}. Available: ${product.quantity}`);
      }

      totalAmount += item.quantity * item.price;
    }

    // 2. Insert into transactions table
    const [transResult] = await conn.execute(
      'INSERT INTO transactions (user_id, type, total_amount) VALUES (?, ?, ?)',
      [userId, type, totalAmount]
    );
    const transactionId = transResult.insertId;

    // 3. Process each item (Atomic updates)
    for (const item of items) {
      // a. Insert into transaction_items
      await conn.execute(
        'INSERT INTO transaction_items (transaction_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [transactionId, item.product_id, item.quantity, item.price]
      );

      // b. Update Product Stock (Atomic increment/decrement)
      const stockChange = type === 'SALE' ? -item.quantity : item.quantity;
      await conn.execute(
        'UPDATE products SET quantity = quantity + ? WHERE product_id = ?',
        [stockChange, item.product_id]
      );

      // c. Insert into stock_logs
      const logType = type === 'SALE' ? 'OUT' : 'IN';
      await conn.execute(
        'INSERT INTO stock_logs (product_id, user_id, change_type, quantity_changed) VALUES (?, ?, ?, ?)',
        [item.product_id, userId, logType, item.quantity]
      );
    }

    await conn.commit();
    res.status(201).json({ 
      message: 'Transaction completed successfully', 
      transactionId, 
      totalAmount 
    });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ message: 'Transaction aborted', error: err.message });
  } finally {
    conn.release();
  }
};

// Get Transaction History
const getTransactions = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createTransaction, getTransactions };
