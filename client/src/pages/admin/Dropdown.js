import React from 'react';
import { Link } from 'react-router-dom'; 

const Dropdown = ({ items }) => {
  return (
    <div className="dropdown">
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <Link
              to={item.url}
              style={{
                color: 'white',
                fontFamily: 'Roboto',
                fontSize: '15px',
                fontWeight: 300,
                textDecoration: 'none', 
                marginLeft: '6px', 
              }}
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
