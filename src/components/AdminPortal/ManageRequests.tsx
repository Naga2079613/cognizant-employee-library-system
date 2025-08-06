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
  Button,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import { 
  CheckCircle, 
  Cancel, 
  LocalShipping, 
  AssignmentReturn
} from '@mui/icons-material';
import { DataService } from '../../services/dataService';
import { useNotification } from '../../contexts/NotificationContext';
import QuickActions from '../common/QuickActions';
import type { BookRequest } from '../../types';

const ManageRequests = () => {
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<BookRequest | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'dispatch' | 'return'>('approve');
  const [adminComments, setAdminComments] = useState('');
  
  const { addNotification } = useNotification();

  useEffect(() => {
    refreshRequests();
  }, []);

  const refreshRequests = () => {
    const allRequests = DataService.getAllRequests();
    setRequests(allRequests.sort((a, b) => 
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    ));
  };

  const handleAction = (request: BookRequest, action: 'approve' | 'reject' | 'dispatch' | 'return') => {
    setSelectedRequest(request);
    setActionType(action);
    setActionDialogOpen(true);
    setAdminComments('');
  };

  const handleConfirmAction = () => {
    if (!selectedRequest) return;

    let newStatus: BookRequest['status'];
    let successMessage = '';
    
    switch (actionType) {
      case 'approve':
        newStatus = 'approved';
        successMessage = 'Request approved successfully';
        break;
      case 'reject':
        newStatus = 'rejected';
        successMessage = 'Request rejected';
        break;
      case 'dispatch':
        newStatus = 'dispatched';
        successMessage = 'Book marked as dispatched';
        break;
      case 'return':
        newStatus = 'returned';
        successMessage = 'Book return processed';
        break;
    }

    const success = DataService.updateRequestStatus(
      selectedRequest.id,
      newStatus,
      adminComments || undefined
    );

    if (success) {
      addNotification({
        type: 'success',
        title: 'Action Completed',
        message: successMessage
      });
      refreshRequests();
    } else {
      addNotification({
        type: 'error',
        title: 'Action Failed',
        message: 'Failed to update request status'
      });
    }

    setActionDialogOpen(false);
    setSelectedRequest(null);
    setAdminComments('');
  };

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

  const getActionButtons = (request: BookRequest) => {
    switch (request.status) {
      case 'pending':
        return (
          <>
            <Tooltip title="Approve Request">
              <IconButton
                color="success"
                onClick={() => handleAction(request, 'approve')}
                size="small"
              >
                <CheckCircle />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reject Request">
              <IconButton
                color="error"
                onClick={() => handleAction(request, 'reject')}
                size="small"
              >
                <Cancel />
              </IconButton>
            </Tooltip>
          </>
        );
      case 'approved':
        return (
          <Tooltip title="Mark as Dispatched">
            <IconButton
              color="info"
              onClick={() => handleAction(request, 'dispatch')}
              size="small"
            >
              <LocalShipping />
            </IconButton>
          </Tooltip>
        );
      case 'dispatched':
        return (
          <Tooltip title="Mark as Returned">
            <IconButton
              color="primary"
              onClick={() => handleAction(request, 'return')}
              size="small"
            >
              <AssignmentReturn />
            </IconButton>
          </Tooltip>
        );
      default:
        return null;
    }
  };

  const getActionTitle = () => {
    switch (actionType) {
      case 'approve': return 'Approve Request';
      case 'reject': return 'Reject Request';
      case 'dispatch': return 'Mark as Dispatched';
      case 'return': return 'Process Return';
      default: return 'Action';
    }
  };

  const getActionDescription = () => {
    switch (actionType) {
      case 'approve': return 'Are you sure you want to approve this book request?';
      case 'reject': return 'Please provide a reason for rejecting this request:';
      case 'dispatch': return 'Mark this book as dispatched to the employee:';
      case 'return': return 'Process the return of this book:';
      default: return '';
    }
  };

  const getRequestsByStatus = (status: string) => 
    requests.filter(r => r.status === status);

  const pendingRequests = getRequestsByStatus('pending');
  const approvedRequests = getRequestsByStatus('approved');
  const dispatchedRequests = getRequestsByStatus('dispatched');
  const returnedRequests = getRequestsByStatus('returned');
  const rejectedRequests = getRequestsByStatus('rejected');

  const RequestSection: React.FC<{ 
    title: string; 
    requests: BookRequest[]; 
    color: 'primary' | 'warning' | 'success' | 'info' | 'error' | 'default';
  }> = ({ title, requests, color }) => (
    <Paper sx={{ mb: 3 }}>
      <Box sx={{ p: 2, bgcolor: `${color}.light`, color: `${color}.contrastText` }}>
        <Typography variant="h6">
          {title} ({requests.length})
        </Typography>
      </Box>
      {requests.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            No {title.toLowerCase()} requests
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Book Details</TableCell>
                <TableCell>Request Date</TableCell>
                <TableCell>Expected Return</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {request.userName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {request.userEmail}
                      </Typography>
                    </Box>
                  </TableCell>
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
                      {request.adminComments && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          {request.adminComments}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      {getActionButtons(request)}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );

  return (
    <Container maxWidth={false} sx={{ py: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', width: '100%', px: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
          📋 Manage Book Requests 📋
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
          Review and process employee book requests
        </Typography>
      </Box>

      {/* Statistics Overview */}
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 4,
          justifyContent: 'center'
        }}
      >
        <Chip 
          label={`Total Requests: ${requests.length}`} 
          color="primary" 
        />
        <Chip 
          label={`Pending: ${pendingRequests.length}`} 
          color="warning" 
        />
        <Chip 
          label={`Dispatched: ${dispatchedRequests.length}`} 
          color="info" 
        />
      </Box>

      {/* Categorized Request Sections */}
      <RequestSection 
        title="Pending Requests" 
        requests={pendingRequests} 
        color="warning" 
      />
      
      <RequestSection 
        title="Approved Requests" 
        requests={approvedRequests} 
        color="success" 
      />
      
      <RequestSection 
        title="Dispatched Books" 
        requests={dispatchedRequests} 
        color="info" 
      />
      
      <RequestSection 
        title="Returned Books" 
        requests={returnedRequests} 
        color="default" 
      />
      
      <RequestSection 
        title="Rejected Requests" 
        requests={rejectedRequests} 
        color="error" 
      />

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{getActionTitle()}</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Typography variant="body1" gutterBottom>
                {getActionDescription()}
              </Typography>
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2">Book: {selectedRequest.bookTitle}</Typography>
                <Typography variant="body2" color="textSecondary">by {selectedRequest.bookAuthor}</Typography>
                <Typography variant="body2" color="textSecondary">Employee: {selectedRequest.userName}</Typography>
              </Box>

              {(actionType === 'reject' || actionType === 'dispatch' || actionType === 'return') && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={actionType === 'reject' ? 'Reason for rejection' : 'Comments (optional)'}
                  value={adminComments}
                  onChange={(e) => setAdminComments(e.target.value)}
                  sx={{ mt: 2 }}
                  required={actionType === 'reject'}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmAction} 
            variant="contained"
            color={actionType === 'reject' ? 'error' : 'primary'}
            disabled={actionType === 'reject' && !adminComments.trim()}
          >
            {getActionTitle()}
          </Button>
        </DialogActions>
      </Dialog>

      <QuickActions />
    </Container>
  );
};

export default ManageRequests;
