import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { setToken, setRefreshToken, setUser, removeToken } from '../utils/auth';

export const authService = {
  async login(email, password) {
    const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    const { user, tokens } = response.data;
    
    setToken(tokens.access);
    setRefreshToken(tokens.refresh);
    setUser(user);
    
    return { user, tokens };
  },

  async loginOwner(library_id, email, password) {
    const response = await api.post(API_ENDPOINTS.LOGIN, { 
      library_id, 
      email, 
      password,
      user_type: 'owner'
    });
    const { user, tokens } = response.data;
    
    setToken(tokens.access);
    setRefreshToken(tokens.refresh);
    setUser(user);
    
    return { user, tokens };
  },

  async loginStudent(library_id, student_id, email, password) {
    const response = await api.post(API_ENDPOINTS.LOGIN, { 
      library_id,
      student_id,
      email, 
      password,
      user_type: 'student'
    });
    const { user, tokens } = response.data;
    
    setToken(tokens.access);
    setRefreshToken(tokens.refresh);
    setUser(user);
    
    return { user, tokens };
  },

  async forgotPassword(email, library_id, student_id = null, user_type = 'owner') {
    const response = await api.post('/api/v1/accounts/forgot-password/', {
      email,
      library_id,
      student_id,
      user_type
    });
    return response.data;
  },

  async register(userData) {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    const { user, tokens } = response.data;
    
    setToken(tokens.access);
    setRefreshToken(tokens.refresh);
    setUser(user);
    
    return { user, tokens };
  },

  async logout(refreshToken) {
    try {
      await api.post(API_ENDPOINTS.LOGOUT, { refresh_token: refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
    }
  },

  async getProfile() {
    const response = await api.get(API_ENDPOINTS.PROFILE);
    return response.data;
  },

  async refreshToken(refreshToken) {
    const response = await api.post(API_ENDPOINTS.TOKEN_REFRESH, { refresh: refreshToken });
    setToken(response.data.access);
    if (response.data.refresh) {
      setRefreshToken(response.data.refresh);
    }
    return response.data;
  },
};
