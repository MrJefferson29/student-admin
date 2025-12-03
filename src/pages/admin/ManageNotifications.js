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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Notifications as NotificationsIcon,
  Image as ImageIcon,
  Videocam as VideocamIcon,
} from '@mui/icons-material';
import { notificationsAPI, resolveAssetUrl } from '../../utils/api';

const ManageNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaType: 'thumbnail', // 'thumbnail' or 'video'
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsAPI.getAll(50);
      if (response.success) {
        setNotifications(response.data || []);
      } else {
        setError('Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Fetch notifications error:', err);
      setError('An error occurred while loading notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (notification = null) => {
    if (notification) {
      setSelectedNotification(notification);
      setFormData({
        title: notification.title || '',
        description: notification.description || '',
        mediaType: notification.thumbnail?.url ? 'thumbnail' : 'video',
      });
      setFilePreview(
        notification.thumbnail?.url
          ? resolveAssetUrl(notification.thumbnail.url)
          : notification.video?.url
          ? resolveAssetUrl(notification.video.url)
          : null
      );
      setFile(null);
    } else {
      setSelectedNotification(null);
      setFormData({
        title: '',
        description: '',
        mediaType: 'thumbnail',
      });
      setFile(null);
      setFilePreview(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedNotification(null);
    setFormData({
      title: '',
      description: '',
      mediaType: 'thumbnail',
    });
    setFile(null);
    setFilePreview(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview
      if (formData.mediaType === 'thumbnail') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(URL.createObjectURL(selectedFile));
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (!selectedNotification && !file) {
      setError('Please select a thumbnail image or video');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const submitFormData = new FormData();
      submitFormData.append('title', formData.title.trim());
      submitFormData.append('description', formData.description.trim());
      submitFormData.append('mediaType', formData.mediaType);

      if (file) {
        submitFormData.append('media', file);
      }

      if (selectedNotification) {
        const response = await notificationsAPI.update(selectedNotification._id, submitFormData);
        if (response.success) {
          handleCloseDialog();
          fetchNotifications();
        } else {
          setError(response.message || 'Failed to update notification');
        }
      } else {
        const response = await notificationsAPI.create(submitFormData);
        if (response.success) {
          handleCloseDialog();
          fetchNotifications();
        } else {
          setError(response.message || 'Failed to create notification');
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || 'An error occurred while saving the notification');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNotification) return;

    try {
      const response = await notificationsAPI.delete(selectedNotification._id);
      if (response.success) {
        setNotifications(notifications.filter((n) => n._id !== selectedNotification._id));
        setDeleteDialogOpen(false);
        setSelectedNotification(null);
      } else {
        setError(response.message || 'Failed to delete notification');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'An error occurred while deleting the notification');
    }
  };

  const openDeleteDialog = (notification) => {
    setSelectedNotification(notification);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedNotification(null);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Manage Notifications
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#1976d2' }}
        >
          Create Notification
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {notifications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No notifications yet
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Create your first notification to start engaging with users
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Create Notification
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {notifications.map((notification) => {
            const hasThumbnail = notification.thumbnail?.url;
            const hasVideo = notification.video?.url;
            const mediaUrl = hasThumbnail
              ? resolveAssetUrl(notification.thumbnail.url)
              : hasVideo
              ? resolveAssetUrl(notification.video.url)
              : null;

            return (
              <Grid item xs={12} sm={6} md={4} key={notification._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {mediaUrl && (
                    <CardMedia
                      component={hasVideo ? 'video' : 'img'}
                      height="200"
                      image={mediaUrl}
                      alt={notification.title}
                      sx={{ objectFit: 'cover' }}
                      controls={hasVideo}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom noWrap>
                      {notification.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {notification.description}
                    </Typography>
                    <Box mt={2} display="flex" gap={1}>
                      {hasThumbnail && (
                        <Chip
                          icon={<ImageIcon />}
                          label="Image"
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                      {hasVideo && (
                        <Chip
                          icon={<VideocamIcon />}
                          label="Video"
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(notification)}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => openDeleteDialog(notification)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedNotification ? 'Edit Notification' : 'Create Notification'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              rows={4}
              required
            />

            <FormControl component="fieldset" margin="normal" fullWidth>
              <FormLabel component="legend">Media Type</FormLabel>
              <RadioGroup
                row
                value={formData.mediaType}
                onChange={(e) => {
                  setFormData({ ...formData, mediaType: e.target.value });
                  setFile(null);
                  setFilePreview(null);
                }}
              >
                <FormControlLabel value="thumbnail" control={<Radio />} label="Thumbnail Image" />
                <FormControlLabel value="video" control={<Radio />} label="Video" />
              </RadioGroup>
            </FormControl>

            <Box mt={2}>
              <Button variant="outlined" component="label" fullWidth>
                {formData.mediaType === 'thumbnail' ? 'Select Image' : 'Select Video'}
                <input
                  type="file"
                  hidden
                  accept={formData.mediaType === 'thumbnail' ? 'image/*' : 'video/*'}
                  onChange={handleFileChange}
                />
              </Button>
            </Box>

            {filePreview && (
              <Box mt={2}>
                {formData.mediaType === 'thumbnail' ? (
                  <img
                    src={filePreview}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                  />
                ) : (
                  <video
                    src={filePreview}
                    controls
                    style={{ width: '100%', maxHeight: '300px' }}
                  />
                )}
              </Box>
            )}

            {selectedNotification && !file && (
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Current Media:
                </Typography>
                {selectedNotification.thumbnail?.url ? (
                  <img
                    src={resolveAssetUrl(selectedNotification.thumbnail.url)}
                    alt="Current"
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                  />
                ) : selectedNotification.video?.url ? (
                  <video
                    src={resolveAssetUrl(selectedNotification.video.url)}
                    controls
                    style={{ width: '100%', maxHeight: '300px' }}
                  />
                ) : null}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={uploading}>
            {uploading ? <CircularProgress size={24} /> : selectedNotification ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Notification</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedNotification?.title}"? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageNotifications;

