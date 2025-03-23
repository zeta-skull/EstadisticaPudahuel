export interface Report {
  id: string;
  name: string;
  description: string;
  type: string;
  parameters: Record<string, any>;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ReportData {
  title: string;
  description: string;
  type: 'pdf' | 'excel' | 'csv';
}

export interface GenerateReportData {
  reportId: string;
  filters?: {
    startDate?: string;
    endDate?: string;
    categories?: string[];
    [key: string]: unknown;
  };
}

export interface ReportsState {
  reports: Report[];
  loading: boolean;
  error: string | null;
} 