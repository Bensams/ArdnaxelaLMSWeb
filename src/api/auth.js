// src/api/auth.js
import { publicAxios, authAxios } from './axiosInstances';

const authAPI = {
  login: (guestInfo) => {
    return publicAxios.post('/auth/login', guestInfo);
  },

  logout: () => {
    return authAxios.post('/auth/logout');
  },

  register: (userData) => {
    return publicAxios.post('/auth/signup', userData);
  },

  getCurrentUser: () => {
    return authAxios.get('/api/auth/me');
  },

  signup: (userData) => {
    return publicAxios.post('/auth/signup', userData);
  }

  // Add other auth-related endpoints as needed
};

export default authAPI;