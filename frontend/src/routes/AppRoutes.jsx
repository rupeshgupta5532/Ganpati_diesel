import React from 'react';
import { Routes, Route } from 'react-router';
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { LoginForm } from '../features/auth/LoginForm';
import { SignupForm } from '../features/auth/SignupForm';
import { ForgotPassword } from '../features/auth/ForgotPassword';
import { AdminDashboard } from '../pages/Admin/Dashboard';
import { AdminServices } from '../pages/Admin/Services';
import { ServiceForm } from '../pages/Admin/ServiceForm';
import { AdminBookings } from '../pages/Admin/Bookings';
import { AdminProducts } from '../pages/Admin/Products';
import { ProductForm } from '../pages/Admin/ProductForm';
import { AdminProjects } from '../pages/Admin/Projects';
import { ProjectForm } from '../pages/Admin/ProjectForm';
import { AdminReviews } from '../pages/Admin/Reviews';
import { AdminEnquiries } from '../pages/Admin/Enquiries';
import { AdminContent } from '../pages/Admin/Content';
import { AdminNotifications } from '../pages/Admin/Notifications';
import { AdminContact } from '../pages/Admin/Contact';
import { Home } from '../pages/Public/Home';
import { About } from '../pages/Public/About';
import { PublicServices } from '../pages/Public/Services';
import { PublicProducts } from '../pages/Public/Products';
import { PublicProjects } from '../pages/Public/Projects';
import { PublicProjectDetails } from '../pages/Public/ProjectDetails';
import { PublicReviews } from '../pages/Public/Reviews';
import { PublicContact } from '../pages/Public/Contact';
import { BookService } from '../pages/Public/BookService';
import { CustomerDashboard } from '../pages/customer/Dashboard';
import { CustomerBookings } from '../pages/customer/Bookings';
import { BookingDetails } from '../pages/customer/BookingDetails';
import { CustomerProfile } from '../pages/customer/Profile';
import { CustomerNotifications } from '../pages/customer/Notifications';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<PublicServices />} />
        <Route path="/products" element={<PublicProducts />} />
        <Route path="/projects" element={<PublicProjects />} />
        <Route path="/projects/:id" element={<PublicProjectDetails />} />
        <Route path="/reviews" element={<PublicReviews />} />
        <Route path="/contact" element={<PublicContact />} />
        <Route path="/book-service" element={<BookService />} />
        <Route path="/bookings" element={<CustomerBookings />} />
        <Route path="/bookings/:id" element={<BookingDetails />} />
        <Route path="/profile" element={<CustomerProfile />} />
        <Route path="/notifications" element={<CustomerNotifications />} />
        <Route path="/login" element={<LoginForm isAdmin={false} />} />
        <Route path="/admin/login" element={<LoginForm isAdmin={true} />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route element={<CustomerLayout />}>
        <Route path="/dashboard" element={<CustomerDashboard />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="services/create" element={<ServiceForm />} />
        <Route path="services/:id/edit" element={<ServiceForm />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/create" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="projects/create" element={<ProjectForm />} />
        <Route path="projects/:id/edit" element={<ProjectForm />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="contact" element={<AdminContact />} />
      </Route>
    </Routes>
  );
};
