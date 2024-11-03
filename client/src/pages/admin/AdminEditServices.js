import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminappTemplate from './AdminappTemplate';
import './AdminEditServices.css';

function AdminEditServices() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    image: null,
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/admin/admingetservice/${id}`);
        setService(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          price: response.data.price,
          duration: response.data.duration,
          image: null,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching service:', error);
      }
    };

    fetchService();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('duration', formData.duration);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      await axios.put(`http://localhost:3001/admin/adminupdateservice/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Service updated successfully');
      navigate(-1); 
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Failed to update service');
    }
  };

  const handleCancel = () => {
    navigate(-1); 
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AdminappTemplate />
      <div className='edit'>
        <h2>Edit Service</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='title'>Title:</label>
            <input type='text' id='title' name='title' value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor='description'>Description:</label>
            <textarea id='description' name='description' value={formData.description} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor='price'>Price:</label>
            <input type='number' id='price' name='price' value={formData.price} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor='duration'>Duration:</label>
            <input type='text' id='duration' name='duration' value={formData.duration} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor='image'>Image:</label>
            <input type='file' id='image' name='image' onChange={handleFileChange} />
          </div>
          <div className="button-container">
            <button type='submit'>Save Changes</button>
            <button type='button' onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminEditServices;
