const express = require('express');
const { body } = require('express-validator');
const expenseController = require('../controllers/expense.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/expenses (Fleet Manager, Dispatcher, Safety Officer only)
router.post(
  '/',
  requireAuth,
  requireRole(['FleetManager', 'Dispatcher', 'SafetyOfficer']),
  [
    body('vehicleId').isInt().withMessage('Vehicle ID must be an integer'),
    body('type').isIn(['toll', 'other']).withMessage('Expense type must be toll or other'),
    body('cost').isFloat({ min: 0 }).withMessage('Cost must be a non-negative number')
  ],
  expenseController.createExpense
);

// GET /api/expenses (All authorized users)
router.get('/', requireAuth, expenseController.listExpenses);

module.exports = router;
