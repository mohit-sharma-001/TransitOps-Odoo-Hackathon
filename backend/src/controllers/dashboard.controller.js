const prisma = require('../utils/prisma');

/**
 * Get aggregated Dashboard KPIs
 */
const getDashboardKPIs = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(today.getDate() + 30);

    // 1. Fetch Fleet Vehicles
    const vehicles = await prisma.vehicle.findMany();
    const fleetTotal = vehicles.length;
    const fleetByStatus = { Available: 0, OnTrip: 0, InShop: 0, Retired: 0 };
    let totalAcquisition = 0;

    vehicles.forEach((v) => {
      if (fleetByStatus[v.status] !== undefined) {
        fleetByStatus[v.status]++;
      }
      totalAcquisition += v.acquisitionCost;
    });

    // 2. Fetch Drivers
    const drivers = await prisma.driver.findMany();
    const driversTotal = drivers.length;
    const driversByStatus = { Available: 0, OnTrip: 0, OffDuty: 0, Suspended: 0 };
    let totalSafetyScore = 0;
    let safetyScoreCount = 0;
    let expiredLicenses = 0;
    let expiringSoonLicenses = 0;

    drivers.forEach((d) => {
      if (driversByStatus[d.status] !== undefined) {
        driversByStatus[d.status]++;
      }
      if (d.safetyScore !== null && d.safetyScore !== undefined) {
        totalSafetyScore += d.safetyScore;
        safetyScoreCount++;
      }

      const expiry = new Date(d.licenseExpiry);
      if (expiry < today) {
        expiredLicenses++;
      } else if (expiry >= today && expiry < thirtyDaysLater) {
        expiringSoonLicenses++;
      }
    });

    const averageSafetyScore = safetyScoreCount > 0 ? parseFloat((totalSafetyScore / safetyScoreCount).toFixed(2)) : 0;

    // 3. Fetch Trips
    const trips = await prisma.trip.findMany();
    const tripsTotal = trips.length;
    const tripsByStatus = { Draft: 0, Dispatched: 0, Completed: 0, Cancelled: 0 };
    let totalDistance = 0;

    trips.forEach((t) => {
      if (tripsByStatus[t.status] !== undefined) {
        tripsByStatus[t.status]++;
      }
      if (t.status === 'Completed') {
        totalDistance += t.distance;
      }
    });

    // 4. Fetch Operating Costs
    const fuelSumResult = await prisma.fuelLog.aggregate({ _sum: { cost: true } });
    const maintenanceSumResult = await prisma.maintenanceLog.aggregate({ _sum: { cost: true } });
    const expenseSumResult = await prisma.expense.aggregate({ _sum: { cost: true } });

    const totalFuel = fuelSumResult._sum.cost || 0;
    const totalMaintenance = maintenanceSumResult._sum.cost || 0;
    const totalExpenses = expenseSumResult._sum.cost || 0;
    const totalTco = totalAcquisition + totalFuel + totalMaintenance + totalExpenses;

    // 5. Assemble Payload
    return res.status(200).json({
      fleet: {
        total: fleetTotal,
        byStatus: fleetByStatus
      },
      drivers: {
        total: driversTotal,
        averageSafetyScore,
        byStatus: driversByStatus
      },
      trips: {
        total: tripsTotal,
        totalDistance: parseFloat(totalDistance.toFixed(2)),
        byStatus: tripsByStatus
      },
      financials: {
        totalAcquisition,
        totalFuel,
        totalMaintenance,
        totalExpenses,
        totalTco
      },
      alerts: {
        expiredLicenses,
        expiringSoonLicenses
      }
    });
  } catch (error) {
    console.error('Get dashboard KPIs error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getDashboardKPIs
};
