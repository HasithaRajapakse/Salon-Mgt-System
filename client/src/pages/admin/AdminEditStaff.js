import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminappTemplate from './AdminappTemplate';
import './AdminEditStaff.css';

function AdminEditStaff() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    role: '',
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    phone: '',
    nic: '',
    image: null,
    staffId: '',
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/admin/admingetstaff/${id}`);
        setStaff(response.data);
        setFormData({
          username: response.data.username,
          role: response.data.role,
          firstName: response.data.firstname,
          lastName: response.data.lastname,
          gender: response.data.gender,
          email: response.data.email,
          phone: response.data.phone,
          nic: response.data.nic,
          image: null,
          staffId: response.data.staff_id,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };

    fetchStaff();
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
    formDataToSend.append('username', formData.username);
    formDataToSend.append('role', formData.role);
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('nic', formData.nic);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      await axios.put(`http://localhost:3001/admin/adminupdatestaff/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Staff updated successfully');
      navigate(-1); // Redirect back to the previous page after update
    } catch (error) {
      console.error('Error updating staff:', error);
      alert('Failed to update staff');
    }
  };

  const handleCancel = () => {
    navigate(-1); // Redirect back to the previous page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AdminappTemplate />
      <div className='edit'>
        <h2>Edit Staff</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='user_id'>User ID:</label>
            <input type='text' id='user_id' name='user_id' value={staff.user_id} readOnly />
          </div>
          <div>
            <label htmlFor='staff_id'>Staff ID:</label>
            <input type='text' id='staff_id' name='staff_id' value={staff.staff_id} readOnly />
          </div>
          <div>
            <label htmlFor='username'>Username:</label>
            <input type='text' id='username' name='username' value={formData.username} readOnly />
          </div>
          <div>
            <label htmlFor='role'>Role:</label>
            <select id='role' name='role' value={formData.role} onChange={handleChange} required>
              <option value=''>Select role</option>
              <option value='receptionist'>Receptionist</option>
              <option value='artist'>Artist</option>
            </select>
          </div>
          <div>
            <label htmlFor='firstName'>First Name:</label>
            <input type='text' id='firstName' name='firstName' value={formData.firstName} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor='lastName'>Last Name:</label>
            <input type='text' id='lastName' name='lastName' value={formData.lastName} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor='gender'>Gender:</label>
            <select id='gender' name='gender' value={formData.gender} onChange={handleChange} required>
              <option value=''>Select gender</option>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
            </select>
          </div>
          <div>
            <label htmlFor='email'>Email:</label>
            <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor='phone'>Phone:</label>
            <input type='text' id='phone' name='phone' value={formData.phone} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor='nic'>NIC:</label>
            <input type='text' id='nic' name='nic' value={formData.nic} onChange={handleChange} required />
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

export default AdminEditStaff;
