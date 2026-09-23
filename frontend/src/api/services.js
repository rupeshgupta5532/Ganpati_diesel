import api from './axios';

export const serviceApi = {
  getAll: () => api.get('/services'),
  getBySlug: (slug) => api.get(`/services/${slug}`),
};

export const productApi = {
  getAll: () => api.get('/products'),
  getBySlug: (slug) => api.get(`/products/${slug}`),
};

export const websiteContentApi = {
  getHomepage: () => api.get('/website-content'),
};

export const contactApi = {
  getContact: () => api.get('/contact'),
};

export const projectApi = {
  getAll: () => api.get('/projects'),
  getBySlug: (slug) => api.get(`/projects/${slug}`),
};

export const reviewApi = {
  getAll: () => api.get('/reviews'),
  create: (data) => api.post('/reviews', data),
};

export const userApi = {
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.patch('/auth/profile', data),
};

export const enquiryApi = {
  create: (data) => api.post('/enquiries', data),
};
