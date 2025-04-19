import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import { publicAxios } from '../api/axiosInstances';

import BookArrive from '../assets/images/NewBookArrive.jpeg';

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await publicAxios.get('/api/notifications/new-arrivals');
        setNewArrivals(response.data);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const libraryImages = [
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  ];

  return (
    <Container className="my-5">
      
      {/* New Arrivals Carousel */}
      <Row className="mb-5">
        <Col>
          <h2 className="text-center mb-4">New Book Arrivals</h2>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : newArrivals.length > 0 ? (
            <Carousel fade indicators={false} interval={5000} className="carousel-dark">
              {newArrivals.map((arrival, index) => (
                <Carousel.Item key={index}>
                  <div className="d-flex justify-content-center">
                    <Card style={{ width: '60%' }} className="shadow">
                      <Card.Img 
                        variant="top" 
                        src={arrival.book?.imageUrl || BookArrive} 
                        alt={arrival.book?.title}
                        style={{ height: '300px', objectFit: 'fill' }}
                      />
                      <Card.Body className="text-center">
                        <Card.Title>{arrival.book?.title}</Card.Title>
                        <Card.Text>
                          {arrival.message}
                        </Card.Text>
                        <small className="text-muted">
                          Arrived on: {new Date(arrival.createdAt).toLocaleDateString()}
                        </small>
                      </Card.Body>
                    </Card>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <p className="text-center text-muted">No new arrivals at the moment</p>
          )}
        </Col>
      </Row>

      <Row className="justify-content-center mb-5">
        <Col md={8} className="text-center">
          <h1 className="display-4">Welcome to Ardnaxela LMS</h1>
          <p className="lead">
            We make it easy for you to find, search, and borrow books.
          </p>
        </Col>
      </Row>

      {/* Original Features Row */}
      <Row className="g-4">
        {libraryImages.map((image, index) => (
          <Col key={index} md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src={image} alt="Library related" />
              <Card.Body>
                <Card.Title className="text-center">
                  {index === 0 && 'Find Books'}
                  {index === 1 && 'Search Easily'}
                  {index === 2 && 'Borrow Conveniently'}
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;