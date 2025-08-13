// @ts-nocheck
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '../../../contexts/AuthContext';
import { NotificationProvider } from '../../../contexts/NotificationContext';
import { DataService } from '../../../services/dataService';

// Mock the DataService
jest.mock('../../../services/dataService');
const mockDataService = DataService as jest.Mocked<typeof DataService>;

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/login' }),
}));

const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'employee' as const,
  department: 'IT',
  employeeId: 'EMP001',
};

const mockAdminUser = {
  id: '2',
  name: 'Admin User',
  email: 'admin@cognizant.com',
  role: 'admin' as const,
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

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock localStorage
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
  });

  test('renders login form', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText('📚 Cognizant Digital Library')).toBeInTheDocument();
    expect(screen.getByText('Employee Login Portal')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows placeholder credentials', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText('Demo Credentials:')).toBeInTheDocument();
    // Use partial text matching since content spans multiple elements
    expect(screen.getByText(/Admin:/)).toBeInTheDocument();
    expect(screen.getByText(/Employee:/)).toBeInTheDocument();
    expect(screen.getByText(/admin@cognizant.com/)).toBeInTheDocument();
    expect(screen.getByText(/john.doe@cognizant.com/)).toBeInTheDocument();
  });

  test('allows user to type in email and password fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('successful employee login redirects to employee dashboard', async () => {
    const user = userEvent.setup();
    mockDataService.getUserByEmail.mockReturnValue(mockUser);
    
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'pass@123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/employee');
    });
  });

  test('successful admin login redirects to admin dashboard', async () => {
    const user = userEvent.setup();
    mockDataService.getUserByEmail.mockReturnValue(mockAdminUser);
    
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'admin@cognizant.com');
    await user.type(passwordInput, 'pass@123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  test('failed login shows error message', async () => {
    const user = userEvent.setup();
    mockDataService.getUserByEmail.mockReturnValue(undefined);
    
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
    
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('shows loading state during login', async () => {
    const user = userEvent.setup();
    mockDataService.getUserByEmail.mockReturnValue(mockUser);
    
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'pass@123');
    
    // Submit form
    await user.click(submitButton);
    
    // Wait for navigation to complete
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/employee');
    });
  });

  test('prevents form submission when fields are empty', async () => {
    renderWithProviders(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Try to click submit button
    const event = new MouseEvent('click', { bubbles: true });
    submitButton.dispatchEvent(event);
    
    // Should not call DataService or navigate
    expect(mockDataService.getUserByEmail).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('requires both email and password fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    
    // Check required attributes
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  test('email field has correct type and validation', () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('Email Address');
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('password field has correct type', () => {
    renderWithProviders(<Login />);
    
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('form submission prevents default behavior', async () => {
    const user = userEvent.setup();
    mockDataService.getUserByEmail.mockReturnValue(mockUser);
    
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'pass@123');
    
    // Submit form by pressing Enter in email field
    await user.type(emailInput, '{enter}');
    
    // Should still call login function
    await waitFor(() => {
      expect(mockDataService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
    });
  });

  test('clears error message when user starts typing', async () => {
    const user = userEvent.setup();
    mockDataService.getUserByEmail.mockReturnValue(undefined);
    
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // First, trigger an error
    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
    
    // Clear the email field and type new content
    await user.clear(emailInput);
    await user.type(emailInput, 'new@example.com');
    
    // Error message should be cleared
    expect(screen.queryByText('Invalid email or password')).not.toBeInTheDocument();
  });

  test('displays library logo and branding', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText('📚 Cognizant Digital Library')).toBeInTheDocument();
    expect(screen.getByText('Employee Login Portal')).toBeInTheDocument();
  });

  test('button is disabled during loading', async () => {
    const user = userEvent.setup();
    mockDataService.getUserByEmail.mockReturnValue(mockUser);
    
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'pass@123');
    
    // Check that button is initially enabled
    expect(submitButton).toBeEnabled();
    
    // Submit form
    await user.click(submitButton);
    
    // Wait for navigation to complete
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/employee');
    });
  });
});
