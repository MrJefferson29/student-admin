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
  IconButton,
  Chip,
  InputAdornment,
} from '@mui/material';
// Removed: DatePicker, LocalizationProvider, and AdapterDateFns imports
import { useNavigate } from 'react-router-dom';
import { UploadFile as UploadFileIcon, Delete as DeleteIcon, Event as EventIcon } from '@mui/icons-material';

// --- MOCK API UTILS (FOR RUNNABILITY) ---
const API_URL = 'https://uba-r875.onrender.com/api'; 
const scholarshipsAPI = {
    upload: async (uploadData) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        console.log('API Call: Upload Scholarship');
        for (const [key, value] of uploadData.entries()) {
            if (key === 'images') {
                console.log(`- ${key}: [File: ${value.name}, Type: ${value.type}]`);
            } else {
                console.log(`- ${key}: ${value}`);
            }
        }

        // Simulate successful response
        return { 
            success: true, 
            message: 'Scholarship data received and processed successfully',
            data: { id: 'new-s-123', organizationName: uploadData.get('organizationName') }
        };
    },
};
// ------------------------------------------

// Helper function to format a Date object or string to 'YYYY-MM-DD' for HTML input
const formatDateToHtml = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function UploadScholarship() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizationName: '',
    description: '',
    location: '',
    websiteLink: '',
    // Deadline now stores a string in 'YYYY-MM-DD' format or null/empty string
    deadline: '', 
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (e) => {
    // The value from the input type="date" is a 'YYYY-MM-DD' string
    setFormData({
        ...formData,
        deadline: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setError(''); 

    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (validFiles.length !== files.length) {
        setError('Error: Only image files are supported.');
        return;
      }

      if (images.length + validFiles.length > 10) {
        setError(`Maximum 10 images allowed. You tried to add ${images.length + validFiles.length}.`);
        return;
      }

      // Add to images array
      setImages([...images, ...validFiles]);

      // Create previews
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, { file, preview: reader.result, name: file.name }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // --- Validation ---
    if (!formData.organizationName || !formData.description || !formData.location || !formData.websiteLink || !formData.deadline) {
      setError('Please fill in all required fields, including the deadline.');
      return;
    }

    if (images.length === 0) {
      setError('Please select at least one image.');
      return;
    }

    // Validate URL
    try {
      new URL(formData.websiteLink);
    } catch (err) {
      setError('Please provide a valid website URL (must include http:// or https://).');
      return;
    }

    setLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('organizationName', formData.organizationName);
      uploadData.append('description', formData.description);
      uploadData.append('location', formData.location);
      uploadData.append('websiteLink', formData.websiteLink);
      
      // Deadline is passed as a 'YYYY-MM-DD' string from the input
      if (formData.deadline) {
          uploadData.append('deadline', formData.deadline);
      }
      
      // Append all images
      images.forEach((image) => {
        uploadData.append('images', image);
      });

      const response = await scholarshipsAPI.upload(uploadData);

      if (response.success) {
        setSuccess('Scholarship uploaded successfully! Redirecting...');
        // Reset form
        setFormData({
          organizationName: '',
          description: '',
          location: '',
          websiteLink: '',
          deadline: '',
        });
        setImages([]);
        setImagePreviews([]);
        // Reset file input manually
        document.getElementById('image-upload').value = '';

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/admin/manage-scholarships');
        }, 2000);
      } else {
        setError(response.message || 'Failed to upload scholarship');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during submission. Please check the console.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Upload New Scholarship 🚀
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Provide the necessary details and visuals for the scholarship opportunity.
          </Typography>
        </Box>

        <Paper elevation={4} sx={{ p: 4 }}>
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
              {/* Organization Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Organization/Sponsor Name"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Grid>

              {/* Description */}
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
                  helperText="Provide a detailed description of the scholarship, including eligibility and requirements."
                />
              </Grid>

              {/* Location and Deadline (Standard HTML input) */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Applicable Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="e.g., Cameroon, Africa, Worldwide"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Application Deadline"
                    name="deadline"
                    type="date" // Uses the native HTML date picker
                    value={formData.deadline}
                    onChange={handleDateChange}
                    required
                    disabled={loading}
                    helperText="The final date applications will be accepted."
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EventIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
              </Grid>

              {/* Website Link */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Official Website Link"
                  name="websiteLink"
                  value={formData.websiteLink}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="https://application-portal.com"
                  helperText="Must be a complete URL (starting with http:// or https://)"
                 InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <EventIcon color="action" />
                        </InputAdornment>
                    ),
                }}
                />
              </Grid>

              {/* Image Upload Zone */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: '2px dashed',
                        borderColor: images.length > 0 ? '#4caf50' : '#ccc', 
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
                  <UploadFileIcon sx={{ fontSize: 48, color: '#1a237e', mb: 1 }} />
                  <Typography variant="body1" gutterBottom fontWeight={600}>
                    Drag & Drop or Click to Upload Images
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Formats: JPG, PNG. Max 10 files.
                  </Typography>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={loading || images.length >= 10}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="contained"
                      component="span"
                        color="secondary"
                      disabled={loading || images.length >= 10}
                      sx={{ mt: 1 }}
                    >
                      Choose Images
                    </Button>
                  </label>
                  {images.length > 0 && (
                    <Chip 
                            label={`${images.length} image(s) selected`} 
                            color="success" 
                            variant="outlined" 
                            size="small"
                            sx={{ mt: 2, ml: 2, fontWeight: 600 }}
                        />
                  )}
                </Box>
              </Grid>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2, borderBottom: '1px solid #eee', pb: 1 }}>
                    Previews
                  </Typography>
                  <Grid container spacing={2}>
                    {imagePreviews.map((preview, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <Box
                          sx={{
                            position: 'relative',
                            border: '1px solid #ccc',
                            borderRadius: 2,
                            overflow: 'hidden',
                            bgcolor: '#fff',
                          }}
                        >
                          <img
                            src={preview.preview}
                            alt={`Preview ${index + 1}`}
                            style={{
                                width: '100%',
                                height: '120px', 
                                objectFit: 'cover',
                                display: 'block',
                            }}
                          />
                          <Typography variant="caption" sx={{ display: 'block', px: 1, py: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', bgcolor: '#f5f5f5' }}>
                            {preview.name}
                          </Typography>
                          <IconButton
                            color="error"
                            onClick={() => removeImage(index)}
                            disabled={loading}
                            sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                                p: 0.5,
                            }}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/admin/manage-scholarships')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || images.length === 0 || !formData.deadline}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <UploadFileIcon />}
                  >
                    {loading ? 'Uploading...' : 'Upload Scholarship'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
  );
}

export default UploadScholarship;