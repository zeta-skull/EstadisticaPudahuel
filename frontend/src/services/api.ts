import axios, { 
  AxiosInstance, 
  InternalAxiosRequestConfig,
  AxiosResponse, 
  AxiosError 
} from 'axios';
import { store } from '@/store';
import type { User, Statistic, Report, DashboardConfig } from '@/types';

const baseURL = 'http://localhost:3001/api';

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      store.dispatch({ type: 'auth/logout' });
    }
    return Promise.reject(error);
  }
);

// Error handler
const handleError = (error: AxiosError): never => {
  if (error.response) {
    // Server responded with error
    const message = (error.response.data as { message?: string })?.message || 'Error en la solicitud';
    throw new Error(message);
  } else if (error.request) {
    // Request made but no response
    throw new Error('No se pudo conectar con el servidor');
  } else {
    // Something else happened
    throw new Error('Error en la solicitud');
  }
};

// Servicios de autenticación
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (email: string, password: string, full_name: string) => {
    const response = await api.post('/auth/register', { email, password, full_name });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Servicios de estadísticas
export const statisticsService = {
  getAll: async (): Promise<Statistic[]> => {
    try {
      const response = await api.get<Statistic[]>('/statistics');
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  getById: async (id: string): Promise<Statistic> => {
    try {
      const response = await api.get<Statistic>(`/statistics/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  create: async (data: Omit<Statistic, 'id'>): Promise<Statistic> => {
    try {
      const response = await api.post<Statistic>('/statistics', data);
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  update: async (id: string, data: Partial<Statistic>): Promise<Statistic> => {
    try {
      const response = await api.put<Statistic>(`/statistics/${id}`, data);
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/statistics/${id}`);
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  upload: async (data: FormData): Promise<Statistic> => {
    try {
      const response = await api.post<Statistic>('/statistics/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },
};

// Servicios de reportes
export const reportsService = {
  getAll: async (): Promise<Report[]> => {
    try {
      const response = await api.get<Report[]>('/reports');
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  getById: async (id: string): Promise<Report> => {
    try {
      const response = await api.get<Report>(`/reports/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },
};

export default api;