import React, { useState, useEffect } from 'react';
import AdminappTemplate from './AdminappTemplate';
import axios from 'axios';
import { MdOutlineAccessTime } from 'react-icons/md';
import { Link } from 'react-router-dom';
import './AdminViewServices.css'; 
function AdminViewServices() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:3001/admin/adminviewservices');
      console.log('Fetched Services:', response.data); // Log the fetched services
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`http://localhost:3001/admin/admindeleteservice/${serviceId}`);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  return (
    <div>
      <AdminappTemplate />
      <div className='edit1'>
        <div className="services-container">
          {services.map(service => (
            <div key={service.service_id} className="service-card">
              <img src={`http://localhost:3001/${service.image}`} alt={service.title} />
              <h3 className='edit2'>Service ID: {service.service_id}</h3>
              <h3>Title: {service.title}</h3>
              <h3>Category: {service.category_name}</h3>
              <h3>Subcategory: {service.subcategory_name}</h3>
              <div className="price-duration-container">
                <div className="price-container">
                  <p className='edit3'> Rs. {service.price}</p>
                </div>
                <div className="duration-container">
                  <MdOutlineAccessTime />
                  <p className='edit3'> Time: {service.duration} minutes</p>
                </div>
              </div>
              
              <div className="edit-delete-container">
                <Link to={`/AdminEditServices/${service.service_id}`} className="btn-red">Edit</Link>
                <button onClick={() => handleDelete(service.service_id)} className="btn-red">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminViewServices;
