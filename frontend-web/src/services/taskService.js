import api from './api';

export const taskService = {
  getTasks: (params) => api.get('/api/v1/students/tasks/', { params }),
  
  createTask: (data) => api.post('/api/v1/students/tasks/', data),
  
  getTask: (id) => api.get(`/api/v1/students/tasks/${id}/`),
  
  updateTask: (id, data) => api.patch(`/api/v1/students/tasks/${id}/`, data),
  
  deleteTask: (id) => api.delete(`/api/v1/students/tasks/${id}/`),
};
