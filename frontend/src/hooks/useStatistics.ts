import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useStore';
import {
  fetchStatistics,
  createStatistic,
  updateStatistic,
  deleteStatistic,
} from '@/store/slices/statisticsSlice';
import type { Statistic } from '@/types';

export const useStatistics = () => {
  const dispatch = useAppDispatch();
  const { statistics, loading, error } = useAppSelector(
    (state) => state.statistics
  );

  const fetchAll = useCallback(async () => {
    try {
      await dispatch(fetchStatistics()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch]);

  const create = useCallback(
    async (data: Omit<Statistic, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        await dispatch(createStatistic(data)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const update = useCallback(
    async (id: string, data: Partial<Statistic>) => {
      try {
        await dispatch(updateStatistic({ id, data })).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteStatistic(id)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  return {
    statistics,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
  };
}; 