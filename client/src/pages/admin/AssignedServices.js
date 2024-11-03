import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignedServices = () => {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [assignedServices, setAssignedServices] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await axios.get('http://localhost:3001/admin/artists');
      setArtists(response.data);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  };

  const handleArtistChange = async (event) => {
    const selectedArtistId = event.target.value;
    setSelectedArtist(selectedArtistId);
    fetchAssignedServices(selectedArtistId);
  };

  const fetchAssignedServices = async (artistId) => {
    try {
      const response = await axios.get(`http://localhost:3001/admin/assigned-services/${artistId}`);
      setAssignedServices(response.data);
    } catch (error) {
      console.error('Error fetching assigned services:', error);
    }
  };

  const confirmDeleteService = (serviceId) => {
    setServiceToDelete(serviceId);
    setShowConfirmation(true);
  };

  const handleDeleteService = async () => {
    try {
      await axios.delete(`http://localhost:3001/admin/assigned-services/${selectedArtist}/${serviceToDelete}`);
      fetchAssignedServices(selectedArtist);
      setShowConfirmation(false);
      setServiceToDelete(null);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  return (
    <div>
      <h2>Assigned Services by Artist</h2>
      <select value={selectedArtist} onChange={handleArtistChange}>
        <option value="">Select Artist</option>
        {artists.map(artist => (
          <option key={artist.staff_id} value={artist.staff_id}>{`${artist.firstname} ${artist.lastname}`}</option>
        ))}
      </select>
      <div>
        <h3>Assigned Services:</h3>
        <ul>
          {assignedServices.map(service => (
            <li key={service.service_id}>
              {service.title}
              <button
                onClick={() => confirmDeleteService(service.service_id)}
                style={{ marginLeft: '10px', fontSize: '12px', padding: '5px 10px', backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: '5px' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showConfirmation && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to delete this service?</p>
          <button onClick={handleDeleteService}>Yes</button>
          <button onClick={() => setShowConfirmation(false)}>No</button>
        </div>
      )}
    </div>
  );
};

export default AssignedServices;
