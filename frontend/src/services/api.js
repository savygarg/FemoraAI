import axios from 'axios';
import { getToken } from '../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

export const authApi = {
  register: (name, email, password) =>
    api.post('/api/auth/register', { name, email, password }),

  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),

  getMe: () => api.get('/api/auth/me'),
};

export const profileApi = {
  getProfile: () => api.get('/api/profile'),
  saveProfile: (profile) => api.put('/api/profile', profile),
};

export const predictionApi = {
  runAssessment: (payload) => api.post('/api/predictions/assessment', payload),
  getLatest: () => api.get('/api/predictions/latest'),
  getHistory: () => api.get('/api/predictions/history'),
};

export const assistantApi = {
  sendMessage: (payload) => api.post('/api/assistant/chat', payload),
};

export const journalApi = {
  createEntry: (entry) => api.post('/api/journal', entry),
  getEntries: () => api.get('/api/journal'),
  getEntry: (id) => api.get(`/api/journal/${id}`),
};
