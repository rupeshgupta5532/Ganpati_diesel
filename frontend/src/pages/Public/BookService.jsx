import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingApi } from '../../api/bookingApi';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';

const bookingSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  vehicleType: z.string().min(1, 'Vehicle type is required'),
  vehicleModel: z.string().min(1, 'Vehicle model is required'),
  problemDescription: z.string().min(10, 'Please describe the problem'),
  preferredDate: z.string().min(1, 'Date is required'),
});

export const BookService = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError('');
    try {
      const payload = { ...data };
      if (!payload.email) delete payload.email;
      await bookingApi.create(payload);
      setSuccess(true);
      setTimeout(() => navigate('/bookings'), 3000);
    } catch (err) {
      setServerError(err?.response?.data?.message || err.message || 'Failed to submit booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-12 bg-white dark:bg-slate-800 shadow dark:shadow-none-xl border border-slate-100 dark:border-slate-700 rounded-lg text-center">
        <div className="text-4xl mb-6">🔒</div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">Authentication Required</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
          To maintain high-quality service and allow you to track your vehicle's repair status, please log in or create an account to book a service.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/login" className="bg-blue-600 text-white font-bold py-3 px-8 rounded hover:bg-blue-700 transition-colors">
            Sign In
          </Link>
          <Link to="/login" className="border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold py-3 px-8 rounded hover:border-slate-800 hover:text-slate-800 dark:text-slate-100 transition-colors">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-20 p-8 bg-green-50 border border-green-200 rounded-lg text-center shadow dark:shadow-none">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Booking Submitted Successfully!</h2>
        <p className="text-green-600">Our engineering team will contact you shortly to confirm your appointment.</p>
        <p className="text-sm text-gray-500 mt-4">Redirecting to your booking history...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-12">
      <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-slate-800 shadow dark:shadow-none-lg border-t-4 border-blue-600 rounded-lg">
        <h1 className="text-3xl font-bold mb-2 text-slate-800 dark:text-slate-100">Book a Service</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Schedule a diagnostic, repair, or component replacement.</p>
        
        {serverError && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 text-sm font-semibold">{serverError}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 dark:text-slate-200 text-sm font-bold mb-2">Customer Name *</label>
              <input {...register('customerName')} className="w-full border border-slate-300 rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.customerName && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.customerName.message}</p>}
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-200 text-sm font-bold mb-2">Phone Number *</label>
              <input {...register('phone')} className="w-full border border-slate-300 rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.phone && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 dark:text-slate-200 text-sm font-bold mb-2">Vehicle Type *</label>
              <input {...register('vehicleType')} placeholder="e.g. Truck, Tractor, SUV" className="w-full border border-slate-300 rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.vehicleType && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.vehicleType.message}</p>}
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-200 text-sm font-bold mb-2">Vehicle Model *</label>
              <input {...register('vehicleModel')} placeholder="e.g. Tata 1512, Scorpio" className="w-full border border-slate-300 rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.vehicleModel && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.vehicleModel.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-200 text-sm font-bold mb-2">Preferred Date *</label>
            <input type="date" {...register('preferredDate')} className="w-full border border-slate-300 rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            {errors.preferredDate && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.preferredDate.message}</p>}
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-200 text-sm font-bold mb-2">Problem Description *</label>
            <textarea {...register('problemDescription')} placeholder="Describe the mechanical issue..." rows={4} className="w-full border border-slate-300 rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            {errors.problemDescription && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.problemDescription.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded transition-colors disabled:opacity-50 text-lg"
          >
            {isSubmitting ? 'Processing Request...' : 'Submit Booking Request'}
          </button>
        </form>
      </div>
    </div>
  );
};
