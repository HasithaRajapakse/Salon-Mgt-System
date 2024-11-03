import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './CustomerViewArtists.css';

function CustomerViewArtists() {
  const customerId = localStorage.getItem('customerId');
  const customerName = localStorage.getItem('customerName');
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await axios.get('http://localhost:3001/customer/viewartists');
      setArtists(response.data);
    } catch (error) {
      setError('Error fetching artists. Please try again later.');
      console.error('Error fetching artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (artistId) => {
    navigate(`/CustomerBook?staffId=${artistId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar customerId={customerId} customerName={customerName} />
      <div className="customer-view-artists">
        <div className='text1'><p><center> Our Talented Artists</center></p></div>
        <p>Explore our talented artists and book your appointment today!</p>
        <div className="artists-container">
          {artists.map(artist => (
            <div key={artist.staff_id} className="artist-card">
              <img src={`http://localhost:3001/${artist.image}`} alt={`${artist.firstname} ${artist.lastname}`} className="artist-image1" />
              <h3 className='artist-name'>{artist.firstname} {artist.lastname}</h3>
              <p className='artist-id'>Staff ID: {artist.staff_id}</p>
              <p className='artist-gender'>{artist.gender}</p>
              <p className='artist-email'>{artist.email}</p>
              <div className="button-container">
                <Link to={`/CustomerViewArtistDetails/${artist.staff_id}`} className="btn btn-seemore">See More</Link>
                <button onClick={() => handleBookNow(artist.staff_id)} className="btn btn-book">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerViewArtists;
