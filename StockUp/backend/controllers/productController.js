const db = require('../config/db');

// Add Product
const addProduct = async (req, res) => {
  const userId = req.user.user_id;
  const { name, sku, description, quantity, price, category_id, supplier_id } = req.body;

  // Validation
  if (!name || !sku || quantity < 0 || price < 0) {
    return res.status(400).json({ message: 'Invalid product data. Quantity and Price must be 0 or higher.' });
  }

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    // 1. Check SKU Uniqueness for the current user
    const [existing] = await conn.execute(
      'SELECT * FROM products WHERE sku = ? AND user_id = ?',
      [sku, userId]
    );
    if (existing.length > 0) {
      await conn.rollback();
      return res.status(400).json({ message: 'SKU already exists for this user.' });
    }

    // 2. Validate Category and Supplier existence if provided (and isolated to user)
    if (category_id) {
      const [cat] = await conn.execute('SELECT * FROM categories WHERE category_id = ? AND user_id = ?', [category_id, userId]);
      if (cat.length === 0) {
        await conn.rollback();
        return res.status(400).json({ message: 'Invalid category selection.' });
      }
    }
    if (supplier_id) {
      const [sup] = await conn.execute('SELECT * FROM suppliers WHERE supplier_id = ? AND user_id = ?', [supplier_id, userId]);
      if (sup.length === 0) {
        await conn.rollback();
        return res.status(400).json({ message: 'Invalid supplier selection.' });
      }
    }

    // 3. Insert Product
    const [result] = await conn.execute(
      'INSERT INTO products (user_id, category_id, supplier_id, name, sku, description, quantity, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, category_id || null, supplier_id || null, name, sku, description || '', quantity || 0, price || 0.00]
    );

    const productId = result.insertId;

    // 4. Initial Stock Log
    if (quantity > 0) {
      await conn.execute(
        'INSERT INTO stock_logs (product_id, user_id, change_type, quantity_changed) VALUES (?, ?, ?, ?)',
        [productId, userId, 'IN', quantity]
      );
    }

    await conn.commit();
    res.status(201).json({ message: 'Product added successfully', productId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    conn.release();
  }
};

// Get All Products (Isolated + Joined info)
const getProducts = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const [rows] = await db.execute(
      `SELECT p.*, c.name as category_name, s.name as supplier_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.category_id 
       LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id 
       WHERE p.user_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Single Product
const getProductById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.user_id;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM products WHERE product_id = ? AND user_id = ?',
      [id, userId]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.user_id;
  const { name, sku, description, quantity, price, category_id, supplier_id } = req.body;
  
  if (quantity < 0 || price < 0) {
    return res.status(400).json({ message: 'Quantity and Price must be 0 or higher.' });
  }

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    // 1. Get current product state
    const [current] = await conn.execute(
      'SELECT quantity FROM products WHERE product_id = ? AND user_id = ?',
      [id, userId]
    );
    if (current.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Product not found' });
    }

    const oldQuantity = current[0].quantity;
    const newQuantity = quantity;

    // 2. Update Product
    await conn.execute(
      'UPDATE products SET name = ?, sku = ?, description = ?, quantity = ?, price = ?, category_id = ?, supplier_id = ? WHERE product_id = ? AND user_id = ?',
      [name, sku, description, newQuantity, price, category_id || null, supplier_id || null, id, userId]
    );

    // 3. Stock Logging logic
    if (newQuantity !== oldQuantity) {
      const diff = newQuantity - oldQuantity;
      const type = diff > 0 ? 'IN' : 'OUT';
      await conn.execute(
        'INSERT INTO stock_logs (product_id, user_id, change_type, quantity_changed) VALUES (?, ?, ?, ?)',
        [id, userId, type, Math.abs(diff)]
      );
    }

    await conn.commit();
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    conn.release();
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.user_id;

  try {
    const [result] = await db.execute(
      'DELETE FROM products WHERE product_id = ? AND user_id = ?',
      [id, userId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { addProduct, getProducts, getProductById, updateProduct, deleteProduct };
