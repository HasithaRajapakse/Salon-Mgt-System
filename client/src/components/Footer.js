// src/components/Footer.js
import React from 'react';
import './footer.css'; 

import { SocialIcon } from 'react-social-icons';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-column">
        <h3>Hours</h3>
        <ul>
          <li>Monday-Friday: 9:00 AM - 8:00 PM</li>
          <li>Saturday: 10:00 AM - 6:00 PM</li>
          <li>Sunday: 10:00 AM - 6:00 PM</li>
        </ul>
      </div>
      <div className="footer-column">
        <h3>Location</h3>
        <p>Main Street, Eheliyagoda</p>
      </div>
      <div className="footer-column">
        <h3>Contact</h3>
        <p>Phone: (+94) 76 3896966</p>
        <p>Email: info@salon@gmail.com</p>
      </div>
      <div className="footer-social-icons">
      <SocialIcon url="https://www.facebook.com" /> {/* Facebook icon */}
      <SocialIcon url="https://www.twitter.com" /> {/* Twitter icon */}
      <SocialIcon url="https://www.youtube.com" /> {/* YouTube icon */}
      <SocialIcon url="https://www.whatsapp.com" /> {/* Whatsapp icon */}
     
      </div>

      
      
    </footer>
    

  );
};

export default Footer;
