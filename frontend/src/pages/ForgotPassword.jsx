import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('If the email exists, an OTP has been sent.');
      setStep(2);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-reset-otp', { email, otp });
      toast.success('OTP Verified!');
      setStep(3);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to reset password. Invalid OTP?');
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
            <div className="heading">
              {step === 1 && 'Reset Password'}
              {step === 2 && 'Verify OTP'}
              {step === 3 && 'New Password'}
            </div>
            
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="form">
                <p className="text-gray-400 text-sm mb-6 text-center">
                  Enter your email address and we'll send you an OTP to reset your password.
                </p>
                <input 
                  required 
                  className="input" 
                  type="email" 
                  name="email" 
                  placeholder="E-mail" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                  className="login-button" 
                  type="submit" 
                  value={loading ? "Sending..." : "Send OTP"} 
                  disabled={loading} 
                />
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="form">
                <p className="text-gray-400 text-sm mb-6 text-center">
                  Enter the 6-digit OTP sent to {email}
                </p>
                <input 
                  required 
                  className="input" 
                  type="text" 
                  name="otp" 
                  placeholder="6-digit OTP" 
                  maxLength={6} 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <input 
                  className="login-button" 
                  type="submit" 
                  value={loading ? "Verifying..." : "Verify OTP"} 
                  disabled={loading} 
                />
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="form">
                <p className="text-gray-400 text-sm mb-6 text-center">
                  OTP Verified. Please create a new password.
                </p>
                <input required className="input" type="password" name="newPassword" placeholder="New Password" />
                <input required className="input" type="password" name="confirmPassword" placeholder="Confirm New Password" />
                <input 
                  className="login-button" 
                  type="submit" 
                  value={loading ? "Resetting..." : "Confirm Password"} 
                  disabled={loading} 
                />
              </form>
            )}
            
            <span className="agreement"><Link to="/login">Back to Login</Link></span>
          </div>
        </StyledWrapper>
      </main>
      
      <Footer />
    </div>
  );
};

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
    margin-bottom: 25px;
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
    margin: 30px auto 20px;
    border-radius: 16px;
    box-shadow: 0px 10px 20px -5px rgba(21, 224, 166, 0.2);
    border: none;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }

  .form .login-button:hover {
    transform: translateY(-2px);
  }

  .agreement {
    display: block;
    text-align: center;
    margin-top: 15px;
    font-size: 11px;
    color: gray;
  }

  .agreement a {
    text-decoration: none;
    color: #7b61ff;
    font-size: 14px;
    font-weight: bold;
    margin-left: 5px;
  }
`;
