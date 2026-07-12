const { validationResult } = require('express-validator');
const prisma = require('../utils/prisma');

/**
 * Record a new Fuel Purchase
 */
const createFuelLog = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { vehicleId, liters, cost, date } = req.body;

  try {
    // 1. Verify vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId) }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // 2. Create fuel log
    const fuelLog = await prisma.fuelLog.create({
      data: {
        vehicleId: parseInt(vehicleId),
        liters: parseFloat(liters),
        cost: parseFloat(cost),
        date: date ? new Date(date) : new Date()
      }
    });

    return res.status(201).json(fuelLog);
  } catch (error) {
    console.error('Create fuel log error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * List all Fuel Logs (including vehicle details)
 */
const listFuelLogs = async (req, res) => {
  try {
    const logs = await prisma.fuelLog.findMany({
      include: {
        vehicle: true
      }
    });
    return res.status(200).json(logs);
  } catch (error) {
    console.error('List fuel logs error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createFuelLog,
  listFuelLogs
};
