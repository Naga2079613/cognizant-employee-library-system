import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import RequestHistory from '../RequestHistory';
import { AuthContext } from '../../../contexts/AuthContext';
import { NotificationContext } from '../../../contexts/NotificationContext';
import { DataService } from '../../../services/dataService';
import type { User, BookRequest } from '../../../types';

// Mock DataService
jest.mock('../../../services/dataService');
const mockDataService = DataService as jest.Mocked<typeof DataService>;

const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'employee',
  department: 'IT'
};

const mockNotificationContext = {
  notifications: [],
  addNotification: jest.fn(),
  removeNotification: jest.fn()
};

const mockRequests: BookRequest[] = [
  {
    id: 'req-1',
    userId: 'user-1',
    userName: 'Test User',
    userEmail: 'test@example.com',
    bookId: 'book-1',
    bookTitle: 'Test Book',
    bookAuthor: 'Test Author',
    requestDate: '2023-12-01',
    status: 'pending',
    expectedReturnDate: '2023-12-15'
  }
];

const renderWithProviders = (component: React.ReactElement, user: User | null = mockUser) => {
  const authValue = {
    user,
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

describe('RequestHistory Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockDataService.getRequestsByUserId as jest.Mock).mockReturnValue(mockRequests);
  });

  it('renders component title', async () => {
    renderWithProviders(<RequestHistory />);
    
    expect(screen.getByText('📋 My Book Requests 📋')).toBeInTheDocument();
  });

  it('displays table headers correctly', () => {
    renderWithProviders(<RequestHistory />);
    
    expect(screen.getByText('Book Details')).toBeInTheDocument();
    expect(screen.getByText('Request Date')).toBeInTheDocument();
    expect(screen.getByText('Expected Return')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Comments')).toBeInTheDocument();
  });

  it('displays requests when data is available', async () => {
    renderWithProviders(<RequestHistory />);
    
    // Wait for data to load and check for book title and author
    expect(await screen.findByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('by Test Author', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });

  it('displays empty state when no requests exist', async () => {
    (mockDataService.getRequestsByUserId as jest.Mock).mockReturnValue([]);
    renderWithProviders(<RequestHistory />);
    
    expect(await screen.findByText('No book requests found')).toBeInTheDocument();
    expect(screen.getByText('Start by browsing our book catalog and requesting books!')).toBeInTheDocument();
  });

  it('handles null user gracefully', () => {
    renderWithProviders(<RequestHistory />, null);
    
    // Should still render the component structure
    expect(screen.getByText('📋 My Book Requests 📋')).toBeInTheDocument();
  });

  it('displays request status correctly', async () => {
    const requestsWithDifferentStatus = [
      {
        ...mockRequests[0],
        status: 'approved' as const
      }
    ];
    (mockDataService.getRequestsByUserId as jest.Mock).mockReturnValue(requestsWithDifferentStatus);
    
    renderWithProviders(<RequestHistory />);
    
    expect(await screen.findByText('APPROVED')).toBeInTheDocument();
  });

  it('displays all status types correctly', async () => {
    const requestsWithAllStatuses: BookRequest[] = [
      { ...mockRequests[0], id: 'req-1', status: 'pending' },
      { ...mockRequests[0], id: 'req-2', status: 'approved' },
      { ...mockRequests[0], id: 'req-3', status: 'rejected' },
      { ...mockRequests[0], id: 'req-4', status: 'dispatched' },
      { ...mockRequests[0], id: 'req-5', status: 'returned' }
    ];
    (mockDataService.getRequestsByUserId as jest.Mock).mockReturnValue(requestsWithAllStatuses);
    
    renderWithProviders(<RequestHistory />);
    
    expect(await screen.findByText('PENDING')).toBeInTheDocument();
    expect(screen.getByText('APPROVED')).toBeInTheDocument();
    expect(screen.getByText('REJECTED')).toBeInTheDocument();
    expect(screen.getByText('DISPATCHED')).toBeInTheDocument();
    expect(screen.getByText('RETURNED')).toBeInTheDocument();
  });

  it('displays status descriptions correctly', async () => {
    const requestWithPendingStatus = [
      { ...mockRequests[0], status: 'pending' as const }
    ];
    (mockDataService.getRequestsByUserId as jest.Mock).mockReturnValue(requestWithPendingStatus);
    
    renderWithProviders(<RequestHistory />);
    
    expect(await screen.findByText('Your request is being reviewed by the admin')).toBeInTheDocument();
  });

  it('displays all status descriptions correctly', async () => {
    const requestsWithAllStatuses: BookRequest[] = [
      { ...mockRequests[0], id: 'req-1', status: 'pending' },
      { ...mockRequests[0], id: 'req-2', status: 'approved' },
      { ...mockRequests[0], id: 'req-3', status: 'rejected' },
      { ...mockRequests[0], id: 'req-4', status: 'dispatched' },
      { ...mockRequests[0], id: 'req-5', status: 'returned' }
    ];
    (mockDataService.getRequestsByUserId as jest.Mock).mockReturnValue(requestsWithAllStatuses);
    
    renderWithProviders(<RequestHistory />);
    
    expect(await screen.findByText('Your request is being reviewed by the admin')).toBeInTheDocument();
    expect(screen.getByText('Request approved, book will be dispatched soon')).toBeInTheDocument();
    expect(screen.getByText('Request was rejected')).toBeInTheDocument();
    expect(screen.getByText('Book has been dispatched to you')).toBeInTheDocument();
    expect(screen.getByText('Book has been returned successfully')).toBeInTheDocument();
  });

  it('displays statistics correctly', async () => {
    const requestsWithMixedStatuses: BookRequest[] = [
      { ...mockRequests[0], id: 'req-1', status: 'pending' },
      { ...mockRequests[0], id: 'req-2', status: 'pending' },
      { ...mockRequests[0], id: 'req-3', status: 'approved' },
      { ...mockRequests[0], id: 'req-4', status: 'dispatched' },
      { ...mockRequests[0], id: 'req-5', status: 'returned' },
      { ...mockRequests[0], id: 'req-6', status: 'returned' },
      { ...mockRequests[0], id: 'req-7', status: 'returned' }
    ];
    (mockDataService.getRequestsByUserId as jest.Mock).mockReturnValue(requestsWithMixedStatuses);
    
    renderWithProviders(<RequestHistory />);
    
    // Check statistics cards by finding their container elements
    await screen.findByText('Pending');
    expect(screen.getByText('Pending').parentElement?.textContent).toContain('2');
    
    expect(screen.getByText('Approved').parentElement?.textContent).toContain('1');
    expect(screen.getByText('Dispatched').parentElement?.textContent).toContain('1');
    expect(screen.getByText('Returned').parentElement?.textContent).toContain('3');
  });

  it('displays admin comments when available', async () => {
    const requestWithComments = [
      { ...mockRequests[0], adminComments: 'Please collect from library desk' }
    ];
    (mockDataService.getRequestsByUserId as jest.Mock).mockReturnValue(requestWithComments);
    
    renderWithProviders(<RequestHistory />);
    
    expect(await screen.findByText('Please collect from library desk')).toBeInTheDocument();
  });

  it('displays dispatch date when available', async () => {
    const requestWithDispatchDate = [
      { ...mockRequests[0], dispatchDate: '2023-12-05T10:00:00.000Z' }
    ];
    (mockDataService.getRequestsByUserId as jest.Mock).mockReturnValue(requestWithDispatchDate);
    
    renderWithProviders(<RequestHistory />);
    
    expect(await screen.findByText(/Dispatched:/)).toBeInTheDocument();
  });

  it('displays return date when available', async () => {
    const requestWithReturnDate = [
      { ...mockRequests[0], returnDate: '2023-12-20T14:00:00.000Z' }
    ];
    (mockDataService.getRequestsByUserId as jest.Mock).mockReturnValue(requestWithReturnDate);
    
    renderWithProviders(<RequestHistory />);
    
    expect(await screen.findByText(/Returned:/)).toBeInTheDocument();
  });

  it('displays all comment types together', async () => {
    const requestWithAllComments = [
      {
        ...mockRequests[0],
        adminComments: 'Book ready for pickup',
        dispatchDate: '2023-12-05T10:00:00.000Z',
        returnDate: '2023-12-20T14:00:00.000Z'
      }
    ];
    (mockDataService.getRequestsByUserId as jest.Mock).mockReturnValue(requestWithAllComments);
    
    renderWithProviders(<RequestHistory />);
    
    expect(await screen.findByText('Book ready for pickup')).toBeInTheDocument();
    expect(screen.getByText(/Dispatched:/)).toBeInTheDocument();
    expect(screen.getByText(/Returned:/)).toBeInTheDocument();
  });

  it('sorts requests by date descending', async () => {
    const unsortedRequests: BookRequest[] = [
      { ...mockRequests[0], id: 'req-1', requestDate: '2023-12-01T10:00:00.000Z', bookTitle: 'First Book' },
      { ...mockRequests[0], id: 'req-2', requestDate: '2023-12-03T10:00:00.000Z', bookTitle: 'Third Book' },
      { ...mockRequests[0], id: 'req-3', requestDate: '2023-12-02T10:00:00.000Z', bookTitle: 'Second Book' }
    ];
    (mockDataService.getRequestsByUserId as jest.Mock).mockReturnValue(unsortedRequests);
    
    renderWithProviders(<RequestHistory />);
    
    const bookTitles = await screen.findAllByText(/Book$/);
    // Should be sorted by date descending, so Third Book (Dec 3) should come first
    expect(bookTitles[0]).toHaveTextContent('Third Book');
    expect(bookTitles[1]).toHaveTextContent('Second Book');
    expect(bookTitles[2]).toHaveTextContent('First Book');
  });

  it('formats dates correctly', async () => {
    const requestWithSpecificDate = [
      {
        ...mockRequests[0],
        requestDate: '2023-12-01T10:00:00.000Z',
        expectedReturnDate: '2023-12-15'
      }
    ];
    (mockDataService.getRequestsByUserId as jest.Mock).mockReturnValue(requestWithSpecificDate);
    
    renderWithProviders(<RequestHistory />);
    
    // Check that dates are formatted as locale date strings
    // Note: Date formatting may vary by locale, so we check for both formats
    await screen.findByText('Test Book');
    
    // Check that date formatting is working (might be DD/MM/YYYY or MM/DD/YYYY depending on locale)
    const dateElements = screen.getByText('1/12/2023').closest('td') || screen.getByText('12/1/2023').closest('td');
    expect(dateElements).toBeInTheDocument();
    
    const returnDateElements = screen.getByText('15/12/2023').closest('td') || screen.getByText('12/15/2023').closest('td');
    expect(returnDateElements).toBeInTheDocument();
  });

  it('handles unknown status gracefully', async () => {
    const requestWithUnknownStatus = [
      { ...mockRequests[0], status: 'unknown' as any }
    ];
    (mockDataService.getRequestsByUserId as jest.Mock).mockReturnValue(requestWithUnknownStatus);
    
    renderWithProviders(<RequestHistory />);
    
    expect(await screen.findByText('UNKNOWN')).toBeInTheDocument();
  });

  it('does not display comments section when no comments available', async () => {
    const requestWithoutComments = [
      { ...mockRequests[0], adminComments: undefined, dispatchDate: undefined, returnDate: undefined }
    ];
    (mockDataService.getRequestsByUserId as jest.Mock).mockReturnValue(requestWithoutComments);
    
    renderWithProviders(<RequestHistory />);
    
    await screen.findByText('Test Book');
    expect(screen.queryByText(/Dispatched:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Returned:/)).not.toBeInTheDocument();
  });

  it('calls DataService.getRequestsByUserId with correct user ID', () => {
    renderWithProviders(<RequestHistory />);
    
    expect(mockDataService.getRequestsByUserId).toHaveBeenCalledWith('user-1');
  });

  it('does not call DataService when user is null', () => {
    jest.clearAllMocks();
    renderWithProviders(<RequestHistory />, null);
    
    expect(mockDataService.getRequestsByUserId).not.toHaveBeenCalled();
  });

  it('displays zero statistics when no requests exist', async () => {
    (mockDataService.getRequestsByUserId as jest.Mock).mockReturnValue([]);
    renderWithProviders(<RequestHistory />);
    
    // All statistics should show 0
    const zeroElements = await screen.findAllByText('0');
    expect(zeroElements).toHaveLength(4); // Four statistics cards
  });
});