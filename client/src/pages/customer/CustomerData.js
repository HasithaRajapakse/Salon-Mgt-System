import React, { useState } from 'react';
import Navbar from './Navbar';
import CustomerMyBookings from './CustomerMyBookings';
import CustomerPayments from './CustomerPayments';
import CustomerSettings from './CustomerSettings';
import CustomerHelpCenter from './CustomerHelpCenter';
import './CustomerData.css'; 
function CustomerData() {
  const customerId = localStorage.getItem('customerId');
  const customerName = localStorage.getItem('customerName');
  const [activeComponent, setActiveComponent] = useState(null);

  const handleClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div>
      <Navbar customerId={customerId} customerName={customerName} />
      <div className="maincontainer">
        <div className="sidebar">
          <ul>
            <li onClick={() => handleClick('MyBookings')}>My Bookings</li>
            <li onClick={() => handleClick('Payments')}>Payments</li>
            <li onClick={() => handleClick('Settings')}>Settings</li>
            <li onClick={() => handleClick('HelpCenter')}>Help Center</li>
          </ul>
        </div>
        <div className="content">
          {activeComponent === 'MyBookings' && <CustomerMyBookings />}
          {activeComponent === 'Payments' && <CustomerPayments />}
          {activeComponent === 'Settings' && <CustomerSettings />}
          {activeComponent === 'HelpCenter' && <CustomerHelpCenter />}
        </div>
      </div>
    </div>
  );
}

export default CustomerData;
