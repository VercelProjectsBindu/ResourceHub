import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_BASE_URL) return import.meta.env.VITE_BASE_URL;
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://${hostname}:3002`;
    }
  }
  return 'http://192.168.0.248:3002';
};

const API_URL = getBaseURL();

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiService = {
  setAuth: (token: string, user: any, expiresInHours: number = 24) => {
    const expiresAt = new Date().getTime() + expiresInHours * 60 * 60 * 1000;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('expiresAt', expiresAt.toString());
  },

  getToken: () => {
    const expiresAt = localStorage.getItem('expiresAt');
    if (expiresAt && new Date().getTime() > parseInt(expiresAt)) {
      apiService.clearAuth();
      return null;
    }
    return localStorage.getItem('token');
  },

  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expiresAt');
  },

  get: async <T>(url: string) => {
    try {
      const response = await apiClient.get<T>(url);
      return response.data;
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  post: async <T>(url: string, data: any) => {
    try {
      const response = await apiClient.post<T>(url, data);
      return response.data;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  put: async <T>(url: string, data: any) => {
    try {
      const response = await apiClient.put<T>(url, data);
      return response.data;
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  delete: async <T>(url: string) => {
    try {
      const response = await apiClient.delete<T>(url);
      return response.data;
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  },
};

export default apiClient;