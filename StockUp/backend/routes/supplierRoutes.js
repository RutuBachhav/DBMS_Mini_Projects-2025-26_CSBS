const express = require('express');
const router = express.Router();
const { 
  createSupplier, 
  getSuppliers, 
  updateSupplier, 
  deleteSupplier 
} = require('../controllers/supplierController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected
router.use(authMiddleware);

router.post('/', createSupplier);
router.get('/', getSuppliers);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);

module.exports = router;
