import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/aj.png'; 
import { LuLogOut } from "react-icons/lu";

const Navbar = ({ activeLink, setActiveLink, customerId, customerName }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!customerId);
  const navigate = useNavigate();

  const buttonText = isLoggedIn ? `${customerId} - ${customerName}` : 'customerid&name';

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/Login');
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setActiveLink('/')}>HOME</NavLink>
        <NavLink to="/CustomerViewServices" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setActiveLink('/CustomerViewServices')}>SERVICES</NavLink>
        <NavLink to="/CustomerViewArtists" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setActiveLink('/CustomerViewArtists')}>ARTISTS</NavLink>
        <NavLink to="/CustomerViewContact" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setActiveLink('/CustomerViewContact')}>CONTACT</NavLink>
        <NavLink to="/CustomerBook" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setActiveLink('/book-now')}>BOOK NOW</NavLink>
        <NavLink to="/CustomerData" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setActiveLink('/CustomerData')}>MY DATA</NavLink>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search" />
      </div>
      {isLoggedIn ? (
        <>
          <button className='sign' onClick={handleLogout}>{buttonText}</button>
          <button className='logout' onClick={handleLogout}><LuLogOut className="icon" /></button>
        </>
      ) : (
        <button className='sign'>{buttonText}</button>
      )}
    </nav>
  );
};

export default Navbar;
