import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Typography,
  Divider,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
// import Logo from './Logo'; // Removed the Logo import
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  // Updated navigation items to focus on core admin routes
  const publicNavItems = [
    { text: 'Home', path: '/' },
    { text: 'About', path: '/about' },
  ];

  const adminNavItems = [
    { text: 'Dashboard', path: '/admin/dashboard' },
    { text: 'Upload Question', path: '/admin/upload-question' },
    { text: 'Manage Scholarships', path: '/admin/manage-scholarships' },
  ];

  // If in the admin area, show admin links; otherwise, show public links
  const isCurrentlyAdminArea = location.pathname.startsWith('/admin');
  const navItems = isCurrentlyAdminArea && isAdmin() ? adminNavItems : publicNavItems;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <List sx={{ pt: 2 }}>
      {/* Dynamic Navigation Links in Drawer */}
      {navItems.map((item) => (
        <ListItem 
          button 
          component={Link} 
          to={item.path} 
          key={item.text}
          onClick={handleDrawerToggle}
          sx={{
            mb: 1,
            borderRadius: '8px',
            mx: 1,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
            bgcolor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            borderLeft: isActive(item.path) ? '4px solid white' : 'none',
          }}
        >
          <ListItemText 
            primary={item.text}
            primaryTypographyProps={{
              fontWeight: isActive(item.path) ? 600 : 500,
              color: 'white',
            }}
          />
        </ListItem>
      ))}

      {/* Authentication/User Info in Drawer */}
      {isAuthenticated && (
        <>
          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
          <ListItem 
            sx={{
              mb: 1,
              mx: 1,
            }}
          >
            <ListItemText 
              primary={user?.name || 'Admin'}
              secondary={user?.email || 'admin@example.com'}
              primaryTypographyProps={{
                color: 'white',
                fontSize: '0.875rem',
              }}
              secondaryTypographyProps={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.75rem',
              }}
            />
          </ListItem>
          <ListItem 
            button 
            onClick={() => {
              handleDrawerToggle();
              navigate('/profile');
            }}
            sx={{
              mb: 1,
              borderRadius: '8px',
              mx: 1,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ListItemText 
              primary="Profile Settings"
              primaryTypographyProps={{
                color: 'white',
              }}
            />
          </ListItem>
          <ListItem 
            button 
            onClick={() => {
              handleDrawerToggle();
              handleLogout();
            }}
            sx={{
              mb: 1,
              borderRadius: '8px',
              mx: 1,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ListItemText 
              primary="Logout"
              primaryTypographyProps={{
                color: 'white',
              }}
            />
          </ListItem>
        </>
      )}

      {/* Login button for non-authenticated users in Drawer */}
      {!isAuthenticated && (
        <>
          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
          <ListItem 
            button 
            component={Link} 
            to="/login"
            onClick={handleDrawerToggle}
            sx={{
              mb: 1,
              borderRadius: '8px',
              mx: 1,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ListItemText 
              primary="Login"
              primaryTypographyProps={{
                color: 'white',
              }}
            />
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* === START: LOGO/TITLE REPLACEMENT === */}
        <Typography 
            variant="h6" 
            component={Link} 
            to={isAdmin() ? '/admin/dashboard' : '/'}
            sx={{ 
                flexGrow: 1, 
                textDecoration: 'none', 
                color: 'inherit',
                fontWeight: 700,
                // Center the title on mobile if no nav items are shown
                textAlign: isMobile && navItems.length === 0 && !isAuthenticated ? 'center' : 'left'
            }}
        >
            Admin Panel
        </Typography>
        {/* === END: LOGO/TITLE REPLACEMENT === */}
        
        {isMobile ? (
          <>
            {/* Mobile View: Profile Icon (if logged in) and Menu Icon */}
            {isAuthenticated && (
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ mr: 1 }}
              >
                <AccountCircleIcon />
              </IconButton>
            )}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              variant="temporary"
              anchor="right"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                '& .MuiDrawer-paper': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 240,
                },
              }}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Desktop View: Navigation Links */}
            {navItems.map((item) => (
              <Button
                key={item.text}
                component={Link}
                to={item.path}
                color="inherit"
                sx={{
                  position: 'relative',
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  fontWeight: isActive(item.path) ? 600 : 500,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  // Active indicator bar styling
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: isActive(item.path) ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
                    width: '80%',
                    height: '2px',
                    bgcolor: 'white',
                    transition: 'transform 0.3s ease-in-out',
                  },
                  '&:hover::after': {
                    transform: 'translateX(-50%) scaleX(1)',
                  },
                }}
              >
                {item.text}
              </Button>
            ))}

            {/* Desktop View: Auth Section */}
            {isAuthenticated ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  sx={{
                    ml: 2,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
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
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleMenuClose}
                  >
                    <PersonIcon sx={{ mr: 2 }} fontSize="small" />
                    Profile
                  </MenuItem>
                  {isAdmin() && (
                    <MenuItem
                      component={Link}
                      to="/admin/dashboard"
                      onClick={handleMenuClose}
                    >
                      <DashboardIcon sx={{ mr: 2 }} fontSize="small" />
                      Dashboard
                    </MenuItem>
                  )}
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 2 }} fontSize="small" color="error" />
                    <Typography color="error">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                color="inherit"
                variant="outlined"
                sx={{
                  ml: 2,
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;