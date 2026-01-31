import api from './api';

export const quoteService = {
  getDailyQuote: () => api.get('/api/v1/student-portal/quotes/daily/'),
  
  getQuotes: (category) => {
    const params = category ? { category } : {};
    return api.get('/api/v1/student-portal/quotes/', { params });
  },
};
