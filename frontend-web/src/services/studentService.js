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

  async updateStudent(id, formData) {
    const response = await api.patch(API_ENDPOINTS.STUDENT_DETAIL(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
};
