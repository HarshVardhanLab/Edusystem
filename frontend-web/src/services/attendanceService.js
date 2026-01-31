import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const attendanceService = {
  async getAttendance(params = {}) {
    const response = await api.get(API_ENDPOINTS.ATTENDANCE, { params });
    return response.data;
  },

  async markAttendance(data) {
    const response = await api.post(API_ENDPOINTS.ATTENDANCE_MARK, data);
    return response.data;
  },

  async getDailyAttendance(date) {
    const params = date ? { date } : {};
    const response = await api.get(API_ENDPOINTS.ATTENDANCE_DAILY, { params });
    return response.data;
  },

  async getMonthlyAttendance(month, year) {
    const response = await api.get(API_ENDPOINTS.ATTENDANCE_MONTHLY, {
      params: { month, year },
    });
    return response.data;
  },
};
