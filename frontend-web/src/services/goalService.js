import api from './api';

export const goalService = {
  getGoals: () => api.get('/api/v1/students/goals/'),
  
  createGoal: (data) => api.post('/api/v1/students/goals/', data),
  
  getGoal: (id) => api.get(`/api/v1/students/goals/${id}/`),
  
  updateGoal: (id, data) => api.patch(`/api/v1/students/goals/${id}/`, data),
  
  deleteGoal: (id) => api.delete(`/api/v1/students/goals/${id}/`),
};
