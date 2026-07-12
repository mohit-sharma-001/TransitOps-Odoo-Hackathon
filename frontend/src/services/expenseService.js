import api from './api';

const expenseService = {
  createExpense: async (data) => {
    const response = await api.post('/expenses', data);
    return response.data;
  },

  getExpenses: async () => {
    const response = await api.get('/expenses');
    return response.data;
  },
};

export default expenseService;
