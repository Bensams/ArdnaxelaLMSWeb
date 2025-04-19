import { useState } from 'react';
import { Navbar, Nav, Container, Button, Dropdown, Form, FormControl } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

const AppNavbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { user, token, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home after logout
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
      navigate('/books'); // Redirect to books page after search
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Container fluid >
        <Navbar.Brand as={Link} to="/" className="me-3">Ardnaxela LMS</Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">

          {/* Search Form - not included in collapse */}
          <Form className="d-flex me-auto pe-3" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search books..."
              className="me-2"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-light" type="submit">Search</Button>
          </Form>

          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="text-white hover-effect">Home</Nav.Link>
            <Nav.Link as={Link} to="/books" className="text-white hover-effect">Books</Nav.Link>
            <Nav.Link as={Link} to="/about" className="text-white hover-effect">About Our Team</Nav.Link>
          </Nav>
          
          <Nav className="align-items-center">
            {token && <NotificationDropdown />} {/* Add notification dropdown */}
            
            {token ? (
              <Dropdown align="end">
                <Dropdown.Toggle as={Nav.Link} className="text-white">
                  Welcome, {user?.username || 'User'}
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end">
                  <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button 
                  variant="outline-warning" 
                  className="me-5 my-1 my-lg-0"
                  onClick={() => navigate('/guest-return')}
                >Guest Borrowing Status</Button>

                
                <Button 
                  variant="outline-light" 
                  className="me-2 my-1 my-lg-0"
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
                <Button 
                  variant="light"
                  className="my-1 my-lg-0"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;