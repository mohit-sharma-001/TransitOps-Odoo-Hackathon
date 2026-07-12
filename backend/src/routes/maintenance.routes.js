const express = require('express');
const { body } = require('express-validator');
const maintenanceController = require('../controllers/maintenance.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/maintenance (Fleet Manager & Safety Officer only)
router.post(
  '/',
  requireAuth,
  requireRole(['FleetManager', 'SafetyOfficer']),
  [
    body('vehicleId').isInt().withMessage('Vehicle ID must be an integer'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('cost').isFloat({ min: 0 }).withMessage('Cost must be a non-negative number')
  ],
  maintenanceController.createMaintenanceLog
);

// PUT /api/maintenance/:id/complete (Fleet Manager & Safety Officer only)
router.put(
  '/:id/complete',
  requireAuth,
  requireRole(['FleetManager', 'SafetyOfficer']),
  maintenanceController.completeMaintenance
);

// GET /api/maintenance (All authorized users)
router.get('/', requireAuth, maintenanceController.listMaintenanceLogs);

module.exports = router;
