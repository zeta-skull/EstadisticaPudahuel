import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import statisticsReducer from './slices/statisticsSlice';
import reportsReducer from './slices/reportsSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    statistics: statisticsReducer,
    reports: reportsReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 