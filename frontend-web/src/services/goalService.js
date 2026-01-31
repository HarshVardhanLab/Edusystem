import api from './api';

export const goalService = {
  getGoals: () => api.get('/api/v1/student-portal/goals/'),
  
  createGoal: (data) => api.post('/api/v1/student-portal/goals/', data),
  
  getGoal: (id) => api.get(`/api/v1/student-portal/goals/${id}/`),
  
  updateGoal: (id, data) => api.patch(`/api/v1/student-portal/goals/${id}/`, data),
  
  deleteGoal: (id) => api.delete(`/api/v1/student-portal/goals/${id}/`),
};
