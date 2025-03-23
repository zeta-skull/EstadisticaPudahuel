import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { StatisticsState, Statistic } from '@/types';

const initialState: StatisticsState = {
  statistics: [],
  loading: false,
  error: null,
};

export const fetchStatistics = createAsyncThunk<Statistic[]>(
  'statistics/fetchStatistics',
  async () => {
    const response = await api.get('/statistics');
    return response.data;
  }
);

export const fetchStatisticById = createAsyncThunk(
  'statistics/fetchById',
  async (id: string) => {
    const response = await api.get<Statistic>(`/statistics/${id}`);
    return response.data;
  }
);

export const createStatistic = createAsyncThunk<Statistic, Omit<Statistic, 'id'>>(
  'statistics/createStatistic',
  async (data) => {
    const response = await api.post('/statistics', data);
    return response.data;
  }
);

export const updateStatistic = createAsyncThunk<
  Statistic,
  { id: string; data: Partial<Statistic> }
>('statistics/updateStatistic', async ({ id, data }) => {
  const response = await api.put(`/statistics/${id}`, data);
  return response.data;
});

export const deleteStatistic = createAsyncThunk<string, string>(
  'statistics/deleteStatistic',
  async (id) => {
    await api.delete(`/statistics/${id}`);
    return id;
  }
);

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.statistics = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Statistics
      .addCase(fetchStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar estadísticas';
      })
      // Fetch Statistic by ID
      .addCase(fetchStatisticById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatisticById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.statistics.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.statistics[index] = action.payload;
        } else {
          state.statistics.push(action.payload);
        }
      })
      .addCase(fetchStatisticById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al obtener la estadística';
      })
      // Create Statistic
      .addCase(createStatistic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStatistic.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics.push(action.payload);
      })
      .addCase(createStatistic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al crear estadística';
      })
      // Update Statistic
      .addCase(updateStatistic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatistic.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.statistics.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.statistics[index] = action.payload;
        }
      })
      .addCase(updateStatistic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al actualizar estadística';
      })
      // Delete Statistic
      .addCase(deleteStatistic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStatistic.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = state.statistics.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteStatistic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al eliminar la estadística';
      });
  },
});

export const { clearError, resetState } = statisticsSlice.actions;
export default statisticsSlice.reducer; 