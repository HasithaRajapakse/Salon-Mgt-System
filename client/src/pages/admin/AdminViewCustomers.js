import React, { useState, useEffect } from 'react';
import AdminappTemplate from './AdminappTemplate';
import './AdminViewCustomers.css';
import axios from 'axios';

function AdminViewCustomers() {
  const [customerCount, setCustomerCount] = useState(0);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomerCount();
    fetchCustomers();
  }, []);

  const fetchCustomerCount = async () => {
    try {
      const response = await axios.get('http://localhost:3001/admin/admincountcustomers');
      setCustomerCount(response.data);
    } catch (error) {
      console.error('Error fetching customer count:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/admin/adminviewcustomers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  return (
    <div>
      <AdminappTemplate />
      <div className='edit1'>
        <h2>Total Customers: {customerCount}</h2>
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Username</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.customer_id}>
                  <td>{customer.customer_id}</td>
                  <td>{customer.username}</td>
                  <td>{customer.firstname}</td>
                  <td>{customer.lastname}</td>
                  <td>{customer.gender}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>
                    {customer.image && <img src={`http://localhost:3001/${customer.img}`} alt={`${customer.firstname} ${customer.lastname}`} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminViewCustomers;
