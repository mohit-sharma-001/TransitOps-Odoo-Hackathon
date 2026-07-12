import api from './api';

const tripService = {
  createTrip: async (data) => {
    const response = await api.post('/trips', data);
    return response.data;
  },

  getTrips: async () => {
    const response = await api.get('/trips');
    return response.data;
  },

  dispatchTrip: async (id) => {
    const response = await api.post(`/trips/${id}/dispatch`);
    return response.data;
  },

  completeTrip: async (id, finalOdometer, fuelConsumed) => {
    const response = await api.post(`/trips/${id}/complete`, {
      finalOdometer: parseFloat(finalOdometer),
      fuelConsumed: parseFloat(fuelConsumed),
    });
    return response.data;
  },

  cancelTrip: async (id) => {
    const response = await api.post(`/trips/${id}/cancel`);
    return response.data;
  },
};

export default tripService;
