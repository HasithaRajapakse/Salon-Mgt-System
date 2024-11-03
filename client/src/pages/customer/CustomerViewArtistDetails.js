import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './CustomerViewArtistDetails.css';

function CustomerViewArtistDetails() {
  const customerId = localStorage.getItem('customerId');
  const customerName = localStorage.getItem('customerName');
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArtistDetails();
  }, []);

  const fetchArtistDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/customer/viewartistdetails/${id}`);
      setArtist(response.data);
    } catch (error) {
      setError('Error fetching artist details. Please try again later.');
      console.error('Error fetching artist details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    navigate(`/CustomerBook?staffId=${artist.staff_id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="details-container">
      <Navbar customerId={customerId} customerName={customerName} />
      <div className="details-wrapper">
        <div className="artist-details">
          <h3>{artist.firstname} {artist.lastname}</h3>
          <img src={`http://localhost:3001/${artist.image}`} alt={`${artist.firstname} ${artist.lastname}`} className="artist-image"/>
          <p>Gender: {artist.gender}</p>
          <p>Email: {artist.email}</p>
          <p>Staff ID: {artist.staff_id}</p>
          <div className="button-container2">
           
            <button className="btn btn-book" onClick={handleBookNow}>Book Now</button>
          </div>
        </div>
        <div className="feedback-section">
          
        </div>
      </div>
    </div>
  );
}

export default CustomerViewArtistDetails;
