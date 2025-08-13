// @ts-nocheck
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { AuthProvider } from '../../../contexts/AuthContext';
import { NotificationProvider } from '../../../contexts/NotificationContext';

const MockComponent = () => <div>Protected Content</div>;

const renderWithProviders = (ui: React.ReactNode, mockUser = null) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          {ui}
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

// Mock the AuthContext
const mockAuthContext = {
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  isLoading: false
};

jest.mock('../../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../../contexts/AuthContext'),
  useAuth: () => mockAuthContext
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login when user is not authenticated', () => {
    mockAuthContext.user = null;
    mockAuthContext.isLoading = false;

    renderWithProviders(
      <ProtectedRoute>
        <MockComponent />
      </ProtectedRoute>
    );

    // Should not show protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('shows loading state when authentication is loading', () => {
    mockAuthContext.user = null;
    mockAuthContext.isLoading = true;

    renderWithProviders(
      <ProtectedRoute>
        <MockComponent />
      </ProtectedRoute>
    );

    // Should not show protected content while loading
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    mockAuthContext.user = { id: '1', name: 'Test User', role: 'employee' };
    mockAuthContext.isLoading = false;

    renderWithProviders(
      <ProtectedRoute>
        <MockComponent />
      </ProtectedRoute>
    );

    // Should show protected content
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('restricts access based on required role', () => {
    mockAuthContext.user = { id: '1', name: 'Test User', role: 'employee' };
    mockAuthContext.isLoading = false;

    renderWithProviders(
      <ProtectedRoute requiredRole="admin">
        <MockComponent />
      </ProtectedRoute>
    );

    // Should not show content for insufficient role
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('allows access when user has required role', () => {
    mockAuthContext.user = { id: '1', name: 'Test User', role: 'admin' };
    mockAuthContext.isLoading = false;

    renderWithProviders(
      <ProtectedRoute requiredRole="admin">
        <MockComponent />
      </ProtectedRoute>
    );

    // Should show content for correct role
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
