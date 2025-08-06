import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Paper,
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

const AdminDashboard: React.FC = () => {
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

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <Card 
      sx={{ 
        height: '140px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CardContent sx={{ width: '100%', textAlign: 'center' }}>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center"
          sx={{ height: '100%' }}
        >
          <Box sx={{ color, mb: 1, fontSize: '2.5rem' }}>
            {icon}
          </Box>
          <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
            {value}
          </Typography>
          <Typography color="textSecondary" variant="body1" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Welcome back, {user?.name}! Here's your library overview.
        </Typography>
      </Box>

      {/* Main Statistics - Equal sized cards */}
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
          height: '140px', 
          display: 'flex', 
          alignItems: 'center',
        }}>
          <CardContent sx={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Success Rate
            </Typography>
            <Typography variant="h4" sx={{ color: '#2e7d32', mb: 1 }}>
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
                height: 8, 
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#2e7d32'
                }
              }}
            />
          </CardContent>
        </Card>
      </Box>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          Quick Actions
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
          <Card sx={{ 
            p: 2, 
            cursor: 'pointer', 
            '&:hover': { backgroundColor: '#f5f5f5' },
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="body1" align="center">
              📚 Manage Books
            </Typography>
          </Card>
          <Card sx={{ 
            p: 2, 
            cursor: 'pointer', 
            '&:hover': { backgroundColor: '#f5f5f5' },
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="body1" align="center">
              📋 Review Requests
            </Typography>
          </Card>
          <Card sx={{ 
            p: 2, 
            cursor: 'pointer', 
            '&:hover': { backgroundColor: '#f5f5f5' },
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="body1" align="center">
              📊 View Reports
            </Typography>
          </Card>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
