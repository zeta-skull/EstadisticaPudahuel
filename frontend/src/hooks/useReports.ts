import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import {
  fetchReports,
  createReport,
  updateReport,
  deleteReport,
  generateReport,
} from '@/store/slices/reportsSlice';
import type { Report, ReportData, GenerateReportData } from '@/types/reports';

export const useReports = () => {
  const dispatch = useAppDispatch();
  const { reports, loading, error } = useAppSelector((state) => state.reports);

  const getReports = async () => {
    try {
      await dispatch(fetchReports()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const addReport = async (data: ReportData) => {
    try {
      await dispatch(createReport(data)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const editReport = async (id: string, data: ReportData) => {
    try {
      await dispatch(updateReport({ id, data })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const removeReport = async (id: string) => {
    try {
      await dispatch(deleteReport(id)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleGenerateReport = async (data: GenerateReportData) => {
    try {
      await dispatch(generateReport(data)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    reports,
    loading,
    error,
    getReports,
    addReport,
    editReport,
    removeReport,
    generateReport: handleGenerateReport,
  };
}; 