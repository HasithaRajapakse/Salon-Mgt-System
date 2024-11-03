import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ArtistHomePage.css'; 

function ArtistHomePage() {
  const [artistId, setArtistId] = useState('');
  const [artistName, setArtistName] = useState('');

  useEffect(() => {
    // Retrieve artist id and name from localStorage
    const storedArtistId = localStorage.getItem('artistId');
    const storedArtistName = localStorage.getItem('artistName');

    // Set state with retrieved values
    setArtistId(storedArtistId);
    setArtistName(storedArtistName);
  }, []); 

  return (
    <div className="artist-homepage">
      {/* Display artist name and id */}
      <div className="artist-header">
        <h1>Artist ID: {artistId}</h1>
        <h2>Artist Name: {artistName}</h2>
      </div>

      {/* Vertical navbar */}
      <div className="vertical-navbar">
        <div className="navbar-links">
          <Link to="#upcoming-bookings" className="nav-link">Upcoming Bookings</Link>
          <Link to="#apply-leaves" className="nav-link">Apply Leaves</Link>
         
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Sections for different links */}
        <section id="upcoming-bookings">
          <h3>Upcoming Bookings</h3>
          <p>List of upcoming bookings can be displayed here.</p>
        </section>

        <section id="apply-leaves">
          <h3>Apply Leaves</h3>
          <p>Form or information related to applying leaves can be displayed here.</p>
        </section>

        {/* Additional sections for other links */}
      </div>
    </div>
  );
}

export default ArtistHomePage;
