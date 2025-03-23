export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface StatisticDataPoint {
  label: string;
  value: number;
}

export interface Statistic {
  id: string;
  name: string;
  description: string;
  data: StatisticDataPoint[];
  createdAt: string;
  updatedAt: string;
}

export interface StatisticsState {
  statistics: Statistic[];
  loading: boolean;
  error: string | null;
}

export interface Report {
  id: string;
  name: string;
  description: string;
  statisticIds: string[];
  format: 'pdf' | 'excel';
  createdAt: string;
  updatedAt: string;
}

export interface ReportsState {
  reports: Report[];
  loading: boolean;
  error: string | null;
}

export interface DashboardWidget {
  id: string;
  type: 'line' | 'bar';
  title: string;
  statisticId: string;
}

export interface DashboardConfiguration {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardState {
  configurations: DashboardConfiguration[];
  currentConfiguration: DashboardConfiguration | null;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  statistics: StatisticsState;
  reports: ReportsState;
  dashboard: DashboardState;
}

export * from './auth';
export * from './statistics';
export * from './reports';
export * from './dashboard'; 