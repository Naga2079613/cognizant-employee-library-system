import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import QuickActions from '../QuickActions';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = () => {
  return render(
    <MemoryRouter>
      <QuickActions />
    </MemoryRouter>
  );
};

describe('QuickActions Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders quick actions section', () => {
    renderWithRouter();
    
    expect(screen.getByText('🚀 Quick Actions')).toBeInTheDocument();
  });

  it('displays all quick action buttons', () => {
    renderWithRouter();
    
    expect(screen.getByText('📚 Manage Books')).toBeInTheDocument();
    expect(screen.getByText('📋 Review Requests')).toBeInTheDocument();
    expect(screen.getByText('📊 View Reports')).toBeInTheDocument();
  });

  it('navigates to manage books page when clicked', () => {
    renderWithRouter();
    
    const manageBooksButton = screen.getByText('📚 Manage Books');
    fireEvent.click(manageBooksButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/admin/books');
  });

  it('navigates to review requests page when clicked', () => {
    renderWithRouter();
    
    const reviewRequestsButton = screen.getByText('📋 Review Requests');
    fireEvent.click(reviewRequestsButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/admin/requests');
  });

  it('navigates to reports page when clicked', () => {
    renderWithRouter();
    
    const viewReportsButton = screen.getByText('📊 View Reports');
    fireEvent.click(viewReportsButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  it('has proper button structure', () => {
    renderWithRouter();
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    
    buttons.forEach(button => {
      expect(button).toHaveClass('quick-action-card');
    });
  });

  it('displays emojis in buttons', () => {
    renderWithRouter();
    
    expect(screen.getByText(/📚/)).toBeInTheDocument();
    expect(screen.getByText(/📋/)).toBeInTheDocument();
    expect(screen.getByText(/📊/)).toBeInTheDocument();
  });

  it('has responsive grid layout', () => {
    renderWithRouter();
    
    const gridContainer = screen.getByText('📚 Manage Books').closest('div');
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'gap-4');
  });

  it('has glass card styling', () => {
    renderWithRouter();
    
    const quickActionsContainer = screen.getByText('🚀 Quick Actions').closest('div');
    expect(quickActionsContainer).toHaveClass('glass-card', 'p-6', 'mt-6');
  });

  it('displays section title with emoji', () => {
    renderWithRouter();
    
    const title = screen.getByText('🚀 Quick Actions');
    expect(title).toHaveClass('text-xl', 'font-semibold', 'text-gray-800', 'mb-4');
  });
});
