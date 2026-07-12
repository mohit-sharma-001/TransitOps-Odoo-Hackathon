import api from './api';

const fuelService = {
  createFuelLog: async (data) => {
    const response = await api.post('/fuel', data);
    return response.data;
  },

  getFuelLogs: async () => {
    const response = await api.get('/fuel');
    return response.data;
  },
};

export default fuelService;
