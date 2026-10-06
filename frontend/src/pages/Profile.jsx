import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import api from '../api/axios';
import { User, Mail, Phone, Calendar, Truck, CheckCircle, Clock } from 'lucide-react';

export const Profile = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchBookings = async () => {
        try {
          const response = await api.get('/bookings/me');
          // Ensure we always set an array, even if the backend returns an object or undefined
          const bookingsData = Array.isArray(response) ? response : (response?.data && Array.isArray(response.data) ? response.data : []);
          setBookings(bookingsData);
        } catch (error) {
          console.error('Failed to fetch bookings', error);
          setBookings([]);
        } finally {
          setLoadingBookings(false);
        }
      };
      fetchBookings();
    }
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-darker flex items-center justify-center text-primary">Loading...</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Safely get the first letter
  const getInitial = () => {
    if (user?.name && typeof user.name === 'string') return user.name.charAt(0).toUpperCase();
    if (user?.email && typeof user.email === 'string') return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <div className="font-sans bg-darker text-gray-100 min-h-screen relative flex flex-col">
      <div className="blob blob-1 fixed"></div>
      <div className="blob blob-2 fixed"></div>
      
      <Navbar />
      
      <main className="flex-grow relative z-10 pt-32 pb-20 px-4 max-w-6xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-8 text-white">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Details Card */}
          <div className="lg:col-span-1">
            <StyledCard>
              <div className="card-inner">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 text-primary text-2xl font-bold uppercase">
                    {getInitial()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{user?.name || 'User'}</h2>
                    <p className="text-sm text-gray-400 capitalize">{user?.role?.toLowerCase() || 'Customer'}</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{user?.phone}</span>
                    </div>
                  )}
                </div>

                <button onClick={handleLogout} className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-xl transition-all font-semibold">
                  Logout
                </button>
              </div>
            </StyledCard>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <StyledCard>
              <div className="card-inner h-full flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Calendar className="text-primary" /> Order History
                </h2>
                
                <div className="flex-grow space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {loadingBookings ? (
                    <p className="text-gray-400">Loading your history...</p>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">You haven't booked any services yet.</p>
                      <button onClick={() => navigate('/book-service')} className="mt-4 text-primary hover:underline">Book a service now</button>
                    </div>
                  ) : (
                    Array.isArray(bookings) && bookings.map((booking) => (
                      <div key={booking._id} className="bg-dark/50 border border-white/10 rounded-xl p-5 flex flex-col md:flex-row justify-between gap-4 transition-all hover:bg-white/5">
                        <div>
                          <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                            <Truck className="h-4 w-4 text-primary" /> {booking.vehicleModel} ({booking.vehicleType})
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">Issue: {booking.problemDescription}</p>
                          <p className="text-xs text-gray-500 mt-2">Date: {new Date(booking.preferredDate || booking.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                            booking.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          } flex items-center gap-1`}>
                            {booking.status === 'COMPLETED' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            {booking.status || 'PENDING'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </StyledCard>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const StyledCard = styled.div`
  height: 100%;
  background: #15131e;
  border-radius: 35px;
  padding: 30px;
  border: none;
  box-shadow: 0px 20px 40px -20px rgba(0,0,0,0.5);
  
  .card-inner {
    height: 100%;
  }
`;
