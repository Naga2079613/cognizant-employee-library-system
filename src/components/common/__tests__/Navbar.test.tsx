// @ts-nocheck
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';
import { AuthProvider } from '../../../contexts/AuthContext';
import { NotificationProvider } from '../../../contexts/NotificationContext';

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockLocation = { pathname: '/employee' };
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'employee' as const,
  department: 'IT',
};

const mockAdminUser = {
  id: 2,
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin' as const,
  department: 'Administration',
};

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </AuthProvider>
  </BrowserRouter>
);

// Custom render function with providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestWrapper });
};

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when user is not logged in', () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    expect(screen.queryByText('Cognizant Digital Library')).not.toBeInTheDocument();
  });

  test('does not render on login page', () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(null), // No user in localStorage
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    // Use MemoryRouter to simulate being on login page
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <NotificationProvider>
            <Navbar />
          </NotificationProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    
    expect(screen.queryByText('Cognizant Digital Library')).not.toBeInTheDocument();
  });

  test('renders navbar with employee user', () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('Cognizant Digital Library')).toBeInTheDocument();
    expect(screen.getByText('Employee Portal')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('renders navbar with admin user', () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockAdminUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('Cognizant Digital Library')).toBeInTheDocument();
    expect(screen.getByText('Admin Portal')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();
  });

  test('displays employee navigation links', () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    // Use getAllByText to handle multiple instances (desktop + mobile)
    expect(screen.getAllByText('🏠 Dashboard')).toHaveLength(2);
    expect(screen.getByText('📚 Browse Books')).toBeInTheDocument();
    expect(screen.getByText('📋 My Requests')).toBeInTheDocument();
  });

  test('displays admin navigation links', () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockAdminUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    // Use getAllByText to handle multiple instances (desktop + mobile)
    expect(screen.getAllByText('🏠 Dashboard')).toHaveLength(2);
    expect(screen.getByText('📚 Manage Books')).toBeInTheDocument();
    expect(screen.getByText('📋 Manage Requests')).toBeInTheDocument();
  });

  test('navigates to employee dashboard when clicked', async () => {
    const user = userEvent.setup();
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    // Get the first dashboard button (desktop version)
    const dashboardButtons = screen.getAllByText('🏠 Dashboard');
    await user.click(dashboardButtons[0]);
    
    expect(mockNavigate).toHaveBeenCalledWith('/employee');
  });

  test('navigates to books page when clicked', async () => {
    const user = userEvent.setup();
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    const booksButton = screen.getByText('📚 Browse Books');
    await user.click(booksButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/employee/books');
  });

  test('navigates to requests page when clicked', async () => {
    const user = userEvent.setup();
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    const requestsButton = screen.getByText('📋 My Requests');
    await user.click(requestsButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/employee/requests');
  });

  test('navigates to admin dashboard when clicked', async () => {
    const user = userEvent.setup();
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockAdminUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    // Get the first dashboard button (desktop version)
    const dashboardButtons = screen.getAllByText('🏠 Dashboard');
    await user.click(dashboardButtons[0]);
    
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  test('navigates to admin books page when clicked', async () => {
    const user = userEvent.setup();
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockAdminUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    const booksButton = screen.getByText('📚 Manage Books');
    await user.click(booksButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/admin/books');
  });

  test('navigates to admin requests page when clicked', async () => {
    const user = userEvent.setup();
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockAdminUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    const requestsButton = screen.getByText('📋 Manage Requests');
    await user.click(requestsButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/admin/requests');
  });

  test('displays user info and logout button', async () => {
    const user = userEvent.setup();
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('employee')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  test('logs out user when logout button is clicked', async () => {
    const user = userEvent.setup();
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    const logoutButton = screen.getByText('Sign Out');
    await user.click(logoutButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('shows logout button', async () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  test('shows user name and role', async () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('employee')).toBeInTheDocument();
  });

  test('logs out user when logout button is clicked', async () => {
    const user = userEvent.setup();
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    // Click logout button directly
    const logoutButton = screen.getByText('Sign Out');
    await user.click(logoutButton);
    
    // Verify navigation to login
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('displays user avatar with first letter of name', () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  test('shows user info in navbar', async () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('employee')).toBeInTheDocument();
  });

  test('shows user info for admin user', async () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockAdminUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  test('highlights active navigation link', () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    // Get the first dashboard button (desktop version) and check if it has active classes
    const dashboardButtons = screen.getAllByText('🏠 Dashboard');
    expect(dashboardButtons[0]).toHaveClass('bg-primary-100', 'text-primary-700');
  });

  test('highlights active navigation link for different paths', () => {
    // Test with different location
    mockLocation.pathname = '/admin/books';
    
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockAdminUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    // The admin/books path should be highlighted
    const booksButton = screen.getByText('📚 Manage Books');
    expect(booksButton).toHaveClass('bg-primary-100', 'text-primary-700');
  });

  test('shows mobile navigation on small screens', () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    // Mobile navigation should have the mobile-specific classes
    const mobileNav = screen.getByText('📚 Books'); // Mobile version of Browse Books
    expect(mobileNav).toBeInTheDocument();
  });

  test('mobile navigation works for employee', async () => {
    const user = userEvent.setup();
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    // Click mobile dashboard button (second one)
    const dashboardButtons = screen.getAllByText('🏠 Dashboard');
    await user.click(dashboardButtons[1]); // Mobile version
    
    expect(mockNavigate).toHaveBeenCalledWith('/employee');
  });

  test('mobile navigation works for admin', async () => {
    const user = userEvent.setup();
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockAdminUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    // Click mobile books button
    const booksButton = screen.getByText('📚 Books'); // Mobile version
    await user.click(booksButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/admin/books');
  });

  test('renders navigation elements correctly', () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    // Check for avatar, user info, and logout button
    expect(screen.getByText('J')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });
  test('displays simple logout button interface', () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProviders(<Navbar />);
    
    // The current implementation has a simple logout button
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
    
    // Check that the logout button has the correct structure
    const logoutButton = screen.getByText('Sign Out');
    expect(logoutButton.closest('button')).toHaveAttribute('title', 'Sign Out');
  });

});

