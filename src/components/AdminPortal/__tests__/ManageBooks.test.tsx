import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ManageBooks from '../ManageBooks';
import { AuthContext } from '../../../contexts/AuthContext';
import { NotificationContext } from '../../../contexts/NotificationContext';
import { DataService } from '../../../services/dataService';
import type { User, Book } from '../../../types';

// Mock DataService
jest.mock('../../../services/dataService');
const mockDataService = DataService as jest.Mocked<typeof DataService>;

// Mock QuickActions component
jest.mock('../../common/QuickActions', () => {
  return function MockQuickActions() {
    return <div data-testid="quick-actions">Quick Actions</div>;
  };
});

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

describe('ManageBooks Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockDataService.getAllBooks as jest.Mock).mockReturnValue(mockBooks);
    (mockDataService.getCategories as jest.Mock).mockReturnValue(['Fiction', 'Non-Fiction', 'Science', 'History']);
    (mockDataService.addBook as jest.Mock).mockImplementation((book) => ({
      ...book,
      id: `book-${Date.now()}`
    }));
    (mockDataService.updateBook as jest.Mock).mockImplementation((id, book) => ({
      ...book,
      id
    }));
    (mockDataService.deleteBook as jest.Mock).mockReturnValue(true);
  });

  it('renders manage books page', async () => {
    renderWithProviders(<ManageBooks />);
    
    expect(screen.getByText('📚 Manage Books 📚')).toBeInTheDocument();
    expect(screen.getByText('Add New Book')).toBeInTheDocument();
  });

  it('displays books table', async () => {
    renderWithProviders(<ManageBooks />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.getByText('Test Book 2')).toBeInTheDocument();
      // Check the categories that are actually in the mock data
      expect(screen.getByText('Fiction')).toBeInTheDocument();
      expect(screen.getByText('Non-Fiction')).toBeInTheDocument();
    });
  });

  it('opens add book dialog', async () => {
    renderWithProviders(<ManageBooks />);
    
    // Click the Add New Book button (not the dialog title)
    const addButton = screen.getByRole('button', { name: /add new book/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      // Check for dialog by role
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      // Look for input fields by their exact labels with asterisks
      expect(screen.getByLabelText('Title *')).toBeInTheDocument();
      expect(screen.getByLabelText('Author *')).toBeInTheDocument();
    });
  });

  it('opens edit book dialog', async () => {
    renderWithProviders(<ManageBooks />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Click edit button for first book - look for tooltip text
    const editButtons = screen.getAllByRole('button', { name: /edit book/i });
    fireEvent.click(editButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Book')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Book 1')).toBeInTheDocument();
    });
  });

  it('adds new book successfully', async () => {
    renderWithProviders(<ManageBooks />);
    
    // Open add dialog
    const addButton = screen.getByRole('button', { name: /add new book/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Fill form
    fireEvent.change(screen.getByLabelText('Title *'), {
      target: { value: 'New Test Book' }
    });
    fireEvent.change(screen.getByLabelText('Author *'), {
      target: { value: 'New Author' }
    });
    fireEvent.change(screen.getByLabelText('ISBN *'), {
      target: { value: '1111111111' }
    });
    
    // Select category - get the combobox without name filter
    const categoryInput = screen.getByRole('combobox');
    fireEvent.mouseDown(categoryInput);
    
    await waitFor(() => {
      const fictionOptions = screen.getAllByRole('option', { name: 'Fiction' });
      fireEvent.click(fictionOptions[0]);
    });
    
    // Submit - look for the button with exact text "Add Book"
    const submitButton = screen.getByRole('button', { name: /add book/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockDataService.addBook).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Test Book',
          author: 'New Author',
          isbn: '1111111111',
          category: 'Fiction'
        })
      );
    });
  });

  it('updates book successfully', async () => {
    renderWithProviders(<ManageBooks />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Open edit dialog
    const editButtons = screen.getAllByRole('button', { name: /edit book/i });
    fireEvent.click(editButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Book 1')).toBeInTheDocument();
    });

    // Update title
    const titleInput = screen.getByDisplayValue('Test Book 1');
    fireEvent.change(titleInput, {
      target: { value: 'Updated Test Book' }
    });
    
    // Submit
    const updateButton = screen.getByText('Update Book');
    fireEvent.click(updateButton);
    
    await waitFor(() => {
      expect(mockDataService.updateBook).toHaveBeenCalledWith('1', expect.objectContaining({
        title: 'Updated Test Book'
      }));
    });
  });

  it('opens delete confirmation dialog', async () => {
    renderWithProviders(<ManageBooks />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Click delete button
    const deleteButtons = screen.getAllByRole('button', { name: /delete book/i });
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
    });
  });

  it('deletes book successfully', async () => {
    renderWithProviders(<ManageBooks />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Click delete button
    const deleteButtons = screen.getAllByRole('button', { name: /delete book/i });
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    });

    // Confirm delete
    const confirmButton = screen.getByText('Delete');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(mockDataService.deleteBook).toHaveBeenCalledWith('1');
    });
  });

  it('cancels dialog operations', async () => {
    renderWithProviders(<ManageBooks />);
    
    // Open add dialog
    const addButton = screen.getByText('Add New Book');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Add Book')).toBeInTheDocument();
    });

    // Cancel
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Add Book')).not.toBeInTheDocument();
    });
  });

  it('displays book availability status', async () => {
    renderWithProviders(<ManageBooks />);
    
    await waitFor(() => {
      // Check that availability info is shown in the summary chips
      expect(screen.getByText('Available: 2')).toBeInTheDocument();
      expect(screen.getByText('Total Books: 2')).toBeInTheDocument();
    });
  });

  it('includes QuickActions component', async () => {
    renderWithProviders(<ManageBooks />);
    
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
  });

  it('shows validation error for required fields', async () => {
    renderWithProviders(<ManageBooks />);
    
    // Open add dialog
    const addButton = screen.getByRole('button', { name: /add new book/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /add book/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockNotificationContext.addNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields'
      });
    });
  });

  it('shows validation error when available copies exceed total copies', async () => {
    renderWithProviders(<ManageBooks />);
    
    // Open add dialog
    const addButton = screen.getByRole('button', { name: /add new book/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Fill required fields
    fireEvent.change(screen.getByLabelText('Title *'), {
      target: { value: 'Test Book' }
    });
    fireEvent.change(screen.getByLabelText('Author *'), {
      target: { value: 'Test Author' }
    });
    fireEvent.change(screen.getByLabelText('ISBN *'), {
      target: { value: '1234567890' }
    });
    
    // Select category
    const categoryInput = screen.getByRole('combobox');
    fireEvent.mouseDown(categoryInput);
    
    await waitFor(() => {
      const fictionOptions = screen.getAllByRole('option', { name: 'Fiction' });
      fireEvent.click(fictionOptions[0]);
    });

    // Set invalid copy counts
    fireEvent.change(screen.getByLabelText('Total Copies *'), {
      target: { value: '5' }
    });
    fireEvent.change(screen.getByLabelText('Available Copies *'), {
      target: { value: '10' }
    });
    
    // Try to submit
    const submitButton = screen.getByRole('button', { name: /add book/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockNotificationContext.addNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Validation Error',
        message: 'Available copies cannot exceed total copies'
      });
    });
  });

  it('handles book update failure', async () => {
    (mockDataService.updateBook as jest.Mock).mockReturnValue(false);
    
    renderWithProviders(<ManageBooks />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Open edit dialog
    const editButtons = screen.getAllByRole('button', { name: /edit book/i });
    fireEvent.click(editButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Book 1')).toBeInTheDocument();
    });

    // Submit without changes (updateBook will return false)
    const updateButton = screen.getByText('Update Book');
    fireEvent.click(updateButton);
    
    await waitFor(() => {
      expect(mockDataService.updateBook).toHaveBeenCalled();
      // Since updateBook returns false, no success notification should be shown
      expect(mockNotificationContext.addNotification).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' })
      );
    });
  });

  it('handles book deletion failure', async () => {
    (mockDataService.deleteBook as jest.Mock).mockReturnValue(false);
    
    renderWithProviders(<ManageBooks />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Click delete button
    const deleteButtons = screen.getAllByRole('button', { name: /delete book/i });
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    });

    // Confirm delete
    const confirmButton = screen.getByText('Delete');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(mockNotificationContext.addNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Delete Failed',
        message: 'Failed to delete the book'
      });
    });
  });

  it('handles save operation error with try-catch', async () => {
    (mockDataService.addBook as jest.Mock).mockImplementation(() => {
      throw new Error('Database error');
    });
    
    renderWithProviders(<ManageBooks />);
    
    // Open add dialog
    const addButton = screen.getByRole('button', { name: /add new book/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Fill required fields
    fireEvent.change(screen.getByLabelText('Title *'), {
      target: { value: 'Test Book' }
    });
    fireEvent.change(screen.getByLabelText('Author *'), {
      target: { value: 'Test Author' }
    });
    fireEvent.change(screen.getByLabelText('ISBN *'), {
      target: { value: '1234567890' }
    });
    
    // Select category
    const categoryInput = screen.getByRole('combobox');
    fireEvent.mouseDown(categoryInput);
    
    await waitFor(() => {
      const fictionOptions = screen.getAllByRole('option', { name: 'Fiction' });
      fireEvent.click(fictionOptions[0]);
    });
    
    // Submit
    const submitButton = screen.getByRole('button', { name: /add book/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockNotificationContext.addNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Error',
        message: 'An error occurred while saving the book'
      });
    });
  });

  it('fills optional fields and handles publisher display', async () => {
    const bookWithPublisher = {
      ...mockBooks[0],
      publisher: 'Test Publisher',
      publishedYear: 2020
    };
    
    (mockDataService.getAllBooks as jest.Mock).mockReturnValue([bookWithPublisher]);
    
    renderWithProviders(<ManageBooks />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Publisher (2020)')).toBeInTheDocument();
    });
  });

  it('handles form field changes for all inputs', async () => {
    renderWithProviders(<ManageBooks />);
    
    // Open add dialog
    const addButton = screen.getByRole('button', { name: /add new book/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Test all form inputs
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Test description' }
    });
    
    fireEvent.change(screen.getByLabelText('Publisher'), {
      target: { value: 'Test Publisher' }
    });
    
    fireEvent.change(screen.getByLabelText('Published Year'), {
      target: { value: '2020' }
    });
    
    // Verify the form data has been updated by checking field values
    expect(screen.getByLabelText('Description')).toHaveValue('Test description');
    expect(screen.getByLabelText('Publisher')).toHaveValue('Test Publisher');
    expect(screen.getByLabelText('Published Year')).toHaveValue(2020);
  });

  it('cancels delete dialog', async () => {
    renderWithProviders(<ManageBooks />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Click delete button
    const deleteButtons = screen.getAllByRole('button', { name: /delete book/i });
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    });

    // Cancel delete - use a more specific selector for the cancel button in the delete dialog
    const cancelButtons = screen.getAllByRole('button', { name: 'Cancel' });
    const deleteCancelButton = cancelButtons.find(button => 
      button.closest('[role="dialog"]')?.textContent?.includes('Confirm Delete')
    );
    
    if (deleteCancelButton) {
      fireEvent.click(deleteCancelButton);
    }
    
    await waitFor(() => {
      expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
    });
  });

  it('displays book availability chips correctly', async () => {
    const booksWithDifferentAvailability = [
      { ...mockBooks[0], availableCopies: 5 }, // Available
      { ...mockBooks[1], availableCopies: 0 }  // Not available
    ];
    
    (mockDataService.getAllBooks as jest.Mock).mockReturnValue(booksWithDifferentAvailability);
    
    renderWithProviders(<ManageBooks />);
    
    await waitFor(() => {
      // Check availability chips
      expect(screen.getByText('5 available')).toBeInTheDocument();
      expect(screen.getByText('0 available')).toBeInTheDocument();
    });
  });
});
