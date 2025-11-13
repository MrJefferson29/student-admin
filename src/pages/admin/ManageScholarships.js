import React, { useState, useEffect, useMemo } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    Alert,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Link as MuiLink,
    useTheme,
    Tooltip,
    TextField,
    InputAdornment,
    Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    LocationOn as LocationOnIcon,
    AccessTime as AccessTimeIcon,
    Search as SearchIcon,
    School as SchoolIcon,
    Public as PublicIcon,
    InfoOutlined as InfoOutlinedIcon,
} from '@mui/icons-material';

// --- MOCK DATA/API ---
const scholarshipsAPI = {
    getAll: async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockData = [
            { _id: 's1', organizationName: 'Tech Innovators Foundation', location: 'Global / Remote', description: 'A scholarship for students pursuing Computer Science or related fields.', websiteLink: 'https://techinnovators.org', deadline: '2025-01-15T00:00:00.000Z', status: 'Active' },
            { _id: 's2', organizationName: 'Green Earth Fellowship', location: 'Africa', description: 'Funding available for research in sustainable energy and environmental conservation.', websiteLink: 'https://greenearth.org', deadline: '2024-11-01T00:00:00.000Z', status: 'Closed' },
            { _id: 's3', organizationName: 'Local Community Support Grant', location: 'Cameroon', description: 'A grant to support local students facing financial difficulty to complete tertiary education.', websiteLink: null, deadline: '2026-03-30T00:00:00.000Z', status: 'Active' },
            { _id: 's4', organizationName: 'Asia-Pacific Research Fund', location: 'Singapore', description: 'Supports postgraduate research in the APAC region across various disciplines.', websiteLink: 'https://asiapac.com', deadline: '2025-08-20T00:00:00.000Z', status: 'Active' },
            { _id: 's5', organizationName: 'North American STEM Grant', location: 'USA / Canada', description: 'Large grant program for high-achieving undergraduate STEM students.', websiteLink: 'https://stemgrant.org', deadline: '2024-12-31T00:00:00.000Z', status: 'Active' },
            { _id: 's6', organizationName: 'European Arts Academy', location: 'Europe (Various)', description: 'Scholarships for masters students in fine arts and humanities.', websiteLink: 'https://artseu.com', deadline: '2024-09-10T00:00:00.000Z', status: 'Closed' },
        ];
        return { success: true, data: mockData };
    },
    delete: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true, message: `Scholarship ${id} deleted.` };
    }
};

// --- HELPER FUNCTIONS ---

const formatDate = (dateString) => {
    if (!dateString) return 'No Deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
};

// --- MAIN COMPONENT ---

