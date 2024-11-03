import React from 'react';
import { Carousel, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainContent.css';
import heroImage from '../../assets/booknowimg.png';
import slide1 from '../../assets/1.jpg';
import slide2 from '../../assets/2.jpg';
import slide3 from '../../assets/3.jpg';

const MainContent = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section d-flex">
        <div className="hero-image" style={{ flex: 1, backgroundImage: 'url(' + heroImage + ')', backgroundSize: 'cover', position: 'relative' }}>
          <Button className="custom-button">Book Now</Button>
        </div>
        <div className="carousel-container" style={{ flex: 1 }}>
          <Carousel>
            <Carousel.Item>
              <img src={slide1} alt="First slide" className="d-block w-100" />
            </Carousel.Item>
            <Carousel.Item>
              <img src={slide2} alt="Second slide" className="d-block w-100" />
            </Carousel.Item>
            <Carousel.Item>
              <img src={slide3} alt="Third slide" className="d-block w-100" />
            </Carousel.Item>
          </Carousel>
        </div>
      </div>

      {/* Content Section */}
      <div className="Ajith">
        <h1>Salon Buddhika Salon</h1>
      </div>

      {/* Service Section */}
      <div className="service-section d-flex">
        <div className="service-column" style={{ flex: 1 }}>
          <h3>Services</h3>
          <ul>
            <li>Haircuts for men and women</li>
            <li>Hair coloring and highlights</li>
            <li>Professional makeup</li>
            <li>Manicure and pedicure</li>
            <li>Facial treatments</li>
            <li>Massage therapy</li>
          </ul>
          <Button variant="primary">See More</Button>
        </div>
        <div className="artists-column" style={{ flex: 1 }}>
          <h3>Our Artists</h3>
          <ul>
            <li>John Doe - Senior Hairstylist</li>
            <li>Jane Smith - Makeup Artist</li>
            <li>Michael Brown - Massage Therapist</li>
            <li>Sarah Johnson - Nail Technician</li>
          </ul>
          <Button variant="primary">See More</Button>
        </div>
        <div className="feedback-column" style={{ flex: 1 }}>
          <h3>Customer Feedbacks</h3>
          <ul>
            <li>"Amazing service! Highly recommend." </li>
            <li>"The best salon experience I've ever had."</li>
            <li>"Professional and friendly staff." </li>
            <li>"Love my new hairstyle!" </li>
          </ul>
          <Button variant="primary">See More</Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer bg-dark text-light text-center py-3">
        <div className="container">
          <p>© 2024 Salon Buddhika Salon. All Rights Reserved.</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
            <a href="#"><i className="fab fa-pinterest"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainContent;
