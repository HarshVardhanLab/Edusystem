import api from './api';

export const taskService = {
  getTasks: (params) => api.get('/api/v1/student-portal/tasks/', { params }),
  
  createTask: (data) => api.post('/api/v1/student-portal/tasks/', data),
  
  getTask: (id) => api.get(`/api/v1/student-portal/tasks/${id}/`),
  
  updateTask: (id, data) => api.patch(`/api/v1/student-portal/tasks/${id}/`, data),
  
  deleteTask: (id) => api.delete(`/api/v1/student-portal/tasks/${id}/`),
};
