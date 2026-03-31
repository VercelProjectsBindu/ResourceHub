import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL || 'http://192.168.0.248:3002';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
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