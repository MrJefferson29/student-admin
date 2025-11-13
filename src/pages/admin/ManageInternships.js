import React, { useState } from 'react';
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
  Link as MuiLink,
  CircularProgress,
  Chip,
  Tooltip,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationOnIcon,
  AccessTime as AccessTimeIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

const ManageInternships = () => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);

  const internships = [
  {
    _id: 'i101',
    title: 'Senior Full-Stack Software Engineering Internship',
    company: 'Innovate Solutions Inc.',
    location: 'Remote',
    duration: '6 Months',
    status: 'Active',
    description: 'Work on cutting-edge features using React and Node.js. Focus on backend reliability.',
    applicationLink: 'https://innovate.com/apply/101',
  },
  {
    _id: 'i102',
    title: 'Digital Marketing Trainee',
    company: 'GrowthForge Agency',
    location: 'Yaoundé, Cameroon',
    duration: '3 Months',
    status: 'Pending Review',
    description: 'Assist in social media campaigns and SEO content strategies across multiple brands.',
    applicationLink: 'https://growthforge.com/apply/102',
  },
  {
    _id: 'i103',
    title: 'Financial Analyst Internship',
    company: 'Global Finance Corp',
    location: 'Douala, Cameroon',
    duration: '12 Months',
    status: 'Active',
    description: 'Analyze market trends, evaluate financial metrics, and support senior analysts.',
    applicationLink: 'https://globalfinance.com/apply/103',
  }
];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Pending Review': return 'warning';
      case 'Expired': return 'error';
      default: return 'default';
    }
  };

  const openDeleteDialog = (internship) => {
    setSelectedInternship(internship);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedInternship(null);
  };

  const handleDelete = async () => {
    if (!selectedInternship) {
      return;
    }
    try {
      setLoading(true);
      // TODO: integrate deletion API call
    } finally {
      setLoading(false);
      closeDeleteDialog();
    }
  };

  const InternshipCard = ({ internship }) => (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        borderColor: '#d0d4db',
        backgroundColor: '#fafbfc',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.25s ease',
        '&:hover': {
          borderColor: '#3b475a',
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          transform: 'translateY(-3px)',
        },
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Chip
            label={internship.status}
            size="small"
            color={getStatusColor(internship.status)}
            sx={{ fontWeight: 600, borderRadius: 1 }}
          />
        </Box>

        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: '#242b38', mb: 0.5 }}
          noWrap
        >
          {internship.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: '#3a5fa8', fontWeight: 600, mb: 2 }}
          noWrap
        >
          {internship.company}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon sx={{ fontSize: 18, mr: 1, color: '#697284' }} />
          <Typography variant="body2" sx={{ color: '#697284' }} noWrap>
            {internship.location}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccessTimeIcon sx={{ fontSize: 18, mr: 1, color: '#697284' }} />
          <Typography variant="body2" sx={{ color: '#697284' }} noWrap>
            {internship.duration}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{ color: '#535b6a', lineHeight: 1.45 }}
        >
          {internship.description}
        </Typography>
      </CardContent>

      <Divider />

      <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <MuiLink
          href={internship.applicationLink}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ display: 'flex', alignItems: 'center', color: '#3b475a', fontWeight: 500 }}
        >
          <LinkIcon sx={{ fontSize: 16, mr: 0.5 }} /> Apply Link
        </MuiLink>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit Internship">
            <IconButton size="small" onClick={() => navigate(`/admin/edit-internship/${internship._id}`)}>
              <EditIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Internship">
            <IconButton size="small" color="error" onClick={() => openDeleteDialog(internship)}>
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#1a2433', fontWeight: 700, mb: 0.5 }}>
            Internship Management
          </Typography>
          <Typography variant="body1" sx={{ color: '#6b7280' }}>
            Managing {internships.length} opportunities
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate('/admin/upload-internship')}
          startIcon={<AddIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            background: '#1e3a8a',
            '&:hover': { background: '#162c6a' },
          }}
        >
          Publish New Internship
        </Button>
      </Box>

      {internships.length === 0 ? (
        <Paper sx={{ textAlign: 'center', p: 6, borderRadius: 2, border: '1px solid #d1d5db' }}>
          <Typography variant="h6" sx={{ color: '#6b7280', mb: 2 }}>
            No internships available.
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => navigate('/admin/upload-internship')}>Add New</Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {internships.map((internship) => (
            <Grid item xs={12} sm={6} md={6} lg={4} key={internship._id}>
              <InternshipCard internship={internship} />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{' '}
            <strong>{selectedInternship?.title || 'this internship'}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Delete Permanently'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageInternships;
