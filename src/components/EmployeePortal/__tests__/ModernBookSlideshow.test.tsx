import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ModernBookSlideshow from '../ModernBookSlideshow';
import { AuthContext } from '../../../contexts/AuthContext';
import { NotificationContext } from '../../../contexts/NotificationContext';
import { DataService } from '../../../services/dataService';
import type { User, Book } from '../../../types';

// Mock DataService
jest.mock('../../../services/dataService');
const mockDataService = DataService as jest.Mocked<typeof DataService>;

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Test Book 1',
    author: 'Author 1',
    isbn: '1234567890',
    category: 'Fiction',
    description: 'A test book',
    publishedYear: 2023,
    totalCopies: 5,
    availableCopies: 3,
    imageUrl: 'test-image-1.jpg'
  },
  {
    id: '2',
    title: 'Test Book 2',
    author: 'Author 2',
    isbn: '0987654321',
    category: 'Non-Fiction',
    description: 'Another test book',
    publishedYear: 2022,
    totalCopies: 3,
    availableCopies: 1,
    imageUrl: 'test-image-2.jpg'
  }
];

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

const renderWithProviders = (component: React.ReactElement) => {
  const authValue = {
    user: mockUser,
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

describe('ModernBookSlideshow Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockDataService.getAllBooks as jest.Mock).mockReturnValue(mockBooks);
    (mockDataService.createRequest as jest.Mock).mockReturnValue({
      id: 'req-1',
      userId: 'user-1',
      userName: 'Test User',
      userEmail: 'test@example.com',
      bookId: '1',
      bookTitle: 'Test Book 1',
      bookAuthor: 'Author 1',
      requestDate: '2023-12-01',
      status: 'pending',
      expectedReturnDate: '2023-12-15'
    });
  });

  it('renders slideshow with books', async () => {
    renderWithProviders(<ModernBookSlideshow />);
    
    // Wait for books to load - check for any book content (randomized)
    await waitFor(() => {
      const hasTestBook1 = screen.queryByText('Test Book 1');
      const hasTestBook2 = screen.queryByText('Test Book 2');
      expect(hasTestBook1 || hasTestBook2).toBeTruthy();
    });
  });

  it('displays book information', async () => {
    renderWithProviders(<ModernBookSlideshow />);
    
    await waitFor(() => {
      // Should have request button regardless of which book is shown
      expect(screen.getByText('Request This Book')).toBeInTheDocument();
    });

    // Should display availability status
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('handles navigation buttons', async () => {
    renderWithProviders(<ModernBookSlideshow />);
    
    await waitFor(() => {
      expect(screen.getByText('Request This Book')).toBeInTheDocument();
    });

    // Test navigation buttons - they show arrow symbols
    const prevButton = screen.getByText('←');
    const nextButton = screen.getByText('→');
    
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    
    fireEvent.click(nextButton);
    fireEvent.click(prevButton);
  });

  it('opens modal when request button is clicked', async () => {
    renderWithProviders(<ModernBookSlideshow />);
    
    await waitFor(() => {
      expect(screen.getByText('Request This Book')).toBeInTheDocument();
    });

    const requestButton = screen.getByText('Request This Book');
    fireEvent.click(requestButton);
    
    // Check if modal opens - correct modal title
    expect(screen.getByText('Request Book')).toBeInTheDocument();
    expect(screen.getByText('Submit Request')).toBeInTheDocument();
  });

  it('submits book request successfully', async () => {
    renderWithProviders(<ModernBookSlideshow />);
    
    await waitFor(() => {
      expect(screen.getByText('Request This Book')).toBeInTheDocument();
    });

    // Open modal
    const requestButton = screen.getByText('Request This Book');
    fireEvent.click(requestButton);
    
    // Submit request
    const confirmButton = screen.getByText('Submit Request');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(mockDataService.createRequest).toHaveBeenCalled();
    });
  });

  it('handles empty state when no books available', async () => {
    (mockDataService.getAllBooks as jest.Mock).mockReturnValue([]);
    renderWithProviders(<ModernBookSlideshow />);
    
    // With no books, the component should not crash but won't show slideshow
    await waitFor(() => {
      expect(screen.queryByText('Request This Book')).not.toBeInTheDocument();
    });
  });

  it('closes modal when cancel button is clicked', async () => {
    renderWithProviders(<ModernBookSlideshow />);
    
    await waitFor(() => {
      expect(screen.getByText('Request This Book')).toBeInTheDocument();
    });

    // Open modal
    const requestButton = screen.getByText('Request This Book');
    fireEvent.click(requestButton);
    
    expect(screen.getByText('Request Book')).toBeInTheDocument();
    
    // Close modal
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Request Book')).not.toBeInTheDocument();
    });
  });

  it('shows book details in modal', async () => {
    renderWithProviders(<ModernBookSlideshow />);
    
    await waitFor(() => {
      expect(screen.getByText('Request This Book')).toBeInTheDocument();
    });

    // Open modal
    const requestButton = screen.getByText('Request This Book');
    fireEvent.click(requestButton);
    
    // Check modal contains book information
    expect(screen.getByText('Request Book')).toBeInTheDocument();
    expect(screen.getByLabelText('Additional Notes (Optional)')).toBeInTheDocument();
  });
});