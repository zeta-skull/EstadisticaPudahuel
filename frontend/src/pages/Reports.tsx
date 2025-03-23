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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Download as DownloadIcon } from '@mui/icons-material';
import { RootState } from '../store';
import { fetchReports, createReport, updateReport, deleteReport, generateReport } from '../store/slices/reportsSlice';

interface ReportFormData {
  name: string;
  description: string;
  statisticIds: string[];
  format: 'pdf' | 'excel';
}

const initialFormData: ReportFormData = {
  name: '',
  description: '',
  statisticIds: [],
  format: 'pdf',
};

const Reports: React.FC = () => {
  const dispatch = useDispatch();
  const { reports, loading, error } = useSelector((state: RootState) => state.reports);
  const { statistics } = useSelector((state: RootState) => state.statistics);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);
  const [formData, setFormData] = useState<ReportFormData>(initialFormData);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const handleOpenDialog = (report?: any) => {
    if (report) {
      setEditingReport(report);
      setFormData({
        name: report.name,
        description: report.description,
        statisticIds: report.statisticIds,
        format: report.format,
      });
    } else {
      setEditingReport(null);
      setFormData(initialFormData);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReport(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async () => {
    try {
      if (editingReport) {
        await dispatch(updateReport({ id: editingReport.id, ...formData }));
      } else {
        await dispatch(createReport(formData));
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
      try {
        await dispatch(deleteReport(id));
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    }
  };

  const handleGenerateReport = async (id: string) => {
    try {
      await dispatch(generateReport(id));
    } catch (error) {
      console.error('Error generating report:', error);
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
          Reportes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Reporte
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
              <TableCell>Estadísticas</TableCell>
              <TableCell>Formato</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.name}</TableCell>
                <TableCell>{report.description}</TableCell>
                <TableCell>
                  {report.statisticIds
                    .map((id) => statistics.find((s) => s.id === id)?.name)
                    .join(', ')}
                </TableCell>
                <TableCell>{report.format.toUpperCase()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleGenerateReport(report.id)}>
                    <DownloadIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDialog(report)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(report.id)}>
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
          {editingReport ? 'Editar Reporte' : 'Nuevo Reporte'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Estadísticas</InputLabel>
                  <Select
                    multiple
                    value={formData.statisticIds}
                    onChange={(e) => setFormData({ ...formData, statisticIds: e.target.value as string[] })}
                    label="Estadísticas"
                  >
                    {statistics.map((statistic) => (
                      <MenuItem key={statistic.id} value={statistic.id}>
                        {statistic.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Formato</InputLabel>
                  <Select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value as 'pdf' | 'excel' })}
                    label="Formato"
                  >
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="excel">Excel</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingReport ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Reports; 
}; 