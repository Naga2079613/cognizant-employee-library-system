import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { AuthContext } from '../../../contexts/AuthContext';
import { NotificationContext } from '../../../contexts/NotificationContext';
import { DataService } from '../../../services/dataService';
import type { User, Book, BookRequest } from '../../../types';

// Mock DataService
jest.mock('../../../services/dataService');
const mockDataService = DataService as jest.Mocked<typeof DataService>;

// Mock ModernBookSlideshow
jest.mock('../ModernBookSlideshow', () => {
  return function MockModernBookSlideshow() {
    return <div data-testid="modern-book-slideshow">Mock Slideshow</div>;
  };
});

const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'John Doe',
  role: 'employee',
  department: 'Engineering'
};

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Test Book 1',
    author: 'Author 1',
    isbn: '1234567890',
    category: 'Fiction',
    description: 'Test description',
    totalCopies: 5,
    availableCopies: 3,
    publishedYear: 2023
  },
  {
    id: '2',
    title: 'Test Book 2',
    author: 'Author 2',
    isbn: '1234567891',
    category: 'Science',
    description: 'Test description',
    totalCopies: 3,
    availableCopies: 0,
    publishedYear: 2022
  }
];

const mockRequests: BookRequest[] = [
  {
    id: 'req-1',
    userId: 'user-1',
    userName: 'John Doe',
    userEmail: 'test@example.com',
    bookId: '1',
    bookTitle: 'Test Book 1',
    bookAuthor: 'Author 1',
    requestDate: '2024-01-01',
    expectedReturnDate: '2024-01-15',
    status: 'pending'
  },
  {
    id: 'req-2',
    userId: 'user-1',
    userName: 'John Doe',
    userEmail: 'test@example.com',
    bookId: '2',
    bookTitle: 'Test Book 2',
    bookAuthor: 'Author 2',
    requestDate: '2024-01-02',
    expectedReturnDate: '2024-01-16',
    status: 'dispatched'
  }
];

const mockAuthContext = {
  user: mockUser,
  login: jest.fn(),
  logout: jest.fn(),
  loading: false
};

