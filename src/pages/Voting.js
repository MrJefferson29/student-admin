import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button, CircularProgress, Alert, Chip } from '@mui/material';
import { HowToVote as VoteIcon, EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { contestsAPI, resolveAssetUrl, votesAPI } from '../utils/api';

function Voting() {
  const [contests, setContests] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);
  const [contestants, setContestants] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userVotes, setUserVotes] = useState({});

  const fetchContestData = useCallback(async (contestId) => {
    try {
      const [contestantsResponse, statsResponse] = await Promise.all([
        contestsAPI.getContestants(contestId),
        contestsAPI.getStats(contestId)
      ]);

      if (contestantsResponse.success) {
        setContestants(contestantsResponse.data);
      }
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      console.error('Error fetching contest data:', err);
    }
  }, []);

  const fetchContests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await contestsAPI.getAll();
      if (response.success) {
        setContests(response.data);
        // Auto-select the first active contest
        const activeContest = response.data.find(contest => contest.isActive);
        if (activeContest) {
          setSelectedContest(activeContest);
          fetchContestData(activeContest._id);
        }
      } else {
        setError('Failed to load contests');
      }
    } catch (err) {
      setError('An error occurred while loading contests');
      console.error('Error fetching contests:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchContestData]);

  const fetchUserVotes = useCallback(async () => {
    try {
      const response = await votesAPI.getMyVotes();
      if (response.success) {
        // Create a map of contest IDs to contestant IDs for quick lookup
        const votesMap = {};
        response.data.forEach(vote => {
          votesMap[vote.contest] = vote.contestant;
        });
        setUserVotes(votesMap);
      }
    } catch (err) {
      console.error('Error fetching user votes:', err);
    }
  }, []);

  useEffect(() => {
    fetchContests();
    fetchUserVotes();
  }, [fetchContests, fetchUserVotes]);

  const handleContestChange = (contest) => {
    setSelectedContest(contest);
    fetchContestData(contest._id);
  };

  const handleVote = async (contestant) => {
    if (!selectedContest) return;

    try {
      const response = await votesAPI.castVote(selectedContest._id, contestant._id);
      if (response.success) {
        // Update user votes
        setUserVotes(prev => ({
          ...prev,
          [selectedContest._id]: contestant._id
        }));
        // Refresh contest data to show updated vote counts
        fetchContestData(selectedContest._id);
        alert(`Vote submitted successfully for ${contestant.name}!`);
      } else {
        alert(response.message || 'Failed to cast vote');
      }
    } catch (error) {
      if (error.response?.status === 409) {
        alert('You have already voted in this contest');
      } else {
        alert('Failed to cast vote. Please try again.');
      }
      console.error('Error casting vote:', error);
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
            Voting & Contests
          </Typography>
          <Typography
            variant="h5"
            sx={{
              opacity: 0.9,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Vote for your favorite contestants and see live results
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Contest Selection */}
        {contests.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Select Contest
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {contests.map((contest) => (
                <Chip
                  key={contest._id}
                  label={contest.name}
                  onClick={() => handleContestChange(contest)}
                  color={selectedContest?._id === contest._id ? 'primary' : 'default'}
                  variant={selectedContest?._id === contest._id ? 'filled' : 'outlined'}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        )}

        {selectedContest && (
          <>
            {/* Contest Info */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                {selectedContest.name}
              </Typography>
              {selectedContest.description && (
                <Typography variant="body1" color="text.secondary">
                  {selectedContest.description}
                </Typography>
              )}
            </Box>

            {/* Statistics */}
            {stats && (
              <Box sx={{ mb: 6 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Contest Statistics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                        {stats.totalVotes}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Total Votes
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h3" color="secondary" sx={{ fontWeight: 700 }}>
                        {stats.totalContestants}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Contestants
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h3" color="success.main" sx={{ fontWeight: 700 }}>
                        {stats.voteDistribution.length > 0 ? Math.max(...stats.voteDistribution.map(c => c.votes)) : 0}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Leading Votes
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Contestants */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Contestants
            </Typography>
            {contestants.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  No Contestants Yet
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Contestants will be added soon. Stay tuned!
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={4}>
                {contestants.map((contestant) => (
                  <Grid item xs={12} md={6} lg={4} key={contestant._id}>
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
                      {resolveAssetUrl(contestant.image) && (
                        <CardMedia
                          component="img"
                          height="250"
                          image={resolveAssetUrl(contestant.image)}
                          alt={contestant.name}
                          sx={{ objectFit: 'cover' }}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TrophyIcon sx={{ mr: 1, color: 'gold' }} />
                          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                            {contestant.name}
                          </Typography>
                        </Box>
                        {contestant.bio && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 2,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {contestant.bio}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <VoteIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                              {contestant.voteCount || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              votes
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            onClick={() => handleVote(contestant)}
                            disabled={userVotes[selectedContest._id] === contestant._id}
                            sx={{
                              minWidth: 100,
                              ...(userVotes[selectedContest._id] === contestant._id && {
                                bgcolor: 'success.main',
                                '&:hover': { bgcolor: 'success.dark' }
                              })
                            }}
                          >
                            {userVotes[selectedContest._id] === contestant._id ? 'VOTED' : 'VOTE'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {!selectedContest && contests.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              No Contests Available
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Check back later for upcoming contests and voting opportunities.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Voting;