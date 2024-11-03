// App.js

import React, { useState } from 'react';
import './components/navbar.css';
//import './App.css';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';



import Home from './pages/Home';
import Createservice from './pages/Createservice';
import Login from './pages/Login';
import Registration from './pages/Registration';
import logo from './assets/aj.png'; 
import Footer from './components/Footer';


//  customer pages import

import CustomerHomePage from './pages/customer/CustomerHomePage';
import CustomerRegistration from './pages/customer/CustomerRegistration';
import CustomerViewServices from './pages/customer/CustomerViewServices';
import CustomerViewServiceDetails from './pages/customer/CustomerViewServiceDetails';
import CustomerViewArtists from './pages/customer/CustomerViewArtists';
import CustomerViewArtistDetails from './pages/customer/CustomerViewArtistDetails';
import CustomerViewContact from './pages/customer/CustomerViewContact';
import CustomerBook from './pages/customer/CustomerBook';
import CustomerPay from './pages/customer/CustomerPay';
import CustomerData from './pages/customer/CustomerData';

// admin pages import
import AdminappTemplate from './pages/admin/AdminappTemplate';

import AdminViewDashboard from './pages/admin/AdminViewDashboard';


import AdminViewServices from './pages/admin/AdminViewServices';
import AdminAddServices from './pages/admin/AdminAddServices';
import AdminEditServices from './pages/admin/AdminEditServices';

import AdminViewStaff from './pages/admin/AdminViewStaff';
import AdminAddStaff from './pages/admin/AdminAddStaff';
import AdminEditStaff from './pages/admin/AdminEditStaff';
import AdminAddLeave from './pages/admin/AdminAddLeave';

import AdminViewCustomers from './pages/admin/AdminViewCustomers';

import AdminBookings from './pages/admin/AdminBookings';
import AdminCompleteBooking from './pages/admin/AdminCompleteBooking';

import Admins from './pages/admin/AdminBookings';

import ArtistHomePage from './pages/artist/ArtistHomePage';



function App() {
    
  
    return (
        <div >
            <Router>
                <Routes> 
                    <Route path="/" element={<CustomerHomePage />} />

                    <Route path="/Login" element={<Login />} />
                    <Route path="/CustomerRegistration" element={<CustomerRegistration />} />
                    <Route path="/CustomerHomePage" element={<CustomerHomePage />} />
                    <Route path="/CustomerViewServices" element={<CustomerViewServices />} />
                    <Route path="/CustomerViewServiceDetails/:id" element={<CustomerViewServiceDetails />} />
                    <Route path="/CustomerViewArtists" element={<CustomerViewArtists />} />
                    <Route path="/CustomerViewArtistDetails/:id" element={<CustomerViewArtistDetails />} />
                    <Route path="/CustomerViewContact" element={<CustomerViewContact />} />
                    <Route path="/CustomerBook" element={<CustomerBook />} />
                    <Route path="/CustomerPay/:booking_id" element={<CustomerPay />} />
                    <Route path="/CustomerData" element={<CustomerData />} />


                   
                   
                    
                    <Route path="/AdminHomePage" element={<AdminappTemplate />} />

                    <Route path="/AdminViewServices" element={<AdminViewServices />} />
                    <Route path="/AdminAddServices" element={<AdminAddServices />} />
                    <Route path="/AdminEditServices/:id" element={<AdminEditServices />} />

                    <Route path="/AdminViewStaff" element={<AdminViewStaff />} />
                    <Route path="/AdminAddStaff" element={<AdminAddStaff />} />
                    <Route path="/AdminEditStaff/:id" element={<AdminEditStaff />} />
                    <Route path="/AdminAddLeave" element={<AdminAddLeave />} />

                    <Route path="/AdminViewCustomers" element={<AdminViewCustomers />} />
                    <Route path="/AdminViewDashboard" element={<AdminViewDashboard />} />

                    <Route path="/AdminBookings" element={<AdminBookings />} />
                    <Route path="/AdminCompleteBooking" element={<AdminCompleteBooking />} />

                    <Route path="/ArtistHomePage" element={<ArtistHomePage />} />


                    

                </Routes>
            </Router>
        </div>
    );
  }
  
  export default App;