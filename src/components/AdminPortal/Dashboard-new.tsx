import { useState, useEffect, type ReactNode } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  LinearProgress,
} from '@mui/material';
import { 
  Book, 
  People, 
  AssignmentTurnedIn, 
  Schedule,
  LocalShipping,
  AssignmentReturn 
} from '@mui/icons-material';
import { DataService } from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';
import QuickActions from '../common/QuickActions';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    dispatchedRequests: 0,
    returnedRequests: 0,
  });

  useEffect(() => {
    const books = DataService.getAllBooks();
    const requestStats = DataService.getRequestStats();
    
    setStats({
      totalBooks: books.length,
      availableBooks: books.filter(book => book.availableCopies > 0).length,
      totalRequests: requestStats.total,
      pendingRequests: requestStats.pending,
      approvedRequests: requestStats.approved,
      dispatchedRequests: requestStats.dispatched,
      returnedRequests: requestStats.returned,
    });
  }, []);

  const StatCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: number;
    icon: ReactNode;
    color: string;
  }) => (
    <Card 
      sx={{ 
        height: '100%',
        minHeight: '110px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        }
      }}
    >
      <CardContent sx={{ width: '100%', textAlign: 'center', p: 2 }}>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center"
          sx={{ height: '100%', gap: 1 }}
        >
          <Box sx={{ color, mb: 0.5, fontSize: '1.5rem' }}>
            {icon}
          </Box>
          <Typography variant="h6" component="div" sx={{ mb: 0.5, fontWeight: 'bold', color: '#2c3e50' }}>
            {value}
          </Typography>
          <Typography color="textSecondary" variant="body2" sx={{ fontWeight: 600, color: '#34495e', fontSize: '0.8rem' }}>
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth={false} sx={{ py: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', width: '100%', px: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4, color: 'white' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          📊 Admin Dashboard 📊
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Welcome back, {user?.name}! Here's your library overview.
        </Typography>
      </Box>

      {/* Main Statistics Grid - Equal sized cards */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(4, 1fr)' 
          },
          gap: 3,
          mb: 4 
        }}
      >
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          icon={<Book />}
          color="#1976d2"
        />

        <StatCard
          title="Available Books"
          value={stats.availableBooks}
          icon={<AssignmentTurnedIn />}
          color="#2e7d32"
        />

        <StatCard
          title="Total Requests"
          value={stats.totalRequests}
          icon={<People />}
          color="#ed6c02"
        />

        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={<Schedule />}
          color="#d32f2f"
        />
      </Box>

      {/* Request Status Overview */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(4, 1fr)' 
          },
          gap: 3,
          mb: 4 
        }}
      >
        <StatCard
          title="Approved"
          value={stats.approvedRequests}
          icon={<AssignmentTurnedIn />}
          color="#388e3c"
        />

        <StatCard
          title="Dispatched"
          value={stats.dispatchedRequests}
          icon={<LocalShipping />}
          color="#1565c0"
        />

        <StatCard
          title="Returned"
          value={stats.returnedRequests}
          icon={<AssignmentReturn />}
          color="#7b1fa2"
        />

        <Card sx={{ 
          height: '110px', 
          display: 'flex', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <CardContent sx={{ width: '100%', textAlign: 'center', p: 2 }}>
            <Typography variant="body1" gutterBottom sx={{ color: '#2c3e50', fontWeight: 600, fontSize: '0.9rem' }}>
              Success Rate
            </Typography>
            <Typography variant="h6" sx={{ color: '#2e7d32', mb: 0.5, fontWeight: 'bold' }}>
              {stats.totalRequests > 0 
                ? Math.round(((stats.returnedRequests + stats.dispatchedRequests) / stats.totalRequests) * 100)
                : 0}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={stats.totalRequests > 0 
                ? ((stats.returnedRequests + stats.dispatchedRequests) / stats.totalRequests) * 100
                : 0}
              sx={{ 
                height: 6, 
                borderRadius: 3,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#2e7d32'
                }
              }}
            />
          </CardContent>
        </Card>
      </Box>

      <QuickActions />
    </Container>
  );
};

export default AdminDashboard;
