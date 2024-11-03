import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
} from 'mdb-react-ui-kit';

import loginImage from '../assets/login2.jpeg'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/login', { username, password });

      if (response.data.role === 'customer') {
        localStorage.setItem('customerId', response.data.userId);
        localStorage.setItem('customerName', response.data.name);
        navigate('/CustomerHomePage');

      } else if (response.data.role === 'admin') {
        localStorage.setItem('adminId', response.data.userId);
        localStorage.setItem('adminName', response.data.name);
        navigate('/AdminHomePage');

      } else if (response.data.role === 'artist') {
        localStorage.setItem('artistId', response.data.userId); 
        localStorage.setItem('artistName', response.data.name); 
        navigate('/ArtistHomePage');

      } else if (response.data.role === 'receptionist') {
        navigate('/ReceptionistHomePage');
      }
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <MDBContainer className="my-5">
        <MDBCard>
          <MDBRow className='g-0'>
            <MDBCol md='6'>
              <div 
                style={{ 
                  backgroundImage: `url(${loginImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '100%',
                  borderTopLeftRadius: '0.25rem',
                  borderBottomLeftRadius: '0.25rem'
                }} 
                className="rounded-start w-100">
              </div>
            </MDBCol>

            <MDBCol md='6'>
              <MDBCardBody className='d-flex flex-column'>

                <div className='d-flex flex-row mt-2'>
                  <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }}/>
                  <span className="h1 fw-bold mb-0" style={{ fontFamily: 'Roboto, sans-serif' }}>Salon Buddhika Salon</span>
                </div>

                <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>Sign into your account</h5>

                <form onSubmit={handleLogin}>
                  <MDBInput
                    wrapperClass='mb-4'
                    label='Username'
                    id='formControlLg'
                    type='text'
                    size="lg"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <MDBInput
                    wrapperClass='mb-4'
                    label='Password'
                    id='formControlLg'
                    type='password'
                    size="lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <MDBBtn className="mb-4 px-5" color='dark' size='lg' type="submit">Login</MDBBtn>
                  <MDBBtn className="mb-4 px-5" color='secondary' size='lg' type="button" onClick={() => navigate(-1)}>Cancel</MDBBtn>
                </form>
                
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <a className="small text-muted" href="#!">Forgot password?</a>
                <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>
                  Don't have an account? 
                  <a href="#!" style={{ color: '#393f81' }} onClick={() => navigate('/CustomerRegistration')}> Register here</a>
                </p>

                <div className='d-flex flex-row justify-content-start'>
                  <a href="#!" className="small text-muted me-1">Terms of use.</a>
                  <a href="#!" className="small text-muted">Privacy policy</a>
                </div>

              </MDBCardBody>
            </MDBCol>

          </MDBRow>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};

export default Login;