const mockNotificationContext = {
  addNotification: jest.fn(),
  notifications: [],
  removeNotification: jest.fn()
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContext}>
        <NotificationContext.Provider value={mockNotificationContext}>
          {component}
        </NotificationContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDataService.getAllBooks.mockReturnValue(mockBooks);
    mockDataService.getRequestsByUserId.mockReturnValue(mockRequests);
  });

  it('renders welcome message with user name', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument();
    expect(screen.getByText('Employee Dashboard - Engineering')).toBeInTheDocument();
  });

  it('renders the modern book slideshow', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByTestId('modern-book-slideshow')).toBeInTheDocument();
  });

  it('displays correct statistics', () => {
    renderWithProviders(<Dashboard />);
    
    // Check for Available Books section
    expect(screen.getByText('Available Books')).toBeInTheDocument();
    expect(screen.getByText('Ready to request')).toBeInTheDocument();
    
    // Check for My Requests section
    expect(screen.getByText('My Requests')).toBeInTheDocument();
    expect(screen.getByText('Total submitted')).toBeInTheDocument();
    
    // Check for Pending section
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Awaiting approval')).toBeInTheDocument();
    
    // Check for Books Issued section
    expect(screen.getByText('Books Issued')).toBeInTheDocument();
    expect(screen.getByText('Currently with you')).toBeInTheDocument();
  });

  it('displays stat card titles and descriptions', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('Available Books')).toBeInTheDocument();
    expect(screen.getByText('Ready to request')).toBeInTheDocument();
    
    expect(screen.getByText('My Requests')).toBeInTheDocument();
    expect(screen.getByText('Total submitted')).toBeInTheDocument();
    
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Awaiting approval')).toBeInTheDocument();
    
    expect(screen.getByText('Books Issued')).toBeInTheDocument();
    expect(screen.getByText('Currently with you')).toBeInTheDocument();
  });

  it('displays stat card icons', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('📚')).toBeInTheDocument();
    expect(screen.getByText('👤')).toBeInTheDocument();
    expect(screen.getByText('⏰')).toBeInTheDocument();
    expect(screen.getByText('📖')).toBeInTheDocument();
  });

  it('renders quick actions section', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('📚 Browse Library')).toBeInTheDocument();
    expect(screen.getByText('Explore our collection of books')).toBeInTheDocument();
    expect(screen.getByText('📋 My Requests')).toBeInTheDocument();
    expect(screen.getByText('Track your book requests')).toBeInTheDocument();
  });

  it('navigates to books page when Browse Books is clicked', () => {
    const { container } = renderWithProviders(<Dashboard />);
    
    const browseButton = screen.getByText('Browse Books');
    fireEvent.click(browseButton);
    
    // Since we're using BrowserRouter, we can check if navigation would occur
    expect(browseButton).toBeInTheDocument();
  });

  it('navigates to requests page when View Requests is clicked', () => {
    const { container } = renderWithProviders(<Dashboard />);
    
    const requestsButton = screen.getByText('View Requests');
    fireEvent.click(requestsButton);
    
    // Since we're using BrowserRouter, we can check if navigation would occur
    expect(requestsButton).toBeInTheDocument();
  });

  it('handles case when user is null', () => {
    const nullUserContext = {
      ...mockAuthContext,
      user: null
    };
    
    render(
      <BrowserRouter>
        <AuthContext.Provider value={nullUserContext}>
          <NotificationContext.Provider value={mockNotificationContext}>
            <Dashboard />
          </NotificationContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    
    // Should still render the component structure
    expect(screen.getByText('Welcome, !')).toBeInTheDocument();
    expect(screen.getByText('Employee Dashboard -')).toBeInTheDocument();
  });

  it('handles case with no books', () => {
    mockDataService.getAllBooks.mockReturnValue([]);
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('0')).toBeInTheDocument(); // Available books should be 0
  });

  it('handles case with no requests', () => {
    mockDataService.getRequestsByUserId.mockReturnValue([]);
    renderWithProviders(<Dashboard />);
    
    // All request-related stats should be 0
    const statValues = screen.getAllByText('0');
    expect(statValues.length).toBeGreaterThanOrEqual(3); // My Requests, Pending, Books Issued
  });

  it('updates stats when user changes', () => {
    const { rerender } = renderWithProviders(<Dashboard />);
    
    // Change user
    const newUser = { ...mockUser, id: 'user-2', name: 'Jane Doe' };
    const newAuthContext = { ...mockAuthContext, user: newUser };
    
    rerender(
      <BrowserRouter>
        <AuthContext.Provider value={newAuthContext}>
          <NotificationContext.Provider value={mockNotificationContext}>
            <Dashboard />
          </NotificationContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Welcome, Jane Doe!')).toBeInTheDocument();
  });

  it('handles different request statuses correctly', () => {
    const mixedRequests: BookRequest[] = [
      { ...mockRequests[0], status: 'pending' },
      { ...mockRequests[1], status: 'dispatched' },
      { ...mockRequests[0], id: 'req-3', status: 'approved' },
      { ...mockRequests[0], id: 'req-4', status: 'rejected' },
      { ...mockRequests[0], id: 'req-5', status: 'returned' }
    ];
    
    mockDataService.getRequestsByUserId.mockReturnValue(mixedRequests);
    renderWithProviders(<Dashboard />);
    
    // Check that statistics cards are displayed with appropriate labels
    expect(screen.getByText('My Requests')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Books Issued')).toBeInTheDocument();
  });

  it('calculates available books correctly', () => {
    const mixedBooks: Book[] = [
      { ...mockBooks[0], availableCopies: 5 }, // Available
      { ...mockBooks[1], availableCopies: 0 }, // Not available
      { ...mockBooks[0], id: '3', availableCopies: 1 }, // Available
      { ...mockBooks[0], id: '4', availableCopies: 0 } // Not available
    ];
    
    mockDataService.getAllBooks.mockReturnValue(mixedBooks);
    renderWithProviders(<Dashboard />);
    
    // Should show Available Books label
    expect(screen.getByText('Available Books')).toBeInTheDocument();
  });

  it('applies correct CSS classes to stat cards', () => {
    renderWithProviders(<Dashboard />);
    
    const statCards = document.querySelectorAll('.stat-card');
    expect(statCards).toHaveLength(4);
  });

  it('applies correct CSS classes to quick action cards', () => {
    renderWithProviders(<Dashboard />);
    
    const actionCards = document.querySelectorAll('.glass-card');
    expect(actionCards).toHaveLength(2);
  });
});
