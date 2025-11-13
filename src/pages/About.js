import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Paper, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HistoryIcon from '@mui/icons-material/History';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import blandine from '../assets/blandine.png';
import elvis from '../assets/elvis.png';
import divine from '../assets/divine.png';
import eugene from '../assets/eugene.png';
import sinorine from '../assets/sinorine.png';
import fidelis from '../assets/fidelis.png';
import tezeh from '../assets/tezeh.png';
import teneng from '../assets/teneng.png';
import boss from '../assets/boss.png'


const managementTeam = [
  {
    name: "Miss. Powoh Blandine",
    role: "Management Team Member",
    image: blandine
  },
  {
    name: "Mr. Elvis Ndatenu",
    role: "Management Team Member",
    image: elvis
  },
  {
    name: "Mr. Tisighe Divine",
    role: "Management Team Member",
    image: divine
  },
  {
    name: "Mr. Tezeh Vigil Khan",
    role: "Management Team Member",
    image: tezeh
  },
  {
    name: "Mme Tengem Sinorine",
    role: "Management Team Member",
    image: sinorine
  },
  {
    name: "Mr. Ngaliwa Eugene",
    role: "Management Team Member",
    image: eugene
  },
  {
    name: "Mme Teneng Conscience",
    role: "Management Team Member",
    image: teneng
  },
  {
    name: "Bar. Awah Fidelis",
    role: "Management Team Member",
    image: fidelis
  }
];

function About() {
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
            About Tenenghang Foundation
          </Typography>
          <Typography 
            variant="h5" 
            sx={{
              opacity: 0.9,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Dedicated to upgrading standards of living through indigenous and self-reliant development initiatives
          </Typography>
        </Container>
      </Box>

      {/* Apply for Scholarship Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          href="https://docs.google.com/forms/d/e/1FAIpQLSdxFiROag4PeHmAK5Ezv9L8g4I-yTPO1bbRWXEOKm5_2aMq7g/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            fontWeight: 600,
            px: 5,
            py: 1.5,
            fontSize: '1.1rem',
            boxShadow: 2,
            borderRadius: 3,
            background: 'linear-gradient(90deg, #1a237e 30%, #534bae 90%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #534bae 30%, #1a237e 90%)',
            },
          }}
        >
          Apply for Scholarship
        </Button>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Mission Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 6,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmojiEventsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h2" color="primary.main">
              Our Mission
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            The Tenenghang Foundation is dedicated to upgrading the standards of living of target populations through the promotion of indigenous and self-reliant development initiatives. We focus on encouraging academic excellence and supporting vulnerable children in schools and orphanages.
          </Typography>
        </Paper>

        {/* Objectives Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 6,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmojiEventsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h2" color="primary.main">
              Our Objectives
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            The Tenenghang Foundation has set forth the following key objectives:
          </Typography>
          <Box component="ul" sx={{ pl: 4 }}>
            <Typography component="li" variant="body1" paragraph>
              To promote and support academic excellence through scholarship programs for outstanding students
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              To provide assistance and support to orphans and vulnerable children in schools and orphanages
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              To encourage and facilitate indigenous development initiatives that improve living standards
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              To support vulnerable populations in developing sustainable livelihoods through petit trades and subsistence activities
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              To foster self-reliance and community development through local initiatives
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              To create awareness and advocate for the rights and welfare of vulnerable populations
            </Typography>
          </Box>
        </Paper>

        {/* History Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 6,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <HistoryIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h2" color="primary.main">
              Our History
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            The TENENGHANG FOUNDATION FOR INDIGENOUS DEVELOPMENT INITIATIVES is an NGO, registered in the Mezam SDO's office, in the North West Region of Cameroon, since the year 2000. Located at Cow Street, Bamenda, the foundation has been actively involved in assisting vulnerable populations and promoting academic excellence through yearly scholarship awards.
          </Typography>
        </Paper>

        {/* Activities Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 6,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h2" color="primary.main">
              Our Activities
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            The foundation is actively involved in various initiatives including:
          </Typography>
          <Box component="ul" sx={{ pl: 4 }}>
            <Typography component="li" variant="body1" paragraph>
              Yearly scholarships for outstanding students in GCE examinations
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Assistance to orphans and vulnerable children in schools and orphanages
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Support for vulnerable populations in developing petit trades and subsistence activities
            </Typography>
          </Box>
        </Paper>

        {/* Founder's Profile Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 6,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: 2,
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              textAlign: 'center',
              mb: 4,
              color: 'primary.main',
              fontWeight: 600,
            }}
          >
            Founder's Profile
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="400"
                  image={boss}
                  alt="Mr. Mboh Patrice Lumumba"
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box>
                <Typography variant="h5" gutterBottom color="primary.main" sx={{ fontWeight: 600 }}>
                  Mr. Mboh Patrice Lumumba
                </Typography>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Founder & Executive President
                </Typography>
                <Typography variant="body1" paragraph>
                  Mr. Mboh Patrice Lumumba is the visionary founder and Executive President of the Tenenghang Foundation. With a deep commitment to community development and education, he established the foundation in 2000 with the mission of upgrading living standards through indigenous and self-reliant development initiatives.
                </Typography>
                <Typography variant="body1" paragraph>
                  Under his leadership, the foundation has grown to become a significant force in promoting academic excellence and supporting vulnerable populations in the North West Region of Cameroon and beyond. His dedication to empowering communities through education and sustainable development has touched countless lives.
                </Typography>
                <Typography variant="body1">
                  Mr. Lumumba's vision continues to guide the foundation's efforts in creating lasting positive change in the community through various initiatives including scholarship programs, orphan support, and community development projects.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Management Team Section */}
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          sx={{ 
            textAlign: 'center',
            mb: 4,
            color: 'primary.main',
            fontWeight: 600,
          }}
        >
          Current Management Team
        </Typography>
        <Grid container spacing={4}>
          {managementTeam.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={member.image}
                  alt={member.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.role}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Media Coverage Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mt: 6,
            mb: 6,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <NewspaperIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h2" color="primary.main">
              Media Coverage
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            Our activities are covered by various media outlets including Equinox Television, My Media Prime Television, Radio Hot Cocoa, Dream FM, the Voice Newspaper, the Horizon Newspaper, and the Post Newspaper. These media partners help us reach a wider audience and share our impact stories.
          </Typography>
        </Paper>

        {/* Contact Information Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOnIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h2" color="primary.main">
              Contact Information
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            The Tenenghang Foundation is located at Cow Street, Bamenda, in the North West Region of Cameroon. For more information about our initiatives and how to get involved, please contact us through our registered office.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default About; 