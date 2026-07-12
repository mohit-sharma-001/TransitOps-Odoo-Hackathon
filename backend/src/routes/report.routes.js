const express = require('express');
const reportController = require('../controllers/report.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/reports/vehicles/csv (Fleet Manager & Financial Analyst only)
router.get(
  '/vehicles/csv',
  requireAuth,
  requireRole(['FleetManager', 'FinancialAnalyst']),
  reportController.exportVehiclesCSV
);

// GET /api/reports/trips/csv (Fleet Manager & Dispatcher only)
router.get(
  '/trips/csv',
  requireAuth,
  requireRole(['FleetManager', 'Dispatcher']),
  reportController.exportTripsCSV
);

// GET /api/reports/maintenance/csv (Fleet Manager, Safety Officer & Financial Analyst only)
router.get(
  '/maintenance/csv',
  requireAuth,
  requireRole(['FleetManager', 'SafetyOfficer', 'FinancialAnalyst']),
  reportController.exportMaintenanceCSV
);

// GET /api/reports/analytics (Fleet Manager & Financial Analyst only)
router.get(
  '/analytics',
  requireAuth,
  requireRole(['FleetManager', 'FinancialAnalyst']),
  reportController.getAnalyticsJSON
);

// GET /api/reports/analytics/csv (Fleet Manager & Financial Analyst only)
router.get(
  '/analytics/csv',
  requireAuth,
  requireRole(['FleetManager', 'FinancialAnalyst']),
  reportController.exportAnalyticsCSV
);

module.exports = router;
