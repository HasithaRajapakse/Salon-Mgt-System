import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AdminappTemplate from './AdminappTemplate';
import './AdminAddLeave.css';

function AdminAddStaff() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [leaveDates, setLeaveDates] = useState([]);

  useEffect(() => {
    // Fetch staff members from the backend
    axios.get('http://localhost:3001/staff/members')
      .then(response => {
        setStaffMembers(response.data);
      })
      .catch(error => {
        console.error('Error fetching staff members:', error);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      staffId: '',
      leaveDate: ''
    },
    validationSchema: Yup.object({
      staffId: Yup.string().required('Required'),
      leaveDate: Yup.date().min(new Date(), "Past dates are not allowed").required('Required')
    }),
    onSubmit: values => {
      axios.post('http://localhost:3001/staff/leave', values)
        .then(response => {
          alert('Leave record added successfully');
          formik.resetForm();
        })
        .catch(error => {
          console.error('Error adding leave record:', error);
        });
    }
  });

  const handleViewLeaves = () => {
    if (!selectedStaffId) {
      alert('Please select a staff member');
      return;
    }

    // Fetch leave dates for the selected staff member
    axios.get(`http://localhost:3001/staff/leave/${selectedStaffId}`)
      .then(response => {
        setLeaveDates(response.data);
      })
      .catch(error => {
        console.error('Error fetching leave dates:', error);
      });
  };

  return (
    <div>
      <AdminappTemplate />
      <div className='nw2'>
      <div className="admin-add-staff-container">
        <h2>Add Leave</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="staffId">Select Staff</label>
            <select
              id="staffId"
              name="staffId"
              onChange={(e) => {
                formik.handleChange(e);
                setSelectedStaffId(e.target.value);
              }}
              onBlur={formik.handleBlur}
              value={formik.values.staffId}
            >
              <option value="">Select a staff member</option>
              {staffMembers.map(staff => (
                <option key={staff.staff_id} value={staff.staff_id}>
                  {staff.firstname} {staff.lastname}
                </option>
              ))}
            </select>
            {formik.touched.staffId && formik.errors.staffId ? (
              <div className="error">{formik.errors.staffId}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="leaveDate">Select Date</label>
            <input
              type="date"
              id="leaveDate"
              name="leaveDate"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.leaveDate}
            />
            {formik.touched.leaveDate && formik.errors.leaveDate ? (
              <div className="error">{formik.errors.leaveDate}</div>
            ) : null}
          </div>

          <button type="submit">Confirm</button>
        </form>
      </div>

      <div className="view-leaves-container">
        <h2>View Leaves</h2>
        <div className="form-group">
          <label htmlFor="selectedStaff">Select Staff</label>
          <select
            id="selectedStaff"
            name="selectedStaff"
            onChange={(e) => setSelectedStaffId(e.target.value)}
            value={selectedStaffId}
          >
            <option value="">Select a staff member</option>
            {staffMembers.map(staff => (
              <option key={staff.staff_id} value={staff.staff_id}>
                {staff.firstname} {staff.lastname}
              </option>
            ))}
          </select>
          <button onClick={handleViewLeaves}>OK</button>
        </div>

        <div className="leave-dates">
          <h3>Leave Dates</h3>
          {leaveDates.length > 0 ? (
            <ul>
              {leaveDates.map((leaveDate, index) => (
                <li key={index}>{leaveDate}</li>
              ))}
            </ul>
          ) : (
            <p>No leave dates found</p>
          )}
        </div>
      </div>
    </div></div>
  );
}

export default AdminAddStaff;
