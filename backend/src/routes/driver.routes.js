const express = require('express');
const { body } = require('express-validator');
const driverController = require('../controllers/driver.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/drivers (Fleet Manager & Safety Officer only)
router.post(
  '/',
  requireAuth,
  requireRole(['FleetManager', 'SafetyOfficer']),
  [
    body('name').trim().notEmpty().withMessage('Driver name is required'),
    body('licenseNumber').trim().notEmpty().withMessage('License number is required'),
    body('licenseCategory').trim().notEmpty().withMessage('License category is required'),
    body('licenseExpiry').isISO8601().withMessage('License expiry must be a valid date (YYYY-MM-DD)'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('safetyScore').isFloat({ min: 0, max: 100 }).withMessage('Safety score must be a number between 0 and 100')
  ],
  driverController.createDriver
);

// GET /api/drivers (All authorized users)
router.get('/', requireAuth, driverController.listDrivers);

// GET /api/drivers/available (All authorized users)
router.get('/available', requireAuth, driverController.listAvailableDrivers);

// PUT /api/drivers/:id/status (Fleet Manager & Safety Officer only)
router.put(
  '/:id/status',
  requireAuth,
  requireRole(['FleetManager', 'SafetyOfficer']),
  [
    body('status').trim().notEmpty().withMessage('Status is required')
  ],
  driverController.updateDriverStatus
);

module.exports = router;
