import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";

function Home() {
    const [listOfServices, setListOfServices] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/services").then((response) => {
      setListOfServices(response.data);
    });
  }, []);

  
  return (
    <div>
      {listOfServices.map((value, key) => {
        return (
          <div className="Ser">
            <div className="title"> {value.servicename} </div>
            <div className="body">{value.description}</div>
            <div className="footer">{value.price}</div>
          </div>
        );
      })}
    </div>
  )
}

export default Home
