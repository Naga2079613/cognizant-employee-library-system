import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  InputAdornment,
  Divider,
  Rating,
  Badge,
} from '@mui/material';
import { 
  Search, 
  Book, 
  CalendarToday, 
  Business, 
  CheckCircle, 
  Error,
  BookmarkBorder,
  Person
} from '@mui/icons-material';
import { DataService } from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import type { Book as BookType } from '../../types';

const BookCatalog = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  
  const { user } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    const allBooks = DataService.getAllBooks();
    setBooks(allBooks);
    setFilteredBooks(allBooks);
  }, []);

  useEffect(() => {
    let filtered = books;

    if (searchQuery) {
      filtered = DataService.searchBooks(searchQuery, selectedCategory || undefined);
    } else if (selectedCategory) {
      filtered = books.filter(book => book.category === selectedCategory);
    }

    setFilteredBooks(filtered);
  }, [searchQuery, selectedCategory, books]);

  const categories = DataService.getCategories();

  const handleRequestBook = (book: BookType) => {
    if (book.availableCopies === 0) {
      addNotification({
        type: 'error',
        title: 'Book Unavailable',
        message: 'This book is currently out of stock.'
      });
      return;
    }

    setSelectedBook(book);
    setRequestDialogOpen(true);
    
    // Set default return date to 14 days from now
    const defaultReturnDate = new Date();
    defaultReturnDate.setDate(defaultReturnDate.getDate() + 14);
    setExpectedReturnDate(defaultReturnDate.toISOString().split('T')[0]);
  };

  const handleSubmitRequest = () => {
    if (!selectedBook || !user || !expectedReturnDate) return;

    DataService.createRequest({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      bookAuthor: selectedBook.author,
      expectedReturnDate: expectedReturnDate
    });

    addNotification({
      type: 'success',
      title: 'Request Submitted',
      message: `Your request for "${selectedBook.title}" has been submitted successfully.`
    });

    setRequestDialogOpen(false);
    setSelectedBook(null);
    setExpectedReturnDate('');
    
    // Refresh books to update availability
    const updatedBooks = DataService.getAllBooks();
    setBooks(updatedBooks);
  };

  const handleCloseDialog = () => {
    setRequestDialogOpen(false);
    setSelectedBook(null);
    setExpectedReturnDate('');
  };

  return (
    <Container maxWidth={false} sx={{ py: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', width: '100%', px: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4, color: 'white' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          📚 Book Catalog 📚
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Browse and request books from our library
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Box 
        sx={{ 
          mb: 4,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          p: 3,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
            gap: 2 
          }}
        >
          <TextField
            fullWidth
            placeholder="Search books by title, author, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'white',
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'primary.main' }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl 
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'white',
                }
              }
            }}
          >
            <InputLabel sx={{ color: 'text.primary' }}>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Results Info */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          mb: 3,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          p: 2,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
          📖 Showing {filteredBooks.length} of {books.length} books
        </Typography>
        {searchQuery && (
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mt: 0.5 }}>
            Search results for: "{searchQuery}"
          </Typography>
        )}
      </Box>

      {/* Books Grid - 4 per row, equal sizes */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)' 
          },
          gap: 3 
        }}
      >
        {filteredBooks.map((book) => (
          <Card 
            key={book.id}
            sx={{ 
              height: '380px', 
              display: 'flex', 
              flexDirection: 'column',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
              },
            }}
          >
                       <CardContent sx={{ flexGrow: 1, p: 3, pb: 1 }}>
              {/* Header Section */}
              <Box display="flex" alignItems="flex-start" mb={2}>
                <Avatar 
                  sx={{ 
                    mr: 2, 
                    bgcolor: 'primary.main',
                    width: 48,
                    height: 48,
                    fontSize: '1.2rem'
                  }}
                >
                  <Book />
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    sx={{ 
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.3,
                      height: '2.6em',
                      color: 'text.primary',
                      mb: 0.5
                    }}
                  >
                    {book.title}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Person sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: 500
                      }}
                    >
                      {book.author}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              {/* Description */}
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.4,
                  height: '2.5em',
                  color: 'text.secondary',
                  fontStyle: 'italic'
                }}
              >
                "{book.description}"
              </Typography>
              
              <Divider sx={{ my: 2 }} />

              {/* Book Details */}
              <Box sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                  <BookmarkBorder sx={{ fontSize: 16, color: 'primary.main' }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {book.category}
                  </Typography>
                </Box>
                
                {book.publisher && (
                  <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                    <Business sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {book.publisher}
                    </Typography>
                  </Box>
                )}
                
                {book.publishedYear && (
                  <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                    <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Published {book.publishedYear}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Availability Status */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Chip 
                  label={`${book.availableCopies} of ${book.totalCopies} available`}
                  size="small"
                  color={book.availableCopies > 0 ? 'success' : 'error'}
                  variant="filled"
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '0.75rem'
                  }}
                />
                {book.availableCopies > 0 && (
                  <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                    ✓ Available
                  </Typography>
                )}
              </Box>

              {/* ISBN Info */}
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.7rem' }}>
                ISBN: {book.isbn}
              </Typography>
            </CardContent>
            
            <CardActions sx={{ p: 3, pt: 0 }}>
              <Button
                fullWidth
                variant={book.availableCopies > 0 ? "contained" : "outlined"}
                onClick={() => handleRequestBook(book)}
                disabled={book.availableCopies === 0}
                sx={{ 
                  height: '42px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  borderRadius: '10px',
                  ...(book.availableCopies === 0 && {
                    backgroundColor: 'grey.100',
                    color: 'text.disabled',
                    border: '1px solid',
                    borderColor: 'grey.300'
                  })
                }}
                startIcon={book.availableCopies === 0 ? <Error /> : <Book />}
              >
                {book.availableCopies === 0 ? 'Out of Stock' : 'Request Book'}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {filteredBooks.length === 0 && (
        <Box 
          textAlign="center" 
          mt={6}
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            p: 4,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Book sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.5)', mb: 2 }} />
          <Typography variant="h5" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
            No books found
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
            We couldn't find any books matching your search criteria
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Try adjusting your search terms or browse different categories
          </Typography>
        </Box>
      )}

      {/* Request Dialog */}
      <Dialog open={requestDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Request Book</DialogTitle>
        <DialogContent>
          {selectedBook && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedBook.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                by {selectedBook.author}
              </Typography>
              
              <Box mt={3}>
                <TextField
                  fullWidth
                  label="Expected Return Date"
                  type="date"
                  value={expectedReturnDate}
                  onChange={(e) => setExpectedReturnDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
                  }}
                />
              </Box>
              
              <Typography variant="body2" color="textSecondary" mt={2}>
                You can keep the book for up to 30 days. Please ensure to return it by the specified date.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitRequest} 
            variant="contained"
            disabled={!expectedReturnDate}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookCatalog;
