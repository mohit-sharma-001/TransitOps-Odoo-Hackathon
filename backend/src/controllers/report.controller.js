const prisma = require('../utils/prisma');

/**
 * Helper to convert structured JSON rows to CSV format
 */
const convertToCSV = (data, fields, headers) => {
  const csvRows = [];
  // 1. Add headers
  csvRows.push(headers.join(','));

  // 2. Add data rows
  for (const row of data) {
    const values = fields.map((field) => {
      const val = row[field];
      // Escape commas and double quotes
      const escaped = ('' + (val ?? '')).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
};

/**
 * Export Vehicles Report as CSV
 */
const exportVehiclesCSV = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany();
    const fields = ['id', 'registrationNumber', 'name', 'type', 'capacity', 'odometer', 'acquisitionCost', 'status'];
    const headers = ['Vehicle ID', 'Registration Number', 'Name', 'Type', 'Capacity', 'Odometer', 'Acquisition Cost', 'Status'];

    const csvContent = convertToCSV(vehicles, fields, headers);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=vehicles_report.csv');
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export vehicles CSV error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Export Trips Report as CSV
 */
const exportTripsCSV = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        vehicle: true,
        driver: true
      }
    });

    const flattened = trips.map((t) => ({
      id: t.id,
      source: t.source,
      destination: t.destination,
      cargoWeight: t.cargoWeight,
      distance: t.distance,
      status: t.status,
      vehicleRegNumber: t.vehicle ? t.vehicle.registrationNumber : 'N/A',
      driverName: t.driver ? t.driver.name : 'N/A'
    }));

    const fields = ['id', 'source', 'destination', 'cargoWeight', 'distance', 'status', 'vehicleRegNumber', 'driverName'];
    const headers = ['Trip ID', 'Source', 'Destination', 'Cargo Weight', 'Distance', 'Status', 'Vehicle Reg Number', 'Driver Name'];

    const csvContent = convertToCSV(flattened, fields, headers);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=trips_report.csv');
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export trips CSV error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Export Maintenance Log Report as CSV
 */
const exportMaintenanceCSV = async (req, res) => {
  try {
    const logs = await prisma.maintenanceLog.findMany({
      include: {
        vehicle: true
      }
    });

    const flattened = logs.map((l) => ({
      id: l.id,
      vehicleRegNumber: l.vehicle ? l.vehicle.registrationNumber : 'N/A',
      description: l.description,
      cost: l.cost,
      startedAt: l.startedAt ? l.startedAt.toISOString() : 'N/A',
      completedAt: l.completedAt ? l.completedAt.toISOString() : 'N/A'
    }));

    const fields = ['id', 'vehicleRegNumber', 'description', 'cost', 'startedAt', 'completedAt'];
    const headers = ['Log ID', 'Vehicle Reg Number', 'Description', 'Cost', 'Started At', 'Completed At'];

    const csvContent = convertToCSV(flattened, fields, headers);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=maintenance_report.csv');
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export maintenance CSV error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Helper to compute fleet analytics calculations
 */
const getAnalyticsData = async () => {
  const vehicles = await prisma.vehicle.findMany({
    include: {
      trips: true,
      fuelLogs: true,
      maintenanceLogs: true,
      expenses: true
    }
  });

  const totalVehicles = vehicles.length;
  const onTripVehicles = vehicles.filter((v) => v.status === 'OnTrip').length;
  const fleetUtilization = totalVehicles > 0 ? parseFloat(((onTripVehicles / totalVehicles) * 100).toFixed(2)) : 0;

  const vehicleAnalytics = vehicles.map((v) => {
    // 1. Total distance from completed trips
    const completedTrips = v.trips.filter((t) => t.status === 'Completed');
    const totalDistance = completedTrips.reduce((sum, t) => sum + t.distance, 0);

    // 2. Total fuel liters from logs
    const totalLiters = v.fuelLogs.reduce((sum, f) => sum + f.liters, 0);

    // 3. Fuel Efficiency: totalDistance / totalLiters
    const fuelEfficiency = totalLiters > 0 ? parseFloat((totalDistance / totalLiters).toFixed(2)) : 0;

    // 4. Operating costs
    const fuelCost = v.fuelLogs.reduce((sum, f) => sum + f.cost, 0);
    const maintenanceCost = v.maintenanceLogs.reduce((sum, m) => sum + m.cost, 0);
    const expenseCost = v.expenses.reduce((sum, e) => sum + e.cost, 0);
    const operationalCost = fuelCost + maintenanceCost + expenseCost;

    // 5. Estimated Revenue: totalDistance * 45
    const estimatedRevenue = totalDistance * 45.0;

    // 6. ROI: (estimatedRevenue - operationalCost) / acquisitionCost
    const roi = v.acquisitionCost > 0 ? parseFloat((((estimatedRevenue - operationalCost) / v.acquisitionCost) * 100).toFixed(4)) : 0;

    return {
      vehicleId: v.id,
      registrationNumber: v.registrationNumber,
      name: v.name,
      totalDistance: parseFloat(totalDistance.toFixed(2)),
      totalLiters: parseFloat(totalLiters.toFixed(2)),
      fuelEfficiency,
      fuelCost,
      maintenanceCost,
      expenseCost,
      operationalCost,
      estimatedRevenue,
      acquisitionCost: v.acquisitionCost,
      roi
    };
  });

  return {
    fleetUtilization,
    vehicles: vehicleAnalytics
  };
};

/**
 * Get Fleet Analytics JSON Summary
 */
const getAnalyticsJSON = async (req, res) => {
  try {
    const analytics = await getAnalyticsData();
    return res.status(200).json(analytics);
  } catch (error) {
    console.error('Get analytics JSON error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Export Fleet Analytics as CSV
 */
const exportAnalyticsCSV = async (req, res) => {
  try {
    const analytics = await getAnalyticsData();

    const fields = [
      'vehicleId',
      'registrationNumber',
      'name',
      'totalDistance',
      'totalLiters',
      'fuelEfficiency',
      'operationalCost',
      'estimatedRevenue',
      'acquisitionCost',
      'roi'
    ];
    const headers = [
      'Vehicle ID',
      'Registration Number',
      'Name',
      'Total Distance (km)',
      'Total Fuel (L)',
      'Fuel Efficiency (km/L)',
      'Operational Cost',
      'Estimated Revenue',
      'Acquisition Cost',
      'ROI (%)'
    ];

    const csvContent = convertToCSV(analytics.vehicles, fields, headers);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=fleet_analytics.csv');
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export analytics CSV error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  exportVehiclesCSV,
  exportTripsCSV,
  exportMaintenanceCSV,
  getAnalyticsJSON,
  exportAnalyticsCSV
};
