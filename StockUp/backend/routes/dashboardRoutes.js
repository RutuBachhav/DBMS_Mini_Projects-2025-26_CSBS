const express = require('express');
const router = express.Router();
const { getDashboardStats, getInventoryAlerts } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/stats', getDashboardStats);
router.get('/alerts', getInventoryAlerts);

module.exports = router;
