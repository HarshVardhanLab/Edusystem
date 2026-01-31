import api from './api';

export const studySessionService = {
  getSessions: () => api.get('/api/v1/student-portal/study-sessions/'),
  
  createSession: (data) => api.post('/api/v1/student-portal/study-sessions/', data),
  
  updateSession: (id, data) => api.patch(`/api/v1/student-portal/study-sessions/${id}/`, data),
  
  deleteSession: (id) => api.delete(`/api/v1/student-portal/study-sessions/${id}/`),
  
  getStats: (period = 'week') => api.get(`/api/v1/student-portal/study-sessions/stats/?period=${period}`),
};
