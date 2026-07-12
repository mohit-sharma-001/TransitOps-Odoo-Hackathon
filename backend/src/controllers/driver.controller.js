const { validationResult } = require('express-validator');
const prisma = require('../utils/prisma');

const ALLOWED_STATUSES = ['Available', 'OnTrip', 'OffDuty', 'Suspended'];

/**
 * Create a new Driver (Fleet Manager / Safety Officer only)
 */
const createDriver = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { name, licenseNumber, licenseCategory, licenseExpiry, phone, safetyScore, status } = req.body;

  // Validate status if provided
  if (status && !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid driver status' });
  }

  try {
    // Check if driver with this license number already exists (Controller level uniqueness)
    const existingDriver = await prisma.driver.findFirst({
      where: { licenseNumber }
    });

    if (existingDriver) {
      return res.status(400).json({ error: 'License number already registered' });
    }

    // Create the driver record
    const driver = await prisma.driver.create({
      data: {
        name,
        licenseNumber,
        licenseCategory,
        licenseExpiry: new Date(licenseExpiry),
        phone,
        safetyScore: parseFloat(safetyScore),
        status: status || 'Available'
      }
    });

    return res.status(201).json(driver);
  } catch (error) {
    console.error('Create driver error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * List all Drivers
 */
const listDrivers = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany();
    return res.status(200).json(drivers);
  } catch (error) {
    console.error('List drivers error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * List only available drivers (Exclude Suspended status AND expired licenses)
 */
const listAvailableDrivers = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const drivers = await prisma.driver.findMany({
      where: {
        status: 'Available',
        licenseExpiry: {
          gte: today
        }
      }
    });
    return res.status(200).json(drivers);
  } catch (error) {
    console.error('List available drivers error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Manual status override (Fleet Manager / Safety Officer only)
 */
const updateDriverStatus = async (req, res) => {
  const driverId = parseInt(req.params.id);
  if (isNaN(driverId)) {
    return res.status(400).json({ error: 'Invalid driver ID' });
  }

  const { status } = req.body;

  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid driver status' });
  }

  try {
    // Check if driver exists
    const driverExists = await prisma.driver.findUnique({
      where: { id: driverId }
    });

    if (!driverExists) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Update status
    const updatedDriver = await prisma.driver.update({
      where: { id: driverId },
      data: { status }
    });

    return res.status(200).json(updatedDriver);
  } catch (error) {
    console.error('Update driver status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createDriver,
  listDrivers,
  listAvailableDrivers,
  updateDriverStatus
};
