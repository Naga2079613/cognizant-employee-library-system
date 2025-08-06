import { useState, useEffect, type ReactNode } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
} from '@mui/material';
import { Book, Person, Schedule, History } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DataService } from '../../services/dataService';
import type { BookRequest } from '../../types';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    availableBooks: 0,
    myRequests: 0,
    pendingRequests: 0,
    booksIssued: 0,
  });

  useEffect(() => {
    if (user) {
      const books = DataService.getAllBooks();
      const userRequests = DataService.getRequestsByUserId(user.id);
      
      setStats({
        availableBooks: books.filter(book => book.availableCopies > 0).length,
        myRequests: userRequests.length,
        pendingRequests: userRequests.filter((req: BookRequest) => req.status === 'pending').length,
        booksIssued: userRequests.filter((req: BookRequest) => req.status === 'dispatched').length,
      });
    }
  }, [user]);

  const StatCard = ({
    title,
    value,
    icon,
    color,
    description,
  }: {
    title: string;
    value: number;
    icon: ReactNode;
    color: string;
    description: string;
  }) => (
    <Card 
      sx={{ 
        height: 'auto',
        minHeight: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        borderRadius: '16px',
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
          <Box sx={{ color, mb: 0.5, fontSize: '2rem' }}>
            {icon}
          </Box>
          <Typography variant="h5" component="div" sx={{ mb: 0.5, fontWeight: 'bold', color: '#2c3e50' }}>
            {value}
          </Typography>
          <Typography color="textSecondary" variant="body1" sx={{ fontWeight: 600, mb: 0.5, color: '#34495e', fontSize: '0.9rem' }}>
            {title}
          </Typography>
          <Typography color="textSecondary" variant="body2" sx={{ fontSize: '0.8rem', color: '#7f8c8d', lineHeight: 1.2, px: 1 }}>
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth={false} sx={{ py: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', borderRadius: '0', width: '100%', px: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4, color: 'white' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          📚 Welcome, {user?.name}! 📚
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9, fontSize: '1.1rem' }}>
          Employee Dashboard - {user?.department}
        </Typography>
      </Box>

      {/* Statistics Grid - Equal sized cards */}
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
          title="Available Books"
          value={stats.availableBooks}
          icon={<Book />}
          color="#1976d2"
          description="Ready to request"
        />
        <StatCard
          title="My Requests"
          value={stats.myRequests}
          icon={<Person />}
          color="#ed6c02"
          description="Total submitted"
        />
        <StatCard
          title="Pending"
          value={stats.pendingRequests}
          icon={<Schedule />}
          color="#d32f2f"
          description="Awaiting approval"
        />
        <StatCard
          title="Books Issued"
          value={stats.booksIssued}
          icon={<History />}
          color="#2e7d32"
          description="Currently with you"
        />
      </Box>

      {/* Quick Actions - Centered and equal sized */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Quick Actions
        </Typography>
      </Box>
      
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)' 
          },
          gap: 3,
          maxWidth: '800px',
          mx: 'auto'
        }}
      >
        <Card sx={{ height: '120px', display: 'flex', alignItems: 'center' }}>
          <CardContent sx={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              📚 Browse Library
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Explore our collection of books
            </Typography>
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => navigate('/employee/books')}
            >
              Browse Books
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ height: '120px', display: 'flex', alignItems: 'center' }}>
          <CardContent sx={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              📋 My Requests
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Track your book requests
            </Typography>
            <Button 
              variant="outlined" 
              fullWidth
              onClick={() => navigate('/employee/requests')}
            >
              View Requests
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default EmployeeDashboard;
