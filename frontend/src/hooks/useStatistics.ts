import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import {
  fetchStatistics,
  createStatistic,
  updateStatistic,
  deleteStatistic,
} from '@/store/slices/statisticsSlice';
import type { Statistic, StatisticData } from '@/types/statistics';

export const useStatistics = () => {
  const dispatch = useAppDispatch();
  const { statistics, loading, error } = useAppSelector((state) => state.statistics);

  const getStatistics = async () => {
    try {
      await dispatch(fetchStatistics()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const addStatistic = async (data: StatisticData) => {
    try {
      await dispatch(createStatistic(data)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const editStatistic = async (id: string, data: StatisticData) => {
    try {
      await dispatch(updateStatistic({ id, data })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const removeStatistic = async (id: string) => {
    try {
      await dispatch(deleteStatistic(id)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    statistics,
    loading,
    error,
    getStatistics,
    addStatistic,
    editStatistic,
    removeStatistic,
  };
}; 