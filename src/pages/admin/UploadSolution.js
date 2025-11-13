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
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { VideoLibrary as VideoLibraryIcon, UploadFile as UploadFileIcon } from '@mui/icons-material';
import { solutionsAPI, questionsAPI } from '../../utils/api';

function UploadSolution() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    questionId: '',
    youtubeUrl: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await questionsAPI.getAll();
        if (response.success) {
          setQuestions(response.data || []);
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.questionId) {
      setError('Please select a question');
      return;
    }

    if (!formData.youtubeUrl && !file) {
      setError('Please provide either a YouTube URL or a PDF file (or both)');
      return;
    }

    setLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('questionId', formData.questionId);
      if (formData.youtubeUrl) {
        uploadData.append('youtubeUrl', formData.youtubeUrl);
      }
      if (file) {
        uploadData.append('pdf', file);
      }

      const response = await solutionsAPI.upload(uploadData);

      if (response.success) {
        setSuccess('Solution uploaded successfully!');
        // Reset form
        setFormData({
          questionId: '',
          youtubeUrl: '',
        });
        setFile(null);
        // Clear file input
        document.getElementById('pdf-upload').value = '';

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 2000);
      } else {
        setError(response.message || 'Failed to upload solution');
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
          Upload Solution
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload a solution (PDF or YouTube video) for an existing question
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
            <Grid item xs={12}>
              <FormControl fullWidth required disabled={loadingQuestions || loading}>
                <InputLabel>Question</InputLabel>
                <Select
                  name="questionId"
                  value={formData.questionId}
                  onChange={handleChange}
                  label="Question"
                  disabled={loadingQuestions || loading}
                >
                  {loadingQuestions ? (
                    <MenuItem disabled>Loading questions...</MenuItem>
                  ) : questions.length === 0 ? (
                    <MenuItem disabled>No questions available</MenuItem>
                  ) : (
                    questions.map((question) => (
                      <MenuItem key={question._id} value={question._id}>
                        {question.subject} - {question.level} - {question.year} ({question.school})
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="YouTube URL (Optional)"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://www.youtube.com/watch?v=..."
                helperText="Provide either YouTube URL or PDF file (or both)"
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
                <UploadFileIcon sx={{ fontSize: 48, color: '#1a237e', mb: 2 }} />
                <Typography variant="body1" gutterBottom>
                  Select PDF File (Optional)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  At least one of YouTube URL or PDF file must be provided
                </Typography>
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={loading}
                  style={{ display: 'none' }}
                />
                <label htmlFor="pdf-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    Choose File
                  </Button>
                </label>
                {file && (
                  <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    Selected: {file.name}
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || loadingQuestions}
                  startIcon={loading ? <CircularProgress size={20} /> : <VideoLibraryIcon />}
                >
                  {loading ? 'Uploading...' : 'Upload Solution'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default UploadSolution;

