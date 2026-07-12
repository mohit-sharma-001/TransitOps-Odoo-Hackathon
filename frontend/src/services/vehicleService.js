import api from './api';

const vehicleService = {
  createVehicle: async (data) => {
    const response = await api.post('/vehicles', data);
    return response.data;
  },

  getVehicles: async () => {
    const response = await api.get('/vehicles');
    return response.data;
  },

  getAvailableVehicles: async () => {
    const response = await api.get('/vehicles/available');
    return response.data;
  },

  updateVehicleStatus: async (id, status) => {
    const response = await api.put(`/vehicles/${id}/status`, { status });
    return response.data;
  },

  getVehicleCosts: async (id) => {
    const response = await api.get(`/vehicles/${id}/costs`);
    return response.data;
  },
};

export default vehicleService;
