import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import guestAPI from '../api/guest';
import BorrowedBooks from './BorrowedBooks';

const GuestReturn = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [borrowings, setBorrowings] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // Track if search was attempted

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setHasSearched(true); // Mark that search was attempted
    
    try {
      const params = new URLSearchParams();
      if (searchCriteria.name) params.append('name', searchCriteria.name);
      if (searchCriteria.email) params.append('email', searchCriteria.email);
      if (searchCriteria.phone) params.append('phone', searchCriteria.phone);
      
      const response = await guestAPI.searchActiveBorrowings(params.toString());
      setBorrowings(response.data);
      
      if (response.data.length === 0) {
        setError('No borrowings found with the provided information');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search for borrowings');
      setBorrowings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Guest Book Management</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSearch} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Guest Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={searchCriteria.name}
            onChange={handleInputChange}
            placeholder="Enter guest name"
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={searchCriteria.email}
            onChange={handleInputChange}
            placeholder="Enter guest email"
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            name="phone"
            value={searchCriteria.phone}
            onChange={handleInputChange}
            placeholder="Enter guest phone number"
          />
        </Form.Group>
        
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search Borrowings'}
        </Button>
      </Form>
      
      {/* Only show BorrowedBooks if we have results or haven't searched yet */}
      {(borrowings.length > 0 || !hasSearched) && (
        <BorrowedBooks 
          borrowings={borrowings} 
          isGuestView={true} 
          error={error && borrowings.length === 0 ? error : null} 
        />
      )}
    </Container>
  );
};

export default GuestReturn;