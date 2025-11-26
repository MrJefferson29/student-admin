import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Drawer,
  Menu, // Imported for the Profile Menu
  MenuItem, // Imported for the Profile Menu
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import {
  UploadFile as UploadFileIcon,
  QuestionAnswer as QuestionAnswerIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Work as WorkIcon,
  History as HistoryIcon,
  EmojiEvents as ContestIcon,
  Book as BookIcon,
  Build as BuildIcon,
  LiveTv as LiveTvIcon,
  PictureAsPdf as PictureAsPdfIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// --- Styled Components & Constants ---

const drawerWidth = 240;

const StyledActionCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s, box-shadow 0.3s',
  cursor: 'pointer',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
}));

const DashboardContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  },
}));

// --- Data Structures ---

const adminActions = [
  {
    title: 'Manage Schools',
    description: 'Create, edit, and manage schools in the system.',
    icon: <SchoolIcon />,
    path: '/admin/manage-schools',
    color: '#1e3a8a',
  },
  {
    title: 'Manage Departments',
    description: 'Create and manage departments within schools.',
    icon: <SchoolIcon />,
    path: '/admin/manage-departments',
    color: '#374785',
  },
  {
    title: 'Manage Courses',
    description: 'Create, edit, and manage courses with chapters and videos.',
    icon: <BookIcon />,
    path: '/admin/manage-courses',
    color: '#1976d2',
  },
  {
    title: 'Manage Concours',
    description: 'Upload and organize concours by school and department.',
    icon: <PictureAsPdfIcon />,
    path: '/admin/manage-concours',
    color: '#c62828',
  },
  {
    title: 'Manage Library',
    description: 'Upload and curate PDFs for the digital library.',
    icon: <BookIcon />,
    path: '/admin/manage-library',
    color: '#6a1b9a',
  },
  {
    title: 'Manage Live Sessions',
    description: 'Schedule department-based live classes and chats.',
    icon: <LiveTvIcon />,
    path: '/admin/manage-live-sessions',
    color: '#0288d1',
  },
  {
    title: 'Manage Skills',
    description: 'Create, edit, and manage skills for students to learn.',
    icon: <BuildIcon />,
    path: '/admin/manage-skills',
    color: '#f57c00',
  },
  {
    title: 'Manage Contests',
    description: 'Create and manage voting contests and contestants.',
    icon: <ContestIcon />,
    path: '/admin/manage-contests',
    color: '#c2185b',
  },
  {
    title: 'Upload Question',
    description: 'Upload a new past question PDF for students.',
    icon: <UploadFileIcon />,
    path: '/admin/upload-question',
    color: '#1e3a8a',
  },
  {
    title: 'Upload Solution',
    description: 'Provide solutions (PDF or video) for existing questions.',
    icon: <QuestionAnswerIcon />,
    path: '/admin/upload-solution',
    color: '#374785',
  },
  {
    title: 'View Questions',
    description: 'Review and manage all uploaded questions and resources.',
    icon: <HistoryIcon />,
    path: '/admin/questions',
    color: '#1976d2',
  },
  {
    title: 'Manage Scholarships',
    description: 'Create, edit, and publish scholarship opportunities.',
    icon: <SchoolIcon />,
    path: '/admin/manage-scholarships',
    color: '#c2185b',
  },
  {
    title: 'Manage Internships',
    description: 'Post and manage internships/job openings.',
    icon: <WorkIcon />,
    path: '/admin/manage-internships',
    color: '#ff8a95',
  },
];

const mockRecentActivity = [
  { id: 1, type: 'Question Uploaded', details: 'Chemistry Paper 2024', timestamp: '5 mins ago', user: 'Admin 1' },
  { id: 2, type: 'Solution Approved', details: 'Maths 2023 Q3 solution', timestamp: '1 hour ago', user: 'Moderator 2' },
  { id: 3, type: 'New Internship Added', details: 'Software Engineering - QTech', timestamp: '4 hours ago', user: 'Admin 1' },
  { id: 4, type: 'User Reported Content', details: 'Physics Q 1.5 - Typo', timestamp: '1 day ago', user: 'System' },
];

// --- Components (Sidebar remains the same logic) ---

