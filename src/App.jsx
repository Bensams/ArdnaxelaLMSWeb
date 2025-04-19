import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import BookPagination from './components/BookPagination';
import AppNavbar from './components/AppNavbar';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import AppFooter from './components/AppFooter';
import Logout from './components/Logout';
import ProfileLayout from './components/Profile/ProfileLayout';
import UserInformation from './components/Profile/UserInfo';
import BorrowedBooks from './components/BorrowedBooks';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { DataProvider } from './Context/DataContext';
import AutoLogout from './components/AutoLogout';
import GuestReturn from './components/GuestStatus';
import booksAPI from './api/books';
import { ToastProvider } from './Context/ToastContext';
import { ToastContainer } from 'react-bootstrap';

function App() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await booksAPI.getAllBooks() ; //publicAxios.get('/api/books')
        setBooks(response.data);
        setFilteredBooks(response.data);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.response?.data?.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('authToken'); // Uncomment if using
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredBooks(books); // If search is empty, show all books
      return;
    }
    
    const lowerCaseQuery = query.toLowerCase();
    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(lowerCaseQuery) || 
      book.author.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredBooks(filtered);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading books...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">Error: {error}</div>;
  }

  return (
    <DataProvider>
    <AuthProvider>
    <ToastProvider>
    <AutoLogout />
    <ToastContainer position="bottom-right" className="p-3" style={{ zIndex: 11 }} />
    <div className="app">
      <header>
        <AppNavbar onSearch={handleSearch}
        />
      </header>
      
      <div className="d-flex flex-column min-vh-100 w-100">
        <main className="main-content">
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/books" 
                element={<BookPagination books={filteredBooks} />} 
              />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/guest-return" element={<GuestReturn />} />
              <Route path="Guest-borrowed-books" element={<BorrowedBooks  />} />

              <Route path="/profile" element={<ProtectedRoute><ProfileLayout /></ProtectedRoute>}>
              <Route index element={<ProtectedRoute><UserInformation /></ProtectedRoute>} />
              <Route path="information" element={<ProtectedRoute><UserInformation /></ProtectedRoute>} />
              <Route path="borrowed-books" element={<ProtectedRoute><BorrowedBooks /></ProtectedRoute>} />
              </Route>

              {/* Protected routes */}
              {/* <Route path="/books" element={
                  <ProtectedRoute>
                      <BookPagination />
                  </ProtectedRoute>
              } /> */}

            </Routes>
          </div>
        </main>
        <footer><AppFooter /></footer>
      </div>
    </div>
    </ToastProvider>
    </AuthProvider>
    </DataProvider>
  );
}

export default App;