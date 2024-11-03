import React from 'react'
import Navbar from './Navbar';
import MainContent from './MainContent';

function CustomerHomePage() {
  const customerId = localStorage.getItem('customerId');
  const customerName = localStorage.getItem('customerName');

  return (
    <div>
          <Navbar customerId={customerId} customerName={customerName} />
        <MainContent />

    </div>
  )
}

export default CustomerHomePage

