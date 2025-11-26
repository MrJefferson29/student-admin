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
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  HowToVote as VoteIcon,
} from '@mui/icons-material';
import { contestsAPI, schoolsAPI, departmentsAPI } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const ManageContests = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startAt: '',
    endAt: '',
    isActive: true,
    votingRestriction: 'all',
    restrictedSchool: '',
    restrictedDepartment: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [contestsRes, schoolsRes, departmentsRes] = await Promise.all([
        contestsAPI.getAll(),
        schoolsAPI.getAll(),
        departmentsAPI.getAll(),
      ]);

      if (contestsRes.success) {
        setContests(contestsRes.data || []);
      }
      if (schoolsRes.success) {
        setSchools(schoolsRes.data || []);
      }
      if (departmentsRes.success) {
        setDepartments(departmentsRes.data || []);
      }
    } catch (err) {
      setError('An error occurred while loading data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (contest = null) => {
    if (contest) {
      setSelectedContest(contest);
      setFormData({
        name: contest.name || '',
        description: contest.description || '',
        startAt: contest.startAt ? new Date(contest.startAt).toISOString().slice(0, 16) : '',
        endAt: contest.endAt ? new Date(contest.endAt).toISOString().slice(0, 16) : '',
        isActive: contest.isActive !== undefined ? contest.isActive : true,
        votingRestriction: contest.votingRestriction || 'all',
        restrictedSchool: contest.restrictedSchool?._id || contest.restrictedSchool || '',
        restrictedDepartment: contest.restrictedDepartment?._id || contest.restrictedDepartment || '',
      });
    } else {
      setSelectedContest(null);
      setFormData({
        name: '',
        description: '',
        startAt: '',
        endAt: '',
        isActive: true,
        votingRestriction: 'all',
        restrictedSchool: '',
        restrictedDepartment: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedContest(null);
    setFormData({
      name: '',
      description: '',
      startAt: '',
      endAt: '',
      isActive: true,
      votingRestriction: 'all',
      restrictedSchool: '',
      restrictedDepartment: '',
    });
  };

  const handleSubmit = async () => {
    try {
      setError('');
      if (!formData.name.trim()) {
        setError('Contest name is required');
        return;
      }

      const contestData = {
        name: formData.name,
        description: formData.description,
        startAt: formData.startAt || null,
        endAt: formData.endAt || null,
        isActive: formData.isActive,
        votingRestriction: formData.votingRestriction,
      };

      if (formData.votingRestriction === 'school' && formData.restrictedSchool) {
        contestData.restrictedSchool = formData.restrictedSchool;
      } else if (formData.votingRestriction === 'department' && formData.restrictedDepartment) {
        contestData.restrictedDepartment = formData.restrictedDepartment;
      }

      if (selectedContest) {
        await contestsAPI.update(selectedContest._id, contestData);
      } else {
        await contestsAPI.create(contestData);
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('Error saving contest:', err);
    }
  };

  const handleDeleteClick = (contest) => {
    setSelectedContest(contest);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await contestsAPI.delete(selectedContest._id);
      setDeleteDialogOpen(false);
      setSelectedContest(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting');
      console.error('Error deleting contest:', err);
    }
  };

  const handleManageContestants = (contest) => {
    navigate(`/admin/manage-contestants/${contest._id}`, {
      state: { contestName: contest.name },
    });
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
        <Typography variant="h4" component="h1" fontWeight="bold">
          Manage Contests
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#1e67cd', '&:hover': { bgcolor: '#1557b0' } }}
        >
          Create Contest
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {contests.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No contests found. Create your first contest to get started.
              </Typography>
            </Paper>
          </Grid>
        ) : (
          contests.map((contest) => (
            <Grid item xs={12} sm={6} md={4} key={contest._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <VoteIcon sx={{ mr: 1, color: '#1e67cd' }} />
                    <Typography variant="h6" component="h2" fontWeight="bold">
                      {contest.name}
                    </Typography>
                  </Box>
                  {contest.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {contest.description}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    <Chip
                      label={contest.isActive ? 'Active' : 'Inactive'}
                      color={contest.isActive ? 'success' : 'default'}
                      size="small"
                    />
                    <Chip
                      label={`Voting: ${contest.votingRestriction || 'all'}`}
                      size="small"
                    />
                    {contest.votingRestriction === 'school' && contest.restrictedSchool && (
                      <Chip
                        label={`School: ${contest.restrictedSchool.name || contest.restrictedSchool}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    {contest.votingRestriction === 'department' && contest.restrictedDepartment && (
                      <Chip
                        label={`Dept: ${contest.restrictedDepartment.name || contest.restrictedDepartment}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  {contest.startAt && (
                    <Typography variant="caption" color="text.secondary">
                      Start: {new Date(contest.startAt).toLocaleDateString()}
                    </Typography>
                  )}
                  {contest.endAt && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      End: {new Date(contest.endAt).toLocaleDateString()}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(contest)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleManageContestants(contest)}
                    size="small"
                    title="Manage Contestants"
                  >
                    <PeopleIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(contest)}
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedContest ? 'Edit Contest' : 'Create New Contest'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Contest Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Start Date & Time"
                  type="datetime-local"
                  value={formData.startAt}
                  onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="End Date & Time"
                  type="datetime-local"
                  value={formData.endAt}
                  onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              }
              label="Active"
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Voting Restriction</InputLabel>
              <Select
                value={formData.votingRestriction}
                onChange={(e) => setFormData({ ...formData, votingRestriction: e.target.value, restrictedSchool: '', restrictedDepartment: '' })}
                label="Voting Restriction"
              >
                <MenuItem value="all">All Users</MenuItem>
                <MenuItem value="school">School Only</MenuItem>
                <MenuItem value="department">Department Only</MenuItem>
              </Select>
            </FormControl>
            {formData.votingRestriction === 'school' && (
              <FormControl fullWidth margin="normal">
                <InputLabel>School</InputLabel>
                <Select
                  value={formData.restrictedSchool}
                  onChange={(e) => setFormData({ ...formData, restrictedSchool: e.target.value })}
                  label="School"
                >
                  {schools.map((school) => (
                    <MenuItem key={school._id} value={school._id}>
                      {school.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {formData.votingRestriction === 'department' && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.restrictedDepartment}
                  onChange={(e) => setFormData({ ...formData, restrictedDepartment: e.target.value })}
                  label="Department"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept._id} value={dept._id}>
                      {dept.name} ({dept.school?.name || dept.school})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#1e67cd' }}>
            {selectedContest ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Contest</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedContest?.name}"? This action cannot be undone.
            Make sure there are no contestants associated with this contest.
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

export default ManageContests;

