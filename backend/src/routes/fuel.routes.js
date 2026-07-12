const express = require('express');
const { body } = require('express-validator');
const fuelController = require('../controllers/fuel.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/fuel (Fleet Manager, Dispatcher, Safety Officer only)
router.post(
  '/',
  requireAuth,
  requireRole(['FleetManager', 'Dispatcher', 'SafetyOfficer']),
  [
    body('vehicleId').isInt().withMessage('Vehicle ID must be an integer'),
    body('liters').isFloat({ min: 0 }).withMessage('Liters must be a non-negative number'),
    body('cost').isFloat({ min: 0 }).withMessage('Cost must be a non-negative number')
  ],
  fuelController.createFuelLog
);

// GET /api/fuel (All authorized users)
router.get('/', requireAuth, fuelController.listFuelLogs);

module.exports = router;
