// RegistrationForm.js

import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '',
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    phone: '',
    nic: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/register', formData);
      alert('Registration successful!');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <select name="role" value={formData.role} onChange={handleChange} required>
        <option value="">Select Role</option>
        <option value="customer">Customer</option>
        <option value="artist">Artist</option>
        <option value="admin">Admin</option>
        <option value="receptionist">Receptionist</option>
      </select>
      {formData.role === 'customer' && (
        <>
          <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        </>
      )}
      {formData.role !== 'customer' && (
        <>
          <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
          <input type="text" name="nic" placeholder="NIC" value={formData.nic} onChange={handleChange} required />
        </>
      )}
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;
