import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const notificationService = {
  async getNotifications(params = {}) {
    const response = await api.get(API_ENDPOINTS.NOTIFICATIONS, { params });
    return response.data;
  },

  async createNotification(data) {
    const response = await api.post(API_ENDPOINTS.NOTIFICATION_CREATE, data);
    return response.data;
  },

  async markAsRead(id) {
    const response = await api.patch(API_ENDPOINTS.NOTIFICATION_MARK_READ(id));
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.post(API_ENDPOINTS.NOTIFICATION_MARK_ALL_READ);
    return response.data;
  },
};
