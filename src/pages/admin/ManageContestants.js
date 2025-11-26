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
  Person as PersonIcon,
} from '@mui/icons-material';
import { contestsAPI, resolveAssetUrl } from '../../utils/api';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const ManageContestants = () => {
  const { contestId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const contestName = location.state?.contestName || 'Contest';
  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContestant, setSelectedContestant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
  });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchContestants();
  }, [contestId]);

  const fetchContestants = async () => {
    try {
      setLoading(true);
      const response = await contestsAPI.getContestants(contestId);
      if (response.success) {
        setContestants(response.data || []);
      } else {
        setError('Failed to load contestants');
      }
    } catch (err) {
      setError('An error occurred while loading contestants');
      console.error('Error fetching contestants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (contestant = null) => {
    if (contestant) {
      setSelectedContestant(contestant);
      setFormData({
        name: contestant.name || '',
        bio: contestant.bio || '',
      });
      setImagePreview(resolveAssetUrl(contestant.image?.url || contestant.image));
    } else {
      setSelectedContestant(null);
      setFormData({
        name: '',
        bio: '',
      });
      setImagePreview(null);
    }
    setFile(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedContestant(null);
    setFormData({
      name: '',
      bio: '',
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
        setError('Contestant name is required');
        return;
      }

      const uploadData = new FormData();
      uploadData.append('name', formData.name);
      uploadData.append('bio', formData.bio);
      if (file) {
        uploadData.append('image', file);
      }

      await contestsAPI.addContestant(contestId, uploadData);

      handleCloseDialog();
      fetchContestants();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('Error saving contestant:', err);
    }
  };

  const handleDeleteClick = (contestant) => {
    setSelectedContestant(contestant);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await contestsAPI.deleteContestant(selectedContestant._id);
      setDeleteDialogOpen(false);
      setSelectedContestant(null);
      fetchContestants();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting');
      console.error('Error deleting contestant:', err);
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
        <Box>
          <Button onClick={() => navigate('/admin/manage-contests')} sx={{ mb: 1 }}>
            ← Back to Contests
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Manage Contestants - {contestName}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#1e67cd', '&:hover': { bgcolor: '#1557b0' } }}
        >
          Add Contestant
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {contestants.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No contestants found. Add contestants to this contest.
              </Typography>
            </Paper>
          </Grid>
        ) : (
          contestants.map((contestant) => (
            <Grid item xs={12} sm={6} md={4} key={contestant._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={resolveAssetUrl(contestant.image?.url || contestant.image) || '/placeholder.png'}
                  alt={contestant.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" component="h2" fontWeight="bold">
                    {contestant.name}
                  </Typography>
                  {contestant.bio && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {contestant.bio}
                    </Typography>
                  )}
                  {contestant.voteCount !== undefined && (
                    <Chip
                      label={`${contestant.voteCount} votes`}
                      color="primary"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </CardContent>
                <CardActions>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(contestant)}
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

      {/* Add Contestant Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Contestant</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Contestant Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <Box sx={{ mt: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="image-upload">
                <Button variant="outlined" component="span" fullWidth>
                  Upload Image
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
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Contestant</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedContestant?.name}"? This action cannot be undone.
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

export default ManageContestants;

