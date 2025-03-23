import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { DashboardState, DashboardConfig } from '@/types';

const initialState: DashboardState = {
  configurations: [],
  currentConfig: null,
  loading: false,
  error: null,
};

export const fetchDashboardConfigs = createAsyncThunk<DashboardConfig[]>(
  'dashboard/fetchConfigs',
  async () => {
    const response = await api.get('/dashboard/configs');
    return response.data;
  }
);

export const createDashboardConfig = createAsyncThunk<DashboardConfig, Omit<DashboardConfig, 'id' | 'createdAt' | 'updatedAt'>>(
  'dashboard/createConfig',
  async (data) => {
    const response = await api.post('/dashboard/configs', data);
    return response.data;
  }
);

export const updateDashboardConfig = createAsyncThunk<
  DashboardConfig,
  { id: string; data: Partial<DashboardConfig> }
>('dashboard/updateConfig', async ({ id, data }) => {
  const response = await api.put(`/dashboard/configs/${id}`, data);
  return response.data;
});

export const deleteDashboardConfig = createAsyncThunk<string, string>(
  'dashboard/deleteConfig',
  async (id) => {
    await api.delete(`/dashboard/configs/${id}`);
    return id;
  }
);

export const setCurrentConfig = createAsyncThunk<DashboardConfig, string>(
  'dashboard/setCurrentConfig',
  async (id) => {
    const response = await api.get(`/dashboard/configs/${id}`);
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
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.error.message || 'Error al cargar configuraciones';
      })
      .addCase(createDashboardConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDashboardConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.configurations.push(action.payload);
      })
      .addCase(createDashboardConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al crear configuración';
      })
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
        if (state.currentConfig?.id === action.payload.id) {
          state.currentConfig = action.payload;
        }
      })
      .addCase(updateDashboardConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al actualizar configuración';
      })
      .addCase(deleteDashboardConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDashboardConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.configurations = state.configurations.filter((c) => c.id !== action.payload);
        if (state.currentConfig?.id === action.payload) {
          state.currentConfig = null;
        }
      })
      .addCase(deleteDashboardConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al eliminar configuración';
      })
      .addCase(setCurrentConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setCurrentConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConfig = action.payload;
      })
      .addCase(setCurrentConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar configuración actual';
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer; 