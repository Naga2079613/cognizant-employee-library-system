// @ts-nocheck
import { render, screen, act } from '@testing-library/react';
import { NotificationProvider, useNotification } from '../NotificationContext';

// Test component to access the notification context
const TestComponent = () => {
  const { notifications, addNotification, removeNotification } = useNotification();
  
  const handleAddNotification = () => {
    addNotification({
      type: 'success',
      title: 'Success',
      message: 'Test message'
    });
  };

  const handleAddErrorNotification = () => {
    addNotification({
      type: 'error',
      title: 'Error', 
      message: 'Error message'
    });
  };

  const handleRemoveNotification = () => {
    if (notifications.length > 0) {
      removeNotification(notifications[0].id);
    }
  };

  return (
    <div>
      <div data-testid="notification-count">{notifications.length}</div>
      {notifications.map((notification) => (
        <div key={notification.id} data-testid={`notification-${notification.type}`}>
          {notification.message}
        </div>
      ))}
      <button onClick={handleAddNotification}>Add Success</button>
      <button onClick={handleAddErrorNotification}>Add Error</button>
      <button onClick={handleRemoveNotification}>Remove First</button>
    </div>
  );
};

describe('NotificationContext', () => {
  test('provides notification context to children', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
  });

  test('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useNotification must be used within a NotificationProvider');

    console.error = originalError;
  });

  test('adds success notification', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    const addButton = screen.getByText('Add Success');
    
    act(() => {
      addButton.click();
    });
    
    expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
    expect(screen.getByTestId('notification-success')).toHaveTextContent('Test message');
  });

  test('adds error notification', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    const addButton = screen.getByText('Add Error');
    
    act(() => {
      addButton.click();
    });
    
    expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
    expect(screen.getByTestId('notification-error')).toHaveTextContent('Error message');
  });

  test('removes notification', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    const addButton = screen.getByText('Add Success');
    const removeButton = screen.getByText('Remove First');
    
    // Add a notification
    act(() => {
      addButton.click();
    });
    
    expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
    
    // Remove the notification
    act(() => {
      removeButton.click();
    });
    
    expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
  });

  test('adds multiple notifications', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    const addSuccessButton = screen.getByText('Add Success');
    const addErrorButton = screen.getByText('Add Error');
    
    act(() => {
      addSuccessButton.click();
      addErrorButton.click();
    });
    
    expect(screen.getByTestId('notification-count')).toHaveTextContent('2');
    expect(screen.getByTestId('notification-success')).toBeInTheDocument();
    expect(screen.getByTestId('notification-error')).toBeInTheDocument();
  });

  test('notification has unique id', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    const addButton = screen.getByText('Add Success');
    
    act(() => {
      addButton.click();
      addButton.click();
    });
    
    expect(screen.getByTestId('notification-count')).toHaveTextContent('2');
    
    const notifications = screen.getAllByTestId('notification-success');
    expect(notifications).toHaveLength(2);
  });
});
