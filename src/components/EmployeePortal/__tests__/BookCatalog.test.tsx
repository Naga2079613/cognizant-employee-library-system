// @ts-nocheck
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BookCatalog from '../BookCatalog';
import { AuthContext } from '../../../contexts/AuthContext';
import { NotificationContext } from '../../../contexts/NotificationContext';
import { DataService } from '../../../services/dataService';
import type { Book, User, BookRequest } from '../../../types';

// Mock the DataService
jest.mock('../../../services/dataService', () => ({
  DataService: {
    getAllBooks: jest.fn(),
    createRequest: jest.fn(),
  },
}));

const mockDataService = DataService as jest.Mocked<typeof DataService>;

// Mock data
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Test Book 1',
    author: 'Test Author 1',
    category: 'Fiction',
    description: 'A great test book',
    availableCopies: 2,
    totalCopies: 5,
    isbn: '123456789',
    publishedYear: 2023,
  },
  {
    id: '2',
    title: 'Test Book 2',
    author: 'Test Author 2',
    category: 'Non-Fiction',
    description: 'Another great test book',
    availableCopies: 0,
    totalCopies: 3,
    isbn: '987654321',
    publishedYear: 2022,
  },
];

const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'employee',
  department: 'IT',
  employeeId: 'EMP001',
};

const mockBookRequest: BookRequest = {
  id: '1',
  userId: '1',
  userName: 'Test User',
  userEmail: 'test@example.com',
  bookId: '1',
  bookTitle: 'Test Book 1',
  bookAuthor: 'Test Author 1',
  requestDate: '2025-08-07T00:00:00.000Z',
  expectedReturnDate: '2025-08-14',
  status: 'pending',
};

// Mock notification context
const mockAddNotification = jest.fn();

const mockNotificationContext = {
  notifications: [],
  addNotification: mockAddNotification,
  removeNotification: jest.fn(),
};

const mockAuthContext = {
  user: mockUser,
  login: jest.fn(),
  logout: jest.fn(),
  loading: false,
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AuthContext.Provider value={mockAuthContext}>
      <NotificationContext.Provider value={mockNotificationContext}>
        {children}
      </NotificationContext.Provider>
    </AuthContext.Provider>
  </MemoryRouter>
);

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestWrapper });
};

