export interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'admin';
  department?: string;
  employeeId?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description: string;
  imageUrl?: string;
  totalCopies: number;
  availableCopies: number;
  publisher?: string;
  publishedYear?: number;
}

export interface BookRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  requestDate: string;
  expectedReturnDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'dispatched' | 'returned';
  adminComments?: string;
  dispatchDate?: string;
  returnDate?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

export interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
}

export interface SearchFilters {
  category?: string;
  author?: string;
  availability?: boolean;
}
