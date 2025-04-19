// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react';
import notificationAPI from '../api/notifications';
import { useAuth } from '../Context/AuthContext';

export const useNotifications = () => {
  const { token, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sort notifications with unread first
  const sortNotifications = useCallback((notifs) => {
    return [...notifs].sort((a, b) => {
      if (a.read === b.read) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return a.read ? 1 : -1;
    });
  }, []);

  // Fetch notifications with enhanced error handling
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await notificationAPI.getUserNotifications();
      
      if (result.success) {
        const newNotifications = sortNotifications(result.data);
        setNotifications(newNotifications);
        setUnreadCount(newNotifications.filter(n => !n.read).length);
      } else {
        if (result.status === 401) {
          logout();
        }
        setError(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  }, [token, logout, sortNotifications]);

  // Mark notification as read
  const markAsRead = useCallback(async (id) => {
    try {
      const result = await notificationAPI.markAsRead(id);
      
      if (result.success) {
        setNotifications(prev => prev.map(n => 
          n.id === id ? {...n, read: true} : n
        ));
        setUnreadCount(prev => prev - 1);
      } else {
        if (result.status === 401) {
          logout();
        }
        setError(result.message);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setError('Failed to mark notification as read');
    }
  }, [logout]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const result = await notificationAPI.markAllAsRead();
      
      if (result.success) {
        setNotifications(prev => prev.map(n => ({...n, read: true})));
        setUnreadCount(0);
      } else {
        if (result.status === 401) {
          logout();
        }
        setError(result.message);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      setError('Failed to mark all notifications as read');
    }
  }, [logout]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};