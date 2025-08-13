import type { 
  User, 
  Book, 
  BookRequest, 
  AuthContextType, 
  AppNotification, 
  NotificationContextType 
} from '../index';

describe('Type Definitions', () => {
  describe('User interface', () => {
    it('should have required properties', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'employee'
      };

      expect(user.id).toBe('1');
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.role).toBe('employee');
    });

    it('should allow optional properties', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
        department: 'IT',
        employeeId: 'EMP001'
      };

      expect(user.department).toBe('IT');
      expect(user.employeeId).toBe('EMP001');
    });

    it('should enforce role values', () => {
      const employeeUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Employee',
        role: 'employee'
      };

      const adminUser: User = {
        id: '2',
        email: 'admin@example.com',
        name: 'Admin',
        role: 'admin'
      };

      expect(employeeUser.role).toBe('employee');
      expect(adminUser.role).toBe('admin');
    });
  });

  describe('Book interface', () => {
    it('should have required properties', () => {
      const book: Book = {
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890',
        category: 'Fiction',
        description: 'Test description',
        totalCopies: 5,
        availableCopies: 3
      };

      expect(book.id).toBe('1');
      expect(book.title).toBe('Test Book');
      expect(book.author).toBe('Test Author');
      expect(book.isbn).toBe('1234567890');
      expect(book.category).toBe('Fiction');
      expect(book.description).toBe('Test description');
      expect(book.totalCopies).toBe(5);
      expect(book.availableCopies).toBe(3);
    });

    it('should allow optional properties', () => {
      const book: Book = {
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890',
        category: 'Fiction',
        description: 'Test description',
        totalCopies: 5,
        availableCopies: 3,
        imageUrl: 'https://example.com/book.jpg',
        publisher: 'Test Publisher',
        publishedYear: 2023
      };

      expect(book.imageUrl).toBe('https://example.com/book.jpg');
      expect(book.publisher).toBe('Test Publisher');
      expect(book.publishedYear).toBe(2023);
    });
  });

  describe('BookRequest interface', () => {
    it('should have required properties', () => {
      const request: BookRequest = {
        id: 'req-1',
        userId: 'user-1',
        userName: 'Test User',
        userEmail: 'test@example.com',
        bookId: 'book-1',
        bookTitle: 'Test Book',
        bookAuthor: 'Test Author',
        requestDate: '2024-01-01T10:00:00Z',
        expectedReturnDate: '2024-01-15T10:00:00Z',
        status: 'pending'
      };

      expect(request.id).toBe('req-1');
      expect(request.userId).toBe('user-1');
      expect(request.userName).toBe('Test User');
      expect(request.userEmail).toBe('test@example.com');
      expect(request.bookId).toBe('book-1');
      expect(request.bookTitle).toBe('Test Book');
      expect(request.bookAuthor).toBe('Test Author');
      expect(request.requestDate).toBe('2024-01-01T10:00:00Z');
      expect(request.expectedReturnDate).toBe('2024-01-15T10:00:00Z');
      expect(request.status).toBe('pending');
    });

    it('should allow optional properties', () => {
      const request: BookRequest = {
        id: 'req-1',
        userId: 'user-1',
        userName: 'Test User',
        userEmail: 'test@example.com',
        bookId: 'book-1',
        bookTitle: 'Test Book',
        bookAuthor: 'Test Author',
        requestDate: '2024-01-01T10:00:00Z',
        expectedReturnDate: '2024-01-15T10:00:00Z',
        status: 'approved',
        adminComments: 'Approved for checkout',
        dispatchDate: '2024-01-02T10:00:00Z',
        returnDate: '2024-01-16T10:00:00Z'
      };

      expect(request.adminComments).toBe('Approved for checkout');
      expect(request.dispatchDate).toBe('2024-01-02T10:00:00Z');
      expect(request.returnDate).toBe('2024-01-16T10:00:00Z');
    });

    it('should enforce status values', () => {
      const statuses: BookRequest['status'][] = [
        'pending',
        'approved',
        'rejected',
        'dispatched',
        'returned'
      ];

      statuses.forEach(status => {
        const request: BookRequest = {
          id: 'req-1',
          userId: 'user-1',
          userName: 'Test User',
          userEmail: 'test@example.com',
          bookId: 'book-1',
          bookTitle: 'Test Book',
          bookAuthor: 'Test Author',
          requestDate: '2024-01-01T10:00:00Z',
          expectedReturnDate: '2024-01-15T10:00:00Z',
          status
        };

        expect(request.status).toBe(status);
      });
    });
  });

  describe('AuthContextType interface', () => {
    it('should have required properties', () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'employee'
      };

      const authContext: AuthContextType = {
        user: mockUser,
        login: jest.fn(),
        logout: jest.fn(),
        loading: false
      };

      expect(authContext.user).toBe(mockUser);
      expect(typeof authContext.login).toBe('function');
      expect(typeof authContext.logout).toBe('function');
      expect(authContext.loading).toBe(false);
    });

    it('should allow null user', () => {
      const authContext: AuthContextType = {
        user: null,
        login: jest.fn(),
        logout: jest.fn(),
        loading: true
      };

      expect(authContext.user).toBeNull();
      expect(authContext.loading).toBe(true);
    });
  });

  describe('AppNotification interface', () => {
    it('should have required properties', () => {
      const notification: AppNotification = {
        id: 'notif-1',
        type: 'success',
        title: 'Success',
        message: 'Operation completed successfully',
        timestamp: '2024-01-01T10:00:00Z'
      };

      expect(notification.id).toBe('notif-1');
      expect(notification.type).toBe('success');
      expect(notification.title).toBe('Success');
      expect(notification.message).toBe('Operation completed successfully');
      expect(notification.timestamp).toBe('2024-01-01T10:00:00Z');
    });

    it('should enforce type values', () => {
      const types: AppNotification['type'][] = [
        'success',
        'error',
        'warning',
        'info'
      ];

      types.forEach(type => {
        const notification: AppNotification = {
          id: 'notif-1',
          type,
          title: 'Test',
          message: 'Test message',
          timestamp: '2024-01-01T10:00:00Z'
        };

        expect(notification.type).toBe(type);
      });
    });
  });

  describe('NotificationContextType interface', () => {
    it('should have required properties', () => {
      const notifications: AppNotification[] = [
        {
          id: 'notif-1',
          type: 'success',
          title: 'Success',
          message: 'Success message',
          timestamp: '2024-01-01T10:00:00Z'
        }
      ];

      const notificationContext: NotificationContextType = {
        notifications,
        addNotification: jest.fn(),
        removeNotification: jest.fn()
      };

      expect(notificationContext.notifications).toBe(notifications);
      expect(typeof notificationContext.addNotification).toBe('function');
      expect(typeof notificationContext.removeNotification).toBe('function');
    });

    it('should allow empty notifications array', () => {
      const notificationContext: NotificationContextType = {
        notifications: [],
        addNotification: jest.fn(),
        removeNotification: jest.fn()
      };

      expect(notificationContext.notifications).toHaveLength(0);
    });
  });

  describe('Type compatibility', () => {
    it('should allow User type in AuthContext', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'employee'
      };

      const authContext: AuthContextType = {
        user,
        login: jest.fn(),
        logout: jest.fn(),
        loading: false
      };

      expect(authContext.user?.id).toBe('1');
    });

    it('should allow BookRequest status types', () => {
      const validStatuses: BookRequest['status'][] = [
        'pending',
        'approved',
        'rejected',
        'dispatched',
        'returned'
      ];

      validStatuses.forEach(status => {
        const request: BookRequest = {
          id: 'req-1',
          userId: 'user-1',
          userName: 'Test User',
          userEmail: 'test@example.com',
          bookId: 'book-1',
          bookTitle: 'Test Book',
          bookAuthor: 'Test Author',
          requestDate: '2024-01-01T10:00:00Z',
          expectedReturnDate: '2024-01-15T10:00:00Z',
          status
        };

        expect(request.status).toBe(status);
      });
    });

    it('should allow notification types in context', () => {
      const notification: AppNotification = {
        id: 'notif-1',
        type: 'error',
        title: 'Error',
        message: 'Error message',
        timestamp: '2024-01-01T10:00:00Z'
      };

      const notificationContext: NotificationContextType = {
        notifications: [notification],
        addNotification: jest.fn(),
        removeNotification: jest.fn()
      };

      expect(notificationContext.notifications[0].type).toBe('error');
    });
  });
});
