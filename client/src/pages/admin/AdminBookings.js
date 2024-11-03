import React, { useState, useEffect } from 'react';
import AdminappTemplate from './AdminappTemplate';
import axios from 'axios';
import './AdminBookings.css';

function AdminBookings() {
  const [customers, setCustomers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState({
    customerId: '',
    staffId: '',
    serviceId: '',
    fromDate: '',
    toDate: '',
    bookingStatus: '',
  });
  const [bookings, setBookings] = useState([]);
  const [bookingId, setBookingId] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellationRequests, setCancellationRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerResponse = await axios.get('http://localhost:3001/viewbookcustomers');
        const staffResponse = await axios.get('http://localhost:3001/viewbookstaff');
        const serviceResponse = await axios.get('http://localhost:3001/viewbookservices');
        setCustomers(customerResponse.data);
        setStaff(staffResponse.data);
        setServices(serviceResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCancellationRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3001/bookings/cancellation-requests');
        setCancellationRequests(response.data);
      } catch (error) {
        console.error('Error fetching cancellation requests:', error);
      }
    };
    fetchCancellationRequests();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const handleFilter = async () => {
    try {
      const response = await axios.post('http://localhost:3001/viewbookings/filter', filter);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleBookingIdChange = (e) => {
    setBookingId(e.target.value);
  };

  const handleViewBooking = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/viewbookings/${bookingId}`);
      setSelectedBooking(response.data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.put(`http://localhost:3001/bookings/cancel/${bookingId}`);
      setCancellationRequests((prevRequests) => prevRequests.filter(request => request.booking_id !== bookingId));
      ;
    } catch (error) {
      console.error('Error cancelling booking:', error);
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
      <div className="admin-bookings-container">
      <div className="admin-bookings">
        <h2>Filter Bookings</h2>
        <form>
          <label>
            Select Customer:
            <select name="customerId" value={filter.customerId} onChange={handleInputChange}>
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.customer_id} value={customer.customer_id}>
                  {customer.firstname} {customer.lastname}
                </option>
              ))}
            </select>
          </label>
          <label>
            Select Staff:
            <select name="staffId" value={filter.staffId} onChange={handleInputChange}>
              <option value="">Select Staff</option>
              {staff.map((member) => (
                <option key={member.staff_id} value={member.staff_id}>
                  {member.firstname} {member.lastname}
                </option>
              ))}
            </select>
          </label>
          <label>
            Select Service:
            <select name="serviceId" value={filter.serviceId} onChange={handleInputChange}>
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service.service_id} value={service.service_id}>
                  {service.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            From Date:
            <input type="date" name="fromDate" value={filter.fromDate} onChange={handleInputChange} />
          </label>
          <label>
            To Date:
            <input type="date" name="toDate" value={filter.toDate} onChange={handleInputChange} />
          </label>
          <label>
            Booking Status:
            <select name="bookingStatus" value={filter.bookingStatus} onChange={handleInputChange}>
              <option value="">Select Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending cancellation">Pending Cancellation</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <button type="button" onClick={handleFilter}>Filter</button>
        </form>
        {bookings.length > 0 ? (
          <table className="admin-bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Staff</th>
                <th>Service</th>
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
                  <td>{booking.customer_name}</td>
                  <td>{booking.staff_name}</td>
                  <td>{booking.service_title}</td>
                  <td>{formatDate(booking.booking_date)}</td>
                  <td>{booking.start_time}</td>
                  <td>{booking.end_time}</td>
                  <td>{booking.booking_status}</td>
                  <td>{formatDateTime(booking.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bookings found</p>
        )}
      </div>
      <div className="admin-view-booking">
        <h2>View Booking Details</h2>
        <form>
          <label>
            Enter Booking ID:
            <input type="text" value={bookingId} onChange={handleBookingIdChange} />
          </label>
          <button type="button" onClick={handleViewBooking}>View Booking</button>
        </form>
        {selectedBooking && (
          <div>
            <h3>Booking ID: {selectedBooking.booking_id}</h3>
            <p>Customer: {selectedBooking.customer_name}</p>
            <p>Staff: {selectedBooking.staff_name}</p>
            <p>Service: {selectedBooking.service_title}</p>
            <p>Booking Date: {formatDate(selectedBooking.booking_date)}</p>
            <p>Start Time: {selectedBooking.start_time}</p>
            <p>End Time: {selectedBooking.end_time}</p>
            <p>Status: {selectedBooking.booking_status}</p>
            <p>Created At: {formatDateTime(selectedBooking.created_at)}</p>
          </div>
        )}
      </div>
      <div className="admin-cancellation-requests">
        <h2>Booking Cancellation Requests</h2>
        {cancellationRequests.length > 0 ? (
          <table className="admin-cancellation-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Staff</th>
                <th>Service</th>
                <th>Booking Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cancellationRequests.map((booking) => (
                <tr key={booking.booking_id}>
                  <td>{booking.booking_id}</td>
                  <td>{booking.customer_name}</td>
                  <td>{booking.staff_name}</td>
                  <td>{booking.service_title}</td>
                  <td>{formatDate(booking.booking_date)}</td>
                  <td>{booking.start_time}</td>
                  <td>{booking.end_time}</td>
                  <td>{booking.booking_status}</td>
                  <td>{formatDateTime(booking.created_at)}</td>
                  <td>
                    <button onClick={() => handleCancelBooking(booking.booking_id)}>Cancel Booking</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No cancellation requests found</p>
        )}
      </div>
    </div></div>
  );
}

export default AdminBookings;

