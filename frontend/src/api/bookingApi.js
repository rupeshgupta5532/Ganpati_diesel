import api from './axios';

export const bookingApi = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/me'),
  getBookingDetails: (id) => api.get(`/bookings/${id}`),
};
