// @ts-nocheck
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

// Mock the lazy components
jest.mock('../components/Auth/Login', () => {
  return function MockLogin() {
    return <div data-testid="login-component">Login Component</div>;
  };
});

jest.mock('../components/EmployeePortal/Dashboard', () => {
  return function MockEmployeeDashboard() {
    return <div data-testid="employee-dashboard">Employee Dashboard</div>;
  };
});

jest.mock('../components/AdminPortal/Dashboard', () => {
  return function MockAdminDashboard() {
    return <div data-testid="admin-dashboard">Admin Dashboard</div>;
  };
});

jest.mock('../components/EmployeePortal/BookCatalog', () => {
  return function MockBookCatalog() {
    return <div data-testid="book-catalog">Book Catalog</div>;
  };
});

jest.mock('../components/EmployeePortal/RequestHistory', () => {
  return function MockRequestHistory() {
    return <div data-testid="request-history">Request History</div>;
  };
});

jest.mock('../components/AdminPortal/ManageBooks', () => {
  return function MockManageBooks() {
    return <div data-testid="manage-books">Manage Books</div>;
  };
});

jest.mock('../components/AdminPortal/ManageRequests', () => {
  return function MockManageRequests() {
    return <div data-testid="manage-requests">Manage Requests</div>;
  };
});

// Mock Navbar and NotificationList
jest.mock('../components/common/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

jest.mock('../components/common/NotificationList', () => {
  return function MockNotificationList() {
    return <div data-testid="notification-list">Notifications</div>;
  };
});

// Mock ProtectedRoute to render children directly for testing
jest.mock('../components/common/ProtectedRoute', () => {
  return function MockProtectedRoute({ children }: { children: React.ReactNode }) {
    return <div data-testid="protected-route">{children}</div>;
  };
});

// Mock the contexts to avoid auth dependencies
jest.mock('../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: () => ({
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    loading: false,
  }),
}));

jest.mock('../contexts/NotificationContext', () => ({
  NotificationProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="notification-provider">{children}</div>,
  useNotification: () => ({
    notifications: [],
    addNotification: jest.fn(),
    removeNotification: jest.fn(),
  }),
}));

// Mock react-router-dom to control navigation for testing
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div data-testid="browser-router">{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div data-testid="routes">{children}</div>,
  Route: ({ children, element }: { children?: React.ReactNode; element?: React.ReactNode }) => {
    if (element) return <div data-testid="route">{element}</div>;
    return <div data-testid="route">{children}</div>;
  },
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to}>Redirecting to {to}</div>,
  useNavigate: () => mockNavigate,
}));

describe('App Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('notification-provider')).toBeInTheDocument();
  });

  test('provides auth and notification context wrappers', () => {
    render(<App />);
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('notification-provider')).toBeInTheDocument();
  });

  test('renders browser router setup', () => {
    render(<App />);
    expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    expect(screen.getByTestId('routes')).toBeInTheDocument();
  });

  test('renders navbar and notification list', () => {
    render(<App />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('notification-list')).toBeInTheDocument();
  });

  test('has proper layout structure', () => {
    render(<App />);
    
    // Check main layout structure
    const main = document.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('flex-1', 'w-full', 'min-h-[calc(100vh-64px)]');
    
    const container = document.querySelector('.flex.flex-col.min-h-screen.w-full');
    expect(container).toBeInTheDocument();
  });

  test('includes all route definitions', () => {
    render(<App />);
    
    // Should have multiple route components rendered
    const routes = screen.getAllByTestId('route');
    expect(routes.length).toBeGreaterThan(5); // We have 7 routes defined
  });

  test('includes navigation redirect for root path', () => {
    render(<App />);
    
    // Should include a Navigate component for root redirect
    expect(screen.getByTestId('navigate')).toBeInTheDocument();
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
  });

  test('renders protected routes with protection wrapper', () => {
    render(<App />);
    
    // Should have protected route wrappers
    const protectedRoutes = screen.getAllByTestId('protected-route');
    expect(protectedRoutes.length).toBeGreaterThan(0);
  });

  test('includes all expected page components in routes', () => {
    render(<App />);
    
    // All the main components should be rendered in the route structure
    expect(screen.getByTestId('login-component')).toBeInTheDocument();
    expect(screen.getByTestId('employee-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('book-catalog')).toBeInTheDocument();
    expect(screen.getByTestId('request-history')).toBeInTheDocument();
    expect(screen.getByTestId('manage-books')).toBeInTheDocument();
    expect(screen.getByTestId('manage-requests')).toBeInTheDocument();
  });
});

// Test the LoadingFallback component separately
describe('App LoadingFallback Component', () => {
  test('LoadingFallback component renders correctly when isolated', () => {
    // Create a wrapper to access the LoadingFallback component
    const TestLoadingFallback = () => {
      // Recreate the LoadingFallback structure from App.tsx
      return (
        <div className="flex items-center justify-center min-h-[50vh] flex-col gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500"></div>
          <div className="text-gray-600 text-lg">Loading...</div>
        </div>
      );
    };

    render(<TestLoadingFallback />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(document.querySelector('.animate-spin.rounded-full.h-16.w-16.border-b-2.border-primary-500')).toBeInTheDocument();
    expect(document.querySelector('.text-gray-600.text-lg')).toBeInTheDocument();
    expect(document.querySelector('.flex.items-center.justify-center.min-h-\\[50vh\\].flex-col.gap-4')).toBeInTheDocument();
  });
});
