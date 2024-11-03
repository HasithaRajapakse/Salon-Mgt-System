import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './CustomerViewServiceDetails.css';

function CustomerViewServiceDetails() {
  const customerId = localStorage.getItem('customerId');
  const customerName = localStorage.getItem('customerName');
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServiceDetails();
  }, []);

  useEffect(() => {
    if (service) {
      fetchStaffList(service.service_id);
    }
  }, [service]);

  const fetchServiceDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/customer/viewservicedetails/${id}`);
      setService(response.data);
    } catch (error) {
      setError('Error fetching service details. Please try again later.');
      console.error('Error fetching service details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffList = async (serviceId) => {
    try {
      const response = await axios.get(`http://localhost:3001/customer/staff-list/${serviceId}`);
      setStaffList(response.data);
    } catch (error) {
      console.error('Error fetching staff list:', error);
    }
  };

  const handleBookNow = () => {
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    navigate(`/CustomerBook?serviceId=${service.service_id}&staffId=${selectedStaff}`);
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
        <div className="service-details">
          <h2>{service.title}</h2>
          <div className='img1'>
            <img src={`http://localhost:3001/${service.image}`} alt={service.title} className="service-image"/>
          </div>
          <h4>{service.category_name} {service.subcategory_name}</h4>
          <p className='service-id'>Service ID: {service.service_id}</p>
          <p>{service.description}</p>
          <p>Price: Rs. {service.price}</p>
          <p>Duration: {service.duration} minutes</p>
          <div className="button-container1">
            <button className="btn btn-book" onClick={handleBookNow}>Book Now</button>
          </div>
          {showForm && (
            <form onSubmit={handleSubmit}>
              <label>Select Staff:</label>
              <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)}>
                <option value="">Select Staff</option>
                {staffList.map(staff => (
                  <option key={staff.staff_id} value={staff.staff_id}>{`${staff.staff_id} - ${staff.staff_name}`}</option>
                ))}
              </select>
              <button type="submit">Go to Next Step</button>
            </form>
          )}
        </div>
        <div className="feedback-section">
         
        </div>
      </div>
    </div>
  );
}

export default CustomerViewServiceDetails;
