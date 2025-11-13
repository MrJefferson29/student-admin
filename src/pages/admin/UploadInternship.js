import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UploadFile as UploadFileIcon, Image as ImageIcon } from '@mui/icons-material';
import { internshipsAPI } from '../../utils/api';

function UploadInternship() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    duration: '',
    description: '',
    applicationLink: '',
  });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setFile(selectedFile);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title || !formData.company || !formData.location || !formData.duration || !formData.description || !formData.applicationLink) {
      setError('Please fill in all fields');
      return;
    }

    // Validate URL
    try {
      new URL(formData.applicationLink);
    } catch (err) {
      setError('Please provide a valid application URL (starting with http:// or https://)');
      return;
    }

    setLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('company', formData.company);
      uploadData.append('location', formData.location);
      uploadData.append('duration', formData.duration);
      uploadData.append('description', formData.description);
      uploadData.append('applicationLink', formData.applicationLink);
      
      // Append image if selected (optional)
      if (file) {
        uploadData.append('image', file);
      }

      const response = await internshipsAPI.upload(uploadData);

      if (response.success) {
        setSuccess('Internship uploaded successfully!');
        // Reset form
        setFormData({
          title: '',
          company: '',
          location: '',
          duration: '',
          description: '',
          applicationLink: '',
        });
        setFile(null);
        setImagePreview(null);
        document.getElementById('image-upload').value = '';

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/admin/manage-internships');
        }, 2000);
      } else {
        setError(response.message || 'Failed to upload internship');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Upload Internship
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add a new internship opportunity
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="e.g., Software Engineering Intern"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="e.g., Tech Innovators"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="e.g., Remote, Lagos, Nigeria"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="e.g., 3 Months, 6 Months"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={4}
                disabled={loading}
                helperText="Provide a detailed description of the internship"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Application Link"
                name="applicationLink"
                value={formData.applicationLink}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="https://example.com/apply"
                helperText="Must start with http:// or https://"
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  bgcolor: '#f9f9f9',
                  '&:hover': {
                    borderColor: '#1a237e',
                    bgcolor: '#f5f5f5',
                  },
                }}
              >
                <ImageIcon sx={{ fontSize: 48, color: '#1a237e', mb: 2 }} />
                <Typography variant="body1" gutterBottom>
                  Select Image (Optional)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Recommended for better presentation
                </Typography>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                  style={{ display: 'none' }}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    Choose Image
                  </Button>
                </label>
                {file && (
                  <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    Selected: {file.name}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Image Preview */}
            {imagePreview && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Image Preview
                </Typography>
                <Box
                  sx={{
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    overflow: 'hidden',
                    maxWidth: '100%',
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/manage-internships')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <UploadFileIcon />}
                >
                  {loading ? 'Uploading...' : 'Upload Internship'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default UploadInternship;

