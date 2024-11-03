import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminappTemplate from './AdminappTemplate';
import './AdminViewDashboard.css';

function AdminViewDashboard() {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalArtists, setTotalArtists] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [todaysBookings, setTodaysBookings] = useState([]);

  useEffect(() => {
    // Fetch total customers
    axios.get('http://localhost:3001/admin/total-customers')
      .then(response => {
        setTotalCustomers(response.data.totalCustomers);
      })
      .catch(error => {
        console.error('Error fetching total customers:', error);
      });

    // Fetch total artists
    axios.get('http://localhost:3001/admin/total-artists')
      .then(response => {
        setTotalArtists(response.data.totalArtists);
      })
      .catch(error => {
        console.error('Error fetching total artists:', error);
      });

    // Fetch total services
    axios.get('http://localhost:3001/admin/total-services')
      .then(response => {
        setTotalServices(response.data.totalServices);
      })
      .catch(error => {
        console.error('Error fetching total services:', error);
      });

    // Fetch today's bookings
    axios.get('http://localhost:3001/admin/todays-bookings')
      .then(response => {
        setTodaysBookings(response.data);
      })
      .catch(error => {
        console.error('Error fetching today\'s bookings:', error);
      });
  }, []);

  return (
    <div>
      <AdminappTemplate />
      <div className="admin-dashboard-container">
        <div className="dashboard-box">
          <h3>Total Customers</h3>
          <p>{totalCustomers}</p>
        </div>
        <div className="dashboard-box">
          <h3>Total Artists</h3>
          <p>{totalArtists}</p>
        </div>
        <div className="dashboard-box">
          <h3>Total Services</h3>
          <p>{totalServices}</p>
        </div>
      </div>

      <div className="admin-bookings-container">
        <h3>Today's Bookings</h3>
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Artist</th>
              <th>Service</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {todaysBookings.map(booking => (
              <tr key={booking.booking_id}>
                <td>{booking.booking_id}</td>
                <td>{booking.customer_firstname} {booking.customer_lastname}</td>
                <td>{booking.staff_firstname} {booking.staff_lastname}</td>
                <td>{booking.service_title}</td>
                <td>{booking.booking_date}</td>
                <td>{booking.start_time}</td>
                <td>{booking.end_time}</td>
                <td>{booking.booking_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminViewDashboard;
