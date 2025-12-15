import React, { useEffect, useState } from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  VideoLibrary as VideoIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { skillChaptersAPI, skillsAPI } from '../../utils/api';
import { useNavigate, useParams } from 'react-router-dom';

const ManageSkillChapters = () => {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [parentChapterId, setParentChapterId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0,
    parentChapter: null,
    youtubeUrl: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [skillId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [chaptersRes, skillRes] = await Promise.all([
        skillChaptersAPI.getBySkill(skillId),
        skillsAPI.getById(skillId),
      ]);

      if (chaptersRes.success) {
        setChapters(chaptersRes.data || []);
      }
      if (skillRes.success) {
        setSkill(skillRes.data);
      }
    } catch (err) {
      setError('An error occurred while loading data');
      console.error('Error fetching skill chapter data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (chapter = null, isSubChapter = false, parentId = null) => {
    if (chapter) {
      setSelectedChapter(chapter);
      setFormData({
        title: chapter.title || '',
        description: chapter.description || '',
        order: chapter.order || 0,
        parentChapter: chapter.parentChapter?._id || chapter.parentChapter || null,
        youtubeUrl: chapter.youtubeUrl || '',
      });
      setParentChapterId(chapter.parentChapter?._id || chapter.parentChapter || null);
    } else {
      setSelectedChapter(null);
      setFormData({
        title: '',
        description: '',
        order: 0,
        parentChapter: parentId || null,
        youtubeUrl: '',
      });
      setParentChapterId(parentId || null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedChapter(null);
    setParentChapterId(null);
    setFormData({
      title: '',
      description: '',
      order: 0,
      parentChapter: null,
      youtubeUrl: '',
    });
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      setError('');

      if (!formData.title.trim()) {
        setError('Chapter title is required');
        setUploading(false);
        return;
      }

      const chapterData = {
        skill: skillId,
        title: formData.title,
        description: formData.description || '',
        order: formData.order,
        youtubeUrl: formData.youtubeUrl?.trim() || null,
      };

      if (formData.parentChapter) {
        chapterData.parentChapter = formData.parentChapter;
      }

      if (selectedChapter) {
        await skillChaptersAPI.update(selectedChapter._id, chapterData);
      } else {
        await skillChaptersAPI.create(chapterData);
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while saving the chapter';
      setError(errorMessage);
      console.error('Error saving skill chapter:', err);
      if (err.response?.data?.error) {
        console.error('Detailed error:', err.response.data.error);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (chapter) => {
    setSelectedChapter(chapter);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await skillChaptersAPI.delete(selectedChapter._id);
      setDeleteDialogOpen(false);
      setSelectedChapter(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting');
      console.error('Error deleting skill chapter:', err);
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
          <Button onClick={() => navigate('/admin/manage-skills')} sx={{ mb: 1 }}>
            ← Back to Skills
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Manage Chapters - {skill?.name || 'Skill'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#1e67cd', '&:hover': { bgcolor: '#1557b0' } }}
        >
          Add Chapter
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {chapters.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No chapters found. Create your first chapter to get started.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {chapters.map((chapter) => (
            <Grid item xs={12} key={chapter._id}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {chapter.title}
                    </Typography>
                    {chapter.youtubeUrl && (
                      <VideoIcon color="primary" sx={{ mr: 1 }} />
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Order: {chapter.order}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {chapter.description || 'No description provided.'}
                  </Typography>
                  <CardActions sx={{ p: 0, pb: 2 }}>
                    <IconButton color="primary" onClick={() => handleOpenDialog(chapter)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(chapter)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleOpenDialog(null, true, chapter._id)}>
                      <AddIcon />
                    </IconButton>
                  </CardActions>
                  {chapter.subChapters?.length > 0 && (
                    <Box sx={{ mt: 2, pl: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Sub Chapters
                      </Typography>
                      {chapter.subChapters.map((sub) => (
                        <Card key={sub._id} variant="outlined" sx={{ mb: 2 }}>
                          <CardContent>
                            <Typography variant="h6">{sub.title}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {sub.description || 'No description provided.'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
                              {sub.youtubeUrl && <VideoIcon color="primary" />}
                              <Typography variant="caption">Order: {sub.order}</Typography>
                            </Box>
                          </CardContent>
                          <CardActions>
                            <IconButton color="primary" onClick={() => handleOpenDialog(sub)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDeleteClick(sub)}>
                              <DeleteIcon />
                            </IconButton>
                          </CardActions>
                        </Card>
                      ))}
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedChapter ? 'Edit Chapter' : 'Add Chapter'}</DialogTitle>
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
              rows={3}
            />
            <TextField
              fullWidth
              type="number"
              label="Order"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="YouTube URL"
              value={formData.youtubeUrl}
              onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
              margin="normal"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <FormControl fullWidth margin="normal" disabled={chapters.length === 0}>
              <InputLabel id="parent-chapter-label">Parent Chapter</InputLabel>
              <Select
                labelId="parent-chapter-label"
                value={formData.parentChapter || ''}
                label="Parent Chapter"
                onChange={(e) => setFormData({ ...formData, parentChapter: e.target.value || null })}
                displayEmpty
              >
                <MenuItem value="">
                  <em>None (top-level)</em>
                </MenuItem>
                {chapters.map((ch) => (
                  <MenuItem key={ch._id} value={ch._id}>
                    {ch.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={uploading}>
            {uploading ? 'Saving...' : selectedChapter ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Chapter</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedChapter?.title}"? This action cannot be undone.
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

export default ManageSkillChapters;

