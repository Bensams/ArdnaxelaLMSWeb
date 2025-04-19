// src/api/books.js
import { publicAxios, authAxios } from './axiosInstances';

const booksAPI = {
  // Public endpoints
  getAllBooks: () => {
    return publicAxios.get('/api/books');
  },

  getBookById: (id) => {
    return publicAxios.get(`/api/books/${id}`);
  },

  // Authenticated endpoints
  createBook: (bookData) => {
    return authAxios.post('/api/books', bookData);
  },

  updateBook: (id, bookData) => {
    return authAxios.put(`/api/books/${id}`, bookData);
  },

  deleteBook: (id) => {
    return authAxios.delete(`/api/books/${id}`);
  },

  // Add other book-related endpoints as needed
};

export default booksAPI;