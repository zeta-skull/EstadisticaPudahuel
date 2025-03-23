export interface Report {
  id: string;
  name: string;
  description: string;
  statisticIds: string[];
  format: 'pdf' | 'excel';
  createdAt: string;
  updatedAt: string;
}

export interface ReportData {
  name: string;
  description: string;
  type: string;
  parameters: Record<string, any>;
  data: Record<string, any>;
}

export interface GenerateReportData {
  type: string;
  parameters: Record<string, any>;
}

export interface ReportsState {
  reports: Report[];
  loading: boolean;
  error: string | null;
} 