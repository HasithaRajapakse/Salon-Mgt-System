import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AdminappTemplate from './AdminappTemplate';
import './AdminAddStaff.css';
import AssignedServices from './AssignedServices';

function AdminAddStaff() {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      role: '',
      firstName: '',
      lastName: '',
      gender: '',
      email: '',
      phone: '',
      nic: '',
      image: null,
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .matches(/[0-9]/, 'Password must contain a number')
        .matches(/[a-zA-Z]/, 'Password must contain a letter')
        .matches(/[!@#$%^&*]/, 'Password must contain a symbol')
        .required('Password is required'),
      role: Yup.string().oneOf(['artist', 'receptionist', 'admin']).required('Role is required'),
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      gender: Yup.string().oneOf(['male', 'female']).required('Gender is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string()
        .matches(/^0\d{9}$/, 'Phone number must be 10 digits and start with 0')
        .required('Phone number is required'),
      nic: Yup.string()
        .matches(/^[a-zA-Z0-9]*$/, 'NIC must not contain symbols')
        .required('NIC is required'),
      image: Yup.mixed().required('Image is required'),
    }),
    onSubmit: async (values, { resetForm, setFieldError }) => {
      try {
        const formData = new FormData();
        formData.append('username', values.username);
        formData.append('password', values.password);
        formData.append('role', values.role);
        formData.append('firstName', values.firstName);
        formData.append('lastName', values.lastName);
        formData.append('gender', values.gender);
        formData.append('email', values.email);
        formData.append('phone', values.phone);
        formData.append('nic', values.nic);
        formData.append('image', values.image);

        await axios.post('http://localhost:3001/register/staff', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        alert('Staff registered successfully');
        resetForm();
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message === 'Username already exists') {
          setFieldError('username', 'Username already exists');
        } else {
          console.error('Error registering staff:', error);
          alert('Failed to register staff');
        }
      }
    },
  });

  const [artists, setArtists] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/admin/artists').then(response => setArtists(response.data));
  }, []);

  useEffect(() => {
    if (selectedArtist) {
      axios.get(`http://localhost:3001/admin/services/${selectedArtist}`).then(response => setServices(response.data));
    }
  }, [selectedArtist]);

  const handleServiceChange = serviceId => {
    setSelectedServices(prevSelectedServices =>
      prevSelectedServices.includes(serviceId)
        ? prevSelectedServices.filter(id => id !== serviceId)
        : [...prevSelectedServices, serviceId]
    );
  };

  const handleAssignServices = () => {
    axios
      .post('http://localhost:3001/admin/assign-services', {
        staff_id: selectedArtist,
        service_ids: selectedServices,
      })
      .then(response => {
        alert(response.data.message);
        setSelectedArtist('');
        setSelectedServices([]);
      })
      .catch(error => {
        console.error('Error assigning services:', error);
      });
  };

  return (
    <div> <AdminappTemplate />
    <div className="admin-add-staff-container">
     

      <div className="register-staff-section">
        <h1>Register Staff</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input id="username" type="text" {...formik.getFieldProps('username')} />
            {formik.touched.username && formik.errors.username && (
              <div className="error">{formik.errors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input id="password" type="password" {...formik.getFieldProps('password')} />
            {formik.touched.password && formik.errors.password && (
              <div className="error">{formik.errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select id="role" {...formik.getFieldProps('role')}>
              <option value="">Select role</option>
              <option value="artist">Artist</option>
              <option value="receptionist">Receptionist</option>
              <option value="admin">Admin</option>
            </select>
            {formik.touched.role && formik.errors.role && (
              <div className="error">{formik.errors.role}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input id="firstName" type="text" {...formik.getFieldProps('firstName')} />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="error">{formik.errors.firstName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input id="lastName" type="text" {...formik.getFieldProps('lastName')} />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="error">{formik.errors.lastName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select id="gender" {...formik.getFieldProps('gender')}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <div className="error">{formik.errors.gender}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input id="email" type="email" {...formik.getFieldProps('email')} />
            {formik.touched.email && formik.errors.email && (
              <div className="error">{formik.errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input id="phone" type="text" {...formik.getFieldProps('phone')} />
            {formik.touched.phone && formik.errors.phone && (
              <div className="error">{formik.errors.phone}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="nic">NIC:</label>
            <input id="nic" type="text" {...formik.getFieldProps('nic')} />
            {formik.touched.nic && formik.errors.nic && (
              <div className="error">{formik.errors.nic}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="image">Image:</label>
            <input
              id="image"
              type="file"
              onChange={event => formik.setFieldValue('image', event.target.files[0])}
            />
            {formik.touched.image && formik.errors.image && (
              <div className="error">{formik.errors.image}</div>
            )}
          </div>

          <button type="submit">Register</button>
        </form>
      </div>

      <div className="assign-services-section">
        <h2>Assign Services to Artists</h2>

        <div className="artist-select">
          <label>Artist:</label>
          <select value={selectedArtist} onChange={e => setSelectedArtist(e.target.value)}>
            <option value="">Select Artist</option>
            {artists.map(artist => (
              <option key={artist.staff_id} value={artist.staff_id}>
                {artist.firstname} {artist.lastname}
              </option>
            ))}
          </select>
        </div>

        <div className="services-checkboxes">
          <label>Services:</label>
          {services.map(service => (
            <div key={service.service_id}>
              <label>
                <input
                  type="checkbox"
                  value={service.service_id}
                  checked={selectedServices.includes(service.service_id)}
                  onChange={() => handleServiceChange(service.service_id)}
                />
                {service.title}
              </label>
            </div>
          ))}
        </div>

        <button onClick={handleAssignServices}>Confirm</button>
      </div>

      <div className="view-assigned-services">
        <AssignedServices />
      </div>
    </div></div>
  );
}

export default AdminAddStaff;
