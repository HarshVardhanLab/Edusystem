import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const subscriptionService = {
  async getSubscriptions(params = {}) {
    const response = await api.get(API_ENDPOINTS.SUBSCRIPTIONS, { params });
    return response.data;
  },

  async createSubscription(data) {
    const response = await api.post(API_ENDPOINTS.SUBSCRIPTION_CREATE, data);
    return response.data;
  },

  async getSubscription(id) {
    const response = await api.get(API_ENDPOINTS.SUBSCRIPTION_DETAIL(id));
    return response.data;
  },

  async updatePaymentStatus(id, feeStatus) {
    const response = await api.patch(API_ENDPOINTS.SUBSCRIPTION_PAYMENT(id), {
      fee_status: feeStatus,
    });
    return response.data;
  },

  async getExpiringSubscriptions(days = 7) {
    const response = await api.get(API_ENDPOINTS.SUBSCRIPTION_EXPIRING, {
      params: { days },
    });
    return response.data;
  },
};
