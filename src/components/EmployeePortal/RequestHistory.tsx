import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { DataService } from '../../services/dataService';
import type { BookRequest } from '../../types';

const RequestHistory = () => {
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const userRequests = DataService.getRequestsByUserId(user.id);
      setRequests(userRequests.sort((a, b) => 
        new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
      ));
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'dispatched': return 'info';
      case 'returned': return 'default';
      default: return 'default';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending': return 'Your request is being reviewed by the admin';
      case 'approved': return 'Request approved, book will be dispatched soon';
      case 'rejected': return 'Request was rejected';
      case 'dispatched': return 'Book has been dispatched to you';
      case 'returned': return 'Book has been returned successfully';
      default: return '';
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const dispatchedCount = requests.filter(r => r.status === 'dispatched').length;
  const returnedCount = requests.filter(r => r.status === 'returned').length;

  return (
    <Container maxWidth={false} sx={{ py: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', width: '100%', px: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4, color: 'white' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          📋 My Book Requests 📋
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Track the status of your book requests
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { 
            xs: 'repeat(2, 1fr)', 
            sm: 'repeat(4, 1fr)' 
          },
          gap: 3,
          mb: 4 
        }}
      >
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
              Pending
            </Typography>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
              {pendingCount}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
              Approved
            </Typography>
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
              {approvedCount}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
              Dispatched
            </Typography>
            <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
              {dispatchedCount}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
              Returned
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#7b1fa2' }}>
              {returnedCount}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Requests Table */}
      {requests.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No book requests found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Start by browsing our book catalog and requesting books!
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book Details</TableCell>
                <TableCell>Request Date</TableCell>
                <TableCell>Expected Return</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Comments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {request.bookTitle}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        by {request.bookAuthor}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(request.requestDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(request.expectedReturnDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Chip
                        label={request.status.toUpperCase()}
                        color={getStatusColor(request.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                        size="small"
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        {getStatusDescription(request.status)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {request.adminComments && (
                      <Typography variant="body2">
                        {request.adminComments}
                      </Typography>
                    )}
                    {request.dispatchDate && (
                      <Typography variant="caption" display="block">
                        Dispatched: {new Date(request.dispatchDate).toLocaleDateString()}
                      </Typography>
                    )}
                    {request.returnDate && (
                      <Typography variant="caption" display="block">
                        Returned: {new Date(request.returnDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default RequestHistory;
