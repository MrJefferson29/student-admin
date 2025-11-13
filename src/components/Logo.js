import { Box, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import FavoriteIcon from '@mui/icons-material/Favorite';

function Logo({ variant = 'default' }) {
  if (variant === 'favicon') {
    return (
      <Box
        sx={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.main',
          borderRadius: '50%',
          color: 'white',
        }}
      >
        <SchoolIcon />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.main',
          borderRadius: '50%',
          width: 40,
          height: 40,
          color: 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <SchoolIcon />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #ffffff 30%, #e0e0e0 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            letterSpacing: '0.5px',
          }}
        >
          TENENGHANG
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 500,
            letterSpacing: '0.5px',
          }}
        >
          FOUNDATION
        </Typography>
      </Box>
    </Box>
  );
}

export default Logo; 