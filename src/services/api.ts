import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.VITE_API_URL;
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API Services
export const consoleService = {
  getAll: (params?: any) => api.get('/consoles', { params }),
  getById: (id: string) => api.get(`/consoles/${id}`),
  create: (data: any) => api.post('/consoles', data),
  update: (id: string, data: any) => api.put(`/consoles/${id}`, data),
  delete: (id: string) => api.delete(`/consoles/${id}`),
};

export const gameService = {
  getAll: (params?: any) => api.get('/games', { params }),
  getById: (id: string) => api.get(`/games/${id}`),
  create: (data: any) => api.post('/games', data),
  update: (id: string, data: any) => api.put(`/games/${id}`, data),
  delete: (id: string) => api.delete(`/games/${id}`),
};

export const eventService = {
  getAll: (params?: any) => api.get('/events', { params }),
  getById: (id: string) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
  update: (id: string, data: any) => api.put(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
};

export const bookingService = {
  getAll: (params?: any) => api.get('/bookings', { params }),
  getById: (id: string) => api.get(`/bookings/${id}`),
  create: (data: any) => api.post('/bookings', data),
  update: (id: string, data: any) => api.put(`/bookings/${id}`, data),
  delete: (id: string) => api.delete(`/bookings/${id}`),
  checkAvailability: (params: any) => api.get('/bookings/check-availability', { params }),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
};

export const authService = {
  register: (data: any) => api.post('/register', data),
  login: (data: any) => api.post('/login', data),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),
};

export { api };
export default api;