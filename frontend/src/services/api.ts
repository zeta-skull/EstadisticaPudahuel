import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { User, Statistic, Report, DashboardConfig } from '@/types';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
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
  (error: AxiosError) => {
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - show error message
          console.error('No tienes permisos para realizar esta acción');
          break;
        case 404:
          // Not found - show error message
          console.error('El recurso solicitado no existe');
          break;
        case 500:
          // Server error - show error message
          console.error('Error interno del servidor');
          break;
        default:
          // Handle other errors
          console.error('Ha ocurrido un error inesperado');
      }
    } else if (error.request) {
      // Network error - show error message
      console.error('Error de conexión. Por favor, verifica tu conexión a internet.');
    } else {
      // Request configuration error - show error message
      console.error('Error al configurar la petición');
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

  create: async (data: Omit<Report, 'id'>): Promise<Report> => {
    try {
      const response = await api.post<Report>('/reports', data);
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  update: async (id: string, data: Partial<Report>): Promise<Report> => {
    try {
      const response = await api.put<Report>(`/reports/${id}`, data);
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/reports/${id}`);
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  generate: async (data: { type: string; parameters: Record<string, any> }): Promise<Report> => {
    try {
      const response = await api.post<Report>('/reports/generate', data);
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },
};

// Servicios de dashboard
export const dashboardService = {
  getConfigs: async (): Promise<DashboardConfig[]> => {
    try {
      const response = await api.get<DashboardConfig[]>('/dashboard/configs');
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  getConfigById: async (id: string): Promise<DashboardConfig> => {
    try {
      const response = await api.get<DashboardConfig>(`/dashboard/configs/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  createConfig: async (data: Omit<DashboardConfig, 'id'>): Promise<DashboardConfig> => {
    try {
      const response = await api.post<DashboardConfig>('/dashboard/configs', data);
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  updateConfig: async (id: string, data: Partial<DashboardConfig>): Promise<DashboardConfig> => {
    try {
      const response = await api.put<DashboardConfig>(`/dashboard/configs/${id}`, data);
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  deleteConfig: async (id: string): Promise<void> => {
    try {
      await api.delete(`/dashboard/configs/${id}`);
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  setDefaultConfig: async (id: string): Promise<DashboardConfig> => {
    try {
      const response = await api.put<DashboardConfig>(`/dashboard/configs/${id}/default`);
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },
};

export default api; 