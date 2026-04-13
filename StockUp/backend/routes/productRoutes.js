const express = require('express');
const router = express.Router();
const { 
  addProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// All product routes are protected
router.use(authMiddleware);

router.post('/', addProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
