import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from '../Dashboard';
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
    availableCopies: 0,
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

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockDataService.getAllBooks as jest.Mock).mockReturnValue(mockBooks);
    (mockDataService.getAllRequests as jest.Mock).mockReturnValue([
      { id: '1', status: 'pending' },
      { id: '2', status: 'approved' },
      { id: '3', status: 'dispatched' },
      { id: '4', status: 'returned' },
      { id: '5', status: 'pending' }
    ]);
  });

  it('renders dashboard title', async () => {
    renderWithProviders(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Admin Dashboard/)).toBeInTheDocument();
    });
  });

  it('displays book statistics', async () => {
    renderWithProviders(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getAllByText('Total Books')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Available Books')[0]).toBeInTheDocument();
      // Check that stats are displayed - use more specific text combinations
      const totalBooksElements = screen.getAllByText('2');
      expect(totalBooksElements.length).toBeGreaterThan(0);
      const availableElements = screen.getAllByText('1');
      expect(availableElements.length).toBeGreaterThan(0);
    });
  });

  it('displays request statistics', async () => {
    renderWithProviders(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Requests')).toBeInTheDocument();
      expect(screen.getAllByText('Pending')[0]).toBeInTheDocument();
      // Use getAllByText for numbers that might appear multiple times
      const numberElements = screen.getAllByText('5');
      expect(numberElements.length).toBeGreaterThan(0);
    });
  });

  it('displays user greeting', async () => {
    renderWithProviders(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Admin User!/)).toBeInTheDocument();
    });
  });

  it('shows progress indicators', async () => {
    renderWithProviders(<AdminDashboard />);
    
    await waitFor(() => {
      // Check for progress bar elements by their styling
      const progressBars = document.querySelectorAll('.bg-gradient-to-r');
      expect(progressBars.length).toBeGreaterThan(0);
    });
  });

  it('handles empty data gracefully', async () => {
    (mockDataService.getAllBooks as jest.Mock).mockReturnValue([]);
    (mockDataService.getAllRequests as jest.Mock).mockReturnValue([]);

    renderWithProviders(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getAllByText('Total Books')[0]).toBeInTheDocument();
      // Use getAllByText for numbers that appear multiple times
      const zeroElements = screen.getAllByText('0');
      expect(zeroElements.length).toBeGreaterThan(0);
    });
  });

  it('displays all stat cards', async () => {
    renderWithProviders(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getAllByText('Total Books')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Available Books')[0]).toBeInTheDocument();
      expect(screen.getByText('Total Requests')).toBeInTheDocument();
      expect(screen.getAllByText('Pending')[0]).toBeInTheDocument();
      // Check for text that actually exists in the component
      expect(screen.getAllByText('Approved')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Dispatched')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Returned')[0]).toBeInTheDocument();
    });
  });
});
