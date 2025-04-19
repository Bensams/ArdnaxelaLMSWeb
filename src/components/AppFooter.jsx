import React from 'react';
import "bootstrap-icons/font/bootstrap-icons.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-4 pb-2 mt-5">
      <div className="container">
        <div className="row">
          {/* Column 1 */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5>About Us</h5>
            <p className="text-white">
                We make it easy for you to find, search, and borrow books.
            </p>
          </div>
          
          {/* Column 2 - Quick Links */}
          <div className="col-md-2 mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white">Home</a></li>
              <li><a href="/about" className="text-white">About Our Team</a></li>
              <li><a href="/services" className="text-white">Services</a></li>
              <li><a href="/contact" className="text-white">Contact</a></li>
            </ul>
          </div>
          
          {/* Column 3 - Contact Info */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h5>Contact Us</h5>
            <address className="text-muted">
              <p className="text-white"><i className="bi bi-geo-alt-fill me-2"></i> 123 Main St, City</p>
              <p className="text-white"><i className="bi bi-envelope-fill me-2"></i> info@example.com</p>
              <p className="text-white"><i className="bi bi-telephone-fill me-2"></i> +1 (123) 456-7890</p>
            </address>
          </div>
          
          {/* Column 4 - Social Media */}
          <div className="col-md-3">
            <h5>Follow Us</h5>
            <div className="social-links">
              <a href="#" className="text-white me-3" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-white me-3" aria-label="Twitter">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-white me-3" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-white me-3" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="row mt-3">
          <div className="col-12 text-center">
            <p className="mb-0 text-white">
              &copy; {new Date().getFullYear()} Ardnaxela LMS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;