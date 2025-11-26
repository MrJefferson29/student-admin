import React, { useMemo, useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import { libraryAPI } from '../../utils/api';

const defaultForm = {
  title: '',
  author: '',
  category: '',
  description: '',
  publishedDate: '',
};

const ManageLibrary = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await libraryAPI.getAll();
      if (response.success) {
        setBooks(response.data || []);
      }
    } catch (err) {
      console.error('Fetch books error:', err);
      setError('Unable to load library books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const set = new Set(books.map((book) => book.category || 'General'));
    return ['All', ...Array.from(set)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesCategory =
        categoryFilter === 'All' || (book.category || 'General') === categoryFilter;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        book.title.toLowerCase().includes(query) ||
        (book.author || '').toLowerCase().includes(query) ||
        (book.description || '').toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [books, categoryFilter, search]);

  const handleOpenDialog = (book = null) => {
    if (book) {
      setSelectedBook(book);
      setFormData({
        title: book.title || '',
        author: book.author || '',
        category: book.category || '',
        description: book.description || '',
        publishedDate: book.publishedDate || '',
      });
      setFile(null);
    } else {
      setSelectedBook(null);
      setFormData(defaultForm);
      setFile(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedBook(null);
    setFormData(defaultForm);
    setFile(null);
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!selectedBook && !file) {
      setError('Please upload a PDF file for the book.');
      return;
    }

    try {
      const payload = new FormData();
      payload.append('title', formData.title.trim());
      if (formData.author) payload.append('author', formData.author);
      if (formData.category) payload.append('category', formData.category);
      if (formData.description) payload.append('description', formData.description);
      if (formData.publishedDate) payload.append('publishedDate', formData.publishedDate);
      if (file) payload.append('pdf', file);

      if (selectedBook) {
        await libraryAPI.update(selectedBook._id, payload);
      } else {
        await libraryAPI.create(payload);
      }

      handleCloseDialog();
      fetchBooks();
    } catch (err) {
      console.error('Save book error:', err);
      setError(err.response?.data?.message || 'Failed to save book.');
    }
  };

  const handleDelete = async () => {
    if (!selectedBook) return;
    try {
      await libraryAPI.delete(selectedBook._id);
      setDeleteDialogOpen(false);
      setSelectedBook(null);
      fetchBooks();
    } catch (err) {
      console.error('Delete book error:', err);
      setError(err.response?.data?.message || 'Failed to delete book.');
    }
  };

  const renderBookCard = (book) => (
    <Grid item xs={12} sm={6} md={4} key={book._id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <MenuBookIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              {book.title}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {book.author || 'Unknown author'}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip label={book.category || 'General'} size="small" />
            {book.publishedDate && <Chip label={book.publishedDate} size="small" color="primary" />}
          </Stack>
          {book.description && (
            <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
              {book.description.length > 100 ? `${book.description.slice(0, 100)}...` : book.description}
            </Typography>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Button
            size="small"
            startIcon={<PdfIcon />}
            onClick={() => window.open(book.pdfUrl, '_blank', 'noopener')}
          >
            View PDF
          </Button>
          <Box>
            <IconButton color="primary" onClick={() => handleOpenDialog(book)}>
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => {
                setSelectedBook(book);
                setDeleteDialogOpen(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardActions>
      </Card>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Digital Library
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload and manage books for students to read in the app.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Book
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by title, author, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TextField
          select
          label="Category"
          SelectProps={{ native: true }}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </TextField>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : filteredBooks.length > 0 ? (
        <Grid container spacing={3}>
          {filteredBooks.map((book) => renderBookCard(book))}
        </Grid>
      ) : (
        <Card sx={{ p: 4 }}>
          <Typography variant="h6" color="text.secondary" align="center">
            No books found. Use the “Add Book” button to upload one.
          </Typography>
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedBook ? 'Edit Book' : 'Add Book'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              margin="normal"
              required
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Author"
              margin="normal"
              value={formData.author}
              onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Category"
              margin="normal"
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Published Date"
              margin="normal"
              placeholder="e.g. 2024"
              value={formData.publishedDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, publishedDate: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" component="label" startIcon={<PdfIcon />}>
                {file ? file.name : 'Upload PDF'}
                <input type="file" hidden accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </Button>
              {selectedBook?.pdfUrl && !file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Current file:{' '}
                  <Button variant="text" size="small" onClick={() => window.open(selectedBook.pdfUrl, '_blank', 'noopener')}>
                    Open current PDF
                  </Button>
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedBook ? 'Save Changes' : 'Create Book'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{selectedBook?.title}&quot; by {selectedBook?.author || 'Unknown'}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageLibrary;

