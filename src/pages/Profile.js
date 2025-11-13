import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  School as SchoolIcon,
  Security as SecurityIcon,
  QuestionAnswer as QuestionAnswerIcon,
  VideoLibrary as VideoLibraryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI, resolveAssetUrl } from '../utils/api';

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const [profileResponse, statsResponse] = await Promise.all([
        authAPI.getProfile(),
        authAPI.getProfileStats(),
      ]);

      if (profileResponse.success) {
        setProfileData(profileResponse.user);
      }

      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
      // Use cached user data if API fails
      if (user) {
        setProfileData(user);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading && !profileData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading profile...</Typography>
      </Container>
    );
  }

  const displayUser = profileData || user;
  const profileImageUrl =
    resolveAssetUrl(displayUser?.profilePicture) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayUser?.name || 'User')}&background=1a237e&color=fff&size=200`;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          My Profile
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Header Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={profileImageUrl}
              alt={displayUser?.name}
              sx={{
                width: 150,
                height: 150,
                mx: 'auto',
                mb: 2,
                fontSize: 60,
              }}
            >
              {displayUser?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
              {displayUser?.name || 'User'}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {displayUser?.email || ''}
            </Typography>
            {displayUser?.role && (
              <Typography
                variant="body2"
                sx={{
                  display: 'inline-block',
                  px: 2,
                  py: 0.5,
                  mt: 1,
                  bgcolor: displayUser.role === 'admin' ? 'primary.main' : 'grey.300',
                  color: displayUser.role === 'admin' ? 'white' : 'text.primary',
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                {displayUser.role.toUpperCase()}
              </Typography>
            )}
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                fullWidth
                onClick={() => navigate('/profile/edit')}
              >
                Edit Profile
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
              Account Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    School
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {displayUser?.school || 'Not set'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Department
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {displayUser?.department || 'Not set'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Level
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {displayUser?.level || 'Not set'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Member Since
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {displayUser?.createdAt
                      ? new Date(displayUser.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Statistics */}
            {stats && (
              <>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                  Your Contributions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Card
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                      }}
                    >
                      <CardContent>
                        <QuestionAnswerIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {stats.questions || 0}
                        </Typography>
                        <Typography variant="body2">Questions</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card
                      sx={{
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                      }}
                    >
                      <CardContent>
                        <VideoLibraryIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {stats.solutions || 0}
                        </Typography>
                        <Typography variant="body2">Solutions</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card
                      sx={{
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        color: 'white',
                      }}
                    >
                      <CardContent>
                        <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {stats.total || 0}
                        </Typography>
                        <Typography variant="body2">Total</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate('/profile/edit')}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                startIcon={<SecurityIcon />}
                onClick={() => navigate('/profile/change-password')}
              >
                Change Password
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleLogout}
                sx={{ ml: 'auto' }}
              >
                Log Out
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile;

