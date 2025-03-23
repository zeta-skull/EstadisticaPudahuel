export type DashboardWidgetType = 'line' | 'bar' | 'pie' | 'table';

export interface DashboardWidget {
  id: string;
  type: DashboardWidgetType;
  title: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  config: Record<string, any>;
  statisticId?: string;
}

export interface DashboardConfig {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  widgets: DashboardWidget[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardConfigData {
  name: string;
  description: string;
  isDefault: boolean;
  widgets: Omit<DashboardWidget, 'id'>[];
}

export interface DashboardState {
  configurations: DashboardConfig[];
  currentConfig: DashboardConfig | null;
  loading: boolean;
  error: string | null;
} 