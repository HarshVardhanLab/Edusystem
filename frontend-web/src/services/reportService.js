import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const reportService = {
  async getDashboardStats() {
    const response = await api.get(API_ENDPOINTS.DASHBOARD);
    return response.data;
  },

  async getMonthlyAttendanceReport(month, year) {
    const response = await api.get(API_ENDPOINTS.MONTHLY_ATTENDANCE_REPORT, {
      params: { month, year },
    });
    return response.data;
  },

  async getStudentReport(studentId) {
    const response = await api.get(API_ENDPOINTS.STUDENT_REPORT, {
      params: { student_id: studentId },
    });
    return response.data;
  },
};
