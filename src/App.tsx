import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/common/Navbar';
import NotificationList from './components/common/NotificationList';
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy load components for code splitting
const Login = lazy(() => import('./components/Auth/Login'));
const EmployeeDashboard = lazy(() => import('./components/EmployeePortal/Dashboard'));
const AdminDashboard = lazy(() => import('./components/AdminPortal/Dashboard-new'));
const BookCatalog = lazy(() => import('./components/EmployeePortal/BookCatalog'));
const RequestHistory = lazy(() => import('./components/EmployeePortal/RequestHistory'));
const ManageBooks = lazy(() => import('./components/AdminPortal/ManageBooks'));
const ManageRequests = lazy(() => import('./components/AdminPortal/ManageRequests'));

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          width: '100%',
          minWidth: '100vw',
          overflowX: 'hidden',
        },
        '#root': {
          width: '100%',
          minWidth: '100vw',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          width: '100%',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

function App() {
  // Loading fallback component
  const LoadingFallback = () => (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <CircularProgress size={60} />
      <Box sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>Loading...</Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
              <Navbar />
              <Box 
                component="main" 
                sx={{ 
                  flexGrow: 1, 
                  width: '100%',
                  minHeight: 'calc(100vh - 64px)',
                  p: 0,
                  m: 0
                }}
              >
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                      path="/employee"
                      element={
                        <ProtectedRoute requiredRole="employee">
                          <EmployeeDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/employee/books"
                      element={
                        <ProtectedRoute requiredRole="employee">
                          <BookCatalog />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/employee/requests"
                      element={
                        <ProtectedRoute requiredRole="employee">
                          <RequestHistory />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/books"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <ManageBooks />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/requests"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <ManageRequests />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                  </Routes>
                </Suspense>
              </Box>
              <NotificationList />
            </Box>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
