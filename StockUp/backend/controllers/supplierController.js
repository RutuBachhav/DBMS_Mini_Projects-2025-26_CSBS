const db = require('../config/db');

// Create Supplier
const createSupplier = async (req, res) => {
  const { name, contact_person, email, phone, address } = req.body;
  const userId = req.user.user_id;

  try {
    const [result] = await db.execute(
      'INSERT INTO suppliers (user_id, name, contact_person, email, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, contact_person, email, phone, address]
    );
    res.status(201).json({ 
      message: 'Supplier created successfully', 
      supplierId: result.insertId 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get All Suppliers (Isolated)
const getSuppliers = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM suppliers WHERE user_id = ?',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Supplier
const updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { name, contact_person, email, phone, address } = req.body;
  const userId = req.user.user_id;

  try {
    const [result] = await db.execute(
      'UPDATE suppliers SET name = ?, contact_person = ?, email = ?, phone = ?, address = ? WHERE supplier_id = ? AND user_id = ?',
      [name, contact_person, email, phone, address, id, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Supplier not found or unauthorized' });
    }
    
    res.json({ message: 'Supplier updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete Supplier
const deleteSupplier = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.user_id;

  try {
    const [result] = await db.execute(
      'DELETE FROM suppliers WHERE supplier_id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Supplier not found or unauthorized' });
    }

    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createSupplier, getSuppliers, updateSupplier, deleteSupplier };
