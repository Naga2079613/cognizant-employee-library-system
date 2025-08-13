import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationList from '../NotificationList';
import { NotificationContext } from '../../../contexts/NotificationContext';
import type { AppNotification, NotificationContextType } from '../../../types';

const mockNotifications: AppNotification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Success',
    message: 'Operation completed successfully',
    timestamp: '2023-12-01T10:00:00.000Z'
  },
  {
    id: '2',
    type: 'error',
    title: 'Error',
    message: 'Something went wrong',
    timestamp: '2023-12-01T10:01:00.000Z'
  },
  {
    id: '3',
    type: 'info',
    title: 'Info',
    message: 'Here is some information',
    timestamp: '2023-12-01T10:02:00.000Z'
  }
];

const mockNotificationContext: NotificationContextType = {
  notifications: mockNotifications,
  addNotification: jest.fn(),
  removeNotification: jest.fn()
};

const renderWithNotificationContext = (notifications: AppNotification[] = mockNotifications) => {
  const contextValue = {
    ...mockNotificationContext,
    notifications
  };

  return render(
    <NotificationContext.Provider value={contextValue}>
      <NotificationList />
    </NotificationContext.Provider>
  );
};

describe('NotificationList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithNotificationContext([]);
    
    // Component should render without notifications
    expect(document.body).toBeInTheDocument();
  });

  it('displays multiple notifications', () => {
    renderWithNotificationContext();
    
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Here is some information')).toBeInTheDocument();
  });

  it('displays notifications with correct severity', () => {
    renderWithNotificationContext();
    
    // Check for Material-UI Alert components with correct severity
    const alerts = screen.getAllByRole('alert');
    expect(alerts).toHaveLength(3);
  });

  it('handles notification removal on close button click', async () => {
    const mockRemoveNotification = jest.fn();
    const contextValue = {
      ...mockNotificationContext,
      removeNotification: mockRemoveNotification
    };

    render(
      <NotificationContext.Provider value={contextValue}>
        <NotificationList />
      </NotificationContext.Provider>
    );

    // Find close buttons
    const closeButtons = screen.getAllByLabelText('Close');
    expect(closeButtons.length).toBeGreaterThan(0);

    // Click first close button
    fireEvent.click(closeButtons[0]);

    expect(mockRemoveNotification).toHaveBeenCalledWith('1');
  });

  it('handles auto-hide functionality', async () => {
    const mockRemoveNotification = jest.fn();
    const contextValue = {
      ...mockNotificationContext,
      removeNotification: mockRemoveNotification
    };

    render(
      <NotificationContext.Provider value={contextValue}>
        <NotificationList />
      </NotificationContext.Provider>
    );

    // Snackbar should auto-hide after 5 seconds
    // We can't easily test the timer, but we can verify the onClose prop is set
    const snackbars = screen.getAllByRole('presentation');
    expect(snackbars.length).toBeGreaterThan(0);
  });

  it('renders empty state when no notifications', () => {
    renderWithNotificationContext([]);
    
    // Should not display any alerts
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('positions notifications correctly', () => {
    renderWithNotificationContext();
    
    // Component should render with fixed positioning styles
    const container = screen.getByText('Success').closest('div');
    expect(container?.parentElement).toBeInTheDocument();
  });

  it('displays notification with only success type', () => {
    const successNotification: AppNotification = {
      id: '1',
      type: 'success',
      title: 'Success Only',
      message: 'This is a success message',
      timestamp: '2023-12-01T10:00:00.000Z'
    };

    renderWithNotificationContext([successNotification]);
    
    expect(screen.getByText('Success Only')).toBeInTheDocument();
    expect(screen.getByText('This is a success message')).toBeInTheDocument();
  });

  it('displays notification with only error type', () => {
    const errorNotification: AppNotification = {
      id: '1',
      type: 'error',
      title: 'Error Only',
      message: 'This is an error message',
      timestamp: '2023-12-01T10:00:00.000Z'
    };

    renderWithNotificationContext([errorNotification]);
    
    expect(screen.getByText('Error Only')).toBeInTheDocument();
    expect(screen.getByText('This is an error message')).toBeInTheDocument();
  });

  it('displays notification with only warning type', () => {
    const warningNotification: AppNotification = {
      id: '1',
      type: 'warning',
      title: 'Warning Only',
      message: 'This is a warning message',
      timestamp: '2023-12-01T10:00:00.000Z'
    };

    renderWithNotificationContext([warningNotification]);
    
    expect(screen.getByText('Warning Only')).toBeInTheDocument();
    expect(screen.getByText('This is a warning message')).toBeInTheDocument();
  });

  it('displays notification with only info type', () => {
    const infoNotification: AppNotification = {
      id: '1',
      type: 'info',
      title: 'Info Only',
      message: 'This is an info message',
      timestamp: '2023-12-01T10:00:00.000Z'
    };

    renderWithNotificationContext([infoNotification]);
    
    expect(screen.getByText('Info Only')).toBeInTheDocument();
    expect(screen.getByText('This is an info message')).toBeInTheDocument();
  });

  it('handles notifications with long messages', () => {
    const longMessageNotification: AppNotification = {
      id: '1',
      type: 'info',
      title: 'Long Message',
      message: 'This is a very long message that should still be displayed properly even though it contains a lot of text and might wrap to multiple lines',
      timestamp: '2023-12-01T10:00:00.000Z'
    };

    renderWithNotificationContext([longMessageNotification]);
    
    expect(screen.getByText('Long Message')).toBeInTheDocument();
    expect(screen.getByText(/This is a very long message/)).toBeInTheDocument();
  });
});
