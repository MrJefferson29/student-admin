import React, { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  Chip,
  CircularProgress,
  Link,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { concoursAPI, schoolsAPI, departmentsAPI } from '../../utils/api';

const defaultForm = {
  title: '',
  description: '',
  year: '',
  school: '',
  department: '',
};

const ManageConcours = () => {
  const [concours, setConcours] = useState([]);
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedConcours, setSelectedConcours] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [concoursRes, schoolsRes, departmentsRes] = await Promise.all([
        concoursAPI.getAll(),
        schoolsAPI.getAll(),
        departmentsAPI.getAll(),
      ]);

      if (concoursRes.success) {
        setConcours(concoursRes.data || []);
      }
      if (schoolsRes.success) {
        setSchools(schoolsRes.data || []);
      }
      if (departmentsRes.success) {
        setDepartments(departmentsRes.data || []);
      }
    } catch (err) {
      console.error('Fetch concours error:', err);
      setError('Unable to load concours. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const availableDepartments = useMemo(() => {
    if (!formData.school) return [];
    return departments.filter((dept) => {
      const schoolId = typeof dept?.school === 'object' ? dept.school?._id : dept.school;
      return String(schoolId) === String(formData.school);
    });
  }, [departments, formData.school]);

  const handleOpenDialog = (item = null) => {
    if (item) {
      setSelectedConcours(item);
      setFormData({
        title: item.title || '',
        description: item.description || '',
        year: item.year || '',
        school: item?.department?.school?._id || item?.department?.school || '',
        department: item?.department?._id || item?.department || '',
      });
      setFile(null);
    } else {
      setSelectedConcours(null);
      setFormData(defaultForm);
      setFile(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedConcours(null);
    setFormData(defaultForm);
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.year.trim() || !formData.department) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setError('');
      const body = new FormData();
      body.append('title', formData.title.trim());
      body.append('year', formData.year.trim());
      body.append('department', formData.department);
      body.append('description', formData.description || '');
      if (file) {
        body.append('pdf', file);
      }

      if (selectedConcours) {
        await concoursAPI.update(selectedConcours._id, body);
      } else {
        if (!file) {
          setError('Please upload a PDF file for the concours.');
          return;
        }
        await concoursAPI.upload(body);
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      console.error('Save concours error:', err);
      setError(err.response?.data?.message || 'Failed to save concours.');
    }
  };

  const handleDelete = async () => {
    if (!selectedConcours) return;
    try {
      await concoursAPI.delete(selectedConcours._id);
      setDeleteDialogOpen(false);
      setSelectedConcours(null);
      fetchData();
    } catch (err) {
      console.error('Delete concours error:', err);
      setError(err.response?.data?.message || 'Failed to delete concours.');
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleYearChange = (event) => {
    const value = event.target.value;
    // allow only digits and max 4 length
    if (/^\d{0,4}$/.test(value)) {
      setFormData((prev) => ({ ...prev, year: value }));
    }
  };

  const renderConcoursCard = (item) => {
    const schoolName = item?.department?.school?.name || 'Unknown School';
    const departmentName = item?.department?.name || 'Unknown Department';

    return (
      <Grid item xs={12} sm={6} md={4} key={item._id}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <PdfIcon color="error" />
              <Typography variant="h6" fontWeight="bold">
                {item.title}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <Chip label={item.year} color="primary" size="small" />
              <Chip label={departmentName} size="small" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              School: {schoolName}
            </Typography>
            {item.description && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {item.description}
              </Typography>
            )}
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between' }}>
            <Button
              size="small"
              startIcon={<PdfIcon />}
              onClick={() => window.open(item.pdfUrl, '_blank')}
            >
              View PDF
            </Button>
            <Box>
              <IconButton color="primary" onClick={() => handleOpenDialog(item)}>
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => {
                  setSelectedConcours(item);
                  setDeleteDialogOpen(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  const hasConcours = concours && concours.length > 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Manage Concours
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload PDF exams by school, department, and year
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Concours
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : hasConcours ? (
        <Grid container spacing={3}>
          {concours.map((item) => renderConcoursCard(item))}
        </Grid>
      ) : (
        <Card sx={{ p: 4 }}>
          <Typography variant="h6" color="text.secondary" align="center">
            No concours uploaded yet. Use the “Add Concours” button to create one.
          </Typography>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedConcours ? 'Edit Concours' : 'Add Concours'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              margin="normal"
              required
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Year"
              margin="normal"
              required
              value={formData.year}
              onChange={handleYearChange}
              placeholder="e.g. 2024"
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>School</InputLabel>
              <Select
                value={formData.school}
                label="School"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    school: e.target.value,
                    department: '',
                  }))
                }
              >
                {schools.map((school) => (
                  <MenuItem key={school._id} value={school._id}>
                    {school.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              margin="normal"
              required
              disabled={!formData.school || availableDepartments.length === 0}
            >
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department}
                label="Department"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
              >
                {availableDepartments.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {formData.school && availableDepartments.length === 0 && (
              <Typography variant="caption" color="text.secondary">
                No departments found for this school. Create departments first.
              </Typography>
            )}
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" component="label" startIcon={<PdfIcon />}>
                {file ? file.name : 'Upload PDF'}
                <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
              </Button>
              {selectedConcours?.pdfUrl && !file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Current file:{' '}
                  <Link href={selectedConcours.pdfUrl} target="_blank" rel="noopener">
                    Open PDF
                  </Link>
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedConcours ? 'Save Changes' : 'Create Concours'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Concours</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedConcours?.title}" ({selectedConcours?.year})?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageConcours;
