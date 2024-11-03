import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import './CustomerSettings.css'; 

function CustomerSettings() {
  const customerId = localStorage.getItem('customerId');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data based on customerId
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/customer/${customerId}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [customerId]);

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required('Old password is required'),
      newPassword: Yup.string()
        .required('New password is required')
        .min(6, 'Password must be at least 6 characters'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values, { resetForm, setFieldError }) => {
      try {
        // Check if old password matches the existing password
        const response = await axios.post('http://localhost:3001/login', {
          username: userData.username,
          password: values.oldPassword,
        });

        if (!response.data.success) {
          setFieldError('oldPassword', 'Old password is incorrect');
          return;
        }

        // Update user password
        await axios.put(`http://localhost:3001/user/${userData.user_id}`, {
          password: values.newPassword,
        });

        alert('Password changed successfully');
        resetForm();
      } catch (error) {
        console.error('Error changing password:', error);
        alert('Failed to change password');
      }
    },
  });

  return (
    <div className="customer-settings-container">
      <h1>Change Password</h1>
      <form onSubmit={formik.handleSubmit} className="password-change-form">
        <div className="form-group">
          <label htmlFor="oldPassword">Old Password:</label>
          <input
            id="oldPassword"
            type="password"
            {...formik.getFieldProps('oldPassword')}
            className="form-control"
          />
          {formik.touched.oldPassword && formik.errors.oldPassword ? (
            <div className="error-message">{formik.errors.oldPassword}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password:</label>
          <input
            id="newPassword"
            type="password"
            {...formik.getFieldProps('newPassword')}
            className="form-control"
          />
          {formik.touched.newPassword && formik.errors.newPassword ? (
            <div className="error-message">{formik.errors.newPassword}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            type="password"
            {...formik.getFieldProps('confirmPassword')}
            className="form-control"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="error-message">{formik.errors.confirmPassword}</div>
          ) : null}
        </div>

        <button type="submit" className="btn btn-primary">Change Password</button>
      </form>
    </div>
  );
}

export default CustomerSettings;
