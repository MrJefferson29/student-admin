import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Link, Stack, Grid, Divider, Skeleton } from '@mui/material';
import { Place as PlaceIcon, MailOutline as MailOutlineIcon } from '@mui/icons-material';
import { questionsAPI, solutionsAPI, scholarshipsAPI, internshipsAPI } from '../utils/api';

function Footer() {
    const currentYear = new Date().getFullYear();

    const [stats, setStats] = useState({
        questions: 0,
        solutions: 0,
        scholarships: 0,
        internships: 0,
        loading: true,
        error: null,
    });

    useEffect(() => {
        let mounted = true;
        const fetchStats = async () => {
            try {
                const [questionsRes, solutionsRes, scholarshipsRes, internshipsRes] = await Promise.all([
                    questionsAPI.getAll().catch(() => ({ count: 0, data: [] })),
                    solutionsAPI.getAll().catch(() => ({ count: 0, data: [] })),
                    scholarshipsAPI.getAll().catch(() => ({ count: 0, data: [] })),
                    internshipsAPI.getAll().catch(() => ({ count: 0, data: [] })),
                ]);

                if (!mounted) return;
                setStats({
                    questions: questionsRes.count ?? questionsRes.data?.length ?? 0,
                    solutions: solutionsRes.count ?? solutionsRes.data?.length ?? 0,
                    scholarships: scholarshipsRes.count ?? scholarshipsRes.data?.length ?? 0,
                    internships: internshipsRes.count ?? internshipsRes.data?.length ?? 0,
                    loading: false,
                    error: null,
                });
            } catch (error) {
                if (!mounted) return;
                setStats((prev) => ({ ...prev, loading: false, error: 'Failed to load platform stats' }));
                // Non-blocking: footer still renders gracefully
            }
        };

        fetchStats();
        return () => { mounted = false; };
    }, []);

    return (
        <Box
            sx={{
                // Light, neutral background for an Admin/App interface
                bgcolor: '#f7f7f7', 
                color: 'text.primary',
                py: 4, // Reduced vertical padding
                mt: 8, // Increased top margin to clearly separate from content
            }}
        >
            <Container maxWidth="xl">
                <Grid
                    container
                    spacing={{ xs: 4, sm: 6, md: 8 }}
                    justifyContent="space-between"
                    alignItems="flex-start"
                >
                    {/* 1. Left Section: Foundation Info (Simplified) */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                Indigenous & Self-Reliant Development
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, fontSize: '0.8rem' }}>
                                Dedicated to upgrading standards of living through key development initiatives.
                            </Typography>
                        </Box>
                    </Grid>

                    {/* 2. Explore: Real pages */}
                    <Grid item xs={6} sm={6} md={2}>
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                                Explore
                            </Typography>
                            <Stack spacing={0.75}>
                                <Link href="/" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                                    Home
                                </Link>
                                <Link href="/about" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                                    About Us
                                </Link>
                                <Link href="/scholarship-awards" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                                    Scholarship Awards
                                </Link>
                                <Link href="/voting" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                                    Voting
                                </Link>
                            </Stack>
                        </Box>
                    </Grid>

                    {/* 3. Platform Stats: Live counts from backend */}
                    <Grid item xs={12} sm={6} md={3}>
                         <Box sx={{ textAlign: 'left' }}>
                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                                Platform Stats
                            </Typography>
                            <Stack spacing={0.75}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Questions</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Solutions</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Scholarships</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Internships</Typography>
                                </Box>
                                {stats.error && (
                                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                        {stats.error}
                                    </Typography>
                                )}
                            </Stack>
                        </Box>
                    </Grid>

                    {/* 4. Contact (Using Icons for Minimalism) */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                                Contact
                            </Typography>
                            
                            <Stack spacing={1} alignItems={{ xs: 'center', sm: 'flex-start' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PlaceIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                         Bambili, Bamenda, Cameroon
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <MailOutlineIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                    <Link href="mailto:info@tenenghang.org" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                                        info@uba.org
                                    </Link>
                                </Box>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>

                {/* Copyright */}
            </Container>
        </Box>
    );
}

export default Footer;