import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, CircularProgress, Alert, Link as MuiLink } from '@mui/material';
import { LocationOn as LocationOnIcon, Link as LinkIcon } from '@mui/icons-material';
import { scholarshipsAPI, resolveAssetUrl } from '../utils/api';

function ScholarshipAwards() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const response = await scholarshipsAPI.getAll();
      if (response.success) {
        setScholarships(response.data || []);
      } else {
        setError('Failed to load scholarships');
      }
    } catch (err) {
      setError('An error occurred while loading scholarships');
      console.error('Error fetching scholarships:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(45deg, #1a237e 30%, #534bae 90%)',
          color: 'white',
          py: { xs: 6, md: 10 },
          textAlign: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.1,
          },
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              mb: 3,
            }}
          >
            Scholarship Opportunities
          </Typography>
          <Typography 
            variant="h5" 
            sx={{
              opacity: 0.9,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Discover available scholarships and funding opportunities
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {scholarships.length === 0 && !loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              No Scholarships Available
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Check back later for available scholarship opportunities
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {scholarships.map((scholarship) => (
              <Grid item xs={12} md={6} key={scholarship._id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  {scholarship.images && scholarship.images.length > 0 && resolveAssetUrl(scholarship.images[0]) && (
                  <CardMedia
                    component="img"
                    height="250"
                      image={resolveAssetUrl(scholarship.images[0])}
                      alt={scholarship.organizationName}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                      {scholarship.organizationName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOnIcon sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {scholarship.location}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {scholarship.description}
                    </Typography>
                    {scholarship.websiteLink && (
                      <MuiLink
                        href={scholarship.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          mt: 2,
                          color: 'primary.main',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        <LinkIcon sx={{ fontSize: 20, mr: 0.5 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Visit Website
                        </Typography>
                      </MuiLink>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default ScholarshipAwards; 
