import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { departmentsAPI, schoolsAPI } from '../../utils/api';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    school: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [departmentsRes, schoolsRes] = await Promise.all([
        departmentsAPI.getAll(),
        schoolsAPI.getAll(),
      ]);
      
      if (departmentsRes.success) {
        setDepartments(departmentsRes.data || []);
      }
      if (schoolsRes.success) {
        setSchools(schoolsRes.data || []);
      }
    } catch (err) {
      setError('An error occurred while loading data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (department = null) => {
    if (department) {
      setSelectedDepartment(department);
      setFormData({
        name: department.name || '',
        description: department.description || '',
        school: department.school?._id || department.school || '',
      });
    } else {
      setSelectedDepartment(null);
      setFormData({
        name: '',
        description: '',
        school: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDepartment(null);
    setFormData({
      name: '',
      description: '',
      school: '',
    });
  };

  const handleSubmit = async () => {
    try {
      setError('');
      if (!formData.name.trim() || !formData.school) {
        setError('Department name and school are required');
        return;
      }

      if (selectedDepartment) {
        await departmentsAPI.update(selectedDepartment._id, formData);
      } else {
        await departmentsAPI.create(formData);
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('Error saving department:', err);
    }
  };

  const handleDeleteClick = (department) => {
    setSelectedDepartment(department);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await departmentsAPI.delete(selectedDepartment._id);
      setDeleteDialogOpen(false);
      setSelectedDepartment(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting');
      console.error('Error deleting department:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Manage Departments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={schools.length === 0}
          sx={{ bgcolor: '#1e67cd', '&:hover': { bgcolor: '#1557b0' } }}
        >
          Add Department
        </Button>
      </Box>

      {schools.length === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please create at least one school before adding departments.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {departments.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No departments found. Create your first department to get started.
              </Typography>
            </Paper>
          </Grid>
        ) : (
          departments.map((department) => (
            <Grid item xs={12} sm={6} md={4} key={department._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BusinessIcon sx={{ mr: 1, color: '#1e67cd' }} />
                    <Typography variant="h6" component="h2" fontWeight="bold">
                      {department.name}
                    </Typography>
                  </Box>
                  {department.school && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      School: {department.school.name || department.school}
                    </Typography>
                  )}
                  {department.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {department.description}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(department)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(department)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedDepartment ? 'Edit Department' : 'Add New Department'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>School</InputLabel>
              <Select
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                label="School"
              >
                {schools.map((school) => (
                  <MenuItem key={school._id} value={school._id}>
                    {school.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Department Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#1e67cd' }}>
            {selectedDepartment ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Department</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedDepartment?.name}"? This action cannot be undone.
            Make sure there are no questions, courses, or concours associated with this department.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageDepartments;

