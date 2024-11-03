import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './CustomerRegistration.css';

function CustomerRegistration() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      gender: '',
      email: '',
      phone: '',
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
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      gender: Yup.string().oneOf(['male', 'female']).required('Gender is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string()
        .matches(/^0\d{9}$/, 'Phone number must be 10 digits and start with 0')
        .required('Phone number is required'),
      image: Yup.mixed(),
    }),
    onSubmit: async (values, { resetForm, setFieldError }) => {
      try {
        const formData = new FormData();
        formData.append('username', values.username);
        formData.append('password', values.password);
        formData.append('role', 'customer'); // Set role to customer
        formData.append('firstName', values.firstName);
        formData.append('lastName', values.lastName);
        formData.append('gender', values.gender);
        formData.append('email', values.email);
        formData.append('phone', values.phone);
        if (values.image) {
          formData.append('image', values.image);
        }

        await axios.post('http://localhost:3001/register/customer', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        alert('Customer registered successfully');
        resetForm();
        navigate('/Login'); // Redirect to the Login page
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message === 'Username already exists') {
          setFieldError('username', 'Username already exists');
        } else {
          console.error('Error registering customer:', error);
          alert('Failed to register customer');
        }
      }
    },
  });

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h1>Register Customer</h1>
        <form onSubmit={formik.handleSubmit} className="registration-form">
          <label htmlFor="username">Username:</label>
          <input id="username" type="text" {...formik.getFieldProps('username')} />
          {formik.touched.username && formik.errors.username ? <div className="error">{formik.errors.username}</div> : null}

          <label htmlFor="password">Password:</label>
          <input id="password" type="password" {...formik.getFieldProps('password')} />
          {formik.touched.password && formik.errors.password ? <div className="error">{formik.errors.password}</div> : null}

          <label htmlFor="firstName">First Name:</label>
          <input id="firstName" type="text" {...formik.getFieldProps('firstName')} />
          {formik.touched.firstName && formik.errors.firstName ? <div className="error">{formik.errors.firstName}</div> : null}

          <label htmlFor="lastName">Last Name:</label>
          <input id="lastName" type="text" {...formik.getFieldProps('lastName')} />
          {formik.touched.lastName && formik.errors.lastName ? <div className="error">{formik.errors.lastName}</div> : null}

          <label htmlFor="gender">Gender:</label>
          <select id="gender" {...formik.getFieldProps('gender')}>
            <option value="" label="Select gender" />
            <option value="male" label="Male" />
            <option value="female" label="Female" />
          </select>
          {formik.touched.gender && formik.errors.gender ? <div className="error">{formik.errors.gender}</div> : null}

          <label htmlFor="email">Email:</label>
          <input id="email" type="email" {...formik.getFieldProps('email')} />
          {formik.touched.email && formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}

          <label htmlFor="phone">Phone:</label>
          <input id="phone" type="text" {...formik.getFieldProps('phone')} />
          {formik.touched.phone && formik.errors.phone ? <div className="error">{formik.errors.phone}</div> : null}

          <label htmlFor="image">Image:</label>
          <input id="image" type="file" onChange={(event) => formik.setFieldValue('image', event.target.files[0])} />
          {formik.touched.image && formik.errors.image ? <div className="error">{formik.errors.image}</div> : null}

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default CustomerRegistration;