const AdminSidebar = ({ mobileOpen, handleDrawerToggle, navigate, handleLogout, drawerItems }) => {
  const theme = useTheme();

  const drawerContent = (
    <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List component="nav" sx={{ flexGrow: 1 }}>
        <ListItemButton onClick={() => navigate('/admin/dashboard')}>
          <ListItemIcon>
            <DashboardIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 600 }} />
        </ListItemButton>
        {drawerItems.map((item) => (
          <ListItemButton key={item.path} onClick={() => navigate(item.path)}>
            <ListItemIcon sx={{ color: item.color }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ color: 'error.main' }} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="Admin sidebar navigation"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Assuming useAuth provides logout
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // *** IMPROVEMENT 2: Profile Menu State ***
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // *** IMPROVEMENT 2: Profile Menu Handlers ***
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    handleMenuClose();
    navigate('/login');
  };
  
  const handleNavigate = (path) => {
    handleMenuClose();
    navigate(path);
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        navigate={navigate}
        handleLogout={handleLogout}
        drawerItems={adminActions}
      />

      {/* Main Content Area */}
      <DashboardContainer>
        {/* Header/App Bar */}
        <AppBar
          position="fixed"
          elevation={1}
          sx={{
            background: 'white',
            color: theme.palette.text.primary,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
              {isMobile ? 'Admin Dashboard' : `Welcome Back, ${user?.name || 'Admin'}`}
            </Typography>

            <IconButton color="inherit" aria-label="search" sx={{ mr: 1 }}>
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="notifications">
              <NotificationsNoneIcon />
            </IconButton>
            
            {/* *** IMPROVEMENT 2: Profile Avatar and Menu Trigger *** */}
            <IconButton
                onClick={handleMenuOpen}
                color="inherit"
                sx={{ ml: 2, p: 0 }}
            >
                <Avatar
                    sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}
                    aria-label="user-avatar"
                >
                    {(user?.name || 'A').slice(0, 1).toUpperCase()}
                </Avatar>
            </IconButton>
            {/* End Profile Avatar */}

          </Toolbar>
        </AppBar>
        
        {/* Profile Menu Component */}
        <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user?.name || 'Admin'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {user?.email || 'admin@example.com'}
                </Typography>
            </Box>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={() => handleNavigate('/profile')}>
                <PersonIcon sx={{ mr: 2 }} fontSize="small" />
                Profile Settings
            </MenuItem>
            <MenuItem onClick={() => handleNavigate('/admin/dashboard')}>
                <DashboardIcon sx={{ mr: 2 }} fontSize="small" />
                Dashboard View
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 2 }} fontSize="small" color="error" />
                <Typography color="error">Logout</Typography>
            </MenuItem>
        </Menu>
        {/* End Profile Menu */}

        <Toolbar /> 

        <Container maxWidth="xl" sx={{ p: 0 }}>
          {/* Overview Statistics */}
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            System Overview
          </Typography>
          {/* Quick Actions and Recent Activity - Split Layout */}
          <Grid container spacing={3}>
            {/* *** IMPROVEMENT 1: New Quick Administrative Tasks List *** */}
            <Grid item xs={12} lg={8}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Divider sx={{ mt: 3, mb: 2 }} />

                <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 700, color: theme.palette.grey[700] }}>
                  Bulk Upload/Management
                </Typography>
                <Grid container spacing={3}>
                    {adminActions.filter(a => a.path.includes('upload') || a.path.includes('manage')).map((action, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <StyledActionCard role="button" onClick={() => navigate(action.path)}>
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 3 }}>
                                    <Box
                                        sx={{
                                            mb: 2,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            bgcolor: action.color,
                                            color: 'white',
                                        }}
                                    >
                                        {React.cloneElement(action.icon, { sx: { fontSize: 32 } })}
                                    </Box>
                                    <Typography variant="subtitle1" component="h3" gutterBottom sx={{ fontWeight: 700 }}>
                                        {action.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ minHeight: '40px' }}>
                                        {action.description}
                                    </Typography>
                                </CardContent>
                            </StyledActionCard>
                        </Grid>
                    ))}
                </Grid>
              </Paper>
            </Grid>
            {/* End New Quick Administrative Tasks List */}

            {/* Recent Activity (Same as before) */}
            <Grid item xs={12} lg={4}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: theme.palette.grey[800] }}>
                  <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Recent Activity
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List disablePadding>
                  {mockRecentActivity.map((activity, index) => (
                    <Box key={activity.id}>
                      <ListItemButton sx={{ p: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {activity.type}
                            </Typography>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography component="span" variant="body2" color="text.primary">
                                {activity.details}
                              </Typography>
                              <Box component="span" sx={{ display: 'block', color: 'text.secondary', fontSize: 12 }}>
                                {activity.timestamp} by **{activity.user}**
                              </Box>
                            </React.Fragment>
                          }
                        />
                      </ListItemButton>
                      {index < mockRecentActivity.length - 1 && <Divider component="li" />}
                    </Box>
                  ))}
                </List>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    All logs are secure.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </DashboardContainer>
    </Box>
  );
}

export default Dashboard;