function ManageScholarships() {
    const navigate = useNavigate();
    const theme = useTheme();
    const [scholarships, setScholarships] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedScholarship, setSelectedScholarship] = useState(null);

    useEffect(() => {
        fetchScholarships();
    }, []);

    const fetchScholarships = async () => {
        try {
            setLoading(true);
            const response = await scholarshipsAPI.getAll();
            if (response.success) {
                // Sort active scholarships first, then by earliest deadline
                const sortedData = (response.data || []).sort((a, b) => {
                    const aPassed = isDeadlinePassed(a.deadline);
                    const bPassed = isDeadlinePassed(b.deadline);

                    if (aPassed && !bPassed) return 1;
                    if (!aPassed && bPassed) return -1;
                    return new Date(a.deadline) - new Date(b.deadline);
                });
                setScholarships(sortedData);
            } else {
                setError('Failed to fetch scholarships');
            }
        } catch (err) {
            setError('An error occurred while fetching scholarships');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedScholarship) return;
        try {
            const response = await scholarshipsAPI.delete(selectedScholarship._id);
            if (response.success) {
                setScholarships(scholarships.filter(s => s._id !== selectedScholarship._id));
                setDeleteDialogOpen(false);
                setSelectedScholarship(null);
            } else {
                setError('Failed to delete scholarship: ' + response.message);
            }
        } catch (err) {
            setError('An unexpected error occurred while deleting the scholarship.');
        }
    };

    const openDeleteDialog = (scholarship) => {
        setSelectedScholarship(scholarship);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedScholarship(null);
    };
    
    // --- Filtered Data Logic ---
    const filteredScholarships = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return scholarships.filter(scholarship => 
            scholarship.organizationName.toLowerCase().includes(lowerCaseSearchTerm) ||
            scholarship.location.toLowerCase().includes(lowerCaseSearchTerm) ||
            (scholarship.description && scholarship.description.toLowerCase().includes(lowerCaseSearchTerm))
        );
    }, [scholarships, searchTerm]);


    // --- Loading State ---
    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 6, minHeight: '80vh' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress color="primary" size={60} sx={{ mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">Loading Registry Data...</Typography>
                </Box>
            </Container>
        );
    }

    // --- Component JSX ---
    return (
        <Container maxWidth="xl" sx={{ py: 4, minHeight: '90vh' }}>

            {/* --- Header & Action Button (Updated Size) --- */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5, color: theme.palette.primary.dark }}>
                        Scholarship Management Console 🎓
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage **{scholarships.length}** total listings in the database.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    size="medium" // Adjusted from large to medium for better balance
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/admin/upload-scholarship')}
                    sx={{ py: 1.2, px: 3, fontWeight: 600, minWidth: 200, boxShadow: theme.shadows[5] }}
                >
                    Create New Listing
                </Button>
            </Box>
            
            {/* --- Search and Results Count (Updated Design) --- */}
            <Paper 
                elevation={0} 
                variant="outlined"
                sx={{ 
                    mb: 4, 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: theme.palette.grey[50], // Subtle background
                    border: `1px solid ${theme.palette.grey[200]}`
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search by organization, location, or keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small" // Smaller size for minimalism
                            sx={{ bgcolor: 'white', borderRadius: 1 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                        <Typography 
                            variant="subtitle1" 
                            color="text.primary" 
                            fontWeight={600}
                            sx={{
                                color: theme.palette.info.dark
                            }}
                        >
                            <InfoOutlinedIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} /> 
                            Showing **{filteredScholarships.length}** of {scholarships.length} Listings
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* --- Error Display --- */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* --- Main Content: Card Grid --- */}
            {filteredScholarships.length === 0 ? (
                <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 2, mt: 3, border: `2px dashed ${theme.palette.grey[300]}` }}>
                    <SchoolIcon sx={{ fontSize: 80, color: theme.palette.primary.light, mb: 3 }} />
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        {scholarships.length === 0 ? 'No Data in Registry' : 'No Results Found'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        {scholarships.length === 0 
                            ? "Start by creating your first scholarship listing." 
                            : `Try adjusting your search for "${searchTerm}".`
                        }
                    </Typography>
                    {scholarships.length > 0 && (
                        <Button variant="outlined" onClick={() => setSearchTerm('')}>
                            Clear Search
                        </Button>
                    )}
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {filteredScholarships.map((scholarship) => {
                        const deadlinePassed = isDeadlinePassed(scholarship.deadline);
                        const statusLabel = deadlinePassed ? 'Closed' : 'Open';
                        const statusColor = deadlinePassed ? 'default' : 'success';
                        
                        return (
                            <Grid item xs={12} sm={6} lg={4} key={scholarship._id}>
                                <Card
                                    elevation={3}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 2,
                                        border: `1px solid ${deadlinePassed ? theme.palette.grey[300] : theme.palette.success.light}`,
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: theme.shadows[8],
                                        },
                                    }}
                                >
                                    {/* Card Header/Content */}
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                            <Typography variant="h6" component="h3" sx={{ fontWeight: 700, lineHeight: 1.3, color: deadlinePassed ? 'text.disabled' : theme.palette.primary.main }}>
                                                {scholarship.organizationName}
                                            </Typography>
                                            <Chip
                                                label={statusLabel}
                                                size="small"
                                                color={statusColor}
                                                variant="outlined"
                                                sx={{ ml: 1, fontWeight: 600 }}
                                            />
                                        </Box>
                                        
                                        {/* Metadata */}
                                        <Box sx={{ my: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                                                {scholarship.location}
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                                                <Typography variant="body2" color={deadlinePassed ? theme.palette.error.main : theme.palette.success.dark}>
                                                    {formatDate(scholarship.deadline)}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        {/* Description */}
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mt: 1,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                fontStyle: deadlinePassed ? 'italic' : 'normal',
                                            }}
                                        >
                                            {scholarship.description}
                                        </Typography>
                                        
                                        {/* External Link */}
                                        {scholarship.websiteLink && (
                                            <MuiLink
                                                href={scholarship.websiteLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                variant="caption"
                                                sx={{ display: 'flex', alignItems: 'center', mt: 1, color: theme.palette.info.main, textDecoration: 'none' }}
                                            >
                                                <PublicIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                                View Application Website
                                            </MuiLink>
                                        )}
                                    </CardContent>
                                    
                                    {/* Card Actions (Admin Controls) */}
                                    <CardActions sx={{ justifyContent: 'flex-end', borderTop: `1px solid ${theme.palette.grey[200]}` }}>
                                        <Tooltip title="Edit Listing">
                                            <IconButton
                                                color="primary"
                                                onClick={() => navigate(`/admin/edit-scholarship/${scholarship._id}`)}
                                                size="medium"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Listing">
                                            <IconButton
                                                color="error"
                                                onClick={() => openDeleteDialog(scholarship)}
                                                size="medium"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* --- Delete Confirmation Dialog --- */}
            <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
                <DialogTitle sx={{ color: theme.palette.error.dark, fontWeight: 700 }}>
                    <DeleteIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Confirm Permanent Deletion
                </DialogTitle>
                <DialogContent dividers>
                    <Typography>
                        You are about to permanently delete the scholarship listing: **{selectedScholarship?.organizationName}**.
                    </Typography>
                    <Typography color="error" sx={{ mt: 1, fontWeight: 500 }}>
                        This action **cannot be undone**.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={closeDeleteDialog} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained" autoFocus>
                        Yes, Delete Listing
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ManageScholarships;