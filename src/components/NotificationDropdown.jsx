import { useState, useRef, useEffect } from 'react';
import { Nav, Dropdown, Badge, ListGroup, Toast, ToastContainer, Modal, Button, Spinner } from 'react-bootstrap';
import { useNotifications } from '../hooks/useNotifications';
import { useContext } from 'react';
import { ToastContext } from '../Context/ToastContext';

const NotificationDropdown = () => {
  const [lastChecked, setLastChecked] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const pollingIntervalRef = useRef(null);
  const { showNewMessageAlert } = useContext(ToastContext);

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  // Show dismissible toast for new messages
  // const showNewMessageAlert = (newMessages) => {
  //   const message = newMessages.length === 1 
  //     ? `New notification: ${newMessages[0].message}` 
  //     : `You have ${newMessages.length} new notifications`;
  //   showNewMessageAlert(message);
  // };

  // Set up polling interval with cleanup
  useEffect(() => {
    // Initial fetch
    fetchNotifications();
    
    // Set up polling every 30 seconds
    pollingIntervalRef.current = setInterval(fetchNotifications, 30000);
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [fetchNotifications]);

  // Add this useEffect to detect new notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const newMessages = notifications.filter(
        notification => !notification.read && new Date(notification.createdAt) > lastChecked
      );
      if (newMessages.length > 0) {
        // Use the context version
        showNewMessageAlert(
          newMessages.length === 1 
            ? `New notification: ${newMessages[0].message}`
            : `You have ${newMessages.length} new notifications`
        );
        setLastChecked(new Date());
      }
    }
  }, [notifications, lastChecked]);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
    
    // Mark as read if unread
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <>
      <Dropdown 
  align="end" 
  onToggle={(isOpen) => {
    if (isOpen) {
      fetchNotifications();
      setLastChecked(new Date());
    }
  }}
>
        <Dropdown.Toggle as={Nav.Link} className="position-relative">
          {isLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <>
              <i className="bi bi-bell-fill fs-5"></i>
              {unreadCount > 0 && (
                <Badge 
                  pill 
                  bg="danger" 
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ 
                    width: '18px', 
                    height: '18px',
                    fontSize: '0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropdown-menu-end p-0" style={{ minWidth: '300px' }}>
          <Dropdown.Header className="bg-light d-flex justify-content-between">
            <span>Notifications</span>
            <small className="text-muted">
              Last checked: {lastChecked.toLocaleTimeString()}
            </small>
          </Dropdown.Header>
          
          {error ? (
            <Dropdown.Item className="text-center py-3 text-danger">
              {error}
            </Dropdown.Item>
          ) : isLoading ? (
            <Dropdown.Item className="text-center py-3">
              <Spinner animation="border" size="sm" />
            </Dropdown.Item>
          ) : notifications.length === 0 ? (
            <Dropdown.Item className="text-center py-3">No notifications</Dropdown.Item>
          ) : (
            <>
              <ListGroup variant="flush" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {notifications.map(notification => (
                  <ListGroup.Item 
                    key={notification.id}
                    action 
                    onClick={() => handleNotificationClick(notification)}
                    className={notification.read ? 'text-muted' : ''}
                    style={{
                      backgroundColor: notification.read ? '#f8f9fa' : 'white',
                      borderLeft: !notification.read ? '3px solid #dc3545' : '3px solid transparent'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span className={notification.read ? '' : 'fw-bold'}>
                        {notification.message}
                      </span>
                      <small className="text-muted">
                        {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </small>
                    </div>
                    <small className="text-muted d-block">{notification.notificationType}</small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Dropdown.Divider />
              <Dropdown.Item className="text-center" onClick={markAllAsRead}>
                Mark all as read
              </Dropdown.Item>
            </>
          )}
        </Dropdown.Menu>
      </Dropdown>

      {/* Notification Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notification Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNotification && (
            <div>
              <h5 className={selectedNotification.read ? 'text-muted' : 'text-primary'}>
                {selectedNotification.message}
              </h5>
              <p className="text-muted mb-3">{selectedNotification.notificationType}</p>
              <hr />
              <p><strong>Book ID:</strong> {selectedNotification.bookID}</p>
              <p><strong>Received:</strong> {new Date(selectedNotification.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> 
                <Badge bg={selectedNotification.read ? 'secondary' : 'success'} className="ms-2">
                  {selectedNotification.read ? 'Read' : 'Unread'}
                </Badge>
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {selectedNotification && !selectedNotification.read && (
            <Button variant="primary" onClick={() => {
              markAsRead(selectedNotification.id);
              setShowModal(false);
            }}>
              Mark as Read
            </Button>
          )}
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default NotificationDropdown;