import api from './axios';

export const adminServiceApi = {
  getAll: () => api.get('/admin/services'),
  create: (data) => api.post('/admin/services', data),
  update: (id, data) => api.patch(`/admin/services/${id}`, data),
  delete: (id) => api.delete(`/admin/services/${id}`),
};

export const adminProductApi = {
  getAll: () => api.get('/admin/products'),
  create: (data) => api.post('/admin/products', data),
  update: (id, data) => api.patch(`/admin/products/${id}`, data),
  delete: (id) => api.delete(`/admin/products/${id}`),
};

export const adminBookingApi = {
  getAll: () => api.get('/admin/bookings'),
  updateStatus: (id, status) => api.patch(`/admin/bookings/${id}/status`, { status }),
  updateNotes: (id, notes) => api.patch(`/admin/bookings/${id}/notes`, { adminNotes: notes }),
};

export const adminProjectApi = {
  getAll: () => api.get('/admin/projects'),
  create: (data) => api.post('/admin/projects', data),
  update: (id, data) => api.patch(`/admin/projects/${id}`, data),
  delete: (id) => api.delete(`/admin/projects/${id}`),
};

export const adminReviewApi = {
  getAll: () => api.get('/admin/reviews'),
  approve: (id) => api.patch(`/admin/reviews/${id}/approve`),
  reject: (id) => api.patch(`/admin/reviews/${id}/reject`),
  delete: (id) => api.delete(`/admin/reviews/${id}`),
};

export const adminEnquiryApi = {
  getAll: () => api.get('/admin/enquiries'),
  update: (id, data) => api.patch(`/admin/enquiries/${id}`, data),
};

export const adminContentApi = {
  getHomepage: () => api.get('/website-content'),
  updateHomepage: (data) => api.patch('/admin/website-content', data),
};

export const adminContactApi = {
  getContact: () => api.get('/contact'),
  updateContact: (data) => api.patch('/admin/contact', data),
};

export const dashboardApi = {
  getAggregations: () => api.get('/admin/dashboard/summary'),
};

export const uploadApi = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/uploads', formData);
  },
};

export const adminUserApi = {
  getAll: (search) => api.get('/admin/users' + (search ? '?search=' + search : '')),
};
