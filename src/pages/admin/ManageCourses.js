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
  CardMedia,
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
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Book as BookIcon,
  VideoLibrary as VideoIcon,
} from '@mui/icons-material';
import { coursesAPI, departmentsAPI, resolveAssetUrl } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const ManageCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    level: '',
    department: '',
    instructor: '',
  });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, departmentsRes] = await Promise.all([
        coursesAPI.getAll(),
        departmentsAPI.getAll(),
      ]);

      if (coursesRes.success) {
        setCourses(coursesRes.data || []);
      }
      if (departmentsRes.success) {
        setDepartments(departmentsRes.data || []);
      }
    } catch (err) {
      setError('An error occurred while loading data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (course = null) => {
    if (course) {
      setSelectedCourse(course);
      setFormData({
        title: course.title || '',
        code: course.code || '',
        description: course.description || '',
        level: course.level || '',
        department: course.department?._id || course.department || '',
        instructor: course.instructor || '',
      });
      setImagePreview(resolveAssetUrl(course.thumbnail?.url));
    } else {
      setSelectedCourse(null);
      setFormData({
        title: '',
        code: '',
        description: '',
        level: '',
        department: '',
        instructor: '',
      });
      setImagePreview(null);
    }
    setFile(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCourse(null);
    setFormData({
      title: '',
      code: '',
      description: '',
      level: '',
      department: '',
      instructor: '',
    });
    setFile(null);
    setImagePreview(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    try {
      setError('');
      if (!formData.title.trim() || !formData.department) {
        setError('Course title and department are required');
        return;
      }

      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('code', formData.code);
      uploadData.append('description', formData.description);
      uploadData.append('level', formData.level);
      uploadData.append('department', formData.department);
      uploadData.append('instructor', formData.instructor);
      if (file) {
        uploadData.append('thumbnail', file);
      }

      if (selectedCourse) {
        await coursesAPI.update(selectedCourse._id, uploadData);
      } else {
        await coursesAPI.create(uploadData);
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('Error saving course:', err);
    }
  };

  const handleDeleteClick = (course) => {
    setSelectedCourse(course);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await coursesAPI.delete(selectedCourse._id);
      setDeleteDialogOpen(false);
      setSelectedCourse(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting');
      console.error('Error deleting course:', err);
    }
  };

  const handleManageChapters = (course) => {
    navigate(`/admin/manage-course-chapters/${course._id}`);
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
          Manage Courses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={departments.length === 0}
          sx={{ bgcolor: '#1e67cd', '&:hover': { bgcolor: '#1557b0' } }}
        >
          Add Course
        </Button>
      </Box>

      {departments.length === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please create at least one department before adding courses.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {courses.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No courses found. Create your first course to get started.
              </Typography>
            </Paper>
          </Grid>
        ) : (
          courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {course.thumbnail?.url && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={resolveAssetUrl(course.thumbnail.url)}
                    alt={course.title}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BookIcon sx={{ mr: 1, color: '#1e67cd' }} />
                    <Typography variant="h6" component="h2" fontWeight="bold">
                      {course.title}
                    </Typography>
                  </Box>
                  {course.code && (
                    <Chip label={course.code} size="small" sx={{ mb: 1 }} />
                  )}
                  {course.department && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {course.department.name || course.department}
                    </Typography>
                  )}
                  {course.level && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Level: {course.level}
                    </Typography>
                  )}
                  {course.instructor && (
                    <Typography variant="body2" color="text.secondary">
                      Instructor: {course.instructor}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <IconButton
                    color="primary"
                    onClick={() => handleManageChapters(course)}
                    size="small"
                    title="Manage Chapters"
                  >
                    <VideoIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(course)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(course)}
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
        <DialogTitle>{selectedCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                label="Department"
              >
                {departments.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.name} ({dept.school?.name || dept.school})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Course Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Course Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Level"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              margin="normal"
              placeholder="e.g., Level 100"
            />
            <TextField
              fullWidth
              label="Instructor"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
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
            <Box sx={{ mt: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="thumbnail-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="thumbnail-upload">
                <Button variant="outlined" component="span" fullWidth>
                  {selectedCourse ? 'Replace Thumbnail' : 'Upload Thumbnail'}
                </Button>
              </label>
              {imagePreview && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#1e67cd' }}>
            {selectedCourse ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Course</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedCourse?.title}"? This action cannot be undone.
            Make sure there are no chapters associated with this course.
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

export default ManageCourses;

