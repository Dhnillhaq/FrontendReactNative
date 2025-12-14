import axios from 'axios';

// Ganti dengan URL backend kamu
const BASE_URL = 'http://192.168.18.15:3001/api'; // Untuk testing di local network
// const BASE_URL = 'https://your-backend-url.com/api'; // Untuk production

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Services
export const groupAPI = {
  getAll: () => api.get('/groups'),
  getActive: () => api.get('/groups?isActive=true'),
  create: (data) => api.post('/groups', data),
};

export const shiftAPI = {
  getAll: () => api.get('/shifts'),
  getActive: () => api.get('/shifts?isActive=true'),
  create: (data) => api.post('/shifts', data),
};

export const productionLineAPI = {
  getAll: () => api.get('/production-lines'),
  getActive: () => api.get('/production-lines?isActive=true'),
  create: (data) => api.post('/production-lines', data),
};

export const operationAPI = {
  getAll: () => api.get('/operations'),
  getById: (id) => api.get(`/operations/${id}`),
  create: (data) => api.post('/operations', data),
  update: (id, data) => api.put(`/operations/${id}`, data),
  delete: (id) => api.delete(`/operations/${id}/toggle-status`),
  getByDate: (date) => api.get(`/operations?date=${date}`),
  getStatistics: () => api.get('/operations/statistics'),
};

export default api;