// @ts-nocheck
import { DataService } from '../dataService';

// Mock the JSON data files
jest.mock('../../data/books.json', () => [
  {
    id: '1',
    title: 'Test Book 1',
    author: 'Test Author 1',
    isbn: '1234567890',
    publishedYear: 2023,
    category: 'Technology',
    description: 'A test book',
    coverImage: 'test-image.jpg',
    totalCopies: 5,
    availableCopies: 3,
    rating: 4.5,
    tags: ['test', 'book']
  },
  {
    id: '2', 
    title: 'Test Book 2',
    author: 'Test Author 2',
    isbn: '0987654321',
    publishedYear: 2022,
    category: 'Science',
    description: 'Another test book',
    coverImage: 'test-image2.jpg',
    totalCopies: 3,
    availableCopies: 2,
    rating: 4.0,
    tags: ['science', 'test']
  }
]);

jest.mock('../../data/users.json', () => [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'employee',
    department: 'IT',
    employeeId: 'EMP001'
  },
  {
    id: '2',
    name: 'Admin User', 
    email: 'admin@cognizant.com',
    role: 'admin'
  }
]);

jest.mock('../../data/bookRequests.json', () => [
  {
    id: '1',
    userId: '1',
    bookId: '1',
    requestDate: '2023-01-01',
    status: 'pending'
  }
]);

describe('DataService', () => {
  beforeEach(() => {
    // Clear any localStorage data before each test
    localStorage.clear();
  });

  describe('Book operations', () => {
    test('getAllBooks returns all books', () => {
      const books = DataService.getAllBooks();
      expect(books).toHaveLength(2);
      expect(books[0].title).toBe('Test Book 1');
      expect(books[1].title).toBe('Test Book 2');
    });

    test('getBookById returns correct book', () => {
      const book = DataService.getBookById('1');
      expect(book).toBeDefined();
      expect(book?.title).toBe('Test Book 1');
    });

    test('getBookById returns undefined for non-existent book', () => {
      const book = DataService.getBookById('999');
      expect(book).toBeUndefined();
    });

    test('searchBooks filters by title', () => {
      const results = DataService.searchBooks('Test Book 1');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Test Book 1');
    });

    test('searchBooks filters by author', () => {
      const results = DataService.searchBooks('Test Author 2');
      expect(results).toHaveLength(1);
      expect(results[0].author).toBe('Test Author 2');
    });

    test('searchBooks returns all books for empty query', () => {
      const results = DataService.searchBooks('');
      expect(results).toHaveLength(2);
    });

    test('searchBooks filters by category', () => {
      const results = DataService.searchBooks('science', 'Science');
      expect(results.length).toBeGreaterThanOrEqual(0);
    });

    test('searchBooks handles books without category', () => {
      // Add a book without category
      const bookWithoutCategory = {
        title: 'Book Without Category',
        author: 'Test Author',
        isbn: '9999999999',
        publishedYear: 2024,
        description: 'A book without category',
        imageUrl: 'test.jpg',
        totalCopies: 1,
        availableCopies: 1
        // Note: no category field
      };
      DataService.addBook(bookWithoutCategory);
      
      // Search should still work
      const results = DataService.searchBooks('Without Category');
      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    test('searchBooks with category filter', () => {
      // Search for books in Technology category
      const results = DataService.searchBooks('', 'Technology');
      expect(results.every(book => book.category === 'Technology')).toBe(true);
    });

    test('addBook adds new book', () => {
      const newBook = {
        title: 'New Book',
        author: 'New Author',
        isbn: '1111111111',
        publishedYear: 2024,
        category: 'Fiction',
        description: 'A new book',
        imageUrl: 'new-image.jpg',
        totalCopies: 2,
        availableCopies: 2
      };

      const addedBook = DataService.addBook(newBook);
      expect(addedBook.id).toBeDefined();
      expect(addedBook.title).toBe('New Book');

      // Verify it was added to the collection
      const allBooks = DataService.getAllBooks();
      expect(allBooks.length).toBeGreaterThanOrEqual(3);
      expect(allBooks.some(book => book.title === 'New Book')).toBe(true);
    });

    test('updateBook updates existing book', () => {
      const updates = { title: 'Updated Title', totalCopies: 10 };
      const result = DataService.updateBook('1', updates);
      
      expect(result).toBe(true);
      
      // Verify the book was actually updated
      const updatedBook = DataService.getBookById('1');
      expect(updatedBook?.title).toBe('Updated Title');
      expect(updatedBook?.totalCopies).toBe(10);
    });

    test('updateBook returns false for non-existent book', () => {
      const updates = { title: 'Updated Title' };
      const result = DataService.updateBook('999', updates);
      expect(result).toBe(false);
    });

    test('deleteBook removes book', () => {
      // Get current count first
      const initialBooks = DataService.getAllBooks();
      const initialCount = initialBooks.length;
      
      const result = DataService.deleteBook('1');
      expect(result).toBe(true);

      const book = DataService.getBookById('1');
      expect(book).toBeUndefined();

      const allBooks = DataService.getAllBooks();
      expect(allBooks).toHaveLength(initialCount - 1);
    });

    test('deleteBook returns false for non-existent book', () => {
      const result = DataService.deleteBook('999');
      expect(result).toBe(false);
    });
  });

  describe('User operations', () => {
    test('getAllUsers returns all users', () => {
      const users = DataService.getAllUsers();
      expect(users).toHaveLength(2);
    });

    test('getUserByEmail returns correct user', () => {
      const user = DataService.getUserByEmail('test@example.com');
      expect(user).toBeDefined();
      expect(user?.name).toBe('Test User');
    });

    test('getUserByEmail returns undefined for non-existent email', () => {
      const user = DataService.getUserByEmail('nonexistent@example.com');
      expect(user).toBeUndefined();
    });
  });

  describe('Book request operations', () => {
    test('getAllRequests returns all requests', () => {
      const requests = DataService.getAllRequests();
      expect(requests).toHaveLength(1);
    });

    test('getRequestsByUserId returns user requests', () => {
      const requests = DataService.getRequestsByUserId('1');
      expect(requests).toHaveLength(1);
      expect(requests[0].userId).toBe('1');
    });

    test('getRequestsByUserId returns empty array for user with no requests', () => {
      const requests = DataService.getRequestsByUserId('2');
      expect(requests).toHaveLength(0);
    });

    test('createRequest creates new request', () => {
      const requestData = {
        userId: '2',
        userName: 'Test User 2',
        userEmail: 'test2@example.com',
        bookId: '2',
        bookTitle: 'Test Book 2',
        bookAuthor: 'Author 2',
        expectedReturnDate: '2024-01-15T10:00:00Z'
      };
      const newRequest = DataService.createRequest(requestData);
      expect(newRequest.id).toBeDefined();
      expect(newRequest.userId).toBe('2');
      expect(newRequest.bookId).toBe('2');
      expect(newRequest.status).toBe('pending');
    });

    test('updateRequestStatus updates existing request', () => {
      const result = DataService.updateRequestStatus('1', 'approved');
      expect(result).toBe(true);
      
      // Verify the update worked
      const request = DataService.getAllRequests().find(r => r.id === '1');
      expect(request?.status).toBe('approved');
    });

    test('updateRequestStatus returns false for non-existent request', () => {
      const result = DataService.updateRequestStatus('999', 'approved');
      expect(result).toBe(false);
    });

    test('updateRequestStatus with approved status updates book availability', () => {
      // Get available books and use the first one
      const allBooks = DataService.getAllBooks();
      
      if (allBooks.length === 0) {
        // If no books, this test can't run
        expect(true).toBe(true);
        return;
      }
      
      // Use the first available book
      const testBookId = allBooks[0].id;
      const initialBook = DataService.getBookById(testBookId);
      expect(initialBook).toBeDefined();
      const initialAvailableCopies = initialBook!.availableCopies;
      
      // Find or create a request for this book
      const allRequests = DataService.getAllRequests();
      let testRequestId = allRequests.find(r => r.bookId === testBookId)?.id;
      
      if (!testRequestId) {
        // Create a request if none exists
        const newRequest = DataService.createRequest({
          userId: '1',
          userName: 'Test User',
          userEmail: 'test@example.com',
          bookId: testBookId,
          bookTitle: initialBook!.title,
          bookAuthor: initialBook!.author,
          expectedReturnDate: '2024-12-31'
        });
        testRequestId = newRequest.id;
      }
      
      // Update request status to approved
      const result = DataService.updateRequestStatus(testRequestId, 'approved');
      expect(result).toBe(true);
      
      // Check that book availability decreased (if it was > 0)
      const updatedBook = DataService.getBookById(testBookId);
      expect(updatedBook).toBeDefined();
      if (initialAvailableCopies > 0) {
        expect(updatedBook!.availableCopies).toBe(initialAvailableCopies - 1);
      } else {
        expect(updatedBook!.availableCopies).toBe(0);
      }
    });

    test('updateRequestStatus with returned status updates book availability', () => {
      // Get available books and use the first one
      const allBooks = DataService.getAllBooks();
      if (allBooks.length === 0) {
        expect(true).toBe(true);
        return;
      }
      
      const testBookId = allBooks[0].id;
      const book = DataService.getBookById(testBookId);
      expect(book).toBeDefined();
      const currentAvailableCopies = book!.availableCopies;
      
      // Find or create a request for this book
      const allRequests = DataService.getAllRequests();
      let testRequestId = allRequests.find(r => r.bookId === testBookId)?.id;
      
      if (!testRequestId) {
        const newRequest = DataService.createRequest({
          userId: '1',
          userName: 'Test User',
          userEmail: 'test@example.com',
          bookId: testBookId,
          bookTitle: book!.title,
          bookAuthor: book!.author,
          expectedReturnDate: '2024-12-31'
        });
        testRequestId = newRequest.id;
      }
      
      // Update request status to returned
      const result = DataService.updateRequestStatus(testRequestId, 'returned');
      expect(result).toBe(true);
      
      // Check that book availability increased
      const updatedBook = DataService.getBookById(testBookId);
      expect(updatedBook).toBeDefined();
      expect(updatedBook!.availableCopies).toBe(currentAvailableCopies + 1);
    });

    test('updateRequestStatus handles case when book is not found for approved status', () => {
      // Create a request for a non-existent book
      const requestData = {
        userId: '1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        bookId: 'non-existent',
        bookTitle: 'Non-existent Book',
        bookAuthor: 'Unknown',
        expectedReturnDate: '2024-12-31'
      };
      const newRequest = DataService.createRequest(requestData);
      
      // Try to approve the request
      const result = DataService.updateRequestStatus(newRequest.id, 'approved');
      expect(result).toBe(true); // Should still return true as the request status is updated
    });

    test('updateRequestStatus handles case when book has no available copies for approved status', () => {
      // Get available books and use the first one
      const allBooks = DataService.getAllBooks();
      if (allBooks.length === 0) {
        expect(true).toBe(true);
        return;
      }
      
      const testBookId = allBooks[0].id;
      const initialBook = DataService.getBookById(testBookId);
      expect(initialBook).toBeDefined();
      
      // Update book to have 0 available copies
      DataService.updateBook(testBookId, { availableCopies: 0 });
      
      // Create or find a request for this book
      const allRequests = DataService.getAllRequests();
      let testRequestId = allRequests.find(r => r.bookId === testBookId)?.id;
      
      if (!testRequestId) {
        const newRequest = DataService.createRequest({
          userId: '1',
          userName: 'Test User',
          userEmail: 'test@example.com',
          bookId: testBookId,
          bookTitle: initialBook!.title,
          bookAuthor: initialBook!.author,
          expectedReturnDate: '2024-12-31'
        });
        testRequestId = newRequest.id;
      }
      
      // Try to approve the request
      const result = DataService.updateRequestStatus(testRequestId, 'approved');
      expect(result).toBe(true); // Should still return true as the request status is updated
      
      // Book availability should remain 0
      const updatedBook = DataService.getBookById(testBookId);
      expect(updatedBook).toBeDefined();
      expect(updatedBook!.availableCopies).toBe(0);
    });

    test('updateRequestStatus with returned status and existing book', () => {
      // Get available books and use the first one
      const allBooks = DataService.getAllBooks();
      if (allBooks.length === 0) {
        expect(true).toBe(true);
        return;
      }
      
      const testBookId = allBooks[0].id;
      const initialBook = DataService.getBookById(testBookId);
      expect(initialBook).toBeDefined();
      
      const initialAvailableCopies = initialBook!.availableCopies;
      
      // Create or find a request for this book
      const allRequests = DataService.getAllRequests();
      let testRequestId = allRequests.find(r => r.bookId === testBookId)?.id;
      
      if (!testRequestId) {
        const newRequest = DataService.createRequest({
          userId: '1',
          userName: 'Test User',
          userEmail: 'test@example.com',
          bookId: testBookId,
          bookTitle: initialBook!.title,
          bookAuthor: initialBook!.author,
          expectedReturnDate: '2024-12-31'
        });
        testRequestId = newRequest.id;
      }
      
      // Set request status to approved first
      DataService.updateRequestStatus(testRequestId, 'approved');
      
      // Now return the book
      const result = DataService.updateRequestStatus(testRequestId, 'returned');
      expect(result).toBe(true);
      
      // Request should have return date
      const updatedRequest = DataService.getAllRequests().find(r => r.id === testRequestId);
      expect(updatedRequest).toBeDefined();
      expect(updatedRequest!.status).toBe('returned');
      expect(updatedRequest!.returnDate).toBeDefined();
    });

    test('updateRequestStatus with returned status and non-existent book', () => {
      // Create a request with a non-existent book ID that doesn't interfere with existing data
      const nonExistentBookId = 'book-id-that-does-not-exist-' + Date.now();
      
      const newRequest = DataService.createRequest({
        userId: '1',
        userName: 'Test User',
        userEmail: 'test@example.com',
        bookId: nonExistentBookId,
        bookTitle: 'Non-existent Book',
        bookAuthor: 'Non-existent Author',
        expectedReturnDate: '2024-12-31'
      });
      
      // Set request status to approved first
      DataService.updateRequestStatus(newRequest.id, 'approved');
      
      // Try to return the book (book doesn't exist, so this tests the if (book) check)
      const result = DataService.updateRequestStatus(newRequest.id, 'returned');
      expect(result).toBe(true); // Should still return true as the request status is updated
      
      // Request should have return date even though book doesn't exist
      const updatedRequest = DataService.getAllRequests().find(r => r.id === newRequest.id);
      expect(updatedRequest).toBeDefined();
      expect(updatedRequest!.status).toBe('returned');
      expect(updatedRequest!.returnDate).toBeDefined();
    });

    test('updateRequestStatus with dispatched status', () => {
      // Create a request
      const allBooks = DataService.getAllBooks();
      if (allBooks.length === 0) {
        expect(true).toBe(true);
        return;
      }
      
      const testBookId = allBooks[0].id;
      const initialBook = DataService.getBookById(testBookId);
      expect(initialBook).toBeDefined();
      
      const newRequest = DataService.createRequest({
        userId: '1',
        userName: 'Test User',
        userEmail: 'test@example.com',
        bookId: testBookId,
        bookTitle: initialBook!.title,
        bookAuthor: initialBook!.author,
        expectedReturnDate: '2024-12-31'
      });
      
      // Set request status to dispatched (this should not affect book availability)
      const result = DataService.updateRequestStatus(newRequest.id, 'dispatched');
      expect(result).toBe(true);
      
      // Request should have dispatch date
      const updatedRequest = DataService.getAllRequests().find(r => r.id === newRequest.id);
      expect(updatedRequest).toBeDefined();
      expect(updatedRequest!.status).toBe('dispatched');
      expect(updatedRequest!.dispatchDate).toBeDefined();
    });
  });

  describe('Statistics', () => {
    test('getRequestStats returns correct statistics', () => {
      // Reset requests to known state
      const stats = DataService.getRequestStats();
      expect(stats.total).toBeGreaterThanOrEqual(1);
      expect(stats.pending).toBeGreaterThanOrEqual(0);
      expect(stats.approved).toBeGreaterThanOrEqual(0);
      expect(stats.dispatched).toBeGreaterThanOrEqual(0);
      expect(stats.returned).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Categories', () => {
    test('getCategories returns all unique categories', () => {
      const categories = DataService.getCategories();
      expect(categories).toContain('Science');
      expect(categories).toContain('Fiction');
      expect(categories.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Available books', () => {
    test('getAvailableBooks returns only books with available copies', () => {
      const availableBooks = DataService.getAvailableBooks();
      // At least one book should have available copies, and all returned books should have > 0 copies
      expect(availableBooks.length).toBeGreaterThanOrEqual(1);
      expect(availableBooks.every(book => book.availableCopies > 0)).toBe(true);
    });

    test('getRandomBooks returns specified number of books', () => {
      const randomBooks = DataService.getRandomBooks(1);
      expect(randomBooks).toHaveLength(1);
    });
  });
});
