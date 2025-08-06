import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/common/Navbar';
import Login from './components/Auth/Login';
import EmployeeDashboard from './components/EmployeePortal/Dashboard';
import AdminDashboard from './components/AdminPortal/Dashboard';
import BookCatalog from './components/EmployeePortal/BookCatalog';
import RequestHistory from './components/EmployeePortal/RequestHistory';
import ManageBooks from './components/AdminPortal/ManageBooks';
import ManageRequests from './components/AdminPortal/ManageRequests';
import NotificationList from './components/common/NotificationList';
import ProtectedRoute from './components/common/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2',
        },
      },
    },
  },
});

function App() {
  console.log('App component is rendering...'); // Debug log
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
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
