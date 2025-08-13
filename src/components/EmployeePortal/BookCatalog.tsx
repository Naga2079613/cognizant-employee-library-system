import { useState, useEffect } from 'react';
import { DataService } from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import type { Book as BookType } from '../../types';

const BookCatalog = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const BOOKS_PER_PAGE = 40;

  const { user } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    const allBooks = DataService.getAllBooks();
    setBooks(allBooks);
    setFilteredBooks(allBooks);
    
    const uniqueCategories = [...new Set(allBooks.map(book => book.category))];
    setCategories(uniqueCategories);
  }, []);

  useEffect(() => {
    let filtered = books;

    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    setFilteredBooks(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [books, searchQuery, selectedCategory]);

  const handleRequestBook = (book: BookType) => {
    setSelectedBook(book);
    setRequestDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setRequestDialogOpen(false);
    setSelectedBook(null);
    setExpectedReturnDate('');
  };

  const handleSubmitRequest = () => {
    if (!user || !selectedBook || !expectedReturnDate) return;

    const requestData = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      bookAuthor: selectedBook.author,
      expectedReturnDate,
    };

    try {
      const result = DataService.createRequest(requestData);
      
      if (result) {
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Book request submitted successfully!'
        });
        handleCloseDialog();
        
        // Refresh books data
        const allBooks = DataService.getAllBooks();
        setBooks(allBooks);
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to submit book request. Please try again.'
      });
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const endIndex = startIndex + BOOKS_PER_PAGE;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen w-full p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-3 drop-shadow-lg">
          📚 Book Catalog 📚
        </h1>
        <p className="text-xl text-white/90 drop-shadow">
          Browse and request books from our library
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search books by title, author, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="modern-input w-full pl-10 py-3 text-gray-700"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="modern-input w-full py-3 text-gray-700"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="text-center mb-6">
        <p className="text-white/80 text-lg">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredBooks.length)} of {filteredBooks.length} books
          {totalPages > 1 && (
            <span className="text-white/60"> • Page {currentPage} of {totalPages}</span>
          )}
        </p>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {currentBooks.map((book) => (
          <div 
            key={book.id}
            className="glass-card h-[320px] flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-elegant-hover group overflow-hidden"
          >
            {/* Book Content - Takes up available space */}
            <div className="flex-1 p-4 flex flex-col min-h-0">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white text-lg shadow-md flex-shrink-0">
                  📚
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-base leading-tight mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-600 font-medium">
                    by {book.author}
                  </p>
                </div>
              </div>
              
              {/* Description - Flexible height */}
              <div className="mb-2 flex-1 min-h-0">
                <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">
                  {book.description}
                </p>
              </div>
              
              {/* Category and Status - Fixed height */}
              <div className="flex flex-wrap gap-1 mb-2 min-h-[24px]">
                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                  {book.category}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  book.availableCopies > 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {book.availableCopies > 0 ? '✅ Available' : '❌ Out of Stock'}
                </span>
              </div>
              
              {/* Availability Info - Fixed height */}
              <div className="p-2 bg-gray-50 rounded-lg border mb-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">Available:</span>
                  <span className="font-bold text-gray-800">
                    {book.availableCopies} of {book.totalCopies}
                  </span>
                </div>
                {book.totalCopies > 0 && (
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          book.availableCopies > 0 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-400'
                        }`}
                        style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Action Button - Always at bottom with consistent height */}
              <button
                onClick={() => handleRequestBook(book)}
                disabled={book.availableCopies === 0}
                className={`w-full h-10 px-3 rounded-lg text-xs font-semibold transition-all duration-300 shadow-sm flex items-center justify-center ${
                  book.availableCopies > 0
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary-500/25'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {book.availableCopies > 0 ? '📋 Request Book' : '❌ Not Available'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mb-8">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentPage === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white/20 text-white hover:bg-white/30'
            } transition-all duration-200`}
          >
            ← Previous
          </button>
          
          <div className="flex space-x-1">
            {/* Show page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-semibold ${
                    currentPage === pageNum
                      ? 'bg-primary-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  } transition-all duration-200`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentPage === totalPages
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white/20 text-white hover:bg-white/30'
            } transition-all duration-200`}
          >
            Next →
          </button>
        </div>
      )}

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-white mb-2">
            No books found matching your criteria
          </h3>
          <p className="text-white/80">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Request Dialog */}
      {requestDialogOpen && selectedBook && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-card max-w-md w-full p-6 animate-slide-in-up">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-3 shadow-lg">
                📚
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Request Book</h2>
              <p className="text-sm text-gray-600">Submit your book request</p>
            </div>
            
            <div className="mb-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200 mb-3">
                <h3 className="font-bold text-gray-800 text-base mb-1">{selectedBook.title}</h3>
                <p className="text-sm text-gray-600 mb-2">by {selectedBook.author}</p>
                <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                  {selectedBook.category}
                </span>
              </div>
              
              <div className="mb-3">
                <label htmlFor="returnDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Expected Return Date *
                </label>
                <input
                  id="returnDate"
                  type="date"
                  value={expectedReturnDate}
                  onChange={(e) => setExpectedReturnDate(e.target.value)}
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  className="modern-input w-full py-2.5 text-sm"
                />
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 text-base flex-shrink-0">ℹ️</span>
                  <div>
                    <p className="text-xs text-amber-800 font-medium mb-1">Important Note:</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Books can be kept for up to 30 days. Please return by the specified date to avoid late fees.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCloseDialog}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                disabled={!expectedReturnDate}
                className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md text-sm ${
                  expectedReturnDate
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/25'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {expectedReturnDate ? '🚀 Submit Request' : 'Select Date First'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCatalog;
