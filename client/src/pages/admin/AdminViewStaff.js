import React, { useState, useEffect } from 'react';
import AdminappTemplate from './AdminappTemplate';
import './AdminViewStaff.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AdminViewStaff() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get('http://localhost:3001/admin/adminviewstaff');
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await axios.delete(`http://localhost:3001/admin/admindeletestaff/${userId}`);
        fetchStaff();
      } catch (error) {
        console.error('Error deleting staff member:', error);
      }
    }
  };

  return (
    <div>
      <AdminappTemplate />
      <div className='edit1'>
        <div className="staff-container">
          {staff.map(member => (
            <div key={member.user_id} className="staff-card">
              <div className="image-container">
                <img src={`http://localhost:3001/${member.image}`} alt={member.firstName} />
              </div>
              <h3 className='edit2'>User ID: {member.user_id}</h3>
              <h4>Staff ID: {member.staff_id}</h4>
              <h4>Username: {member.username}</h4>
              <h4>Name: {member.firstname} {member.lastname}</h4>
              <p>Email: {member.email}</p>
              <p>Phone: {member.phone}</p>
              <p>Gender: {member.gender}</p>
              <p>Role: {member.role}</p>

              <div className="edit-delete-container">
                <Link to={`/AdminEditStaff/${member.user_id}`} className="btn">Edit</Link>
                <button onClick={() => handleDelete(member.user_id)} className="btn btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminViewStaff;
