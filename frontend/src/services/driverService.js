import api from './api';

const driverService = {
  createDriver: async (data) => {
    const response = await api.post('/drivers', data);
    return response.data;
  },

  getDrivers: async () => {
    const response = await api.get('/drivers');
    return response.data;
  },

  getAvailableDrivers: async () => {
    const response = await api.get('/drivers/available');
    return response.data;
  },

  updateDriverStatus: async (id, status) => {
    const response = await api.put(`/drivers/${id}/status`, { status });
    return response.data;
  },
};

export default driverService;
