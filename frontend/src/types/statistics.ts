export interface Statistic {
  id: string;
  name: string;
  description: string;
  type: 'line' | 'bar' | 'pie' | 'table';
  data: Array<{
    label: string;
    value: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface StatisticData {
  name: string;
  description: string;
  type: string;
  data: Record<string, any>;
}

export interface StatisticsState {
  statistics: Statistic[];
  loading: boolean;
  error: string | null;
} 