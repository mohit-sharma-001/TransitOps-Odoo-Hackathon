import api from './api';

const dashboardService = {
  getDashboardKPIs: async () => {
    const response = await api.get('/dashboard/kpis');
    return response.data;
  },
};

export default dashboardService;
