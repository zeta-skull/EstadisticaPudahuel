import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { DashboardState, DashboardConfig } from '@/types/dashboard';
import api from '@/services/api';

const initialState: DashboardState = {
  configurations: [],
  currentConfiguration: null,
  loading: false,
  error: null,
};

export const fetchDashboardConfigs = createAsyncThunk(
  'dashboard/fetchConfigs',
  async () => {
    const response = await api.get<DashboardConfig[]>('/dashboard/configs');
    return response.data;
  }
);

export const fetchDashboardConfigById = createAsyncThunk(
  'dashboard/fetchConfigById',
  async (id: string) => {
    const response = await api.get<DashboardConfig>(`/dashboard/configs/${id}`);
    return response.data;
  }
);

export const createDashboardConfig = createAsyncThunk(
  'dashboard/createConfig',
  async (data: Omit<DashboardConfig, 'id'>) => {
    const response = await api.post<DashboardConfig>('/dashboard/configs', data);
    return response.data;
  }
);

export const updateDashboardConfig = createAsyncThunk(
  'dashboard/updateConfig',
  async ({ id, data }: { id: string; data: Partial<DashboardConfig> }) => {
    const response = await api.put<DashboardConfig>(`/dashboard/configs/${id}`, data);
    return response.data;
  }
);

export const deleteDashboardConfig = createAsyncThunk(
  'dashboard/deleteConfig',
  async (id: string) => {
    await api.delete(`/dashboard/configs/${id}`);
    return id;
  }
);

export const setDefaultDashboardConfig = createAsyncThunk(
  'dashboard/setDefaultConfig',
  async (id: string) => {
    const response = await api.put<DashboardConfig>(`/dashboard/configs/${id}/default`);
    return response.data;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentConfig: (state, action) => {
      state.currentConfiguration = action.payload;
    },
    resetState: (state) => {
      state.configurations = [];
      state.currentConfiguration = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Configs
      .addCase(fetchDashboardConfigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardConfigs.fulfilled, (state, action) => {
        state.loading = false;
        state.configurations = action.payload;
      })
      .addCase(fetchDashboardConfigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al obtener las configuraciones';
      })
      // Fetch Config by ID
      .addCase(fetchDashboardConfigById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardConfigById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.configurations.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.configurations[index] = action.payload;
        } else {
          state.configurations.push(action.payload);
        }
        state.currentConfiguration = action.payload;
      })
      .addCase(fetchDashboardConfigById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al obtener la configuración';
      })
      // Create Config
      .addCase(createDashboardConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDashboardConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.configurations.push(action.payload);
        state.currentConfiguration = action.payload;
      })
      .addCase(createDashboardConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al crear la configuración';
      })
      // Update Config
      .addCase(updateDashboardConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDashboardConfig.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.configurations.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.configurations[index] = action.payload;
        }
        if (state.currentConfiguration?.id === action.payload.id) {
          state.currentConfiguration = action.payload;
        }
      })
      .addCase(updateDashboardConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al actualizar la configuración';
      })
      // Delete Config
      .addCase(deleteDashboardConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDashboardConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.configurations = state.configurations.filter((c) => c.id !== action.payload);
        if (state.currentConfiguration?.id === action.payload) {
          state.currentConfiguration = null;
        }
      })
      .addCase(deleteDashboardConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al eliminar la configuración';
      })
      // Set Default Config
      .addCase(setDefaultDashboardConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultDashboardConfig.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.configurations.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.configurations[index] = action.payload;
        }
        if (state.currentConfiguration?.id === action.payload.id) {
          state.currentConfiguration = action.payload;
        }
      })
      .addCase(setDefaultDashboardConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al establecer la configuración por defecto';
      });
  },
});

export const { clearError, setCurrentConfig, resetState } = dashboardSlice.actions;
export default dashboardSlice.reducer; 