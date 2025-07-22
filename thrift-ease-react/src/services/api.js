import axios from 'axios';

// Get API base URL from environment or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

// Products API
export const productsAPI = {
  // Fetch all products
  fetchProducts: async () => {
    try {
      const response = await api.get('/api/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Fetch products by category
  fetchByCategory: async (category) => {
    try {
      const response = await api.get(`/api/products/category/${category}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  // Fetch product by ID
  fetchById: async (productId) => {
    try {
      const response = await api.get(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  },

  // Search products
  search: async (query, filters = {}) => {
    try {
      const params = new URLSearchParams({
        q: query || '',
        ...filters
      });
      const response = await api.get(`/api/products/search?${params}`);
      return response.data || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },

  // Add new product (admin only)
  addProduct: async (productData) => {
    try {
      const response = await api.post('/api/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Update product (admin only)
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/api/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product (admin only)
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

// Authentication API
export const authAPI = {
  // Sign in
  signIn: async (credentials) => {
    try {
      const response = await api.post('/api/auth/signin', credentials);
      return response.data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  // Sign up
  signUp: async (userData) => {
    try {
      const response = await api.post('/api/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/api/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
};

// Cart/Bag API
export const cartAPI = {
  // Get user's cart
  getCart: async (userId) => {
    try {
      const response = await api.get(`/api/bag/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting cart:', error);
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (userId, productId, quantity = 1) => {
    try {
      const response = await api.post('/api/bag/add', {
        userId,
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (userId, productId) => {
    try {
      const response = await api.post('/api/bag/remove', {
        userId,
        productId
      });
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Update item quantity
  updateQuantity: async (userId, productId, quantity) => {
    try {
      const response = await api.post('/api/bag/update', {
        userId,
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  },

  // Clear cart
  clearCart: async (userId) => {
    try {
      const response = await api.post('/api/bag/clear', { userId });
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};

// Orders API
export const ordersAPI = {
  // Create order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get user orders
  getUserOrders: async (userId) => {
    try {
      const response = await api.get(`/api/orders/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  },

  // Get all orders (admin only)
  getAllOrders: async () => {
    try {
      const response = await api.get('/api/admin/orders');
      return response.data;
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw error;
    }
  }
};

// Admin API
export const adminAPI = {
  // Get all users
  getUsers: async () => {
    try {
      const response = await api.get('/api/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/api/admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  },

  // Add new product
  addProduct: async (productData) => {
    try {
      const response = await api.post('/api/admin/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/api/admin/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/api/admin/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/api/admin/orders/${orderId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    try {
      const response = await api.put(`/api/admin/users/${userId}`, { role });
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  // Get special offers
  getSpecialOffers: async () => {
    try {
      const response = await api.get('/api/special-offers');
      return response.data;
    } catch (error) {
      console.error('Error getting special offers:', error);
      throw error;
    }
  },

  // Create special offer
  createSpecialOffer: async (offerData) => {
    try {
      const response = await api.post('/api/admin/special-offers', offerData);
      return response.data;
    } catch (error) {
      console.error('Error creating special offer:', error);
      throw error;
    }
  }
};

// Combined API service object for easy import
export const apiService = {
  // Products
  getProducts: productsAPI.fetchProducts,
  getProductsByCategory: productsAPI.fetchByCategory,
  getProductById: productsAPI.fetchById,
  searchProducts: productsAPI.search,

  // Authentication  
  signIn: authAPI.signIn,
  signUp: authAPI.signUp,
  signOut: authAPI.signOut,
  getCurrentUser: authAPI.getCurrentUser,
  updateProfile: authAPI.updateProfile,

  // Cart/Bag
  addToBag: bagAPI.addItem,
  updateBagItem: bagAPI.updateItem,
  removeBagItem: bagAPI.removeItem,
  getBag: bagAPI.getItems,
  clearBag: bagAPI.clearBag,

  // Orders
  createOrder: ordersAPI.createOrder,
  getUserOrders: ordersAPI.getUserOrders,
  getOrders: ordersAPI.getAllOrders,

  // Admin functions
  getUsers: adminAPI.getUsers,
  getAdminStats: adminAPI.getDashboardStats,
  addProduct: adminAPI.addProduct,
  updateProduct: adminAPI.updateProduct,
  deleteProduct: adminAPI.deleteProduct,
  updateOrderStatus: adminAPI.updateOrderStatus,
  updateUserRole: adminAPI.updateUserRole,
  getSpecialOffers: adminAPI.getSpecialOffers,
  createSpecialOffer: adminAPI.createSpecialOffer
};

export default api;
