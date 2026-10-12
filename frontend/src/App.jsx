import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Products } from './pages/Products';
import { Projects } from './pages/Projects';
import { Reviews } from './pages/Reviews';
import { ContactPage } from './pages/ContactPage';
import { ForgotPassword } from './pages/ForgotPassword';
import { OAuthCallback } from './pages/OAuthCallback';
import { BookService } from './pages/BookService';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProductForm } from './pages/Admin/ProductForm';
import { ServiceForm } from './pages/Admin/ServiceForm';
import { ProjectForm } from './pages/Admin/ProjectForm';
import { AuthProvider } from './context/AuthContext';
import { VerifyOtp } from './pages/VerifyOtp';
import { Profile } from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/products" element={<Products />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/book-service" element={<BookService />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/bookings" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminDashboard />} />
        <Route path="/admin/services" element={<AdminDashboard />} />
        <Route path="/admin/projects" element={<AdminDashboard />} />
        <Route path="/admin/reviews" element={<AdminDashboard />} />
        <Route path="/admin/enquiries" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminDashboard />} />
        <Route path="/admin/content" element={<AdminDashboard />} />
        <Route path="/admin/contact" element={<AdminDashboard />} />
        <Route path="/admin/audit-logs" element={<AdminDashboard />} />
        <Route path="/admin/audit" element={<AdminDashboard />} />

        <Route path="/admin/products/create" element={<ProductForm />} />
        <Route path="/admin/products/:id/edit" element={<ProductForm />} />
        <Route path="/admin/services/create" element={<ServiceForm />} />
        <Route path="/admin/services/:id/edit" element={<ServiceForm />} />
        <Route path="/admin/projects/create" element={<ProjectForm />} />
        <Route path="/admin/projects/:id/edit" element={<ProjectForm />} />
        <Route path="/profile" element={<Profile />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
