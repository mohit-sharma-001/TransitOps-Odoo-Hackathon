import api from './api';

const downloadCSV = async (endpoint, filename) => {
  try {
    const response = await api.get(endpoint, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Failed to download CSV:', error);
    throw error;
  }
};

const reportService = {
  getAnalytics: async () => {
    const response = await api.get('/reports/analytics');
    return response.data;
  },

  downloadVehiclesCSV: () => downloadCSV('/reports/vehicles/csv', 'vehicles_report.csv'),
  downloadTripsCSV: () => downloadCSV('/reports/trips/csv', 'trips_report.csv'),
  downloadMaintenanceCSV: () => downloadCSV('/reports/maintenance/csv', 'maintenance_report.csv'),
  downloadAnalyticsCSV: () => downloadCSV('/reports/analytics/csv', 'fleet_analytics.csv'),
};

export default reportService;
