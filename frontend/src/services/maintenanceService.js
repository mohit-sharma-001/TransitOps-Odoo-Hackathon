import api from './api';

const maintenanceService = {
  createMaintenanceLog: async (data) => {
    const response = await api.post('/maintenance', data);
    return response.data;
  },

  completeMaintenance: async (id) => {
    const response = await api.put(`/maintenance/${id}/complete`);
    return response.data;
  },

  getMaintenanceLogs: async () => {
    const response = await api.get('/maintenance');
    return response.data;
  },
};

export default maintenanceService;
