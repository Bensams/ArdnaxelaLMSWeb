import { Card, ListGroup, Button, Modal, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import membersAPI from '../../api/members';

const UserInformation = () => {
  const [userInfo, setUserInfo] = useState({
    name: "test",
    email: "test@gmail.com",
    phoneNumber: null,
    address: null,
    username: "test",
    createdAt: "2025-04-09T11:19:18.591993"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: ""
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await membersAPI.getProfile();
        setUserInfo(response.data);
        // Initialize form data with current user info
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          phoneNumber: response.data.phoneNumber || "",
          address: response.data.address || ""
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user info');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await membersAPI.updateProfile(formData);
      setUserInfo(response.data);
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>My Information</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Name:</strong> {userInfo?.name || "Not provided"}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Username:</strong> {userInfo?.username}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Email:</strong> {userInfo?.email}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Phone:</strong> {userInfo?.phoneNumber || "Not provided"}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Address:</strong> {userInfo?.address || "Not provided"}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Member Since:</strong> {new Date(userInfo?.createdAt).toLocaleDateString()}
            </ListGroup.Item>
          </ListGroup>
          <Button 
            variant="primary" 
            className="mt-3"
            onClick={() => setShowModal(true)}
          >
            Update Information
          </Button>
        </Card.Body>
      </Card>

      {/* Update Information Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Optional"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Optional"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default UserInformation;