import { DataService } from '../dataService';

describe('DataService', () => {
  test('getAllBooks returns array of books', () => {
    const books = DataService.getAllBooks();
    expect(Array.isArray(books)).toBe(true);
    expect(books.length).toBeGreaterThan(0);
  });

  test('getAllUsers returns array of users', () => {
    const users = DataService.getAllUsers();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  test('getAllRequests returns array of book requests', () => {
    const requests = DataService.getAllRequests();
    expect(Array.isArray(requests)).toBe(true);
    expect(requests.length).toBeGreaterThan(0);
  });

  test('searchBooks filters books correctly', () => {
    const allBooks = DataService.getAllBooks();
    const searchResults = DataService.searchBooks('JavaScript');
    expect(Array.isArray(searchResults)).toBe(true);
    expect(searchResults.length).toBeLessThanOrEqual(allBooks.length);
  });

  test('getAvailableBooks returns only books with available copies', () => {
    const availableBooks = DataService.getAvailableBooks();
    expect(Array.isArray(availableBooks)).toBe(true);
    availableBooks.forEach(book => {
      expect(book.availableCopies).toBeGreaterThan(0);
    });
  });
});