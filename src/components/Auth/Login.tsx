import { useState, type FormEvent } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    const redirectPath = user.role === 'admin' ? '/admin' : '/employee';
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      
      if (success) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const redirectPath = currentUser.role === 'admin' ? '/admin' : '/employee';
        navigate(redirectPath);
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2
      }}
    >
      <Container component="main" maxWidth="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Paper 
            elevation={10} 
            sx={{ 
              padding: 4, 
              width: '100%',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                📚 Cognizant Digital Library
              </Typography>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Employee Login Portal
              </Typography>
            </Box>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                borderRadius: '12px',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                }
              }}
              disabled={loading}
            >
              {loading ? '🔄 Signing In...' : '🚀 Sign In'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>Demo Credentials:</Typography>
            <Typography variant="body2"><strong>Admin:</strong> admin@cognizant.com / pass@123</Typography>
            <Typography variant="body2"><strong>Employee:</strong> john.doe@cognizant.com / pass@123</Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
    </Box>
  );
};

export default Login;
