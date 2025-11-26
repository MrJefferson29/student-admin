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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  VideoLibrary as VideoIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { courseChaptersAPI, coursesAPI, departmentsAPI } from '../../utils/api';
import { useParams, useNavigate } from 'react-router-dom';

const ManageCourseChapters = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [course, setCourse] = useState(null);
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
  }, [courseId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [chaptersRes, courseRes] = await Promise.all([
        courseChaptersAPI.getByCourse(courseId),
        coursesAPI.getById(courseId),
      ]);

      if (chaptersRes.success) {
        setChapters(chaptersRes.data || []);
      }
      if (courseRes.success) {
        setCourse(courseRes.data);
      }
    } catch (err) {
      setError('An error occurred while loading data');
      console.error('Error fetching data:', err);
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
      setError('');
      setUploading(true);
      
      if (!formData.title.trim()) {
        setError('Chapter title is required');
        setUploading(false);
        return;
      }

      // Validate YouTube URL if provided
      if (formData.youtubeUrl && formData.youtubeUrl.trim()) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        if (!youtubeRegex.test(formData.youtubeUrl.trim())) {
          setError('Please provide a valid YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID)');
          setUploading(false);
          return;
        }
      }

      const chapterData = {
        course: courseId,
        title: formData.title,
        description: formData.description || '',
        order: formData.order,
        youtubeUrl: formData.youtubeUrl?.trim() || null,
      };
      
      if (formData.parentChapter) {
        chapterData.parentChapter = formData.parentChapter;
      }

      if (selectedChapter) {
        await courseChaptersAPI.update(selectedChapter._id, chapterData);
      } else {
        await courseChaptersAPI.create(chapterData);
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while saving the chapter';
      setError(errorMessage);
      console.error('Error saving chapter:', err);
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
      await courseChaptersAPI.delete(selectedChapter._id);
      setDeleteDialogOpen(false);
      setSelectedChapter(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting');
      console.error('Error deleting chapter:', err);
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
          <Button onClick={() => navigate('/admin/manage-courses')} sx={{ mb: 1 }}>
            ← Back to Courses
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Manage Chapters - {course?.title || 'Course'}
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
            No chapters found. Add chapters to this course.
          </Typography>
        </Paper>
      ) : (
        <Box>
          {chapters.map((chapter) => (
            <Accordion key={chapter._id} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <VideoIcon sx={{ mr: 2, color: chapter.youtubeUrl ? '#1e67cd' : '#9CA3AF' }} />
                  <Typography variant="h6" sx={{ flex: 1 }}>
                    {chapter.title}
                  </Typography>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDialog(chapter);
                    }}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(chapter);
                    }}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
                  {chapter.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {chapter.description}
                    </Typography>
                  )}
                  {chapter.youtubeUrl ? (
                    <Chip label="YouTube Video Available" color="success" size="small" sx={{ mr: 1 }} />
                  ) : (
                    <Chip label="No Video" color="default" size="small" sx={{ mr: 1 }} />
                  )}
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog(null, true, chapter._id)}
                    sx={{ mt: 1 }}
                  >
                    Add Sub-Chapter
                  </Button>
                </Box>
                {chapter.subChapters && chapter.subChapters.length > 0 && (
                  <Box sx={{ ml: 4, mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Sub-Chapters:
                    </Typography>
                    {chapter.subChapters.map((subChapter) => (
                      <Card key={subChapter._id} sx={{ mb: 1 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="body1" fontWeight="500">
                                {subChapter.title}
                              </Typography>
                              {subChapter.description && (
                                <Typography variant="body2" color="text.secondary">
                                  {subChapter.description}
                                </Typography>
                              )}
                            </Box>
                            <Box>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDialog(subChapter)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClick(subChapter)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedChapter ? 'Edit Chapter' : parentChapterId ? 'Add Sub-Chapter' : 'Add Chapter'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Chapter Title"
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
              label="Order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              margin="normal"
            />
            {!parentChapterId && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Parent Chapter (Optional)</InputLabel>
                <Select
                  value={formData.parentChapter || ''}
                  onChange={(e) => setFormData({ ...formData, parentChapter: e.target.value || null })}
                  label="Parent Chapter (Optional)"
                >
                  <MenuItem value="">None (Top-level Chapter)</MenuItem>
                  {chapters.map((ch) => (
                    <MenuItem key={ch._id} value={ch._id}>
                      {ch.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="YouTube URL (Optional)"
                placeholder="https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID"
                value={formData.youtubeUrl}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                margin="normal"
                helperText="Enter a YouTube video URL. Examples: https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/dQw4w9WgXcQ"
              />
              {selectedChapter?.youtubeUrl && (
                <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                  Current YouTube URL: {selectedChapter.youtubeUrl}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={uploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            sx={{ bgcolor: '#1e67cd' }}
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {uploading ? 'Saving...' : selectedChapter ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Chapter</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedChapter?.title}"? This action cannot be undone.
            Make sure there are no sub-chapters associated with this chapter.
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

export default ManageCourseChapters;

