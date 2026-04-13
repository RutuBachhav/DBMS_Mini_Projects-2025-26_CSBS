const db = require('../config/db');

// Create Category
const createCategory = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.user_id;

  try {
    const [result] = await db.execute(
      'INSERT INTO categories (user_id, name) VALUES (?, ?)',
      [userId, name]
    );
    res.status(201).json({ 
      message: 'Category created successfully', 
      categoryId: result.insertId 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get All Categories (Isolated)
const getCategories = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM categories WHERE user_id = ?',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user.user_id;

  try {
    const [result] = await db.execute(
      'UPDATE categories SET name = ? WHERE category_id = ? AND user_id = ?',
      [name, id, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found or unauthorized' });
    }
    
    res.json({ message: 'Category updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.user_id;

  try {
    const [result] = await db.execute(
      'DELETE FROM categories WHERE category_id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found or unauthorized' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };
