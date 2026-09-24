import toast from 'react-hot-toast';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const isAuthRoute = error.config?.url?.includes('/login') || error.config?.url?.includes('/signup');
    if (error.response?.status === 401 && !isAuthRoute) {
      // Token expired or invalid
      const userStr = localStorage.getItem('user');
      let isAdmin = false;
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
            isAdmin = true;
          }
        } catch (e) {}
      }

      // Clear authentication data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // Redirect based on role
      window.location.href = isAdmin ? '/admin/login' : '/login';
    }
    // Show toast notification for errors
      if (error.response?.status !== 401 || isAuthRoute) { // Show toast for all errors, including 401s if they are from the login page
        const errData = error.response?.data;
        let errMsg = 'An unexpected error occurred.';
        
        if (errData) {
          if (typeof errData.message === 'string') errMsg = errData.message;
          else if (Array.isArray(errData.message)) errMsg = errData.message[0];
          else if (Array.isArray(errData.errors)) errMsg = errData.errors[0];
        } else if (error.message) {
          errMsg = error.message;
        }
        
        toast.error(errMsg);
      }
      
      return Promise.reject(error.response?.data || error.message);
  }
);

export default api;
