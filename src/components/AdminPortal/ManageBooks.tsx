import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { DataService } from '../../services/dataService';
import { useNotification } from '../../contexts/NotificationContext';
import QuickActions from '../common/QuickActions';
import type { Book } from '../../types';

const ManageBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    description: '',
    totalCopies: 1,
    availableCopies: 1,
    publisher: '',
    publishedYear: new Date().getFullYear(),
  });

  const { addNotification } = useNotification();

  useEffect(() => {
    refreshBooks();
  }, []);

  const refreshBooks = () => {
    const allBooks = DataService.getAllBooks();
    setBooks(allBooks);
  };

  const handleAddBook = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: '',
      description: '',
      totalCopies: 1,
      availableCopies: 1,
      publisher: '',
      publishedYear: new Date().getFullYear(),
    });
    setDialogOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      description: book.description,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      publisher: book.publisher || '',
      publishedYear: book.publishedYear || new Date().getFullYear(),
    });
    setDialogOpen(true);
  };

  const handleSaveBook = () => {
    if (!formData.title || !formData.author || !formData.isbn || !formData.category) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    if (formData.availableCopies > formData.totalCopies) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Available copies cannot exceed total copies'
      });
      return;
    }

    try {
      if (editingBook) {
        const success = DataService.updateBook(editingBook.id, formData);
        if (success) {
          addNotification({
            type: 'success',
            title: 'Book Updated',
            message: 'Book information has been updated successfully'
          });
        }
      } else {
        const newBook = DataService.addBook(formData);
        addNotification({
          type: 'success',
          title: 'Book Added',
          message: `"${newBook.title}" has been added to the catalog`
        });
      }
      
      refreshBooks();
      setDialogOpen(false);
    } catch {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'An error occurred while saving the book'
      });
    }
  };

  const handleDeleteBook = (book: Book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteBook = () => {
    if (!bookToDelete) return;

    const success = DataService.deleteBook(bookToDelete.id);
    if (success) {
      addNotification({
        type: 'success',
        title: 'Book Deleted',
        message: `"${bookToDelete.title}" has been removed from the catalog`
      });
      refreshBooks();
    } else {
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: 'Failed to delete the book'
      });
    }
    
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  const categories = DataService.getCategories();

  return (
    <Container maxWidth={false} sx={{ py: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', width: '100%', px: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
            📚 Manage Books 📚
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            Add, edit, and manage the book catalog
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddBook}
        >
          Add New Book
        </Button>
      </Box>

      {/* Statistics */}
      <Box sx={{ mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip 
            label={`Total Books: ${books.length}`} 
            color="primary" 
          />
          <Chip 
            label={`Available: ${books.filter(b => b.availableCopies > 0).length}`} 
            color="success" 
          />
          <Chip 
            label={`Categories: ${categories.length}`} 
            color="info" 
          />
        </Box>
      </Box>

      {/* Books Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book Details</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Copies</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2">
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      by {book.author}
                    </Typography>
                    {book.publisher && (
                      <Typography variant="caption" color="textSecondary">
                        {book.publisher} ({book.publishedYear})
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={book.category} size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {book.isbn}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {book.totalCopies}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${book.availableCopies} available`}
                    color={book.availableCopies > 0 ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title="Edit Book">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditBook(book)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Book">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteBook(book)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Book Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBook ? 'Edit Book' : 'Add New Book'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Author *"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="ISBN *"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category *</InputLabel>
              <Select
                value={formData.category}
                label="Category *"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
                <MenuItem value="Programming">Programming</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="Psychology">Psychology</MenuItem>
                <MenuItem value="Science">Science</MenuItem>
                <MenuItem value="Fiction">Fiction</MenuItem>
                <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <Box display="flex" gap={2}>
              <TextField
                label="Total Copies *"
                type="number"
                value={formData.totalCopies}
                onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value) || 1 })}
                margin="normal"
                inputProps={{ min: 1 }}
              />
              <TextField
                label="Available Copies *"
                type="number"
                value={formData.availableCopies}
                onChange={(e) => setFormData({ ...formData, availableCopies: parseInt(e.target.value) || 1 })}
                margin="normal"
                inputProps={{ min: 0, max: formData.totalCopies }}
              />
            </Box>
            <TextField
              fullWidth
              label="Publisher"
              value={formData.publisher}
              onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Published Year"
              type="number"
              value={formData.publishedYear}
              onChange={(e) => setFormData({ ...formData, publishedYear: parseInt(e.target.value) || new Date().getFullYear() })}
              margin="normal"
              inputProps={{ min: 1000, max: new Date().getFullYear() + 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveBook} variant="contained">
            {editingBook ? 'Update' : 'Add'} Book
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{bookToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteBook} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <QuickActions />
    </Container>
  );
};

export default ManageBooks;