describe('BookCatalog Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock window.scrollTo for all tests
    Object.defineProperty(window, 'scrollTo', {
      value: jest.fn(),
      writable: true
    });
    
    mockDataService.getAllBooks.mockReturnValue(mockBooks);
    mockDataService.createRequest.mockReturnValue(mockBookRequest);
  });

  test('renders book catalog with header and search elements', () => {
    renderWithProviders(<BookCatalog />);
    
    expect(screen.getByText('📚 Book Catalog 📚')).toBeInTheDocument();
    expect(screen.getByText('Browse and request books from our library')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search books by title, author, or category...')).toBeInTheDocument();
  });

  test('displays books in the catalog', () => {
    renderWithProviders(<BookCatalog />);
    
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.getByText('by Test Author 1')).toBeInTheDocument();
    expect(screen.getByText('Test Book 2')).toBeInTheDocument();
    expect(screen.getByText('by Test Author 2')).toBeInTheDocument();
  });

  test('shows correct availability status for books', () => {
    renderWithProviders(<BookCatalog />);
    
    expect(screen.getByText('✅ Available')).toBeInTheDocument();
    expect(screen.getByText('❌ Out of Stock')).toBeInTheDocument();
  });

  test('shows correct availability count', () => {
    renderWithProviders(<BookCatalog />);
    
    expect(screen.getByText('2 of 5')).toBeInTheDocument();
    expect(screen.getByText('0 of 3')).toBeInTheDocument();
  });

  test('enables request button for available books', () => {
    renderWithProviders(<BookCatalog />);
    
    const requestButtons = screen.getAllByText('📋 Request Book');
    expect(requestButtons).toHaveLength(1);
    expect(requestButtons[0]).not.toBeDisabled();
  });

  test('disables request button for unavailable books', () => {
    renderWithProviders(<BookCatalog />);
    
    const unavailableButtons = screen.getAllByText('❌ Not Available');
    expect(unavailableButtons).toHaveLength(1);
    expect(unavailableButtons[0]).toBeDisabled();
  });

  test('filters books by search query', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookCatalog />);
    
    const searchInput = screen.getByPlaceholderText('Search books by title, author, or category...');
    await user.type(searchInput, 'Test Book 1');
    
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Book 2')).not.toBeInTheDocument();
  });

  test('filters books by category', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookCatalog />);
    
    const categorySelect = screen.getByDisplayValue('All Categories');
    await user.selectOptions(categorySelect, 'Fiction');
    
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Book 2')).not.toBeInTheDocument();
  });

  test('opens request dialog when request button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookCatalog />);
    
    const requestButton = screen.getByText('📋 Request Book');
    await user.click(requestButton);
    
    await waitFor(() => {
      expect(screen.getByText('Request Book')).toBeInTheDocument();
    });
  });

  test('submits book request successfully', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookCatalog />);
    
    // Open dialog
    const requestButton = screen.getByText('📋 Request Book');
    await user.click(requestButton);
    
    await waitFor(() => {
      expect(screen.getByText('Request Book')).toBeInTheDocument();
    });
    
    // Select date
    const dateInput = screen.getByLabelText('Expected Return Date *');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split('T')[0];
    
    await user.type(dateInput, dateString);
    
    // Submit request
    const submitButton = screen.getByText('🚀 Submit Request');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockDataService.createRequest).toHaveBeenCalledWith({
        userId: mockUser.id,
        userName: mockUser.name,
        userEmail: mockUser.email,
        bookId: mockBooks[0].id,
        bookTitle: mockBooks[0].title,
        bookAuthor: mockBooks[0].author,
        expectedReturnDate: dateString,
      });
    });
    
    expect(mockAddNotification).toHaveBeenCalledWith({
      type: 'success',
      title: 'Success',
      message: 'Book request submitted successfully!'
    });
  });

  test('handles request submission failure', async () => {
    const user = userEvent.setup();
    mockDataService.createRequest.mockImplementation(() => {
      throw new Error('Request failed');
    });
    
    renderWithProviders(<BookCatalog />);
    
    // Open dialog
    const requestButton = screen.getByText('📋 Request Book');
    await user.click(requestButton);
    
    await waitFor(() => {
      expect(screen.getByText('Request Book')).toBeInTheDocument();
    });
    
    // Select date
    const dateInput = screen.getByLabelText('Expected Return Date *');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split('T')[0];
    
    await user.type(dateInput, dateString);
    
    // Submit request
    const submitButton = screen.getByText('🚀 Submit Request');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockAddNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Error',
        message: 'Failed to submit book request. Please try again.'
      });
    });
  });

  test('closes dialog when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookCatalog />);
    
    // Open dialog
    const requestButton = screen.getByText('📋 Request Book');
    await user.click(requestButton);
    
    await waitFor(() => {
      expect(screen.getByText('Request Book')).toBeInTheDocument();
    });
    
    // Click cancel
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Request Book')).not.toBeInTheDocument();
    });
  });

  test('disables submit button when no date is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookCatalog />);
    
    // Open dialog
    const requestButton = screen.getByText('📋 Request Book');
    await user.click(requestButton);
    
    await waitFor(() => {
      expect(screen.getByText('Select Date First')).toBeInTheDocument();
    });
    
    const submitButton = screen.getByText('Select Date First');
    expect(submitButton).toBeDisabled();
  });

  test('shows no books found message when no books match filters', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookCatalog />);
    
    const searchInput = screen.getByPlaceholderText('Search books by title, author, or category...');
    await user.type(searchInput, 'Nonexistent Book');
    
    expect(screen.getByText('No books found matching your criteria')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search terms or filters')).toBeInTheDocument();
  });

  test('resets to first page when filters change', async () => {
    const user = userEvent.setup();
    
    // Create enough books to trigger pagination
    const manyBooks: Book[] = Array.from({ length: 50 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Test Book ${i + 1}`,
      author: `Test Author ${i + 1}`,
      category: i % 2 === 0 ? 'Fiction' : 'Non-Fiction',
      description: `A great test book ${i + 1}`,
      availableCopies: 1,
      totalCopies: 1,
      isbn: `123456789${i}`,
      publishedYear: 2023,
    }));
    
    mockDataService.getAllBooks.mockReturnValue(manyBooks);
    
    renderWithProviders(<BookCatalog />);
    
    // Should show pagination controls
    await waitFor(() => {
      expect(screen.getByText('Next →')).toBeInTheDocument();
    });
    
    // Go to page 2
    const nextButton = screen.getByText('Next →');
    await user.click(nextButton);
    
    // Wait for page 2 to be displayed
    await waitFor(() => {
      expect(screen.getByText(/• Page 2 of/)).toBeInTheDocument();
    });
    
    // Apply a filter
    const searchInput = screen.getByPlaceholderText('Search books by title, author, or category...');
    await user.clear(searchInput);
    await user.type(searchInput, 'Test Book 1');
    
    // Should reset to page 1 - check that pagination info no longer shows page info (since results fit on one page)
    await waitFor(() => {
      expect(screen.queryByText(/• Page/)).not.toBeInTheDocument();
    });
  });

  test('handles pagination correctly', async () => {
    const user = userEvent.setup();
    
    // Create enough books to trigger pagination
    const manyBooks: Book[] = Array.from({ length: 50 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Test Book ${i + 1}`,
      author: `Test Author ${i + 1}`,
      category: 'Fiction',
      description: `A great test book ${i + 1}`,
      availableCopies: 1,
      totalCopies: 1,
      isbn: `123456789${i}`,
      publishedYear: 2023,
    }));
    
    mockDataService.getAllBooks.mockReturnValue(manyBooks);
    
    renderWithProviders(<BookCatalog />);
    
    // Should show pagination controls
    await waitFor(() => {
      expect(screen.getByText('Next →')).toBeInTheDocument();
      expect(screen.getByText('← Previous')).toBeInTheDocument();
    });
    
    // First page should show books 1-40
    expect(screen.getByText('Showing 1-40 of 50 books')).toBeInTheDocument();
    expect(screen.getByText(/• Page 1 of 2/)).toBeInTheDocument();
    
    // Previous button should be disabled on first page
    expect(screen.getByText('← Previous')).toBeDisabled();
    
    // Go to next page
    const nextButton = screen.getByText('Next →');
    await user.click(nextButton);
    
    // Should show remaining books
    await waitFor(() => {
      expect(screen.getByText('Showing 41-50 of 50 books')).toBeInTheDocument();
      expect(screen.getByText(/• Page 2 of 2/)).toBeInTheDocument();
    });
    
    // Next button should be disabled on last page
    expect(screen.getByText('Next →')).toBeDisabled();
    
    // Previous button should be enabled
    const prevButton = screen.getByText('← Previous');
    expect(prevButton).not.toBeDisabled();
    
    // Go back to first page
    await user.click(prevButton);
    
    await waitFor(() => {
      expect(screen.getByText(/• Page 1 of 2/)).toBeInTheDocument();
    });
  });

  test('handles page number clicks', async () => {
    const user = userEvent.setup();
    
    // Create enough books to trigger pagination with multiple pages
    const manyBooks: Book[] = Array.from({ length: 200 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Test Book ${i + 1}`,
      author: `Test Author ${i + 1}`,
      category: 'Fiction',
      description: `A great test book ${i + 1}`,
      availableCopies: 1,
      totalCopies: 1,
      isbn: `123456789${i}`,
      publishedYear: 2023,
    }));
    
    mockDataService.getAllBooks.mockReturnValue(manyBooks);
    
    renderWithProviders(<BookCatalog />);
    
    // Should show pagination controls
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
    
    // Click on page 2
    const page2Button = screen.getByText('2');
    await user.click(page2Button);
    
    await waitFor(() => {
      expect(screen.getByText(/• Page 2 of 5/)).toBeInTheDocument();
    });
  });

  test('filters by category and search combined', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookCatalog />);
    
    // Apply category filter
    const categorySelect = screen.getByDisplayValue('All Categories');
    await user.selectOptions(categorySelect, 'Fiction');
    
    // Apply search filter
    const searchInput = screen.getByPlaceholderText('Search books by title, author, or category...');
    await user.type(searchInput, 'Test Book 1');
    
    // Should show Test Book 1 only (Fiction category)
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Book 2')).not.toBeInTheDocument();
  });

  test('handles empty books array', () => {
    mockDataService.getAllBooks.mockReturnValue([]);
    
    renderWithProviders(<BookCatalog />);
    
    expect(screen.getByText('No books found matching your criteria')).toBeInTheDocument();
  });

  test('handles missing user context', async () => {
    const user = userEvent.setup();
    
    const mockAuthContextNoUser = {
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      loading: false,
    };

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContextNoUser}>
          <NotificationContext.Provider value={mockNotificationContext}>
            <BookCatalog />
          </NotificationContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    
    // Open dialog
    const requestButton = screen.getByText('📋 Request Book');
    await user.click(requestButton);
    
    await waitFor(() => {
      expect(screen.getByText('Request Book')).toBeInTheDocument();
    });
    
    // Select date
    const dateInput = screen.getByLabelText('Expected Return Date *');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split('T')[0];
    
    await user.type(dateInput, dateString);
    
    // Try to submit request - should not call createRequest
    const submitButton = screen.getByText('🚀 Submit Request');
    await user.click(submitButton);
    
    // Should not have called createRequest
    expect(mockDataService.createRequest).not.toHaveBeenCalled();
  });

  test('handles failed book request submission returning null', async () => {
    const user = userEvent.setup();
    mockDataService.createRequest.mockReturnValue(null);
    
    renderWithProviders(<BookCatalog />);
    
    // Open dialog
    const requestButton = screen.getByText('📋 Request Book');
    await user.click(requestButton);
    
    await waitFor(() => {
      expect(screen.getByText('Request Book')).toBeInTheDocument();
    });
    
    // Select date
    const dateInput = screen.getByLabelText('Expected Return Date *');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split('T')[0];
    
    await user.type(dateInput, dateString);
    
    // Submit request
    const submitButton = screen.getByText('🚀 Submit Request');
    await user.click(submitButton);
    
    // Should not show success notification for null result
    expect(mockAddNotification).not.toHaveBeenCalledWith({
      type: 'success',
      title: 'Success',
      message: 'Book request submitted successfully!'
    });
  });

  test('scrolls to top when navigating pages', async () => {
    const user = userEvent.setup();
    
    // Mock window.scrollTo
    const mockScrollTo = jest.fn();
    Object.defineProperty(window, 'scrollTo', {
      value: mockScrollTo,
      writable: true
    });
    
    // Create enough books to trigger pagination
    const manyBooks: Book[] = Array.from({ length: 50 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Test Book ${i + 1}`,
      author: `Test Author ${i + 1}`,
      category: 'Fiction',
      description: `A great test book ${i + 1}`,
      availableCopies: 1,
      totalCopies: 1,
      isbn: `123456789${i}`,
      publishedYear: 2023,
    }));
    
    mockDataService.getAllBooks.mockReturnValue(manyBooks);
    
    renderWithProviders(<BookCatalog />);
    
    // Clear any initial scrollTo calls
    mockScrollTo.mockClear();
    
    // Go to next page
    const nextButton = screen.getByText('Next →');
    await user.click(nextButton);
    
    // Should have called scrollTo
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  test('refreshes books data after successful request', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookCatalog />);
    
    // Open dialog
    const requestButton = screen.getByText('📋 Request Book');
    await user.click(requestButton);
    
    await waitFor(() => {
      expect(screen.getByText('Request Book')).toBeInTheDocument();
    });
    
    // Select date
    const dateInput = screen.getByLabelText('Expected Return Date *');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split('T')[0];
    
    await user.type(dateInput, dateString);
    
    // Submit request
    const submitButton = screen.getByText('🚀 Submit Request');
    await user.click(submitButton);
    
    await waitFor(() => {
      // Should have called getAllBooks twice: once on mount, once after successful request
      expect(mockDataService.getAllBooks).toHaveBeenCalledTimes(2);
    });
  });
});
