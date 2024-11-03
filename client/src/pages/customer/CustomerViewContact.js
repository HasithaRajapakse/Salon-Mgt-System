import React from 'react';
import Navbar from './Navbar';
import './CustomerViewContact.css';
import salonImage from '../../assets/2.jpg'; 


function CustomerViewContact() {
  const customerId = localStorage.getItem('customerId');
  const customerName = localStorage.getItem('customerName');
  
  return (
    <div>
      <Navbar customerId={customerId} customerName={customerName} />
      <div className="contact-container">
        <div className="salon-details">
          <img src={salonImage} alt="Salon" className="salon-image" />
          <h2>Salon Buddhika Salon</h2>
          <p><i className="fas fa-map-marker-alt"></i> Mainstreet Eheliyagoda</p>
          <p><i className="fas fa-phone"></i> Telephone number: 0721121492</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
            <a href="https://wa.me/0721121492" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
          </div>
          <h3>Open Hours</h3>
          <p>Monday - Saturday: 8:00 AM - 6:00 PM</p>
          <p>Sunday: 10:00 AM - 8:00 PM</p>
        </div>
        <div className="contact-form">
          <h2>Contact Us</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" className="btn">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomerViewContact;
