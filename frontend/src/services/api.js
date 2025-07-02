import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://brandea-api.onrender.com/api',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast.error('Zugriff verweigert');
    } else if (error.response?.status === 500) {
      toast.error('Serverfehler');
    } else if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error('Ein Fehler ist aufgetreten');
    }
    return Promise.reject(error);
  }
);

export default api;