const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/dashboard/kpis (All authorized users)
router.get('/kpis', requireAuth, dashboardController.getDashboardKPIs);

module.exports = router;
