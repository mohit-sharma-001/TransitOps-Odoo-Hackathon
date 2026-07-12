const { validationResult } = require('express-validator');
const prisma = require('../utils/prisma');

/**
 * Record a new Miscellaneous Expense
 */
const createExpense = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { vehicleId, type, cost, date } = req.body;

  try {
    // 1. Verify vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId) }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // 2. Create expense log
    const expense = await prisma.expense.create({
      data: {
        vehicleId: parseInt(vehicleId),
        type,
        cost: parseFloat(cost),
        date: date ? new Date(date) : new Date()
      }
    });

    return res.status(201).json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * List all Expenses (including vehicle details)
 */
const listExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      include: {
        vehicle: true
      }
    });
    return res.status(200).json(expenses);
  } catch (error) {
    console.error('List expenses error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createExpense,
  listExpenses
};
