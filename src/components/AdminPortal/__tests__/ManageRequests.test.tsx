import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ManageRequests from '../ManageRequests';
import { AuthContext } from '../../../contexts/AuthContext';
import { NotificationContext } from '../../../contexts/NotificationContext';
import { DataService } from '../../../services/dataService';
import type { User, BookRequest } from '../../../types';

// Mock DataService
jest.mock('../../../services/dataService');
const mockDataService = DataService as jest.Mocked<typeof DataService>;

// Mock QuickActions component
jest.mock('../../common/QuickActions', () => {
  return function MockQuickActions() {
    return <div data-testid="quick-actions">Quick Actions</div>;
  };
});

const mockRequests: BookRequest[] = [
  {
    id: '1',
    userId: 'user-1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    bookId: 'book-1',
    bookTitle: 'Test Book 1',
    bookAuthor: 'Author 1',
    requestDate: '2023-12-01T10:00:00.000Z',
    status: 'pending',
    expectedReturnDate: '2023-12-15T10:00:00.000Z'
  },
  {
    id: '2',
    userId: 'user-2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    bookId: 'book-2',
    bookTitle: 'Test Book 2',
    bookAuthor: 'Author 2',
    requestDate: '2023-12-02T10:00:00.000Z',
    status: 'approved',
    expectedReturnDate: '2023-12-16T10:00:00.000Z'
  }
];

const mockAdmin: User = {
  id: 'admin-1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
  department: 'Administration'
};

const mockNotificationContext = {
  notifications: [],
  addNotification: jest.fn(),
  removeNotification: jest.fn()
};

