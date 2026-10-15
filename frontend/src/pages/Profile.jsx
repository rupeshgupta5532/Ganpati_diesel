import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router';
import api from '../api/axios';
import { userApi } from '../api/services';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  ArrowLeft,
  Camera,
  Edit3,
  RotateCcw,
  ShieldCheck,
  Lock,
  LogOut,
  X,
  Upload,
  AlertCircle,
  Check,
  Loader2,
  Sparkles,
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=250&q=80',
  'https://api.dicebear.com/7.x/bottts/svg?seed=DieselMaster',
  'https://api.dicebear.com/7.x/bottts/svg?seed=TurboSpeed',
];

export const Profile = () => {
  const { user, isAuthenticated, isLoading, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'bookings' | 'security'
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingFilter, setBookingFilter] = useState('ALL');

  // Profile Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    profileImage: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        profileImage: user.profileImage || '',
      });
    }
  }, [user]);

  // Handle route tab parameter (e.g. if navigated from /bookings)
  useEffect(() => {
    if (location.pathname === '/bookings') {
      setActiveTab('bookings');
    }
  }, [location.pathname]);

  // Auth protection
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Fetch bookings
  useEffect(() => {
    if (isAuthenticated) {
      const fetchBookings = async () => {
        try {
          const response = await api.get('/bookings/me');
          const bookingsData = Array.isArray(response)
            ? response
            : response?.data && Array.isArray(response.data)
            ? response.data
            : [];
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
    return (
      <div className="min-h-screen bg-darker flex items-center justify-center text-primary font-medium">
        <Loader2 className="w-8 h-8 animate-spin text-primary mr-3" />
        Loading your profile...
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const hasFormChanges =
    user &&
    (formData.name !== (user.name || '') ||
      formData.phone !== (user.phone || '') ||
      formData.address !== (user.address || '') ||
      formData.profileImage !== (user.profileImage || ''));

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Full Name is required');
      return;
    }

    setIsSaving(true);
    try {
      await userApi.updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        profileImage: formData.profileImage,
      });
      await refreshProfile();
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      const msg = err.response?.data?.message || 'Failed to update profile';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetForm = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        profileImage: user.profileImage || '',
      });
      toast('Changes reverted', { icon: '↩️' });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|webp|gif)$/i)) {
      toast.error('Please select a valid image file (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('file', file);

    setIsUploadingAvatar(true);
    try {
      const res = await userApi.uploadAvatar(uploadData);
      const uploadedUrl = res.data?.data?.url || res.data?.url;
      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, profileImage: uploadedUrl }));
        await userApi.updateProfile({ profileImage: uploadedUrl });
        await refreshProfile();
        toast.success('Profile photo uploaded and saved!');
        setIsAvatarModalOpen(false);
      } else {
        throw new Error('Image URL not returned');
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSelectPresetAvatar = async (url) => {
    setFormData((prev) => ({ ...prev, profileImage: url }));
    try {
      await userApi.updateProfile({ profileImage: url });
      await refreshProfile();
      toast.success('Avatar updated!');
      setIsAvatarModalOpen(false);
    } catch (error) {
      console.error('Failed to save preset avatar', error);
      toast.error('Failed to update avatar');
    }
  };

  const handleRemovePhoto = async () => {
    setFormData((prev) => ({ ...prev, profileImage: '' }));
    try {
      await userApi.updateProfile({ profileImage: '' });
      await refreshProfile();
      toast.success('Profile photo removed');
      setIsAvatarModalOpen(false);
    } catch (error) {
      console.error('Failed to remove avatar', error);
      toast.error('Failed to remove photo');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const getInitial = () => {
    if (user?.name && typeof user.name === 'string') return user.name.charAt(0).toUpperCase();
    if (user?.email && typeof user.email === 'string') return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'ALL') return true;
    return b.status === bookingFilter;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'PENDING').length,
    completed: bookings.filter((b) => b.status === 'COMPLETED').length,
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <div className="font-sans bg-darker text-gray-100 min-h-screen relative flex flex-col selection:bg-primary selection:text-black">
      <div className="blob blob-1 fixed"></div>
      <div className="blob blob-2 fixed"></div>

      <Navbar />

      <main className="flex-grow relative z-10 pt-28 pb-20 px-4 max-w-6xl mx-auto w-full">
        {/* Top bar with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all text-sm font-medium backdrop-blur-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-primary" />
            <span>Back</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 text-xs font-bold transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Go to Admin Panel</span>
            </button>
          )}
        </div>

        {/* Hero User Profile Card */}
        <div className="bg-[#15131e]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            {/* Avatar with Camera badge */}
            <div className="relative group">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-white/5 border-2 border-primary/50 flex items-center justify-center shadow-lg relative">
                {formData.profileImage || user?.profileImage ? (
                  <img
                    src={formData.profileImage || user?.profileImage}
                    alt={user?.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-primary/30 to-amber-500/20 text-primary text-4xl font-black">
                    {getInitial()}
                  </div>
                )}
              </div>

              {/* Edit Avatar Button */}
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary hover:bg-primary-hover text-black flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer border-2 border-[#15131e]"
                title="Change Profile Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* User Meta Information */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {user?.name || 'Customer'}
                </h1>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    isAdmin
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-primary/10 text-primary border-primary/30'
                  }`}
                >
                  {isAdmin ? 'Administrator' : 'Customer Account'}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-400 mb-6">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-primary/80" />
                  {user?.email}
                </span>
                {user?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-primary/80" />
                    {user?.phone}
                  </span>
                )}
                {user?.createdAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary/80" />
                    Joined{' '}
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>

              {/* Quick Stats Chips */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto md:mx-0">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
                  <div className="text-xs text-gray-400 font-medium">Total Bookings</div>
                  <div className="text-xl font-bold text-white mt-0.5">{stats.total}</div>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
                  <div className="text-xs text-amber-400 font-medium">Pending</div>
                  <div className="text-xl font-bold text-amber-400 mt-0.5">{stats.pending}</div>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
                  <div className="text-xs text-emerald-400 font-medium">Completed</div>
                  <div className="text-xl font-bold text-emerald-400 mt-0.5">{stats.completed}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="flex border-b border-white/10 mb-8 space-x-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 ${
              activeTab === 'profile'
                ? 'border-primary text-primary bg-primary/10'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 ${
              activeTab === 'bookings'
                ? 'border-primary text-primary bg-primary/10'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Bookings & Orders</span>
            {bookings.length > 0 && (
              <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-white/10 text-white font-bold">
                {bookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 ${
              activeTab === 'security'
                ? 'border-primary text-primary bg-primary/10'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Account & Security</span>
          </button>
        </div>

        {/* TAB 1: Profile Settings (Edit Profile Section) */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-[#15131e]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-bold text-white">Edit Profile Details</h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Update your personal information and contact details.
                    </p>
                  </div>
                  <span className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-gray-400">
                    ID: {user?._id?.slice(-6) || user?.id?.slice(-6) || '---'}
                  </span>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Phone & Address in grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Phone className="w-4 h-4 text-primary" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                        />
                      </div>
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                          Email Address
                        </label>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Read-Only
                        </span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Mail className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full pl-10 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-gray-400 cursor-not-allowed text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Workshop / Delivery Address */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                      Address / Workshop Location
                    </label>
                    <div className="relative">
                      <div className="absolute top-3.5 left-3.5 pointer-events-none text-gray-400">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <textarea
                        rows={3}
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Plot number, industrial area, street, city, pin code..."
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm resize-none"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">
                      Used for scheduling on-site service diagnostics and fuel pump delivery.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="pt-4 flex flex-wrap items-center justify-end gap-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      disabled={!hasFormChanges || isSaving}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                    </button>

                    <button
                      type="submit"
                      disabled={!hasFormChanges || isSaving}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-primary hover:bg-primary-hover text-black shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.02] disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Profile Sidebar Info */}
            <div className="space-y-6">
              {/* Profile Photo Quick Card */}
              <div className="bg-[#15131e]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl text-center">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">
                  Profile Photo
                </h3>
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-white/5 border-2 border-primary/40 flex items-center justify-center mb-4">
                  {formData.profileImage || user?.profileImage ? (
                    <img
                      src={formData.profileImage || user?.profileImage}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary">{getInitial()}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-primary" />
                  Change Profile Photo
                </button>
              </div>

              {/* Account Security Card */}
              <div className="bg-[#15131e]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Account Privacy
                </h3>
                <div className="space-y-3 text-xs text-gray-400">
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span>Email Verification</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span>Account Role</span>
                    <span className="text-primary font-semibold capitalize">
                      {user?.role?.toLowerCase() || 'Customer'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>Password Status</span>
                    <span className="text-gray-300 font-semibold">Protected</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="w-full mt-5 text-center text-xs font-semibold text-primary hover:underline block"
                >
                  Reset / Change Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Bookings History */}
        {activeTab === 'bookings' && (
          <div className="bg-[#15131e]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="text-primary w-5 h-5" /> My Bookings & Orders
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  View and track the status of all your vehicle service requests.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {['ALL', 'PENDING', 'COMPLETED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      bookingFilter === st
                        ? 'bg-primary text-black'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {st === 'ALL' ? 'All Bookings' : st}
                  </button>
                ))}
              </div>
            </div>

            {loadingBookings ? (
              <div className="py-16 text-center text-gray-400 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                <p>Loading your booking history...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-4 border border-white/10">
                  <Truck className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Bookings Found</h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
                  {bookingFilter === 'ALL'
                    ? "You haven't booked any diesel services yet. Schedule your first pump or injector checkup now!"
                    : `No bookings found with status "${bookingFilter}".`}
                </p>
                <button
                  onClick={() => navigate('/book-service')}
                  className="bg-primary text-black font-bold py-3 px-8 rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Book a Service Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-primary/40 transition-all flex flex-col md:flex-row justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                          <Truck className="w-5 h-5" />
                        </span>
                        <div>
                          <h4 className="font-bold text-white text-base">
                            {booking.vehicleModel || 'Vehicle Service'}
                            {booking.vehicleType && (
                              <span className="text-xs text-gray-400 ml-2 font-normal">
                                ({booking.vehicleType})
                              </span>
                            )}
                          </h4>
                          <span className="text-xs text-gray-500">
                            Booking ID: #{booking._id?.slice(-8)}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-300 pl-13">
                        <span className="text-gray-500 font-medium">Issue: </span>
                        {booking.problemDescription || 'Diesel inspection & pump service'}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pl-13 pt-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {new Date(booking.preferredDate || booking.createdAt).toLocaleDateString(
                            'en-US',
                            { dateStyle: 'medium' }
                          )}
                        </span>
                        {booking.preferredTime && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            {booking.preferredTime}
                          </span>
                        )}
                        {booking.contactNumber && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-primary" />
                            {booking.contactNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                      <span
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                          booking.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : booking.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : booking.status === 'CANCELLED'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {booking.status === 'COMPLETED' ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : booking.status === 'PENDING' ? (
                          <Clock className="w-3.5 h-3.5" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5" />
                        )}
                        {booking.status || 'PENDING'}
                      </span>

                      <button
                        onClick={() => navigate('/book-service')}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Book Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Security & Session */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Password and Auth */}
            <div className="bg-[#15131e]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" /> Password & Login
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Manage your login credentials and password reset options.
              </p>

              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">Password Recovery</span>
                  <span className="text-xs text-primary font-bold">Email OTP</span>
                </div>
                <p className="text-xs text-gray-400">
                  If you need to change your password, request an OTP verification code sent
                  directly to your registered email ({user?.email}).
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-3 px-4 rounded-xl text-sm border border-white/10 transition-all cursor-pointer text-center"
              >
                Send Password Reset Request
              </button>
            </div>

            {/* Session Management */}
            <div className="bg-[#15131e]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <LogOut className="w-5 h-5 text-red-400" /> Session Management
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  Sign out from your active account on this browser.
                </p>

                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 mb-6">
                  <div className="text-sm font-bold text-red-400 mb-1">Active Session</div>
                  <p className="text-xs text-gray-400">
                    Logged in as <span className="text-white font-medium">{user?.email}</span>.
                    Signing out will terminate your current session on this device.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out from All Devices
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Avatar Picker & Upload Modal */}
      {isAvatarModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setIsAvatarModalOpen(false)}
        >
          <div
            className="bg-[#15131e] border border-white/15 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Choose Profile Avatar
              </h3>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Upload from file button */}
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                disabled={isUploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-white font-semibold transition-all cursor-pointer group disabled:opacity-50"
              >
                {isUploadingAvatar ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span>Uploading photo...</span>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">Upload from Computer</div>
                      <div className="text-xs text-gray-400">JPG, PNG, WebP up to 5MB</div>
                    </div>
                  </>
                )}
              </button>
            </div>

            {/* Preset Avatars */}
            <div className="mb-6">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Or pick a preset avatar
              </div>
              <div className="grid grid-cols-4 gap-3">
                {PRESET_AVATARS.map((avatarUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPresetAvatar(avatarUrl)}
                    className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10 hover:border-primary transition-all hover:scale-105 cursor-pointer relative group bg-white/5"
                  >
                    <img
                      src={avatarUrl}
                      alt={`Avatar ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Remove photo option */}
            {(formData.profileImage || user?.profileImage) && (
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs text-gray-400">Reset to default initial</span>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-xs font-semibold text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                >
                  Remove Photo
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
