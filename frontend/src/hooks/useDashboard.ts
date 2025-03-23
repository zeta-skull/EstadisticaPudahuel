import { useAppDispatch, useAppSelector } from './useStore';
import {
  fetchDashboardConfigs,
  createDashboardConfig,
  updateDashboardConfig,
  deleteDashboardConfig,
  setCurrentConfig,
} from '@/store/slices/dashboardSlice';
import type { DashboardConfig } from '@/types';

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const { configurations, currentConfig, loading, error } = useAppSelector((state) => state.dashboard);

  const loadDashboardConfigs = async (): Promise<boolean> => {
    try {
      await dispatch(fetchDashboardConfigs()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleCreateConfig = async (data: Omit<DashboardConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      await dispatch(createDashboardConfig(data)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleUpdateConfig = async (id: string, data: Partial<DashboardConfig>): Promise<boolean> => {
    try {
      await dispatch(updateDashboardConfig({ id, data })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleDeleteConfig = async (id: string): Promise<boolean> => {
    try {
      await dispatch(deleteDashboardConfig(id)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSetCurrentConfig = async (id: string): Promise<boolean> => {
    try {
      await dispatch(setCurrentConfig(id)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    configurations,
    currentConfig,
    loading,
    error,
    loadDashboardConfigs,
    createConfig: handleCreateConfig,
    updateConfig: handleUpdateConfig,
    deleteConfig: handleDeleteConfig,
    setCurrentConfig: handleSetCurrentConfig,
  };
}; 