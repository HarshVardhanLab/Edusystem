import api from './api';

export const studySessionService = {
  getSessions: () => api.get('/api/v1/students/study-sessions/'),
  
  createSession: (data) => api.post('/api/v1/students/study-sessions/', data),
  
  updateSession: (id, data) => api.patch(`/api/v1/students/study-sessions/${id}/`, data),
  
  deleteSession: (id) => api.delete(`/api/v1/students/study-sessions/${id}/`),
  
  getStats: (period = 'week') => api.get(`/api/v1/students/study-sessions/stats/?period=${period}`),
};
