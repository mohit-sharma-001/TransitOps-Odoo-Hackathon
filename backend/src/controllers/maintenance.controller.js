const { validationResult } = require('express-validator');
const prisma = require('../utils/prisma');

/**
 * Create a new Maintenance Log (Sets vehicle status to InShop)
 */
const createMaintenanceLog = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { vehicleId, description, cost, startedAt } = req.body;

  try {
    // 1. Verify vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId) }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // 2. Create log and set vehicle to 'InShop' inside a transaction
    const log = await prisma.$transaction(async (tx) => {
      const maintenanceLog = await tx.maintenanceLog.create({
        data: {
          vehicleId: parseInt(vehicleId),
          description,
          cost: parseFloat(cost),
          startedAt: startedAt ? new Date(startedAt) : new Date(),
          previousStatus: vehicle.status
        }
      });

      await tx.vehicle.update({
        where: { id: parseInt(vehicleId) },
        data: { status: 'InShop' }
      });

      return maintenanceLog;
    });

    return res.status(201).json(log);
  } catch (error) {
    console.error('Create maintenance log error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Complete a Maintenance Log (Sets vehicle status back to Available unless Retired)
 */
const completeMaintenance = async (req, res) => {
  const logId = parseInt(req.params.id);
  if (isNaN(logId)) {
    return res.status(400).json({ error: 'Invalid log ID' });
  }

  try {
    // 1. Fetch log and include vehicle status
    const log = await prisma.maintenanceLog.findUnique({
      where: { id: logId },
      include: { vehicle: true }
    });

    if (!log) {
      return res.status(404).json({ error: 'Maintenance log not found' });
    }

    if (log.completedAt) {
      return res.status(400).json({ error: 'Maintenance is already completed' });
    }

    // Determine target vehicle status: if previousStatus was 'Retired', keep it 'Retired'. Otherwise, revert to 'Available'.
    const targetStatus = log.previousStatus === 'Retired' ? 'Retired' : 'Available';

    // 2. Perform updates inside transaction
    const updatedLog = await prisma.$transaction(async (tx) => {
      const completed = await tx.maintenanceLog.update({
        where: { id: logId },
        data: { completedAt: new Date() }
      });

      await tx.vehicle.update({
        where: { id: log.vehicleId },
        data: { status: targetStatus }
      });

      return completed;
    });

    return res.status(200).json(updatedLog);
  } catch (error) {
    console.error('Complete maintenance error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * List all Maintenance Logs (including vehicle details)
 */
const listMaintenanceLogs = async (req, res) => {
  try {
    const logs = await prisma.maintenanceLog.findMany({
      include: {
        vehicle: true
      }
    });
    return res.status(200).json(logs);
  } catch (error) {
    console.error('List maintenance logs error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createMaintenanceLog,
  completeMaintenance,
  listMaintenanceLogs
};
