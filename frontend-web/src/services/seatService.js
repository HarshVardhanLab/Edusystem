import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const seatService = {
  async getSeats(params = {}) {
    const response = await api.get(API_ENDPOINTS.SEATS, { params });
    return response.data;
  },

  async createSeat(data) {
    const response = await api.post(API_ENDPOINTS.SEAT_CREATE, data);
    return response.data;
  },

  async getSeat(id) {
    const response = await api.get(API_ENDPOINTS.SEAT_DETAIL(id));
    return response.data;
  },

  async assignSeat(id, studentId) {
    const response = await api.post(API_ENDPOINTS.SEAT_ASSIGN(id), { student_id: studentId });
    return response.data;
  },

  async freeSeat(id) {
    const response = await api.post(API_ENDPOINTS.SEAT_FREE(id));
    return response.data;
  },

  async deleteSeat(id) {
    const response = await api.delete(API_ENDPOINTS.SEAT_DELETE(id));
    return response.data;
  },
};
