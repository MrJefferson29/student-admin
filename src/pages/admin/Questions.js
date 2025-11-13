import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { questionsAPI, resolveAssetUrl } from '../../utils/api';

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionsAPI.getAll();
      if (response.success) {
        setQuestions(response.data || []);
      } else {
        setError('Failed to fetch questions');
      }
    } catch (err) {
      setError('An error occurred while fetching questions');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      const response = await questionsAPI.delete(questionId);
      if (response.success) {
        setQuestions(questions.filter((q) => q._id !== questionId));
      } else {
        alert('Failed to delete question');
      }
    } catch (err) {
      alert('An error occurred while deleting the question');
      console.error('Error deleting question:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          All Questions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all uploaded questions
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>School</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Level</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Year</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No questions found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              questions.map((question) => (
                <TableRow key={question._id} hover>
                  <TableCell>{question.subject}</TableCell>
                  <TableCell>
                    <Chip label={question.school} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>{question.department}</TableCell>
                  <TableCell>{question.level}</TableCell>
                  <TableCell>{question.year}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => window.open(resolveAssetUrl(question.pdfUrl) || question.pdfUrl, '_blank')}
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(question._id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Questions;

