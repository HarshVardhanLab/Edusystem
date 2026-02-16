import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const studentService = {
  async getStudents(params = {}) {
    const response = await api.get(API_ENDPOINTS.STUDENTS, { params });
    return response.data;
  },

  async createStudent(formData) {
    const response = await api.post(API_ENDPOINTS.STUDENT_CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async bulkUploadStudents(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(API_ENDPOINTS.STUDENT_BULK_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getStudent(id) {
    const response = await api.get(API_ENDPOINTS.STUDENT_DETAIL(id));
    return response.data;
  },

  async updateStudent(id, data) {
    // Send as JSON, not FormData for PATCH requests
    const response = await api.patch(API_ENDPOINTS.STUDENT_DETAIL(id), data);
    return response.data;
  },

  async deactivateStudent(id) {
    const response = await api.patch(API_ENDPOINTS.STUDENT_DEACTIVATE(id));
    return response.data;
  },

  async activateStudent(id) {
    const response = await api.patch(API_ENDPOINTS.STUDENT_ACTIVATE(id));
    return response.data;
  },

  async deleteStudent(id) {
    const response = await api.delete(API_ENDPOINTS.STUDENT_DELETE(id));
    return response.data;
  },

  async resetPassword(id) {
    const response = await api.post(`/api/v1/students/${id}/set-password/`, {});
    return response.data;
  },

  async getTrash() {
    const response = await api.get('/api/v1/students/trash/');
    return response.data;
  },

  async restoreStudent(id) {
    const response = await api.post(`/api/v1/students/${id}/restore/`);
    return response.data;
  },

  async permanentDelete(id) {
    const response = await api.delete(`/api/v1/students/${id}/permanent-delete/`);
    return response.data;
  },
};
