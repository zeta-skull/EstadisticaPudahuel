import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { StatisticsState, Statistic } from '@/types/statistics';
import api from '@/services/api';

const initialState: StatisticsState = {
  statistics: [],
  loading: false,
  error: null,
};

export const fetchStatistics = createAsyncThunk(
  'statistics/fetchStatistics',
  async () => {
    const response = await api.get<Statistic[]>('/statistics');
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

export const createStatistic = createAsyncThunk(
  'statistics/createStatistic',
  async (data: Omit<Statistic, 'id'>) => {
    const response = await api.post<Statistic>('/statistics', data);
    return response.data;
  }
);

export const updateStatistic = createAsyncThunk(
  'statistics/updateStatistic',
  async ({ id, data }: { id: string; data: Partial<Statistic> }) => {
    const response = await api.put<Statistic>(`/statistics/${id}`, data);
    return response.data;
  }
);

export const deleteStatistic = createAsyncThunk(
  'statistics/deleteStatistic',
  async (id: string) => {
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
        state.error = action.error.message || 'Error al obtener las estadísticas';
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
        state.error = action.error.message || 'Error al crear la estadística';
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
        state.error = action.error.message || 'Error al actualizar la estadística';
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