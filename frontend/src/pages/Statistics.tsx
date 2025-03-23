import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { RootState } from '../store';
import { fetchStatistics, createStatistic, updateStatistic, deleteStatistic } from '../store/slices/statisticsSlice';

interface StatisticFormData {
  name: string;
  description: string;
  data: Array<{ label: string; value: number }>;
}

const initialFormData: StatisticFormData = {
  name: '',
  description: '',
  data: [],
};

const Statistics: React.FC = () => {
  const dispatch = useDispatch();
  const { statistics, loading, error } = useSelector((state: RootState) => state.statistics);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStatistic, setEditingStatistic] = useState<any>(null);
  const [formData, setFormData] = useState<StatisticFormData>(initialFormData);

  useEffect(() => {
    dispatch(fetchStatistics());
  }, [dispatch]);

  const handleOpenDialog = (statistic?: any) => {
    if (statistic) {
      setEditingStatistic(statistic);
      setFormData({
        name: statistic.name,
        description: statistic.description,
        data: statistic.data,
      });
    } else {
      setEditingStatistic(null);
      setFormData(initialFormData);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStatistic(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async () => {
    try {
      if (editingStatistic) {
        await dispatch(updateStatistic({ id: editingStatistic.id, ...formData }));
      } else {
        await dispatch(createStatistic(formData));
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving statistic:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta estadística?')) {
      try {
        await dispatch(deleteStatistic(id));
      } catch (error) {
        console.error('Error deleting statistic:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Estadísticas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Estadística
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Datos</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statistics.map((statistic) => (
              <TableRow key={statistic.id}>
                <TableCell>{statistic.name}</TableCell>
                <TableCell>{statistic.description}</TableCell>
                <TableCell>{statistic.data.length} puntos</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(statistic)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(statistic.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingStatistic ? 'Editar Estadística' : 'Nueva Estadística'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingStatistic ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Statistics; 