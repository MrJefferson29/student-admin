import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import ScholarshipAwards from './pages/ScholarshipAwards';
import Voting from './pages/Voting';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import UploadQuestion from './pages/admin/UploadQuestion';
import UploadSolution from './pages/admin/UploadSolution';
import ManageScholarships from './pages/admin/ManageScholarships';
import UploadScholarship from './pages/admin/UploadScholarship';
import ManageInternships from './pages/admin/ManageInternships';
import UploadInternship from './pages/admin/UploadInternship';
import Questions from './pages/admin/Questions';
import ManageSchools from './pages/admin/ManageSchools';
import ManageDepartments from './pages/admin/ManageDepartments';
import ManageContests from './pages/admin/ManageContests';
import ManageContestants from './pages/admin/ManageContestants';
import ManageCourses from './pages/admin/ManageCourses';
import ManageCourseChapters from './pages/admin/ManageCourseChapters';
import ManageLiveSessions from './pages/admin/ManageLiveSessions';
import ManageConcours from './pages/admin/ManageConcours';
import ManageSkills from './pages/admin/ManageSkills';
import ManageLibrary from './pages/admin/ManageLibrary';
import ManageNotifications from './pages/admin/ManageNotifications';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
      light: '#534bae',
      dark: '#000051',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#c2185b',
      light: '#fa5788',
      dark: '#8c0032',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a237e',
      secondary: '#534bae',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      background: 'linear-gradient(45deg, #1a237e 30%, #534bae 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 600,
      color: '#1a237e',
    },
    h3: {
      fontWeight: 600,
      color: '#534bae',
    },
    h4: {
      fontWeight: 500,
      color: '#1a237e',
    },
    h5: {
      fontWeight: 500,
      color: '#534bae',
    },
    h6: {
      fontWeight: 500,
      color: '#1a237e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          background: 'linear-gradient(45deg, #1a237e 30%, #534bae 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #000051 30%, #1a237e 90%)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #1a237e 30%, #534bae 90%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
            }}
          >
            <Navbar />
            <Box component="main" sx={{ flex: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/scholarship-awards" element={<ScholarshipAwards />} />
                <Route path="/voting" element={<Voting />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/upload-question"
                  element={
                    <ProtectedRoute requireAdmin>
                      <UploadQuestion />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/upload-solution"
                  element={
                    <ProtectedRoute requireAdmin>
                      <UploadSolution />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/manage-scholarships"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ManageScholarships />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/upload-scholarship"
                  element={
                    <ProtectedRoute requireAdmin>
                      <UploadScholarship />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/manage-internships"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ManageInternships />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/upload-internship"
                  element={
                    <ProtectedRoute requireAdmin>
                      <UploadInternship />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/questions"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Questions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/manage-schools"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ManageSchools />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/manage-departments"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ManageDepartments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/manage-contests"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ManageContests />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/manage-contestants/:contestId"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ManageContestants />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/manage-courses"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ManageCourses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/manage-course-chapters/:courseId"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ManageCourseChapters />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/manage-concours"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ManageConcours />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/manage-live-sessions"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ManageLiveSessions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/manage-skills"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ManageSkills />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/manage-library"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ManageLibrary />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/manage-notifications"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ManageNotifications />
                    </ProtectedRoute>
                  }
                />
                
                {/* Protected Profile Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/edit"
                  element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/change-password"
                  element={
                    <ProtectedRoute>
                      <ChangePassword />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
