import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const libraryService = {
  async createLibrary(data) {
    const response = await api.post(API_ENDPOINTS.LIBRARY_CREATE, data);
    return response.data;
  },

  async getLibraryDetail() {
    const response = await api.get(API_ENDPOINTS.LIBRARY_DETAIL);
    return response.data;
  },

  async updateLibrary(data) {
    const response = await api.put(API_ENDPOINTS.LIBRARY_DETAIL, data);
    return response.data;
  },

  async getLibraries() {
    const response = await api.get(API_ENDPOINTS.LIBRARY_LIST);
    return response.data;
  },
};
