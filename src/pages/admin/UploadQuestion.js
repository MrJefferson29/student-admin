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
import { UploadFile as UploadFileIcon } from '@mui/icons-material';
import { questionsAPI, departmentsAPI } from '../../utils/api';

const levels = ['Level 100', 'Level 200', 'Level 300', 'Level 400'];

function UploadQuestion() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    department: '',
    level: '',
    subject: '',
    year: '',
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setFetching(true);
      const response = await departmentsAPI.getAll();
      if (response.success) {
        setDepartments(response.data || []);
      }
    } catch (err) {
      setError('Failed to load departments');
      console.error('Error fetching departments:', err);
    } finally {
      setFetching(false);
    }
  };

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
    if (!formData.department || !formData.level || !formData.subject || !formData.year) {
      setError('Please fill in all fields');
      return;
    }

    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('department', formData.department);
      uploadData.append('level', formData.level);
      uploadData.append('subject', formData.subject);
      uploadData.append('year', formData.year);
      uploadData.append('pdf', file);

      const response = await questionsAPI.upload(uploadData);

      if (response.success) {
        setSuccess('Question uploaded successfully!');
        // Reset form
        setFormData({
          department: '',
          level: '',
          subject: '',
          year: '',
        });
        setFile(null);
        // Clear file input
        const fileInput = document.getElementById('pdf-upload');
        if (fileInput) fileInput.value = '';

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 2000);
      } else {
        setError(response.message || 'Failed to upload question');
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
          Upload Question
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload a new past question PDF
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

        {fetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : departments.length === 0 ? (
          <Alert severity="warning">
            No departments found. Please create departments first.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    label="Department"
                    disabled={loading}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id}>
                        {dept.name} {dept.school && `(${dept.school.name || dept.school})`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Level</InputLabel>
                <Select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  label="Level"
                  disabled={loading}
                >
                  {levels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    label="Subject"
    name="subject"
    value={formData.subject}
    onChange={handleChange}
    required
    disabled={loading}
    placeholder="Enter subject (e.g., Mathematics)"
  />
</Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="e.g., 2023"
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
                  Select PDF File
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
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <UploadFileIcon />}
                >
                  {loading ? 'Uploading...' : 'Upload Question'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
        )}
      </Paper>
    </Container>
  );
}

export default UploadQuestion;

