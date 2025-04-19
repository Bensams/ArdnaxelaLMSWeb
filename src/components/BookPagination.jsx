import React, { useState } from 'react';
import { Pagination, Button, Modal, Form, Alert, Card, Row, Col } from 'react-bootstrap';
import { useAuth } from '../Context/AuthContext';
import { useData } from '../Context/DataContext';
import guestAPI from '../api/guest';
import membersAPI from '../api/members';

const BookPagination = ({ books, itemsPerPage = 9 }) => {
  // State management
  const { filteredBooks } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showUserBorrowModal, setShowUserBorrowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: '',
    dueDate: '' // Add dueDate field
  });

  const [userDueDate, setUserDueDate] = useState(''); // New state for user due date
  const [borrowSuccess, setBorrowSuccess] = useState(null);
  const [returnSuccess, setReturnSuccess] = useState(null);
  const { user, token } = useAuth();

  // Helper functions for date validation
  const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const getMaxDueDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    maxDate.setHours(0, 0, 0, 0);
    return maxDate.toISOString().split('T')[0];
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(books.length / itemsPerPage);
  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  // Event handlers
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleBorrowClick = (book) => {
    setSelectedBook(book);
    if (token) {
      // For logged-in users
      setShowUserBorrowModal(true);
      // Set default due date (1 week from today)
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 7);
      setUserDueDate(defaultDueDate.toISOString().split('T')[0]);
    } else {
      // For guests
      setShowGuestModal(true);
    }
  };

  const handleUserBorrowSubmit = () => {
    const today = getToday();
    const maxDueDate = new Date(getMaxDueDate());
    const selectedDate = new Date(userDueDate);

    if (selectedDate < today) {
      alert('Due date must be today or in the future');
      return;
    }

    if (selectedDate > maxDueDate) {
      alert('Maximum borrowing period is 3 months');
      return;
    }

    borrowBook(selectedBook, { ...user, dueDate: userDueDate });
    setShowUserBorrowModal(false);
  };

  const handleReturnClick = (book) => {
    returnBook(book);
  };

  const handleGuestInfoChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleGuestBorrowSubmit = () => {
    if (!guestInfo.name) {
      alert('Please provide at least your name');
      return;
    }
    if (!guestInfo.email && !guestInfo.phone) {
      alert('Please provide either an email or a phone number');
      return;
    }

    if (!guestInfo.dueDate) {
      alert('Please select a due date');
      return;
    }

    // Validate due date is not in the past
    const today = getToday();
    const maxDueDate = new Date(getMaxDueDate());
    const selectedDate = new Date(guestInfo.dueDate);

    if (selectedDate < today) {
      alert('Due date must be today or in the future');
      return;
    }

    if (selectedDate > maxDueDate) {
      alert('Maximum borrowing period is 3 months');
      return;
    }

    borrowBook(selectedBook, guestInfo);
    setShowGuestModal(false);
    setGuestInfo({ name: '', email: '', phone: '', dueDate: '' });
  };

  const borrowBook = async (book, borrower) => {
    const dueDate = new Date(borrower.dueDate).toLocaleDateString();
    
    try {
      let response;
      if (token) {
        // For logged-in users
        response = await membersAPI.borrowBook({
          bookId: book.id,
          dueDate: borrower.dueDate
        });
      } else {
        // For guests
        response = await guestAPI.borrowBook({
          bookId: book.id,
          guestName: borrower.name,
          guestEmail: borrower.email,
          guestPhone: borrower.phone,
          dueDate: borrower.dueDate,
        });
      }

      setBorrowSuccess(
        `Successfully borrowed "${book.title}"! Please return by ${dueDate}.` + 
        (borrower.email || borrower.phone 
          ? " Confirmation will be sent to your contact info or follow up to the counter." 
          : "")
      );
      setTimeout(() => setBorrowSuccess(null), 10000);
    } catch (err) {
      console.error('Borrow error:', err);
      alert(err.response?.data?.message || 'Failed to borrow book');
    }
  };

  // TODO: Will not implement returnBook here
  const returnBook = (book) => {
    console.log(`Book "${book.title}" returned`);
    setReturnSuccess(`Successfully returned "${book.title}"`);
    setTimeout(() => setReturnSuccess(null), 5000);
  };

  // Responsive pagination - show fewer items on mobile
  const getPaginationItems = () => {
    const items = [];
    const maxMobilePages = 3; // Show fewer page numbers on mobile
    
    if (totalPages <= maxMobilePages) {
      // Show all pages if there are few enough
      for (let number = 1; number <= totalPages; number++) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </Pagination.Item>
        );
      }
    } else {
      // Show first, current, and last pages on mobile
      items.push(
        <Pagination.Item
          key={1}
          active={1 === currentPage}
          onClick={() => handlePageChange(1)}
        >
          1
        </Pagination.Item>
      );

      if (currentPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }

      if (currentPage > 1 && currentPage < totalPages) {
        items.push(
          <Pagination.Item
            key={currentPage}
            active
            onClick={() => handlePageChange(currentPage)}
          >
            {currentPage}
          </Pagination.Item>
        );
      }

      if (currentPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }

      items.push(
        <Pagination.Item
          key={totalPages}
          active={totalPages === currentPage}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <div className="book-pagination-container">
      {borrowSuccess && <Alert variant="success">{borrowSuccess}</Alert>}
      {returnSuccess && <Alert variant="info">{returnSuccess}</Alert>}
      
      {/* Responsive book list using Cards */}
      <Row className="g-3">
        {currentBooks.map(book => (
          <Col key={book.id} xs={12} sm={6} lg={4}>
            <Card className="h-100">
              <Card.Body>
                <h6>BOOK ID: {book.id} </h6>
                <Card.Title className="text-truncate">{book.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Author: {book.author}</Card.Subtitle>
                <Card.Text>
                  Status: {book.quantity > 0 ? (
                    <span className="text-success">Available</span>
                  ) : (
                    <span className="text-danger">Book Not Available</span>
                  )}
                </Card.Text>
                {book.quantity > 0 ? (
                  <Button 
                    variant="primary" 
                    onClick={() => handleBorrowClick(book)}
                    className="w-100"
                  >
                    Borrow
                  </Button>
                ) : (
                  <Button 
                    variant="secondary" 
                    disabled
                    className="w-100"
                  >
                    Not Available
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Responsive pagination */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination className="flex-wrap">
          <Pagination.First 
            onClick={() => handlePageChange(1)} 
            disabled={currentPage === 1} 
          />
          <Pagination.Prev 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1} 
          />
          
          {getPaginationItems()}
          
          <Pagination.Next 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages} 
          />
          <Pagination.Last 
            onClick={() => handlePageChange(totalPages)} 
            disabled={currentPage === totalPages} 
          />
        </Pagination>
      </div>

      {/* Modal remains unchanged */}
      <Modal show={showGuestModal} onHide={() => setShowGuestModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Your Guest Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>You are borrowing: <strong>{selectedBook?.title}</strong> as a guest.</p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={guestInfo.name}
                onChange={handleGuestInfoChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={guestInfo.email}
                onChange={handleGuestInfoChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={guestInfo.phone}
                onChange={handleGuestInfoChange}
              />
            </Form.Group>
          </Form>

          <Form.Group className="mb-3">
            <Form.Label>Due Date *</Form.Label>
            <Form.Control
              type="date"
              name="dueDate"
              value={guestInfo.dueDate}
              onChange={handleGuestInfoChange}
              min={new Date().toISOString().split('T')[0]} // Set min date to today
              max={getMaxDueDate()} // Add max date limit
              required
            />
            <Form.Text className="text-muted">
              Please select a future date
            </Form.Text>
          </Form.Group>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGuestModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleGuestBorrowSubmit}>
            Confirm Borrow
          </Button>
        </Modal.Footer>
      </Modal>

      {/* New User Borrow Modal */}
      <Modal show={showUserBorrowModal} onHide={() => setShowUserBorrowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Borrow</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You are borrowing: <strong>{selectedBook?.title}</strong></p>
          
          <Form.Group className="mb-3">
            <Form.Label>Return Date *</Form.Label>
            <Form.Control
              type="date"
              value={userDueDate}
              onChange={(e) => setUserDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              max={getMaxDueDate()}
              required
            />
            <Form.Text className="text-muted">
              Please select a return date (max 3 months from today)
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserBorrowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUserBorrowSubmit}>
            Confirm Borrow
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default BookPagination;