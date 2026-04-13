const db = require('../config/db');

// Get Dashboard Stats
const getDashboardStats = async (req, res) => {
  const userId = req.user.user_id;

  try {
    // 1. Total Products
    const [totalProd] = await db.execute('SELECT COUNT(*) as count FROM products WHERE user_id = ?', [userId]);

    // 2. Low Stock Count (0 < quantity < 10)
    const [lowStock] = await db.execute('SELECT COUNT(*) as count FROM products WHERE quantity > 0 AND quantity < 10 AND user_id = ?', [userId]);

    // 3. Out of Stock Count (quantity = 0)
    const [outOfStock] = await db.execute('SELECT COUNT(*) as count FROM products WHERE quantity = 0 AND user_id = ?', [userId]);

    // 4. Total Sales Revenue
    const [totalSales] = await db.execute("SELECT SUM(total_amount) as total FROM transactions WHERE type = 'SALE' AND user_id = ?", [userId]);

    res.json({
      total_products: totalProd[0].count,
      low_stock_count: lowStock[0].count,
      out_of_stock_count: outOfStock[0].count,
      total_sales: totalSales[0].total || 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Detailed Inventory Alerts
const getInventoryAlerts = async (req, res) => {
  const userId = req.user.user_id;

  try {
    // Fetch Low Stock Products with JOINS
    const [lowStockItems] = await db.execute(
      `SELECT p.name, p.sku, p.quantity, c.name as category_name, s.name as supplier_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.category_id 
       LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id 
       WHERE p.quantity > 0 AND p.quantity < 10 AND p.user_id = ?`,
      [userId]
    );

    // Fetch Out of Stock Products with JOINS
    const [outOfStockItems] = await db.execute(
      `SELECT p.name, p.sku, p.quantity, c.name as category_name, s.name as supplier_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.category_id 
       LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id 
       WHERE p.quantity = 0 AND p.user_id = ?`,
      [userId]
    );

    res.json({
      low_stock_items: lowStockItems,
      out_of_stock_items: outOfStockItems
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getDashboardStats, getInventoryAlerts };
