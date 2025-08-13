import { useState, useEffect, useCallback } from 'react';
import { DataService } from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import type { Book } from '../../types';

const ModernBookSlideshow = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [currentBatch, setCurrentBatch] = useState<Book[]>([]);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestNote, setRequestNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BOOKS_PER_BATCH = 7;
  const SLIDE_INTERVAL = 2000; // 2 seconds

  // Get random batch of books
  const getRandomBatch = useCallback((books: Book[], batchIndex: number) => {
    const totalBatches = Math.ceil(books.length / BOOKS_PER_BATCH);
    const actualBatchIndex = batchIndex % totalBatches;
    
    const startIndex = actualBatchIndex * BOOKS_PER_BATCH;
    const endIndex = Math.min(startIndex + BOOKS_PER_BATCH, books.length);
    const batch = books.slice(startIndex, endIndex);
    
    // Shuffle the batch for random order
    return batch.sort(() => Math.random() - 0.5);
  }, []);

  // Initialize books
  useEffect(() => {
    const books = DataService.getAllBooks();
    const availableBooks = books.filter(book => book.availableCopies > 0);
    setAllBooks(availableBooks);
    
    if (availableBooks.length > 0) {
      const firstBatch = getRandomBatch(availableBooks, 0);
      setCurrentBatch(firstBatch);
    }
  }, [getRandomBatch]);

  // Auto-advance slideshow
  useEffect(() => {
    if (!isPlaying || currentBatch.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBookIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        
        if (nextIndex >= currentBatch.length) {
          // Move to next batch
          const nextBatchIndex = currentBatchIndex + 1;
          const newBatch = getRandomBatch(allBooks, nextBatchIndex);
          
          setCurrentBatch(newBatch);
          setCurrentBatchIndex(nextBatchIndex);
          return 0;
        }
        
        return nextIndex;
      });
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [isPlaying, currentBatch.length, currentBatchIndex, allBooks, getRandomBatch]);

  // Handle book click
  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setShowRequestModal(true);
    setRequestNote('');
    setIsPlaying(false); // Pause slideshow when modal opens
  };

  // Handle request submission
  const handleRequestSubmit = async () => {
    if (!selectedBook || !user) return;

    setIsSubmitting(true);
    try {
      const expectedReturnDate = new Date();
      expectedReturnDate.setDate(expectedReturnDate.getDate() + 14);

      const request = DataService.createRequest({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        bookId: selectedBook.id,
        bookTitle: selectedBook.title,
        bookAuthor: selectedBook.author,
        expectedReturnDate: expectedReturnDate.toISOString()
      });

      if (request) {
        addNotification({
          type: 'success',
          title: 'Request Submitted',
          message: `Request for "${selectedBook.title}" submitted successfully!`
        });
        closeModal();
        
        // Refresh books
        const books = DataService.getAllBooks();
        const availableBooks = books.filter(book => book.availableCopies > 0);
        setAllBooks(availableBooks);
        
        if (availableBooks.length > 0) {
          const newBatch = getRandomBatch(availableBooks, currentBatchIndex);
          setCurrentBatch(newBatch);
        }
      } else {
        addNotification({
          type: 'error',
          title: 'Request Failed',
          message: 'Failed to submit request. Please try again.'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'An error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowRequestModal(false);
    setSelectedBook(null);
    setRequestNote('');
    setIsPlaying(true); // Resume slideshow
  };

  const goToNext = () => {
    setCurrentBookIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      
      if (nextIndex >= currentBatch.length) {
        const nextBatchIndex = currentBatchIndex + 1;
        const newBatch = getRandomBatch(allBooks, nextBatchIndex);
        
        setCurrentBatch(newBatch);
        setCurrentBatchIndex(nextBatchIndex);
        return 0;
      }
      
      return nextIndex;
    });
  };

  const goToPrevious = () => {
    setCurrentBookIndex((prevIndex) => {
      if (prevIndex === 0) {
        const prevBatchIndex = currentBatchIndex - 1;
        const newBatch = getRandomBatch(allBooks, prevBatchIndex >= 0 ? prevBatchIndex : Math.ceil(allBooks.length / BOOKS_PER_BATCH) - 1);
        setCurrentBatch(newBatch);
        setCurrentBatchIndex(prevBatchIndex >= 0 ? prevBatchIndex : Math.ceil(allBooks.length / BOOKS_PER_BATCH) - 1);
        return newBatch.length - 1;
      }
      return prevIndex - 1;
    });
  };

  const currentBook = currentBatch[currentBookIndex];

  if (!currentBook) {
    return (
      <div className="w-full h-80 bg-white rounded-2xl shadow-lg mb-8 flex items-center justify-center">
        <div className="text-gray-500 text-xl">Loading books...</div>
      </div>
    );
  }

  return (
    <>
      {/* Modern Slideshow Container */}
      <div className="w-full h-80 bg-white rounded-2xl shadow-lg mb-8 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50"></div>
        
        {/* Book Content */}
        <div 
          className="relative h-full flex items-center cursor-pointer transition-all duration-500 hover:scale-105"
                  >
          {/* Book Image Section */}
          <div className="w-1/3 h-full flex items-center justify-center p-8">
            <div className="relative">
              <div className="w-48 h-64 bg-white rounded-lg shadow-xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src={currentBook.imageUrl || 'https://via.placeholder.com/300x400/4A90E2/FFFFFF?text=No+Image'}
                  alt={currentBook.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x400/4A90E2/FFFFFF?text=No+Image';
                  }}
                />
              </div>
              {/* Availability Badge */}
              <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold ${
                currentBook.availableCopies > 0
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}>
                {currentBook.availableCopies > 0 ? 'Available' : 'Not Available'}
              </div>
            </div>
          </div>

          {/* Book Information Section */}
          <div className="flex-1 p-8 pr-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
                {currentBook.title}
              </h2>
              
              <div className="flex items-center mb-4">
                <span className="text-xl text-gray-600">by</span>
                <span className="text-xl font-semibold text-blue-600 ml-2">{currentBook.author}</span>
              </div>

              <div className="flex items-center mb-6 space-x-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  📚 {currentBook.category}
                </span>
                {currentBook.publishedYear && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    📅 {currentBook.publishedYear}
                  </span>
                )}
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6 line-clamp-3">
                {currentBook.description}
              </p>

              <div className="flex items-center justify-between">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md" onClick={() => handleBookClick(currentBook)}>
                  Request This Book
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 transition-all duration-200"
          >
            ←
          </button>
        </div>

        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 transition-all duration-200"
          >
            →
          </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
          <div 
            className="h-full bg-blue-500 transition-all duration-200"
            style={{ width: `${((currentBookIndex + 1) / currentBatch.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && selectedBook && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">Request Book</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <div className="flex space-x-4 mb-4">
                <img
                  src={selectedBook.imageUrl || 'https://via.placeholder.com/300x400/4A90E2/FFFFFF?text=No+Image'}
                  alt={selectedBook.title}
                  className="w-20 h-28 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x400/4A90E2/FFFFFF?text=No+Image';
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-1">{selectedBook.title}</h4>
                  <p className="text-gray-600 text-sm mb-1">by {selectedBook.author}</p>
                  <p className="text-gray-500 text-xs mb-2">{selectedBook.category}</p>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    selectedBook.availableCopies > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedBook.availableCopies > 0 ? 'Available' : 'Not Available'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="requestNote" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                id="requestNote"
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Any specific requirements or notes..."
                disabled={isSubmitting}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 font-semibold text-sm transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestSubmit}
                disabled={isSubmitting || selectedBook.availableCopies === 0}
                className={`flex-1 px-4 py-2.5 rounded-lg font-semibold shadow-md text-sm transition-all duration-200 ${
                  selectedBook.availableCopies === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isSubmitting
                    ? 'bg-blue-400 text-white cursor-wait'
                    : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg'
                }`}
              >
                {isSubmitting ? 'Submitting...' : selectedBook.availableCopies === 0 ? 'Not Available' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModernBookSlideshow;
