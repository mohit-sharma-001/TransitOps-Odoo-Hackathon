const express = require('express');
const { body } = require('express-validator');
const vehicleController = require('../controllers/vehicle.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/vehicles (Fleet Manager only)
router.post(
  '/',
  requireAuth,
  requireRole(['FleetManager']),
  [
    body('registrationNumber').trim().notEmpty().withMessage('Registration number is required'),
    body('name').trim().notEmpty().withMessage('Vehicle name is required'),
    body('type').trim().notEmpty().withMessage('Vehicle type is required'),
    body('capacity').isFloat({ min: 0 }).withMessage('Capacity must be a non-negative number'),
    body('odometer').isFloat({ min: 0 }).withMessage('Odometer must be a non-negative number'),
    body('acquisitionCost').isFloat({ min: 0 }).withMessage('Acquisition cost must be a non-negative number')
  ],
  vehicleController.createVehicle
);

// GET /api/vehicles (All authorized users)
router.get('/', requireAuth, vehicleController.listVehicles);

// GET /api/vehicles/available (All authorized users)
router.get('/available', requireAuth, vehicleController.listAvailableVehicles);

// PUT /api/vehicles/:id/status (Fleet Manager only)
router.put(
  '/:id/status',
  requireAuth,
  requireRole(['FleetManager']),
  [
    body('status').trim().notEmpty().withMessage('Status is required')
  ],
  vehicleController.updateVehicleStatus
);

// GET /api/vehicles/:id/costs (Fleet Manager & Financial Analyst only)
router.get(
  '/:id/costs',
  requireAuth,
  requireRole(['FleetManager', 'FinancialAnalyst']),
  vehicleController.getVehicleCosts
);

module.exports = router;
