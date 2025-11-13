import React, { useState, useEffect } from 'react';
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
  Avatar,
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI, resolveAssetUrl } from '../utils/api';

function EditProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    department: '',
    level: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        school: user.school || '',
        department: user.department || '',
        level: user.level || '',
      });
      if (user.profilePicture) {
        setPreviewImage(resolveAssetUrl(user.profilePicture));
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);

    try {
      const updateFormData = new FormData();
      updateFormData.append('name', formData.name);
      updateFormData.append('school', formData.school);
      updateFormData.append('department', formData.department);
      updateFormData.append('level', formData.level);

      if (profileImage) {
        updateFormData.append('image', profileImage);
      }

      const response = await authAPI.updateProfile(updateFormData);

      if (response.success) {
        setSuccess('Profile updated successfully!');
        // Update auth context
        updateUser(response.user);
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const defaultImageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=1a237e&color=fff&size=200`;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Edit Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Update your profile information
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
          {/* Profile Picture */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Avatar
              src={previewImage || defaultImageUrl}
              alt={formData.name}
              sx={{
                width: 150,
                height: 150,
                mb: 2,
                fontSize: 60,
              }}
            >
              {formData.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-image-upload"
              type="file"
              onChange={handleImageChange}
              disabled={loading}
            />
            <label htmlFor="profile-image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCameraIcon />}
                disabled={loading}
              >
                Change Photo
              </Button>
            </label>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="School"
                name="school"
                value={formData.school}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/profile')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default EditProfile;

