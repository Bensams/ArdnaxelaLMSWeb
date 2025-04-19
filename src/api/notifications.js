import { authAxios } from "./axiosInstances";

const notificationAPI = {
    getUserNotifications: async () => {
      try {
        const response = await authAxios.get('/api/notifications');
        return {
          success: true,
          data: response.data,
          status: response.status
        };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to fetch notifications',
          status: error.response?.status || 500
        };
      }
      },
    
      markAsRead: async (notificationId) => {
        try {
          const response = await authAxios.patch(`/api/notifications/${notificationId}/read`);
          return {
            success: true,
            data: response.data,
            status: response.status
          };
        } catch (error) {
          return {
            success: false,
            message: error.response?.data?.message || 'Failed to mark notification as read',
            status: error.response?.status || 500
          };
        }
      },
    
      markAllAsRead: async () => {
        try {
          const response = await authAxios.patch('/api/notifications/read-all');
          return {
            success: true,
            data: response.data,
            status: response.status
          };
        } catch (error) {
          return {
            success: false,
            message: error.response?.data?.message || 'Failed to mark all notifications as read',
            status: error.response?.status || 500
          };
        }
      },
    
      getBorrowedBooks: async () => {
        return authAxios.get('/api/members/borrowed-books');
      },
};

export default notificationAPI;