import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppNotification, NotificationContextType } from '../types';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Export the context for testing
export { NotificationContext };

// eslint-disable-next-line react-refresh/only-export-components
function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

export { useNotification };

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [counter, setCounter] = useState(0);

  const addNotification = (notification: Omit<AppNotification, 'id' | 'timestamp'>) => {
    const newNotification: AppNotification = {
      ...notification,
      id: `${Date.now()}-${counter}`,
      timestamp: new Date().toISOString()
    };
    setCounter(prev => prev + 1);
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