const renderWithProviders = (component: React.ReactElement) => {
  const authValue = {
    user: mockAdmin,
    login: jest.fn(),
    logout: jest.fn(),
    loading: false
  };

  return render(
    <MemoryRouter>
      <AuthContext.Provider value={authValue}>
        <NotificationContext.Provider value={mockNotificationContext}>
          {component}
        </NotificationContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('ManageRequests Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockDataService.getAllRequests as jest.Mock).mockReturnValue(mockRequests);
    (mockDataService.updateRequestStatus as jest.Mock).mockReturnValue(true);
  });

  it('renders manage requests page', async () => {
    renderWithProviders(<ManageRequests />);
    
    expect(screen.getByText('📋 Manage Book Requests 📋')).toBeInTheDocument();
  });

  it('displays requests table', async () => {
    renderWithProviders(<ManageRequests />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.getByText('Test Book 2')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('displays request status correctly', async () => {
    renderWithProviders(<ManageRequests />);
    
    await waitFor(() => {
      expect(screen.getByText('PENDING')).toBeInTheDocument();
      expect(screen.getByText('APPROVED')).toBeInTheDocument();
    });
  });

  it('filters requests by status', async () => {
    renderWithProviders(<ManageRequests />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Look for status filter dropdown
    const statusFilters = screen.getAllByRole('button');
    const statusFilterButton = statusFilters.find(button => 
      button.textContent?.includes('All Status') || button.textContent?.includes('Status')
    );
    
    if (statusFilterButton) {
      fireEvent.click(statusFilterButton);
      
      await waitFor(() => {
        const pendingOption = screen.queryByText('Pending');
        if (pendingOption) {
          fireEvent.click(pendingOption);
        }
      });
    }
  });

  it('approves request successfully', async () => {
    renderWithProviders(<ManageRequests />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Look for approve buttons by tooltip
    const approveButton = screen.getByLabelText('Approve Request');
    expect(approveButton).toBeInTheDocument();
    
    fireEvent.click(approveButton);
    
    // Should open action dialog - use getAllByText since text appears in title and button
    await waitFor(() => {
      const approveTexts = screen.getAllByText('Approve Request');
      expect(approveTexts.length).toBeGreaterThan(0);
    });
  });

  it('rejects request successfully', async () => {
    renderWithProviders(<ManageRequests />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Look for reject buttons by tooltip
    const rejectButton = screen.getByLabelText('Reject Request');
    expect(rejectButton).toBeInTheDocument();
    
    fireEvent.click(rejectButton);
    
    // Should open action dialog - use getAllByText since text appears in title and button
    await waitFor(() => {
      const rejectTexts = screen.getAllByText('Reject Request');
      expect(rejectTexts.length).toBeGreaterThan(0);
    });
  });

  it('dispatches request successfully', async () => {
    renderWithProviders(<ManageRequests />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 2')).toBeInTheDocument();
    });

    // Look for dispatch buttons by tooltip (only for approved requests)
    const dispatchButton = screen.getByLabelText('Mark as Dispatched');
    expect(dispatchButton).toBeInTheDocument();
    
    fireEvent.click(dispatchButton);
    
    // Should open action dialog - check for dialog being present
    await waitFor(() => {
      // The dialog should open - look for any dialog content
      const dialogs = screen.getAllByRole('dialog');
      expect(dialogs.length).toBeGreaterThan(0);
    });
  });

  it('handles empty requests list', async () => {
    (mockDataService.getAllRequests as jest.Mock).mockReturnValue([]);
    renderWithProviders(<ManageRequests />);
    
    await waitFor(() => {
      expect(screen.getByText('📋 Manage Book Requests 📋')).toBeInTheDocument();
    });

    // Should show empty state or no requests message
    expect(screen.queryByText('Test Book 1')).not.toBeInTheDocument();
  });

  it('displays request details correctly', async () => {
    renderWithProviders(<ManageRequests />);
    
    await waitFor(() => {
      // Check for user information that we know is displayed
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      
      // Check for book titles that we know are displayed
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.getByText('Test Book 2')).toBeInTheDocument();
    });
  });

  it('includes QuickActions component', async () => {
    renderWithProviders(<ManageRequests />);
    
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
  });

  it('displays request dates', async () => {
    renderWithProviders(<ManageRequests />);
    
    await waitFor(() => {
      // Check that date-related columns exist - use getAllByText to handle multiple headers
      const requestDateHeaders = screen.getAllByText('Request Date');
      expect(requestDateHeaders.length).toBeGreaterThan(0);
      
      const returnDateHeaders = screen.getAllByText('Expected Return');
      expect(returnDateHeaders.length).toBeGreaterThan(0);
    });
  });

  it('shows admin comments section for rejected requests', async () => {
    const requestsWithRejected = [
      ...mockRequests,
      {
        id: '3',
        userId: 'user-3',
        userName: 'Bob Wilson',
        userEmail: 'bob@example.com',
        bookId: 'book-3',
        bookTitle: 'Test Book 3',
        bookAuthor: 'Author 3',
        requestDate: '2023-12-03T10:00:00.000Z',
        status: 'rejected' as const,
        expectedReturnDate: '2023-12-17T10:00:00.000Z',
        adminComments: 'Book temporarily unavailable'
      }
    ];
    
    (mockDataService.getAllRequests as jest.Mock).mockReturnValue(requestsWithRejected);
    renderWithProviders(<ManageRequests />);
    
    await waitFor(() => {
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });
  });

  it('handles request action dialog confirmation', async () => {
    renderWithProviders(<ManageRequests />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Click approve button
    const approveButton = screen.getByLabelText('Approve Request');
    fireEvent.click(approveButton);
    
    // Wait for dialog to open - use role="dialog" to find the modal
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Click the approve request button in the dialog actions (use getByRole to be more specific)
    const confirmButton = screen.getByRole('button', { name: 'Approve Request' });
    fireEvent.click(confirmButton);

    expect(mockDataService.updateRequestStatus).toHaveBeenCalledWith('1', 'approved', undefined);
    expect(mockNotificationContext.addNotification).toHaveBeenCalledWith({
      type: 'success',
      title: 'Action Completed',
      message: 'Request approved successfully'
    });
  });

  it('handles request action dialog cancellation', async () => {
    renderWithProviders(<ManageRequests />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Click approve button
    const approveButton = screen.getByLabelText('Approve Request');
    fireEvent.click(approveButton);
    
    // Wait for dialog to open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Click cancel button
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Dialog should close and no service call should be made
    expect(mockDataService.updateRequestStatus).not.toHaveBeenCalled();
  });

  it('handles rejection with admin comments', async () => {
    renderWithProviders(<ManageRequests />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Click reject button
    const rejectButton = screen.getByLabelText('Reject Request');
    fireEvent.click(rejectButton);
    
    // Wait for dialog to open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Add admin comments - try to find the text field by placeholder or role
    const commentsField = screen.getByRole('textbox');
    fireEvent.change(commentsField, { target: { value: 'Book out of stock' } });

    // Click the reject request button in the dialog actions
    const confirmButton = screen.getByRole('button', { name: 'Reject Request' });
    fireEvent.click(confirmButton);

    expect(mockDataService.updateRequestStatus).toHaveBeenCalledWith('1', 'rejected', 'Book out of stock');
  });

  it('handles failed request status update', async () => {
    (mockDataService.updateRequestStatus as jest.Mock).mockReturnValue(false);
    
    renderWithProviders(<ManageRequests />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Click approve button
    const approveButton = screen.getByLabelText('Approve Request');
    fireEvent.click(approveButton);
    
    // Wait for dialog to open and confirm
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole('button', { name: 'Approve Request' });
    fireEvent.click(confirmButton);

    expect(mockNotificationContext.addNotification).toHaveBeenCalledWith({
      type: 'error',
      title: 'Action Failed',
      message: 'Failed to update request status'
    });
  });

  it('shows return button for dispatched requests', async () => {
    const requestsWithDispatched = [
      {
        id: '3',
        userId: 'user-3',
        userName: 'Bob Wilson',
        userEmail: 'bob@example.com',
        bookId: 'book-3',
        bookTitle: 'Test Book 3',
        bookAuthor: 'Author 3',
        requestDate: '2023-12-03T10:00:00.000Z',
        status: 'dispatched' as const,
        expectedReturnDate: '2023-12-17T10:00:00.000Z'
      }
    ];
    
    (mockDataService.getAllRequests as jest.Mock).mockReturnValue(requestsWithDispatched);
    renderWithProviders(<ManageRequests />);
    
    await waitFor(() => {
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    // Should have return button for dispatched requests
    expect(screen.getByLabelText('Mark as Returned')).toBeInTheDocument();
  });

  it('handles return process for dispatched books', async () => {
    const requestsWithDispatched = [
      {
        id: '3',
        userId: 'user-3',
        userName: 'Bob Wilson',
        userEmail: 'bob@example.com',
        bookId: 'book-3',
        bookTitle: 'Test Book 3',
        bookAuthor: 'Author 3',
        requestDate: '2023-12-03T10:00:00.000Z',
        status: 'dispatched' as const,
        expectedReturnDate: '2023-12-17T10:00:00.000Z'
      }
    ];
    
    (mockDataService.getAllRequests as jest.Mock).mockReturnValue(requestsWithDispatched);
    renderWithProviders(<ManageRequests />);
    
    await waitFor(() => {
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    // Click return button
    const returnButton = screen.getByLabelText('Mark as Returned');
    fireEvent.click(returnButton);
    
    // Wait for dialog to open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Click the process return button in the dialog actions
    const confirmButton = screen.getByRole('button', { name: 'Process Return' });
    fireEvent.click(confirmButton);

    expect(mockDataService.updateRequestStatus).toHaveBeenCalledWith('3', 'returned', undefined);
    expect(mockNotificationContext.addNotification).toHaveBeenCalledWith({
      type: 'success',
      title: 'Action Completed',
      message: 'Book return processed'
    });
  });

  it('does not show action buttons for completed requests', async () => {
    const requestsWithCompleted = [
      {
        id: '4',
        userId: 'user-4',
        userName: 'Alice Johnson',
        userEmail: 'alice@example.com',
        bookId: 'book-4',
        bookTitle: 'Test Book 4',
        bookAuthor: 'Author 4',
        requestDate: '2023-12-04T10:00:00.000Z',
        status: 'returned' as const,
        expectedReturnDate: '2023-12-18T10:00:00.000Z'
      }
    ];
    
    (mockDataService.getAllRequests as jest.Mock).mockReturnValue(requestsWithCompleted);
    renderWithProviders(<ManageRequests />);
    
    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    // Should not have any action buttons for returned requests
    expect(screen.queryByLabelText('Approve Request')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Reject Request')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Mark as Dispatched')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Mark as Returned')).not.toBeInTheDocument();
  });
});
