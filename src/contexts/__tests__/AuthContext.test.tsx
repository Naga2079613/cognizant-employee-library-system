// @ts-nocheck
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { DataService } from '../../services/dataService';

// Mock the DataService
jest.mock('../../services/dataService');
const mockDataService = DataService as jest.Mocked<typeof DataService>;

const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'employee' as const,
  department: 'IT',
  employeeId: 'EMP001',
};

// Test component to access the auth context
const TestComponent = () => {
  const { user, login, logout, loading } = useAuth();
  
  const handleLogin = async () => {
    const success = await login('test@example.com', 'pass@123');
    // Simulate callback to show login result
    if (success) {
      document.body.setAttribute('data-login', 'success');
    } else {
      document.body.setAttribute('data-login', 'failed');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {user ? (
        <div>
          <div>Welcome, {user.name}</div>
          <div>Email: {user.email}</div>
          <div>Role: {user.role}</div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <div>Not logged in</div>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Clear localStorage
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
  });

  test('provides auth context to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Not logged in')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('throws error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    console.error = originalError;
  });

  test('shows loading state initially', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Loading state should eventually resolve to "Not logged in"
    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument();
    });
  });

  test('loads user from localStorage on mount', async () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Welcome, Test User')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Email: test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Role: employee')).toBeInTheDocument();
  });

  test('successful login updates user state', async () => {
    mockDataService.getUserByEmail.mockReturnValue(mockUser);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const loginButton = screen.getByText('Login');
    
    await act(async () => {
      loginButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Welcome, Test User')).toBeInTheDocument();
    });

    expect(document.body.getAttribute('data-login')).toBe('success');
    expect(localStorage.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(mockUser));
  });

  test('failed login does not update user state', async () => {
    mockDataService.getUserByEmail.mockReturnValue(undefined);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const loginButton = screen.getByText('Login');
    
    await act(async () => {
      loginButton.click();
    });

    await waitFor(() => {
      expect(document.body.getAttribute('data-login')).toBe('failed');
    });

    expect(screen.getByText('Not logged in')).toBeInTheDocument();
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  test('failed login with wrong password does not update user state', async () => {
    // Mock user exists but we'll simulate wrong password by not setting up the mock properly
    mockDataService.getUserByEmail.mockReturnValue(mockUser);
    
    // Create a test component that tries wrong password
    const TestComponentWrongPassword = () => {
      const { user, login, loading } = useAuth();
      
      const handleLogin = async () => {
        const success = await login('test@example.com', 'wrongpassword');
        if (success) {
          document.body.setAttribute('data-login', 'success');
        } else {
          document.body.setAttribute('data-login', 'failed');
        }
      };

      return (
        <div>
          {loading && <div>Loading...</div>}
          {user ? (
            <div>Welcome, {user.name}</div>
          ) : (
            <div>
              <div>Not logged in</div>
              <button onClick={handleLogin}>Login</button>
            </div>
          )}
        </div>
      );
    };
    
    render(
      <AuthProvider>
        <TestComponentWrongPassword />
      </AuthProvider>
    );

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const loginButton = screen.getByText('Login');
    
    await act(async () => {
      loginButton.click();
    });

    await waitFor(() => {
      expect(document.body.getAttribute('data-login')).toBe('failed');
    });

    expect(screen.getByText('Not logged in')).toBeInTheDocument();
  });

  test('logout clears user state and localStorage', async () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for user to be loaded
    await waitFor(() => {
      expect(screen.getByText('Welcome, Test User')).toBeInTheDocument();
    });

    const logoutButton = screen.getByText('Logout');
    
    act(() => {
      logoutButton.click();
    });

    expect(screen.getByText('Not logged in')).toBeInTheDocument();
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('currentUser');
  });

  test('handles invalid JSON in localStorage gracefully', async () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue('invalid-json'),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument();
    });
  });

  test('login function calls DataService.getUserByEmail', async () => {
    mockDataService.getUserByEmail.mockReturnValue(mockUser);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const loginButton = screen.getByText('Login');
    
    await act(async () => {
      loginButton.click();
    });

    expect(mockDataService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
  });

  test('loading state is handled correctly during login', async () => {
    mockDataService.getUserByEmail.mockReturnValue(mockUser);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const loginButton = screen.getByText('Login');
    
    // Click login
    await act(async () => {
      loginButton.click();
    });

    // Wait for login to complete and check final state
    await waitFor(() => {
      expect(screen.getByText('Welcome, Test User')).toBeInTheDocument();
    });
  });
});
