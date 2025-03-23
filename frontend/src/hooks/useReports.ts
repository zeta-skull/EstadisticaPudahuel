import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useStore';
import {
  fetchReports,
  createReport,
  updateReport,
  deleteReport,
} from '@/store/slices/reportsSlice';
import type { Report } from '@/types';

export const useReports = () => {
  const dispatch = useAppDispatch();
  const { reports, loading, error } = useAppSelector(
    (state) => state.reports
  );

  const fetchAll = useCallback(async () => {
    try {
      await dispatch(fetchReports()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch]);

  const create = useCallback(
    async (data: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        await dispatch(createReport(data)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const update = useCallback(
    async (id: string, data: Partial<Report>) => {
      try {
        await dispatch(updateReport({ id, data })).unwrap();
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
        await dispatch(deleteReport(id)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  return {
    reports,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
  };
}; 