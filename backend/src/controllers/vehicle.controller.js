const { validationResult } = require('express-validator');
const prisma = require('../utils/prisma');

const ALLOWED_STATUSES = ['Available', 'OnTrip', 'InShop', 'Retired'];

/**
 * Create a new Vehicle (Fleet Manager only)
 */
const createVehicle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { registrationNumber, name, type, capacity, odometer, acquisitionCost, status } = req.body;

  // Validate status if provided
  if (status && !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid vehicle status' });
  }

  try {
    // Check if vehicle with registration number already exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { registrationNumber }
    });

    if (existingVehicle) {
      return res.status(400).json({ error: 'Vehicle registration number already exists' });
    }

    // Create the vehicle record
    const vehicle = await prisma.vehicle.create({
      data: {
        registrationNumber,
        name,
        type,
        capacity: parseFloat(capacity),
        odometer: parseFloat(odometer),
        acquisitionCost: parseFloat(acquisitionCost),
        status: status || 'Available'
      }
    });

    return res.status(201).json(vehicle);
  } catch (error) {
    console.error('Create vehicle error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * List all Vehicles
 */
const listVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany();
    return res.status(200).json(vehicles);
  } catch (error) {
    console.error('List vehicles error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * List only vehicles with status = Available
 */
const listAvailableVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { status: 'Available' }
    });
    return res.status(200).json(vehicles);
  } catch (error) {
    console.error('List available vehicles error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Manual status override (Fleet Manager only)
 */
const updateVehicleStatus = async (req, res) => {
  const vehicleId = parseInt(req.params.id);
  if (isNaN(vehicleId)) {
    return res.status(400).json({ error: 'Invalid vehicle ID' });
  }

  const { status } = req.body;

  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid vehicle status' });
  }

  try {
    // Check if vehicle exists
    const vehicleExists = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    });

    if (!vehicleExists) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Update status
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status }
    });

    return res.status(200).json(updatedVehicle);
  } catch (error) {
    console.error('Update vehicle status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getVehicleCosts = async (req, res) => {
  const vehicleId = parseInt(req.params.id);
  if (isNaN(vehicleId)) {
    return res.status(400).json({ error: 'Invalid vehicle ID' });
  }

  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        maintenanceLogs: true,
        fuelLogs: true,
        expenses: true
      }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const acquisitionCost = vehicle.acquisitionCost;
    const maintenanceCost = vehicle.maintenanceLogs.reduce((sum, log) => sum + log.cost, 0);
    const fuelCost = vehicle.fuelLogs.reduce((sum, log) => sum + log.cost, 0);
    const expenseCost = vehicle.expenses.reduce((sum, exp) => sum + exp.cost, 0);
    const totalCost = acquisitionCost + maintenanceCost + fuelCost + expenseCost;

    return res.status(200).json({
      vehicleId: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      acquisitionCost,
      maintenanceCost,
      fuelCost,
      expenseCost,
      totalCost
    });
  } catch (error) {
    console.error('Get vehicle costs error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createVehicle,
  listVehicles,
  listAvailableVehicles,
  updateVehicleStatus,
  getVehicleCosts
};
