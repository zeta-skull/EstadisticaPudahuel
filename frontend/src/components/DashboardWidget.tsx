import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardWidgetProps {
  widget: {
    type: 'line' | 'bar';
    title: string;
    statisticId: string;
  };
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({ widget }) => {
  const [statistic, setStatistic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statistics = useSelector((state: RootState) => state.statistics.statistics);

  useEffect(() => {
    const foundStatistic = statistics.find(s => s.id === widget.statisticId);
    if (foundStatistic) {
      setStatistic(foundStatistic);
      setLoading(false);
    } else {
      setError('Estadística no encontrada');
      setLoading(false);
    }
  }, [statistics, widget.statisticId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!statistic) {
    return null;
  }

  const chartData = {
    labels: statistic.data.map((d: any) => d.label),
    datasets: [
      {
        label: statistic.name,
        data: statistic.data.map((d: any) => d.value),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: widget.title,
      },
    },
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box height={300}>
        {widget.type === 'line' ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </Box>
    </Paper>
  );
};

export default DashboardWidget; 