const express = require('express');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  toggleUserActive,
  getDashboardStats,
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Product Management
router.post('/products', authMiddleware, adminMiddleware, createProduct);
router.put('/products/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/products/:id', authMiddleware, adminMiddleware, deleteProduct);

// Category Management
router.post('/categories', authMiddleware, adminMiddleware, createCategory);
router.put('/categories/:id', authMiddleware, adminMiddleware, updateCategory);

// Order Management
router.get('/orders', authMiddleware, adminMiddleware, getAllOrders);
router.put(
  '/orders/:id/status',
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

// User Management
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.put('/users/:id/toggle', authMiddleware, adminMiddleware, toggleUserActive);

// Dashboard
router.get('/dashboard/stats', authMiddleware, adminMiddleware, getDashboardStats);

module.exports = router;
