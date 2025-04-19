// src/api/axiosInstances.js
import axios from 'axios';

const baseConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://af89-143-44-184-91.ngrok-free.app',  // Added '/api' to baseURL
  headers: { 'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true' // Bypass Ngrok warning
  },
};

// Public instance (no auth)
const publicAxios = axios.create(baseConfig);

// Auth instance
const authAxios = axios.create(baseConfig);

// For development only - bypass SSL verification
if (import.meta.env.DEV) {
  publicAxios.defaults.httpsAgent = { rejectUnauthorized: false };
  authAxios.defaults.httpsAgent = { rejectUnauthorized: false };
}

// Token refresh logic
let isRefreshing = false;
let failedRequests = [];

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');
    
    const response = await publicAxios.post('/auth/refresh', { refreshToken });
    
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data.token;
  } catch (error) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    throw error;
  }
};

// Request interceptor (for authAxios only)
authAxios.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor (for authAxios only)
authAxios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Only handle 401 errors for non-auth endpoints
    if (error.response?.status === 401 && 
        !originalRequest.url.includes('/auth/') &&
        !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequests.push({ 
            resolve: () => {
              originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('authToken')}`;
              resolve(authAxios(originalRequest));
            },
            reject
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        failedRequests.forEach(pending => pending.resolve());
        return authAxios(originalRequest);
      } catch (refreshError) {
        failedRequests.forEach(pending => pending.reject(refreshError));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        failedRequests = [];
      }
    }
    return Promise.reject(error);
  }
);

// Global error handler
const handleError = error => {
  if (!error.response) {
    console.error('Network Error:', error);
  }
  return Promise.reject(error);
};

publicAxios.interceptors.response.use(null, handleError);
authAxios.interceptors.response.use(null, handleError);

export { publicAxios, authAxios };