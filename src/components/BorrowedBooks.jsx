import { useState, useEffect } from 'react';
import { Nav, Card, Table, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../Context/AuthContext';
import membersAPI from '../api/members';

const statuses = ['all', 'borrowed', 'returned', 'overdue', 'pending', 'cancelled'];

const BorrowedBooks = ({ isGuestView = false, borrowings: externalBorrowings = [], error: externalError = null }) => {
  const [activeStatus, setActiveStatus] = useState('all');
  const [borrowings, setBorrowings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchBorrowings = async () => {
      try {
        let response;
        
        if (isGuestView) {
          // If borrowings are passed from parent (GuestReturn), use those
          if (externalBorrowings.length > 0) {
            setBorrowings(externalBorrowings);
            return;
          }
          // Otherwise, don't fetch for guest view - let GuestReturn handle it
          setIsLoading(false);
          return;
        } else if (token) {
          // For logged-in users
          response = await membersAPI.getBorrowedBooks();
          setBorrowings(response.data);
        } else {
          throw new Error('Authentication required to view your borrowings');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBorrowings();
  }, [isGuestView, token, externalBorrowings]);

  const getStatusBadge = (status) => {
    const variants = {
      borrowed: 'primary',
      returned: 'success',
      overdue: 'danger',
      pending: 'warning',
      cancelled: 'secondary'
    };
    return <Badge bg={variants[status.toLowerCase()]}>{status.toLowerCase()}</Badge>;
  };

  const filteredBorrowings = activeStatus === 'all' 
    ? borrowings 
    : borrowings.filter(item => item.status.toLowerCase() === activeStatus);

  if (isLoading) return <div>Loading...</div>;
  if (externalError) return <Alert variant="danger">{externalError}</Alert>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (borrowings.length === 0) return <Alert variant="info">No borrowings found</Alert>;

  return (
    <Card>
      <Card.Body>
        <Card.Title>{isGuestView ? 'Guest Borrowings' : 'My Borrowed Books'}</Card.Title>
        
        <Nav variant="pills" activeKey={activeStatus} onSelect={setActiveStatus} className="mb-4">
          {statuses.map(status => (
            <Nav.Item key={status}>
              <Nav.Link eventKey={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>{isGuestView ? 'Guest Info' : 'Details'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredBorrowings.map(borrowing => (
              <tr key={borrowing.id}>
                <td>{borrowing.book.title}</td>
                <td>{getStatusBadge(borrowing.status)}</td>
                <td>{new Date(borrowing.borrowDate).toLocaleDateString()}</td>
                <td>{borrowing.dueDate ? new Date(borrowing.dueDate).toLocaleDateString() : '-'}</td>
                <td>{borrowing.returnedDate ? new Date(borrowing.returnedDate).toLocaleDateString() : '-'}</td>
                <td>
                  {isGuestView ? (
                    <>
                      {borrowing.guestName}<br />
                      {borrowing.guestEmail || borrowing.guestPhone}
                    </>
                  ) : (
                    borrowing.member ? `Member: ${borrowing.member.username}` : 'Guest borrowing'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default BorrowedBooks;