import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminappTemplate from './AdminappTemplate';
import './AdminCompleteBooking.css';
import axios from 'axios';

function AdminCompleteBooking() {
  const [bookingId, setBookingId] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const [notification, setNotification] = useState('');

  const navigate = useNavigate();

  const handleBookingIdChange = (e) => {
    setBookingId(e.target.value);
  };

  const handleNext = async () => {
    try {
      const bookingResponse = await axios.get(`http://localhost:3001/completeabooking/${bookingId}`);
      setBookingDetails(bookingResponse.data);
      const paymentResponse = await axios.get(`http://localhost:3001/booking/payment/${bookingId}`);
      setPaymentDetails(paymentResponse.data);
      setError('');
    } catch (error) {
      console.error('Error fetching booking or payment details:', error);
      setError('Booking not found or server error');
      setBookingDetails(null);
      setPaymentDetails(null);
    }
  };

  const handleSetAsPaid = async () => {
    try {
      await axios.put(`http://localhost:3001/payment/setaspaid/${paymentDetails.payment_id}`);
      setConfirmation(false);
      const paymentResponse = await axios.get(`http://localhost:3001/booking/payment/${bookingId}`);
      setPaymentDetails(paymentResponse.data);
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError('Failed to update payment status');
    }
  };

  const handleCompleteBooking = async () => {
    try {
      await axios.put(`http://localhost:3001/completebooking/${bookingId}`);
      setConfirmation(false);
      setNotification('Booking completed successfully!');
      setTimeout(() => {
        navigate('/admindashboard');
      }, 2000); // Redirect to admin dashboard after 2 seconds
    } catch (error) {
      console.error('Error completing booking:', error);
      setError('Failed to complete booking');
    }
  };

  const formatDate = (dateString) => {
    return dateString.split('T')[0];
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div>
      <AdminappTemplate />
      <div className="nw1">
        <div className="admin-complete-booking">
          <h2>Complete a Booking</h2>
          <form>
            <label>
              Booking ID:
              <input type="text" value={bookingId} onChange={handleBookingIdChange} />
            </label>
            <button type="button" onClick={handleNext}>Next</button>
          </form>
          {error && <p className="error">{error}</p>}
          {bookingDetails && (
            <div className="booking-details">
              <h3>Booking Details</h3>
              <p>Booking ID: {bookingDetails.booking_id}</p>
              <p>Customer: {bookingDetails.customer_firstname} {bookingDetails.customer_lastname}</p>
              <p>Staff: {bookingDetails.staff_firstname} {bookingDetails.staff_lastname}</p>
              <p>Service: {bookingDetails.service_title}</p>
              <p>Booking Date: {formatDate(bookingDetails.booking_date)}</p>
              <p>Start Time: {bookingDetails.start_time}</p>
              <p>End Time: {bookingDetails.end_time}</p>
              <p>Status: {bookingDetails.booking_status}</p>
              <p>Created At: {formatDateTime(bookingDetails.created_at)}</p>
            </div>
          )}
          {paymentDetails && (
            <div className="payment-details">
              <h3>Payment Details</h3>
              <table>
                <tbody>
                  <tr>
                    <th>Payment ID</th>
                    <td>{paymentDetails.payment_id}</td>
                  </tr>
                  <tr>
                    <th>Amount</th>
                    <td>{paymentDetails.amount}</td>
                  </tr>
                  <tr>
                    <th>Payment Method</th>
                    <td>{paymentDetails.payment_method}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>{paymentDetails.payment_status}</td>
                  </tr>
                  {paymentDetails.payment_status === 'not paid' && (
                    <tr>
                      <td colSpan="2">
                        <button onClick={() => setConfirmation(true)}>Set as Paid</button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {paymentDetails && paymentDetails.payment_status === 'paid' && (
            <div className="complete-booking">
              <button onClick={handleCompleteBooking}>Complete Booking</button>
            </div>
          )}
        </div>
        {confirmation && (
          <div className="confirmation">
            <p>Are you sure you want to set this payment as paid?</p>
            <button onClick={handleSetAsPaid}>Confirm</button>
            <button onClick={() => setConfirmation(false)}>Cancel</button>
          </div>
        )}
        {notification && (
          <div className="notification">
            <p>{notification}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCompleteBooking;
