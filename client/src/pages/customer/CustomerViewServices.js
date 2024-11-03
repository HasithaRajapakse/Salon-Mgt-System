import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MdOutlineAccessTime } from 'react-icons/md';
import './CustomerViewServices.css';
import Navbar from './Navbar';

function CustomerViewServices() {
  const customerId = localStorage.getItem('customerId');
  const customerName = localStorage.getItem('customerName');
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/customer/viewservicecategories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching service categories:', error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(`http://localhost:3001/customer/viewservicesubcategories/${categoryId}`);
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching service subcategories:', error);
    }
  };

  const fetchServices = async (subcategoryId = '') => {
    try {
      const response = await axios.get('http://localhost:3001/customer/viewservices', {
        params: { subcategoryId }
      });
      setServices(response.data);
    } catch (error) {
      setError('Error fetching services. Please try again later.');
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedSubcategory('');
    fetchSubcategories(categoryId);
  };

  const handleSubcategoryChange = (e) => {
    const subcategoryId = e.target.value;
    setSelectedSubcategory(subcategoryId);
  };

  const handleFilter = () => {
    fetchServices(selectedSubcategory);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar customerId={customerId} customerName={customerName} />

      <div className="new-div">
        <div className="welcome-filter-wrapper">
          <div className="welcome-section">
            <h2>Welcome to Our Services</h2>
            <p>Explore the wide range of services we offer.</p>
          </div>
          <div className="filter-section">
            <h2>Filter Services</h2>
            <form>
              <label htmlFor="category">Service Category</label>
              <select id="category" name="category" value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.servicecategory_id} value={category.servicecategory_id}>
                    {category.categoryname}
                  </option>
                ))}
              </select>

              <label htmlFor="subcategory">Service Sub Category</label>
              <select id="subcategory" name="subcategory" value={selectedSubcategory} onChange={handleSubcategoryChange}>
                <option value="">Select Sub Category</option>
                {subcategories.map(subcategory => (
                  <option key={subcategory.servicesubcategory_id} value={subcategory.servicesubcategory_id}>
                    {subcategory.subcategoryname}
                  </option>
                ))}
              </select>

              <button type="button" className="filter-button" onClick={handleFilter}>Filter</button>
            </form>
          </div>
        </div>
      </div>

      <div className="customer-view-services">
        <div className="services-container">
          {services.map(service => (
            <div key={service.service_id} className="service-card">
              <img src={`http://localhost:3001/${service.image}`} alt={service.title} className="service-image"/>
              <div className='s1'><h3 className='service-title'>{service.title}</h3></div>
              <h4 className='service-category'>{service.categoryname} {service.subcategoryname}</h4>
              <p className='service-id'>Service ID: {service.service_id}</p>
              <div className="price-duration-container">
                <div className="price-container">
                  <p className='service-price'>Rs. {service.price}</p>
                </div>
                <div className="duration-container">
                  <MdOutlineAccessTime />
                  <p className='service-duration'>Time: {service.duration} minutes</p>
                </div>
              </div>
              <div className="button-container">
                <Link to={`/CustomerViewServiceDetails/${service.service_id}`} className="btn btn-seemore">See More</Link>
                
                <button className="btn btn-book">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerViewServices;
