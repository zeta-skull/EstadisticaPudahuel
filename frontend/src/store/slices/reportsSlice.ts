import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { ReportsState, Report } from '@/types';

const initialState: ReportsState = {
  reports: [],
  loading: false,
  error: null,
};

export const fetchReports = createAsyncThunk<Report[]>(
  'reports/fetchReports',
  async () => {
    const response = await api.get('/reports');
    return response.data;
  }
);

export const fetchReportById = createAsyncThunk(
  'reports/fetchById',
  async (id: string) => {
    const response = await api.get<Report>(`/reports/${id}`);
    return response.data;
  }
);

export const createReport = createAsyncThunk<Report, Omit<Report, 'id' | 'createdAt' | 'updatedAt'>>(
  'reports/createReport',
  async (data) => {
    const response = await api.post('/reports', data);
    return response.data;
  }
);

export const updateReport = createAsyncThunk<
  Report,
  { id: string; data: Partial<Report> }
>('reports/updateReport', async ({ id, data }) => {
  const response = await api.put(`/reports/${id}`, data);
  return response.data;
});

export const deleteReport = createAsyncThunk<string, string>(
  'reports/deleteReport',
  async (id) => {
    await api.delete(`/reports/${id}`);
    return id;
  }
);

export const generateReport = createAsyncThunk(
  'reports/generateReport',
  async (data: { type: string; parameters: Record<string, any> }) => {
    const response = await api.post<Report>('/reports/generate', data);
    return response.data;
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.reports = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Reports
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar reportes';
      })
      // Fetch Report by ID
      .addCase(fetchReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reports.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        } else {
          state.reports.push(action.payload);
        }
      })
      .addCase(fetchReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al obtener el reporte';
      })
      // Create Report
      .addCase(createReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.push(action.payload);
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al crear reporte';
      })
      // Update Report
      .addCase(updateReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reports.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al actualizar reporte';
      })
      // Delete Report
      .addCase(deleteReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = state.reports.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al eliminar reporte';
      })
      // Generate Report
      .addCase(generateReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.push(action.payload);
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al generar el reporte';
      });
  },
});

export const { clearError, resetState } = reportsSlice.actions;
export default reportsSlice.reducer; 