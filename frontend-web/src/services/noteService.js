import api from './api';

export const noteService = {
  getNotes: (params) => api.get('/api/v1/student-portal/notes/', { params }),
  
  createNote: (data) => api.post('/api/v1/student-portal/notes/', data),
  
  getNote: (id) => api.get(`/api/v1/student-portal/notes/${id}/`),
  
  updateNote: (id, data) => api.patch(`/api/v1/student-portal/notes/${id}/`, data),
  
  deleteNote: (id) => api.delete(`/api/v1/student-portal/notes/${id}/`),
};
