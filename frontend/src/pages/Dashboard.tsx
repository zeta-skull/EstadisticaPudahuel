import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Grid, Typography, Paper, Button, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { fetchDashboardConfigurations, setCurrentConfiguration } from '../store/slices/dashboardSlice';
import DashboardWidget from '../components/DashboardWidget';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { configurations, currentConfiguration, loading, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardConfigurations());
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Cargando dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!currentConfiguration) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No hay configuración de dashboard seleccionada
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/configurations/new')}
          >
            Crear nueva configuración
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          {currentConfiguration.name}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => navigate('/dashboard/configurations/edit')}
        >
          Editar configuración
        </Button>
      </Box>

      <Grid container spacing={3}>
        {currentConfiguration.widgets.map((widget, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <DashboardWidget widget={widget} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard; 