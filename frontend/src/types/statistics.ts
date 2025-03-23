export interface Statistic {
  id: string;
  name: string;
  description: string;
  type: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface StatisticData {
  title: string;
  description: string;
  value: number;
  unit: string;
  category: string;
  date: string;
}

export interface StatisticsState {
  statistics: Statistic[];
  loading: boolean;
  error: string | null;
} 