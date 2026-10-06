import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation, Navigate } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  // If user navigated here directly without signup data, send them back
  if (!location.state || !location.state.email) {
    return <Navigate to="/signup" replace />;
  }

  const { name, email, password } = location.state;

  const handleVerify = async (e) => {
    e.preventDefault();
    const otp = e.target.otp.value;
    
    setLoading(true);
    try {
      const response = await api.post('/auth/user/signup', { name, email, password, otp });
      const responseData = response.data || response;
      
      if (responseData && responseData.accessToken) {
        await login(responseData.accessToken, responseData.user);
        toast.success('Account created successfully!');
        navigate('/book-service');
      } else {
        console.error('Unexpected response:', response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans bg-darker text-gray-100 min-h-screen relative overflow-x-hidden flex flex-col">
      <div className="blob blob-1 fixed"></div>
      <div className="blob blob-2 fixed"></div>
      
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center relative z-10 pt-32 pb-20 px-4">
        <StyledWrapper>
          <div className="container">
            <div className="heading">Verify Email</div>
            <p className="text-gray-400 text-sm text-center mb-6">
              We sent a 6-digit OTP to <br/><strong className="text-white">{email}</strong>
            </p>
            <form onSubmit={handleVerify} className="form">
              <input 
                required 
                className="input text-center tracking-widest text-2xl font-mono" 
                type="text" 
                name="otp" 
                id="otp" 
                placeholder="••••••" 
                maxLength="6" 
              />
              <input 
                className="login-button mt-8" 
                type="submit" 
                value={loading ? "Verifying..." : "Verify & Login"} 
                disabled={loading} 
              />
            </form>
          </div>
        </StyledWrapper>
      </main>
      
      <Footer />
    </div>
  );
}

const StyledWrapper = styled.div`
  .container {
    width: 350px;
    background: #15131e;
    border-radius: 35px;
    padding: 35px 30px;
    border: none;
    box-shadow: 0px 30px 40px -20px rgba(0,0,0,0.7);
    margin: 20px;
  }

  .heading {
    text-align: center;
    font-weight: 800;
    font-size: 28px;
    color: #ffffff;
    margin-bottom: 15px;
  }

  .form {
    margin-top: 10px;
  }

  .form .input {
    width: 100%;
    background: #1c1929;
    color: white;
    border: none;
    padding: 16px 20px;
    border-radius: 14px;
    margin-top: 15px;
    box-shadow: none;
    border-inline: 2px solid transparent;
  }

  .form .input:focus {
    outline: none;
    border-inline: 2px solid #6b66ff;
  }

  .form .login-button {
    display: block;
    width: 100%;
    font-weight: 600;
    font-size: 16px;
    background: linear-gradient(90deg, #6b66ff 0%, #15e0a6 100%);
    color: black;
    padding-block: 16px;
    margin: 20px auto 10px;
    border-radius: 16px;
    box-shadow: 0px 10px 20px -5px rgba(21, 224, 166, 0.2);
    border: none;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }

  .form .login-button:hover {
    transform: translateY(-2px);
    box-shadow: 0px 15px 20px -5px rgba(21, 224, 166, 0.3);
  }

  .form .login-button:active {
    transform: translateY(1px);
    box-shadow: 0px 5px 10px -5px rgba(21, 224, 166, 0.2);
  }
`;
