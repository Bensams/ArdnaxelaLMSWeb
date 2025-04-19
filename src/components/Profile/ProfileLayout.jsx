import { useState } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Outlet, useNavigate } from 'react-router-dom';

const ProfileLayout = () => {
  const [activeKey, setActiveKey] = useState('information');
  const navigate = useNavigate();

  const handleSelect = (selectedKey) => {
    setActiveKey(selectedKey);
    navigate(`/profile/${selectedKey}`);
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={3} className="mb-4">
          <Nav variant="pills" className="flex-column" activeKey={activeKey} onSelect={handleSelect}>
            <Nav.Item>
              <Nav.Link eventKey="information">My Information</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="borrowed-books">Borrowed Books</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md={9}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileLayout;