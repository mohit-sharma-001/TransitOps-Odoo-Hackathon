const { validationResult } = require('express-validator');
const prisma = require('../utils/prisma');

/**
 * Create a new Trip (status defaulted to Draft)
 */
const createTrip = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { source, destination, vehicleId, driverId, cargoWeight, distance } = req.body;

  try {
    // 1. Verify vehicle exists and retrieve capacity
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId) }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // 2. Verify driver exists
    const driver = await prisma.driver.findUnique({
      where: { id: parseInt(driverId) }
    });

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // 3. Validate cargo weight against vehicle capacity
    if (parseFloat(cargoWeight) > vehicle.capacity) {
      return res.status(400).json({ error: 'Cargo weight exceeds vehicle capacity' });
    }

    // 4. Create the trip record in 'Draft' status
    const trip = await prisma.trip.create({
      data: {
        source,
        destination,
        vehicleId: parseInt(vehicleId),
        driverId: parseInt(driverId),
        cargoWeight: parseFloat(cargoWeight),
        distance: parseFloat(distance),
        status: 'Draft'
      }
    });

    return res.status(201).json(trip);
  } catch (error) {
    console.error('Create trip error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Dispatch a Trip (runs as a single transaction)
 */
const dispatchTrip = async (req, res) => {
  const tripId = parseInt(req.params.id);
  if (isNaN(tripId)) {
    return res.status(400).json({ error: 'Invalid trip ID' });
  }

  try {
    // Fetch the trip first to verify it exists and get vehicle/driver IDs
    const trip = await prisma.trip.findUnique({
      where: { id: tripId }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (trip.status !== 'Draft') {
      return res.status(400).json({ error: 'Trip is not in Draft status' });
    }

    // Execute the dispatch logic inside a single transaction to guarantee atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check vehicle status
      const vehicle = await tx.vehicle.findUnique({
        where: { id: trip.vehicleId }
      });
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }
      if (vehicle.status !== 'Available') {
        throw new Error('Vehicle is not available');
      }

      // 2. Check driver status
      const driver = await tx.driver.findUnique({
        where: { id: trip.driverId }
      });
      if (!driver) {
        throw new Error('Driver not found');
      }
      if (driver.status !== 'Available') {
        throw new Error('Driver is not available');
      }

      // 3. Check driver license expiry
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      if (new Date(driver.licenseExpiry) < today) {
        throw new Error('Driver license has expired');
      }

      // 4. Update statuses
      const updatedTrip = await tx.trip.update({
        where: { id: tripId },
        data: { status: 'Dispatched' }
      });

      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: 'OnTrip' }
      });

      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: 'OnTrip' }
      });

      return updatedTrip;
    });

    return res.status(200).json(result);
  } catch (error) {
    // If error is thrown inside transaction, it automatically rolls back
    console.error('Dispatch transaction failed:', error.message);
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createTrip,
  dispatchTrip
};
