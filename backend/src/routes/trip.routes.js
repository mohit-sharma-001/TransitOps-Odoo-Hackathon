const express = require('express');
const { body } = require('express-validator');
const tripController = require('../controllers/trip.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/trips (Fleet Manager & Dispatcher only)
router.post(
  '/',
  requireAuth,
  requireRole(['FleetManager', 'Dispatcher']),
  [
    body('source').trim().notEmpty().withMessage('Source is required'),
    body('destination').trim().notEmpty().withMessage('Destination is required'),
    body('vehicleId').isInt().withMessage('Vehicle ID must be an integer'),
    body('driverId').isInt().withMessage('Driver ID must be an integer'),
    body('cargoWeight').isFloat({ min: 0 }).withMessage('Cargo weight must be a non-negative number'),
    body('distance').isFloat({ min: 0 }).withMessage('Distance must be a non-negative number')
  ],
  tripController.createTrip
);

// POST /api/trips/:id/dispatch (Fleet Manager & Dispatcher only)
router.post(
  '/:id/dispatch',
  requireAuth,
  requireRole(['FleetManager', 'Dispatcher']),
  tripController.dispatchTrip
);

module.exports = router;
