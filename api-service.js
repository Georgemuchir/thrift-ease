// API Service for HTML version of ThriftEase
// This file handles all API calls to the Flask backend

const API_BASE_URL = 'http://localhost:5000';

// Helper function to handle API errors
function handleApiError(error) {
  console.error('API Error:', error);
  throw error;
}

// Products API
const ProductsAPI = {
  // Fetch all products from backend
  async fetchProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      handleApiError(error);
      // Fallback to localStorage if API fails
      return JSON.parse(localStorage.getItem("products")) || [];
    }
  },

  // Add new product
  async addProduct(productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      handleApiError(error);
      // Fallback to localStorage
      const products = JSON.parse(localStorage.getItem("products")) || [];
      products.push(productData);
      localStorage.setItem("products", JSON.stringify(products));
      return productData;
    }
  }
};

// Authentication API
const AuthAPI = {
  // User sign in
  async signIn(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Pass through the specific error message from the backend
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      // Store auth token and user info if provided
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      if (data.user) {
        localStorage.setItem('userInfo', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // User sign up
  async signUp(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Get stored auth token
  getToken() {
    return localStorage.getItem('authToken');
  },

  // Remove auth token and user info
  removeToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  }
};

// Orders API
const OrdersAPI = {
  // Submit new order
  async submitOrder(orderData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthAPI.getToken()}`
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      handleApiError(error);
      // For now, just simulate success
      return { success: true, orderId: Date.now() };
    }
  }
};

// Bag API
const BagAPI = {
  // Get user's bag from backend
  async getUserBag(userEmail) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bag/${encodeURIComponent(userEmail)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user bag:', error);
      // Fallback to localStorage
      return JSON.parse(localStorage.getItem("bag")) || [];
    }
  },

  // Save user's bag to backend
  async saveUserBag(userEmail, bagItems) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bag/${encodeURIComponent(userEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bagItems)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Also save to localStorage as backup
      localStorage.setItem("bag", JSON.stringify(bagItems));
      return data;
    } catch (error) {
      console.error('Error saving user bag:', error);
      // Fallback to localStorage only
      localStorage.setItem("bag", JSON.stringify(bagItems));
    }
  },

  // Clear user's bag from backend
  async clearUserBag(userEmail) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bag/${encodeURIComponent(userEmail)}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Also clear localStorage
      localStorage.removeItem("bag");
      return await response.json();
    } catch (error) {
      console.error('Error clearing user bag:', error);
      // Fallback to localStorage only
      localStorage.removeItem("bag");
    }
  }
};

// Make APIs available globally
window.ThriftEaseAPI = {
  Products: ProductsAPI,
  Auth: AuthAPI
};

window.BagAPI = BagAPI;

// Export APIs for use in other files
window.ThriftEaseAPI = {
  Products: ProductsAPI,
  Auth: AuthAPI,
  Orders: OrdersAPI,
  Bag: BagAPI,
  API_BASE_URL
};

// Test backend connection
async function testBackendConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (response.ok) {
      console.log('✅ Backend connection successful');
      return true;
    }
  } catch (error) {
    console.warn('⚠️ Backend not available, using localStorage fallback');
    return false;
  }
}

// Initialize API connection test
document.addEventListener('DOMContentLoaded', () => {
  testBackendConnection();
});
