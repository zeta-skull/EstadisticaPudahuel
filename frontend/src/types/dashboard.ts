export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  config: Record<string, any>;
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
  widgets: Omit<DashboardWidget, 'id'>[];
}

export interface DashboardState {
  configurations: DashboardConfig[];
  currentConfiguration: DashboardConfig | null;
  loading: boolean;
  error: string | null;
} 