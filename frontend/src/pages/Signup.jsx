import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const handleSignup = async (e) => {
    e.preventDefault();
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const name = `${firstName} ${lastName}`.trim();
      const response = await api.post('/auth/user/signup', { name, email, password });
      
      const responseData = response.data || response;
      
      if (responseData && responseData.requiresOtp) {
        toast.success('OTP sent to your email!');
        // Navigate to the new page, passing the form data securely in state
        navigate('/verify-otp', { state: { name, email, password } });
      } else if (responseData && responseData.accessToken) {
         await login(responseData.accessToken, responseData.user);
         toast.success('Account created successfully!');
         navigate('/book-service');
      } else {
         toast.error('Unexpected response from server');
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
            <div className="heading">Sign Up</div>
            <form onSubmit={handleSignup} className="form">
              <div className="name-group">
                <input required className="input" type="text" name="firstName" id="firstName" placeholder="First Name" />
                <input required className="input" type="text" name="lastName" id="lastName" placeholder="Last Name" />
              </div>
              <input required className="input" type="email" name="email" id="email" placeholder="E-mail" />
              <input required className="input" type="password" name="password" id="password" placeholder="Password" />
              <input required className="input" type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" />
              <input className="login-button" type="submit" value={loading ? "Sending OTP..." : "Sign Up"} disabled={loading} />
            </form>
            <div className="social-account-container">
              <span className="title">Or Sign up with</span>
              <div className="social-accounts">
                <button type="button" className="social-button google" onClick={() => window.location.href = 'http://localhost:5000/api/v1/auth/google'}>
                  <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 488 512">
                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                  </svg>
                </button>
                <button type="button" className="social-button apple" onClick={() => toast('Apple Signup requires API keys. Coming soon!', { icon: '🚧' })}>
                  <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                </button>
                <button type="button" className="social-button github" onClick={() => window.location.href = 'http://localhost:5000/api/v1/auth/github'}>
                  <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 496 512">
                    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                  </svg>
                </button>
              </div>
            </div>
            <span className="agreement">Already have an account? <Link to="/login">Sign in</Link></span>
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
    margin-bottom: 25px;
  }

  .form {
    margin-top: 10px;
  }

  .name-group {
    display: flex;
    gap: 10px;
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

  .form .input::-moz-placeholder {
    color: #8b8a9b;
  }

  .form .input::placeholder {
    color: #8b8a9b;
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
    box-shadow: 0px 15px 20px -5px rgba(21, 224, 166, 0.3);
  }

  .form .login-button:active {
    transform: translateY(1px);
    box-shadow: 0px 5px 10px -5px rgba(21, 224, 166, 0.2);
  }

  .social-account-container {
    margin-top: 25px;
  }

  .social-account-container .title {
    display: block;
    text-align: center;
    font-size: 10px;
    color: rgb(170, 170, 170);
  }

  .social-account-container .social-accounts {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 5px;
  }

  .social-account-container .social-accounts .social-button {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
    padding: 5px;
    border-radius: 50%;
    width: 40px;
    aspect-ratio: 1;
    display: grid;
    place-content: center;
    box-shadow: rgba(0,0,0,0.5) 0px 12px 10px -8px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }

  .social-account-container .social-accounts .social-button .svg {
    fill: white;
    margin: auto;
  }

  .social-account-container .social-accounts .social-button:hover {
    transform: scale(1.2);
    background: rgba(255,255,255,0.1);
  }

  .social-account-container .social-accounts .social-button:active {
    transform: scale(0.9);
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
    font-size: 12px;
    font-weight: bold;
    margin-left: 5px;
  }
`;
