import React, { useState } from 'react';
import axios from 'axios';
import './CustomerMyBookings.css';

function CustomerMyBookings() {
  const customerId = localStorage.getItem('customerId');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [status, setStatus] = useState('');
  const [bookings, setBookings] = useState([]);
  const [searchBookingId, setSearchBookingId] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [cancelRequestMessage, setCancelRequestMessage] = useState('');

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    return timeString.slice(0, 5);
  };

  const handleFilter = async () => {
    try {
      const response = await axios.post('http://localhost:3001/bookings/filter', {
        customerId,
        fromDate,
        toDate,
        status,
      });

      setBookings(response.data);
    } catch (error) {
      console.error('There was an error filtering the bookings!', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:3001/bookings/details', {
        customerId,
        bookingId: searchBookingId,
      });

      if (response.data) {
        setBookingDetails(response.data);
        setCancelRequestMessage('');
      } else {
        setBookingDetails(null);
        setCancelRequestMessage('No booking found with this ID or it does not belong to you.');
      }
    } catch (error) {
      console.error('There was an error searching for the booking details!', error);
    }
  };

  const handleCancelRequest = async () => {
    try {
      await axios.post('http://localhost:3001/bookings/cancel', {
        bookingId: searchBookingId,
      });

      setBookingDetails({ ...bookingDetails, booking_status: 'pending cancellation' });
      setCancelRequestMessage('Requested for cancellation');
    } catch (error) {
      console.error('There was an error requesting cancellation!', error);
    }
  };

  return (
    <div className="customer-my-bookings-container">
      <div className="filter-section">
        <form className="filter-form">
          <label>
            From Date:
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              required
            />
          </label>
          <label>
            To Date:
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              required
            />
          </label>
          <label>
            Status:
            <select value={status} onChange={(e) => setStatus(e.target.value)} required>
              <option value="">Select Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending cancellation">Pending Cancellation</option>
            </select>
          </label>
          <button type="button" className="filter-button" onClick={handleFilter}>Filter</button>
        </form>
      </div>
      <div className="bookings-section">
        {bookings.length > 0 ? (
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Service ID</th>
                <th>Booking Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.booking_id}>
                  <td>{booking.booking_id}</td>
                  <td>{booking.service_id}</td>
                  <td>{formatDate(booking.booking_date)}</td>
                  <td>{formatTime(booking.start_time)}</td>
                  <td>{formatTime(booking.end_time)}</td>
                  <td>{booking.booking_status}</td>
                  <td>{formatDate(booking.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bookings found</p>
        )}
      </div>
      <div className="cancel-section">
        <h2>Request for Cancel Booking</h2>
        <form className="cancel-form">
          <label>
            Booking ID:
            <input
              type="text"
              value={searchBookingId}
              onChange={(e) => setSearchBookingId(e.target.value)}
              required
            />
          </label>
          <button type="button" className="search-button" onClick={handleSearch}>Search Booking</button>
        </form>
        {bookingDetails && (
          <div className="booking-details">
            <h3>Booking Details</h3>
            <p><strong>Booking ID:</strong> {bookingDetails.booking_id}</p>
            <p><strong>Service ID:</strong> {bookingDetails.service_id}</p>
            <p><strong>Booking Date:</strong> {formatDate(bookingDetails.booking_date)}</p>
            <p><strong>Start Time:</strong> {formatTime(bookingDetails.start_time)}</p>
            <p><strong>End Time:</strong> {formatTime(bookingDetails.end_time)}</p>
            <p><strong>Status:</strong> {bookingDetails.booking_status}</p>
            <p><strong>Created At:</strong> {formatDate(bookingDetails.created_at)}</p>
            <p><strong>Updated At:</strong> {formatDate(bookingDetails.updated_at)}</p>
            {bookingDetails.booking_status === 'confirmed' ? (
              <>
                <button className="cancel-button" onClick={handleCancelRequest}>Request Cancel</button>
                {cancelRequestMessage && <p className="cancel-request-message">{cancelRequestMessage}</p>}
              </>
            ) : (
              <p className="cannot-cancel-message"></p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerMyBookings;
