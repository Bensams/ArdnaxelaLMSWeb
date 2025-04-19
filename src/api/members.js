// src/api/members.js
import { authAxios } from './axiosInstances';

const membersAPI = {
  getProfile: () => {
    return authAxios.get('/api/members/profile'); //authAxios.get(`/api/members/profile`)
  },

  updateProfile: (profileData) => {
    return authAxios.put('/api/members/profile', profileData);
  },

  changePassword: (passwordData) => {
    return authAxios.put('/api/members/password', passwordData); 
  },

  getBorrowedBooks: async () => {
    try {
      const response = await authAxios.get('/api/members/borrowed-books');
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch borrowed books',
        status: error.response?.status || 500
      }
    }
  },

  borrowBook: (credentials) => {
    return authAxios.post('/api/members/borrow', credentials);
  },

  // Add other member-related endpoints as needed
};

export default membersAPI;