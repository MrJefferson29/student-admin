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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  PlayCircle as PlayIcon,
  StopCircle as StopIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LiveTv as LiveIcon,
} from '@mui/icons-material';
import { liveSessionsAPI, departmentsAPI } from '../../utils/api';

const defaultForm = {
  department: '',
  courseTitle: '',
  courseCode: '',
  description: '',
  lecturer: '',
  youtubeUrl: '',
  scheduledAt: '',
};

const statusColors = {
  scheduled: 'default',
  live: 'success',
  ended: 'warning',
};

const formatDateTimeLocal = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatReadableDate = (value) => {
  if (!value) return 'Not scheduled';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not scheduled';
  return date.toLocaleString();
};

const ManageLiveSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sessionsRes, departmentsRes] = await Promise.all([
        liveSessionsAPI.getAll(),
        departmentsAPI.getAll(),
      ]);
      if (sessionsRes.success) {
        setSessions(sessionsRes.data || []);
      }
      if (departmentsRes.success) {
        setDepartments(departmentsRes.data || []);
      }
    } catch (err) {
      console.error('Fetch live sessions error:', err);
      setError('Failed to load live sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (session = null) => {
    if (session) {
      setSelectedSession(session);
      setFormData({
        department: session.department?._id || session.department,
        courseTitle: session.courseTitle || '',
        courseCode: session.courseCode || '',
        description: session.description || '',
        lecturer: session.lecturer || '',
        youtubeUrl: session.youtubeUrl || '',
        scheduledAt: formatDateTimeLocal(session.scheduledAt),
      });
    } else {
      setSelectedSession(null);
      setFormData(defaultForm);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSession(null);
    setFormData(defaultForm);
  };

  const handleSubmit = async () => {
    try {
      setError('');
      const payload = {
        ...formData,
        scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : undefined,
      };

      if (selectedSession) {
        await liveSessionsAPI.update(selectedSession._id, payload);
      } else {
        await liveSessionsAPI.create(payload);
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      console.error('Save live session error:', err);
      setError(err.response?.data?.message || 'Failed to save live session');
    }
  };

  const handleStart = async (session) => {
    try {
      await liveSessionsAPI.start(session._id);
      fetchData();
    } catch (err) {
      console.error('Start live session error:', err);
      setError(err.response?.data?.message || 'Failed to start live session');
    }
  };

  const handleEnd = async (session) => {
    try {
      await liveSessionsAPI.end(session._id);
      fetchData();
    } catch (err) {
      console.error('End live session error:', err);
      setError(err.response?.data?.message || 'Failed to end live session');
    }
  };

  const handleDelete = async () => {
    if (!selectedSession) return;
    try {
      await liveSessionsAPI.delete(selectedSession._id);
      setDeleteDialogOpen(false);
      setSelectedSession(null);
      fetchData();
    } catch (err) {
      console.error('Delete live session error:', err);
      setError(err.response?.data?.message || 'Failed to delete live session');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">Loading live sessions...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Manage Live Sessions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Session
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {sessions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No live sessions yet. Create your first session to get started.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {sessions.map((session) => (
            <Grid item xs={12} md={6} lg={4} key={session._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <LiveIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      {session.courseTitle}
                    </Typography>
                  </Stack>
                  <Chip
                    label={session.status?.toUpperCase()}
                    color={statusColors[session.status] || 'default'}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Course Code: {session.courseCode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Lecturer: {session.lecturer}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Department: {session.department?.name || '—'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Scheduled: {formatReadableDate(session.scheduledAt)}
                  </Typography>
                  {session.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {session.description}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Box>
                    <Tooltip title="Start session">
                      <span>
                        <IconButton
                          color="success"
                          onClick={() => handleStart(session)}
                          disabled={session.status === 'live'}
                        >
                          <PlayIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="End session">
                      <span>
                        <IconButton
                          color="warning"
                          onClick={() => handleEnd(session)}
                          disabled={session.status === 'ended'}
                        >
                          <StopIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                  <Box>
                    <IconButton color="primary" onClick={() => handleOpenDialog(session)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedSession(session);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedSession ? 'Edit Live Session' : 'Create Live Session'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Department</InputLabel>
              <Select
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.name} {dept.school && `(${dept.school.name || dept.school})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Course Title"
              margin="normal"
              required
              value={formData.courseTitle}
              onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
            />
            <TextField
              fullWidth
              label="Course Code"
              margin="normal"
              required
              value={formData.courseCode}
              onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
            />
            <TextField
              fullWidth
              label="Lecturer"
              margin="normal"
              required
              value={formData.lecturer}
              onChange={(e) => setFormData({ ...formData, lecturer: e.target.value })}
            />
            <TextField
              fullWidth
              label="YouTube Live URL"
              margin="normal"
              required
              value={formData.youtubeUrl}
              onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
            />
            <TextField
              fullWidth
              label="Scheduled Time"
              type="datetime-local"
              margin="normal"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedSession ? 'Save Changes' : 'Create Session'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Live Session</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedSession?.courseTitle}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageLiveSessions;


