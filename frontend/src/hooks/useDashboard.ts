import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import {
  fetchDashboardConfigs,
  createDashboardConfig,
  updateDashboardConfig,
  deleteDashboardConfig,
  setDefaultDashboardConfig,
} from '@/store/slices/dashboardSlice';
import type { DashboardConfig, DashboardConfigData } from '@/types/dashboard';

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const { configurations, currentConfiguration, loading, error } = useAppSelector(
    (state) => state.dashboard
  );

  const getConfigurations = async () => {
    try {
      await dispatch(fetchDashboardConfigs()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const addConfiguration = async (data: DashboardConfigData) => {
    try {
      await dispatch(createDashboardConfig(data)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const editConfiguration = async (id: string, data: DashboardConfigData) => {
    try {
      await dispatch(updateDashboardConfig({ id, data })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const removeConfiguration = async (id: string) => {
    try {
      await dispatch(deleteDashboardConfig(id)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const setDefaultConfiguration = async (id: string) => {
    try {
      await dispatch(setDefaultDashboardConfig(id)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    configurations,
    currentConfiguration,
    loading,
    error,
    getConfigurations,
    addConfiguration,
    editConfiguration,
    removeConfiguration,
    setDefaultConfiguration,
  };
}; 