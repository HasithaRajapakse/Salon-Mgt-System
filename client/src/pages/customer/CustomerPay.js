import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './CustomerPay.css';

function CustomerPay() {
  const { booking_id } = useParams();
  const customerId = localStorage.getItem('customerId');
  const customerName = localStorage.getItem('customerName');
  const [servicePrice, setServicePrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiryDate: '', cvv: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookingDetails();
  }, [booking_id]);

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/booking/${booking_id}`);
      setServicePrice(response.data.price);
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleNextClick = () => {
    setShowPaymentForm(true);
  };

  const handleCardDetailsChange = (event) => {
    const { name, value } = event.target;
    setCardDetails(prevState => ({ ...prevState, [name]: value }));
  };

  const handleOnlinePaymentSubmit = async () => {
    const validCardDetails = {
      cardNumber: '4444444444444444',
      expiryDate: '2024-12',
      cvv: '444'
    };

    if (
      cardDetails.cardNumber === validCardDetails.cardNumber &&
      cardDetails.expiryDate === validCardDetails.expiryDate &&
      cardDetails.cvv === validCardDetails.cvv
    ) {
      const paymentData = {
        booking_id,
        amount: servicePrice,
        payment_method: 'online credit/debit card',
        payment_status: 'paid'
      };

      try {
        await axios.post('http://localhost:3001/payments', paymentData);
        alert('Payment successful!');
        navigate('/'); // Redirect to homepage
      } catch (error) {
        console.error('Error processing payment:', error);
        alert('Failed to process payment. Please try again.');
      }
    } else {
      alert('Invalid card details. Please try again.');
    }
  };

  const handleServiceTimePaymentSubmit = async () => {
    const paymentData = {
      booking_id,
      amount: servicePrice,
      payment_method: 'at service time',
      payment_status: 'not paid'
    };

    try {
      await axios.post('http://localhost:3001/payments', paymentData);
      alert('You have to pay at service time.');
      navigate('/'); // Redirect to homepage
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
    }
  };

  return (
    <div>
      <Navbar customerId={customerId} customerName={customerName} />
      <div className="payment-container">
        <div className="payment-info">
          <h2>Payment for Booking ID: {booking_id}</h2>
          <p>Service Price: Rs {servicePrice}</p>
          <div className="payment-methods">
            <label className="radio-label">
              <input
                type="radio"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={handlePaymentMethodChange}
              />
              Online
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="at service time"
                checked={paymentMethod === 'at service time'}
                onChange={handlePaymentMethodChange}
              />
              At Service Time
            </label>
          </div>
          <button className="next-button" onClick={handleNextClick}>Next</button>
          {showPaymentForm && paymentMethod === 'online' && (
            <div className="online-payment-form">
              <h3>Online Payment</h3>
              <div className="form-group">
                <label>Debit Card Number:</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardDetailsChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Expiry Date:</label>
                <input
                  type="month"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleCardDetailsChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>CVV:</label>
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardDetailsChange}
                  required
                />
              </div>
              <button className="pay-button" onClick={handleOnlinePaymentSubmit}>Pay Online</button>
            </div>
          )}
          {showPaymentForm && paymentMethod === 'at service time' && (
            <div className="service-time-payment">
              <h3>Pay at Service Time</h3>
              <button className="pay-button" onClick={handleServiceTimePaymentSubmit}>Confirm Pay at Service Time</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerPay;
