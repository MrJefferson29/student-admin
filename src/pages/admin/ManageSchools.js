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
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { schoolsAPI, departmentsAPI } from '../../utils/api';

const ManageSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await schoolsAPI.getAll();
      if (response.success) {
        setSchools(response.data || []);
      } else {
        setError('Failed to load schools');
      }
    } catch (err) {
      setError('An error occurred while loading schools');
      console.error('Error fetching schools:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (school = null) => {
    if (school) {
      setSelectedSchool(school);
      setFormData({
        name: school.name || '',
        description: school.description || '',
        location: school.location || '',
      });
    } else {
      setSelectedSchool(null);
      setFormData({
        name: '',
        description: '',
        location: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSchool(null);
    setFormData({
      name: '',
      description: '',
      location: '',
    });
  };

  const handleSubmit = async () => {
    try {
      setError('');
      if (!formData.name.trim()) {
        setError('School name is required');
        return;
      }

      if (selectedSchool) {
        await schoolsAPI.update(selectedSchool._id, formData);
      } else {
        await schoolsAPI.create(formData);
      }

      handleCloseDialog();
      fetchSchools();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('Error saving school:', err);
    }
  };

  const handleDeleteClick = (school) => {
    setSelectedSchool(school);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await schoolsAPI.delete(selectedSchool._id);
      setDeleteDialogOpen(false);
      setSelectedSchool(null);
      fetchSchools();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting');
      console.error('Error deleting school:', err);
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
          Manage Schools
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#1e67cd', '&:hover': { bgcolor: '#1557b0' } }}
        >
          Add School
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {schools.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No schools found. Create your first school to get started.
              </Typography>
            </Paper>
          </Grid>
        ) : (
          schools.map((school) => (
            <Grid item xs={12} sm={6} md={4} key={school._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SchoolIcon sx={{ mr: 1, color: '#1e67cd' }} />
                    <Typography variant="h6" component="h2" fontWeight="bold">
                      {school.name}
                    </Typography>
                  </Box>
                  {school.location && (
                    <Chip label={school.location} size="small" sx={{ mb: 1 }} />
                  )}
                  {school.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {school.description}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(school)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(school)}
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
        <DialogTitle>{selectedSchool ? 'Edit School' : 'Add New School'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="School Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              margin="normal"
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
            {selectedSchool ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete School</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedSchool?.name}"? This action cannot be undone.
            Make sure there are no departments associated with this school.
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

export default ManageSchools;

