import React, { useState } from 'react';
import axios from 'axios';
import './CustomerPayments.css';

function CustomerPayments() {
  const customerId = localStorage.getItem('customerId');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [status, setStatus] = useState('');
  const [payments, setPayments] = useState([]);
  const [searchBookingId, setSearchBookingId] = useState('');
  const [searchedPayment, setSearchedPayment] = useState(null);
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiryDate: '', cvv: '' });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [error, setError] = useState('');

  const hardcodedCardDetails = {
    cardNumber: '4444444444444444',
    expiryDate: '2024-12',
    cvv: '444'
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleFilter = async () => {
    try {
      const response = await axios.post('http://localhost:3001/payments/filter', {
        customerId,
        fromDate,
        toDate,
        status,
      });

      setPayments(response.data);
    } catch (error) {
      console.error('There was an error filtering the payments!', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:3001/payments/search', {
        bookingId: searchBookingId,
        customerId,
      });

      if (response.data.length > 0) {
        setSearchedPayment(response.data[0]);
        setShowPaymentForm(false);
        setError('');
      } else {
        setSearchedPayment(null);
        setError('No payment found for this booking ID or booking ID does not belong to the customer');
      }
    } catch (error) {
      console.error('There was an error searching for the payment!', error);
      setError('There was an error searching for the payment!');
    }
  };

  const handlePayNow = () => {
    setShowPaymentForm(true);
  };

  const handlePayment = async () => {
    try {
      // Validate card details against hardcoded values
      if (
        cardDetails.cardNumber !== hardcodedCardDetails.cardNumber ||
        cardDetails.expiryDate !== hardcodedCardDetails.expiryDate ||
        cardDetails.cvv !== hardcodedCardDetails.cvv
      ) {
        setError('Invalid card details. Payment cannot be processed.');
        return;
      }

     

      // Masking the card details for security purposes
      const maskedCardDetails = {
        cardNumber: '**** **** **** ' + cardDetails.cardNumber.slice(-4),
        expiryDate: cardDetails.expiryDate,
        cvv: '***'
      };

      await axios.post('http://localhost:3001/payments/update', {
        bookingId: searchedPayment.booking_id,
        paymentMethod: 'online credit/debit card',
        paymentStatus: 'paid',
        maskedCardDetails // Sending masked card details to backend
      });

      setSearchedPayment({
        ...searchedPayment,
        payment_method: 'online credit/debit card',
        payment_status: 'paid',
        maskedCardDetails // Updating with masked card details in UI
      });
      setShowPaymentForm(false);
      setError('');
      alert('Payment successful');
    } catch (error) {
      console.error('There was an error processing the payment!', error);
      setError('There was an error processing the payment. Please try again later.');
    }
  };

  return (
    <div className="customer-payments-container">
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
              <option value="not paid">Not Paid</option>
              <option value="paid">Paid</option>
            </select>
          </label>
          <button type="button" className="filter-button" onClick={handleFilter}>Filter</button>
        </form>
      </div>
      <div className="payments-section">
        {payments.length > 0 ? (
          <table className="payments-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Booking ID</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.payment_id}>
                  <td>{payment.payment_id}</td>
                  <td>{payment.booking_id}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.payment_method}</td>
                  <td>{payment.payment_status}</td>
                  <td>{formatDate(payment.created_at)}</td>
                  <td>{formatDate(payment.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No payments found</p>
        )}
      </div>
      <div className="pay-now-section">
        <h2>Pay Now</h2>
        <form className="pay-now-form">
          <label>
            Booking ID:
            <input
              type="text"
              value={searchBookingId}
              onChange={(e) => setSearchBookingId(e.target.value)}
              required
            />
          </label>
          <button type="button" className="search-button" onClick={handleSearch}>Search</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div>
          {searchedPayment ? (
            <div className="payment-details">
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Booking ID</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{searchedPayment.payment_id}</td>
                    <td>{searchedPayment.booking_id}</td>
                    <td>{searchedPayment.amount}</td>
                    <td>{searchedPayment.payment_method}</td>
                    <td>{searchedPayment.payment_status}</td>
                    <td>{formatDate(searchedPayment.created_at)}</td>
                    <td>{formatDate(searchedPayment.updated_at)}</td>
                  </tr>
                </tbody>
              </table>
              {searchedPayment.payment_status === 'not paid' && (
                <div className="payment-form-section">
                  <button className="pay-now-button" onClick={handlePayNow}>Pay Now (Online)</button>
                  {showPaymentForm && (
                    <form className="payment-form">
                      <label>
                        Card Number:
                        <input
                          type="text"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                          required
                        />
                      </label>
                      <label>
                        Expiry Date:
                        <input
                          type="month"
                          value={cardDetails.expiryDate}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                          required
                        />
                      </label>
                      <label>
                        CVV:
                        <input
                          type="text"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          required
                        />
                      </label>
                      <button type="button" className="submit-payment-button" onClick={handlePayment}>Pay Now</button>
                    </form>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p>No payment found for this booking ID</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerPayments;
