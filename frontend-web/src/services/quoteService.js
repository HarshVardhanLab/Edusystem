import api from './api';

export const quoteService = {
  getDailyQuote: () => api.get('/api/v1/students/quotes/daily/'),
  
  getQuotes: (category) => {
    const params = category ? { category } : {};
    return api.get('/api/v1/students/quotes/', { params });
  },
};
