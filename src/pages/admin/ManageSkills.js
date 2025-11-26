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
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Build as BuildIcon,
} from '@mui/icons-material';
import { skillsAPI, resolveAssetUrl } from '../../utils/api';

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await skillsAPI.getAll();

      if (response.success) {
        setSkills(response.data || []);
      }
    } catch (err) {
      setError('An error occurred while loading data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (skill = null) => {
    if (skill) {
      setSelectedSkill(skill);
      setFormData({
        name: skill.name || '',
        category: skill.category || '',
        description: skill.description || '',
      });
      setImagePreview(resolveAssetUrl(skill.thumbnail?.url));
    } else {
      setSelectedSkill(null);
      setFormData({
        name: '',
        category: '',
        description: '',
      });
      setImagePreview(null);
    }
    setFile(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSkill(null);
    setFormData({
      name: '',
      category: '',
      description: '',
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
      if (!formData.name.trim()) {
        setError('Skill name is required');
        return;
      }

      const uploadData = new FormData();
      uploadData.append('name', formData.name);
      uploadData.append('category', formData.category);
      uploadData.append('description', formData.description);
      if (file) {
        uploadData.append('thumbnail', file);
      }

      if (selectedSkill) {
        await skillsAPI.update(selectedSkill._id, uploadData);
      } else {
        await skillsAPI.create(uploadData);
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('Error saving skill:', err);
    }
  };

  const handleDeleteClick = (skill) => {
    setSelectedSkill(skill);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await skillsAPI.delete(selectedSkill._id);
      setDeleteDialogOpen(false);
      setSelectedSkill(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting');
      console.error('Error deleting skill:', err);
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
          Manage Skills
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#1e67cd', '&:hover': { bgcolor: '#1557b0' } }}
        >
          Add Skill
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {skills.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No skills found. Create your first skill to get started.
              </Typography>
            </Paper>
          </Grid>
        ) : (
          skills.map((skill) => (
            <Grid item xs={12} sm={6} md={4} key={skill._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {skill.thumbnail?.url && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={resolveAssetUrl(skill.thumbnail.url)}
                    alt={skill.name}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BuildIcon sx={{ mr: 1, color: '#1e67cd' }} />
                    <Typography variant="h6" component="h2" fontWeight="bold">
                      {skill.name}
                    </Typography>
                  </Box>
                  {skill.category && (
                    <Chip label={skill.category} size="small" sx={{ mb: 1 }} />
                  )}
                  {skill.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {skill.description}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(skill)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(skill)}
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
        <DialogTitle>{selectedSkill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Skill Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              margin="normal"
              placeholder="e.g., Programming, Design, Business"
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
                  {selectedSkill ? 'Replace Thumbnail' : 'Upload Thumbnail'}
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
            {selectedSkill ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Skill</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedSkill?.name}"? This action cannot be undone.
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

export default ManageSkills;


