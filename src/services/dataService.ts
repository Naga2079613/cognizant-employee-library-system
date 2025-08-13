import type { Book, BookRequest } from '../types';
import booksData from '../data/books.json';
import usersData from '../data/users.json';
import bookRequestsData from '../data/bookRequests.json';

// Import data from JSON files
const mockBooks: Book[] = booksData as Book[];
const mockUsers = usersData;
const mockRequests: BookRequest[] = bookRequestsData as BookRequest[];

export class DataService {
  private static books: Book[] = [...mockBooks];
  private static requests: BookRequest[] = [...mockRequests];

  // Books methods
  static getAllBooks(): Book[] {
    return this.books;
  }

  static getBookById(id: string): Book | undefined {
    return this.books.find(book => book.id === id);
  }

  static searchBooks(query: string, category?: string): Book[] {
    return this.books.filter(book => {
      const matchesQuery = !query || 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        (book.category && book.category.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = !category || book.category === category;
      
      return matchesQuery && matchesCategory;
    });
  }

  static getAvailableBooks(): Book[] {
    return this.books.filter(book => book.availableCopies > 0);
  }

  static getRandomBooks(count: number = 7): Book[] {
    const shuffled = [...this.books].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  static updateBook(id: string, updates: Partial<Book>): boolean {
    const index = this.books.findIndex(book => book.id === id);
    if (index !== -1) {
      this.books[index] = { ...this.books[index], ...updates };
      return true;
    }
    return false;
  }

  static addBook(book: Omit<Book, 'id'>): Book {
    const newBook: Book = {
      ...book,
      id: Date.now().toString()
    };
    this.books.push(newBook);
    return newBook;
  }

  static deleteBook(id: string): boolean {
    const index = this.books.findIndex(book => book.id === id);
    if (index !== -1) {
      this.books.splice(index, 1);
      return true;
    }
    return false;
  }

  // Request methods
  static getAllRequests(): BookRequest[] {
    return this.requests;
  }

  static getRequestsByUserId(userId: string): BookRequest[] {
    return this.requests.filter(request => request.userId === userId);
  }

  static createRequest(request: Omit<BookRequest, 'id' | 'requestDate' | 'status'>): BookRequest {
    const newRequest: BookRequest = {
      ...request,
      id: Date.now().toString(),
      requestDate: new Date().toISOString(),
      status: 'pending'
    };
    
    this.requests.push(newRequest);
    return newRequest;
  }

  static updateRequestStatus(
    id: string, 
    status: BookRequest['status'], 
    adminComments?: string
  ): boolean {
    const index = this.requests.findIndex(request => request.id === id);
    if (index !== -1) {
      this.requests[index] = {
        ...this.requests[index],
        status,
        adminComments,
        ...(status === 'dispatched' && { dispatchDate: new Date().toISOString() }),
        ...(status === 'returned' && { returnDate: new Date().toISOString() })
      };
      
      // Update book availability
      if (status === 'approved') {
        const book = this.getBookById(this.requests[index].bookId);
        if (book && book.availableCopies > 0) {
          this.updateBook(book.id, { availableCopies: book.availableCopies - 1 });
        }
      } else if (status === 'returned') {
        const book = this.getBookById(this.requests[index].bookId);
        if (book) {
          this.updateBook(book.id, { availableCopies: book.availableCopies + 1 });
        }
      }
      
      return true;
    }
    return false;
  }

  static getCategories(): string[] {
    const categories = new Set(this.books.map(book => book.category));
    return Array.from(categories);
  }

  static getRequestStats() {
    const total = this.requests.length;
    const pending = this.requests.filter(r => r.status === 'pending').length;
    const approved = this.requests.filter(r => r.status === 'approved').length;
    const dispatched = this.requests.filter(r => r.status === 'dispatched').length;
    const returned = this.requests.filter(r => r.status === 'returned').length;
    
    return { total, pending, approved, dispatched, returned };
  }

  // Users methods
  static getAllUsers() {
    return mockUsers;
  }

  static getUserByEmail(email: string) {
    return mockUsers.find(user => user.email === email);
  }
}
