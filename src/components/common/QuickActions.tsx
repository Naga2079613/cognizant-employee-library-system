import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Card,
} from '@mui/material';

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ 
      p: 3, 
      mt: 3,
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
    }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 600 }}>
        🚀 Quick Actions
      </Typography>
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)' 
          },
          gap: 2 
        }}
      >
        <Card 
          sx={{ 
            p: 2, 
            cursor: 'pointer', 
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { 
              transform: 'translateY(-3px)',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            } 
          }}
          onClick={() => navigate('/admin/books')}
        >
          <Typography variant="body1" align="center" sx={{ fontWeight: 'bold' }}>
            📚 Manage Books
          </Typography>
        </Card>
        <Card 
          sx={{ 
            p: 2, 
            cursor: 'pointer', 
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { 
              transform: 'translateY(-3px)',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            } 
          }}
          onClick={() => navigate('/admin/requests')}
        >
          <Typography variant="body1" align="center" sx={{ fontWeight: 'bold' }}>
            📋 Review Requests
          </Typography>
        </Card>
        <Card 
          sx={{ 
            p: 2, 
            cursor: 'pointer', 
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { 
              transform: 'translateY(-3px)',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            } 
          }}
          onClick={() => navigate('/admin')}
        >
          <Typography variant="body1" align="center" sx={{ fontWeight: 'bold' }}>
            📊 View Reports
          </Typography>
        </Card>
      </Box>
    </Paper>
  );
};

export default QuickActions;
