import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

import juperImage from '../assets/images/Jupeta.jpg';
import benedictImage from '../assets/images/Benedict.jpg';
import angeloImage from '../assets/images/AngeloGo.jfif';

const About = () => {
  const teamMembers = [
    {
      name: "Juper Del Rosario",
      role: "Designer",
      image: juperImage,
      description: "Responsible for creating intuitive and beautiful user interfaces."
    },
    {
      name: "Benedict Paul S. Samson",
      role: "Fullstack Developer",
      image: benedictImage,
      description: "Builds the core functionality and ensures smooth system operation."
    },
    {
      name: "Angelo Go",
      role: "Documentarian",
      image: angeloImage,
      description: "Maintains comprehensive documentation for users and developers."
    }
  ];

  return (
    <Container className="my-5">
      <Row className="justify-content-center mb-5">
        <Col md={8} className="text-center">
          <h1 className="display-4">About Our Team</h1>
          <p className="lead">
            Meet the talented individuals behind Ardnaxela LMS
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        {teamMembers.map((member, index) => (
          <Col key={index} md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Img 
                variant="top" 
                src={member.image} 
                alt={member.name}
                style={{ height: '300px', objectFit: 'cover' }}
              />
              <Card.Body className="text-center">
                <Card.Title>{member.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{member.role}</Card.Subtitle>
                <Card.Text>{member.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="my-5">
        <Col className="text-center">
          <h2>Our Mission</h2>
          <p className="lead">
            At Ardnaxela LMS, we're committed to creating a seamless library management experience 
            that connects readers with books effortlessly.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default About;