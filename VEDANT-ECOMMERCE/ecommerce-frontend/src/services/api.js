import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
};

export const productAPI = {
  getAllProducts: (params) => apiClient.get('/products', { params }),
  getProductById: (id) => apiClient.get(`/products/${id}`),
  getFeaturedProducts: () => apiClient.get('/products/featured'),
  getCategories: () => apiClient.get('/products/categories'),
};

export const cartAPI = {
  getCart: () => apiClient.get('/cart'),
  addToCart: (data) => apiClient.post('/cart/add', data),
  updateCartItem: (data) => apiClient.put('/cart/update', data),
  removeFromCart: (productId) => apiClient.delete(`/cart/remove/${productId}`),
  clearCart: () => apiClient.delete('/cart/clear'),
};

export const orderAPI = {
  createOrder: (data) => apiClient.post('/orders/create', data),
  getOrders: () => apiClient.get('/orders'),
  getOrderById: (id) => apiClient.get(`/orders/${id}`),
  cancelOrder: (id) => apiClient.put(`/orders/${id}/cancel`),
};

export const adminAPI = {
  createProduct: (data) => apiClient.post('/admin/products', data),
  updateProduct: (id, data) => apiClient.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => apiClient.delete(`/admin/products/${id}`),
  createCategory: (data) => apiClient.post('/admin/categories', data),
  updateCategory: (id, data) => apiClient.put(`/admin/categories/${id}`, data),
  getAllOrders: () => apiClient.get('/admin/orders'),
  updateOrderStatus: (id, data) =>
    apiClient.put(`/admin/orders/${id}/status`, data),
  getAllUsers: () => apiClient.get('/admin/users'),
  toggleUserActive: (id) => apiClient.put(`/admin/users/${id}/toggle`),
  getDashboardStats: () => apiClient.get('/admin/dashboard/stats'),
};

export default apiClient;
