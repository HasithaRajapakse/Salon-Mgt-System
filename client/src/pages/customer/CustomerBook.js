import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdPerson, MdDateRange, MdAccessTime, MdAttachMoney, MdAssignmentTurnedIn } from 'react-icons/md';
import Navbar from './Navbar';
import './CustomerBook.css';

function CustomerBook() {
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [assignedServices, setAssignedServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [serviceDuration, setServiceDuration] = useState(0);
  const [servicePrice, setServicePrice] = useState(0);
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const id = localStorage.getItem('customerId');
    const name = localStorage.getItem('customerName');
    setCustomerId(id);
    setCustomerName(name);
    fetchArtists();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const staffIdParam = queryParams.get('staffId');
    if (staffIdParam) {
      setSelectedArtist(staffIdParam);
      fetchAssignedServices(staffIdParam);
    }
  }, [location]);

  const fetchArtists = async () => {
    try {
      const response = await axios.get('http://localhost:3001/book/artists');
      setArtists(response.data);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  };

  const handleArtistChange = async (event) => {
    const artistId = event.target.value;
    setSelectedArtist(artistId);
    fetchAssignedServices(artistId);
  };

  const fetchAssignedServices = async (artistId) => {
    try {
      const response = await axios.get(`http://localhost:3001/book/assigned-services/${artistId}`);
      setAssignedServices(response.data);
    } catch (error) {
      console.error('Error fetching assigned services:', error);
    }
  };

  const handleServiceChange = async (event) => {
    const serviceId = event.target.value;
    setSelectedService(serviceId);
    fetchServiceDetails(serviceId);
  };

  const fetchServiceDetails = async (serviceId) => {
    try {
      const response = await axios.get(`http://localhost:3001/book/${serviceId}`);
      const { duration, price } = response.data;
      setServiceDuration(duration);
      setServicePrice(price);
      calculateEndTime(startTime, duration);
    } catch (error) {
      console.error('Error fetching service details:', error);
    }
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setBookingDate(date);
  };

  const handleStartTimeChange = (event) => {
    const time = event.target.value;
    setStartTime(time);
    calculateEndTime(time, serviceDuration);
  };

  const calculateEndTime = (start, duration) => {
    if (!start || !duration) return;
    const [hours, minutes] = start.split(':').map(Number);
    const startDate = new Date(0, 0, 0, hours, minutes);
    startDate.setMinutes(startDate.getMinutes() + duration);
    const endHours = startDate.getHours().toString().padStart(2, '0');
    const endMinutes = startDate.getMinutes().toString().padStart(2, '0');
    setEndTime(`${endHours}:${endMinutes}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const confirm = window.confirm('Are you sure to confirm booking?');
    if (!confirm) return;

    // Validate booking date and time
    const currentDateTime = new Date();
    const selectedDate = new Date(bookingDate);
    const selectedStartTime = new Date(`${bookingDate}T${startTime}`);
    const oneHourLater = new Date(currentDateTime.getTime() + 60 * 60 * 1000);

    if (selectedDate < new Date(currentDateTime.toDateString())) {
      alert('Cannot book for past days.');
      return;
    }
    if (selectedStartTime < oneHourLater) {
      alert('Booking time must be at least one hour from now.');
      return;
    }
    if (selectedStartTime.getHours() < 9 || selectedStartTime.getHours() >= 18) {
      alert('Salon is open from 9:00 AM to 6:00 PM.');
      return;
    }

    const bookingData = {
      customer_id: customerId,
      staff_id: selectedArtist,
      service_id: selectedService,
      booking_date: bookingDate,
      start_time: startTime,
      end_time: endTime,
      booking_status: 'confirmed'
    };

    try {
      const response = await axios.post('http://localhost:3001/customer/book-service', bookingData);
      const { booking_id } = response.data;
      setBookingId(booking_id);
      setIsBookingConfirmed(true);
      alert('Booking confirmed successfully!');
    } catch (error) {
      console.error('Error booking service:', error);
      alert('Failed to confirm booking. Please try again.');
    }
  };

  return (
    <div>
      <Navbar customerId={customerId} customerName={customerName} />
      <div className="booking-form">
        <h2>Customer Booking</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><MdPerson /> Select Staff:</label>
            <select value={selectedArtist} onChange={handleArtistChange} disabled={isBookingConfirmed}>
              <option value="">Select Staff</option>
              {artists.map(artist => (
                <option key={artist.staff_id} value={artist.staff_id}>{`${artist.firstname} ${artist.lastname}`}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label><MdAssignmentTurnedIn /> Select Service:</label>
            <select value={selectedService} onChange={handleServiceChange} disabled={isBookingConfirmed}>
              <option value="">Select Service</option>
              {assignedServices.map(service => (
                <option key={service.service_id} value={service.service_id}>{`${service.service_title} (ID: ${service.service_id})`}</option>
              ))}
            </select>
            {selectedService && (
              <div className="service-details">
                <p><MdAttachMoney /> Price: Rs {servicePrice}</p>
                <p><MdAccessTime /> Duration: {serviceDuration} minutes</p>
              </div>
            )}
          </div>
          <div className="form-group">
            <label><MdDateRange /> Select Date:</label>
            <input type="date" value={bookingDate} onChange={handleDateChange} disabled={isBookingConfirmed} />
          </div>
          <div className="form-group">
            <label><MdAccessTime /> Select Start Time:</label>
            <input type="time" value={startTime} onChange={handleStartTimeChange} disabled={isBookingConfirmed} />
          </div>
          <div className="form-group">
            <label><MdAccessTime /> Select End Time:</label>
            <input type="time" value={endTime} readOnly />
          </div>
          {!isBookingConfirmed && <button type="submit" className="confirm-button">Confirm Booking</button>}
        </form>
        {bookingId && (
          <Link to={`/CustomerPay/${bookingId}`}>
            <button className="proceed-button">Proceed to Payment</button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default CustomerBook;
