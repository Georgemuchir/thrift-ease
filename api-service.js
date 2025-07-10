// API Service for HTML version of ThriftEase
// This file handles all API calls to the Flask backend

// Auto-detect API URL based on environment
const API_BASE_URL = (() => {
  // If running locally, use localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  // For deployed sites - smart detection
  const currentDomain = window.location.origin;
  
  // Common deployment patterns:
  
  // 1. If deployed on Render/Railway/Heroku with separate backend service
  if (window.location.hostname.includes('render.com')) {
    // Replace 'frontend' with 'backend' in the URL
    return currentDomain.replace('frontend', 'backend');
  }
  
  // 2. If backend is on same domain but different port
  if (window.location.hostname.includes('herokuapp.com') || 
      window.location.hostname.includes('railway.app') ||
      window.location.hostname.includes('onrender.com')) {
    // Try same domain (some services can serve both frontend and backend)
    return currentDomain;
  }
  
  // 3. If using GitHub Pages, Netlify, or Vercel, specify your backend URL
  if (window.location.hostname.includes('github.io') || 
      window.location.hostname.includes('netlify.app') ||
      window.location.hostname.includes('vercel.app')) {
    // Your deployed Render backend URL
    const BACKEND_URL = 'https://thrift-ease-1.onrender.com';
    return BACKEND_URL;
  }
  
  // 4. Default: try same domain with port 5000
  return `${window.location.protocol}//${window.location.hostname}:5000`;
})();

console.log('🔗 API Base URL:', API_BASE_URL);

// Global state management
class ThriftEaseState {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.listeners = [];
    this.user = null;
    this.bag = [];
    this.products = [];
    
    this.init();
  }
  
  init() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
    
    // Listen for storage changes (other tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === 'bag') {
        this.bag = JSON.parse(e.newValue || '[]');
        this.notifyListeners('bagUpdate', this.bag);
      }
      if (e.key === 'userInfo') {
        this.user = JSON.parse(e.newValue || 'null');
        this.notifyListeners('userUpdate', this.user);
      }
    });
    
    // Load initial state
    this.loadFromStorage();
  }
  
  loadFromStorage() {
    try {
      this.bag = JSON.parse(localStorage.getItem('bag') || '[]');
      this.user = JSON.parse(localStorage.getItem('userInfo') || 'null');
    } catch (error) {
      console.error('Error loading from storage:', error);
      this.bag = [];
      this.user = null;
    }
  }
  
  addListener(callback) {
    this.listeners.push(callback);
  }
  
  notifyListeners(type, data) {
    this.listeners.forEach(callback => {
      try {
        callback(type, data);
      } catch (error) {
        console.error('Error in listener:', error);
      }
    });
  }
  
  async syncToServer(action, data) {
    if (!this.isOnline || !this.user) {
      this.syncQueue.push({ action, data, timestamp: Date.now() });
      return;
    }
    
    try {
      if (action === 'saveBag') {
        await fetch(`${API_BASE_URL}/api/bag/${this.user.email}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        console.log('✅ Bag synced to server');
      }
    } catch (error) {
      console.error('❌ Sync failed:', error);
      this.syncQueue.push({ action, data, timestamp: Date.now() });
    }
  }
  
  async processSyncQueue() {
    while (this.syncQueue.length > 0 && this.isOnline) {
      const item = this.syncQueue.shift();
      await this.syncToServer(item.action, item.data);
    }
  }
  
  updateBag(newBag) {
    this.bag = newBag;
    localStorage.setItem('bag', JSON.stringify(newBag));
    this.notifyListeners('bagUpdate', newBag);
    this.syncToServer('saveBag', newBag);
  }
  
  setUser(user) {
    this.user = user;
    localStorage.setItem('userInfo', JSON.stringify(user));
    this.notifyListeners('userUpdate', user);
  }
  
  clearUser() {
    this.user = null;
    this.bag = [];
    localStorage.removeItem('userInfo');
    localStorage.removeItem('authToken');
    localStorage.removeItem('bag');
    this.notifyListeners('userUpdate', null);
    this.notifyListeners('bagUpdate', []);
  }
}

// Default products for when backend is not available
const DEFAULT_PRODUCTS = [
  {"id": 1, "name": "Vintage Denim Jacket", "mainCategory": "Women", "subCategory": "Jackets", "price": 45.99, "image": "demo1.jpeg"},
  {"id": 2, "name": "Classic White Sneakers", "mainCategory": "Shoes", "subCategory": "Sneakers", "price": 35.50, "image": "demo2.jpeg"},
  {"id": 3, "name": "Cotton T-Shirt", "mainCategory": "Men", "subCategory": "T-Shirts", "price": 15.99, "image": "demo3.jpeg"},
  {"id": 4, "name": "Kids Rainbow T-Shirt", "mainCategory": "Kids", "subCategory": "T-Shirts", "subGroup": "Girls", "price": 12.99, "image": "demo1.jpeg"},
  {"id": 5, "name": "Boys Denim Shorts", "mainCategory": "Kids", "subCategory": "Shorts", "subGroup": "Boys", "price": 18.50, "image": "demo2.jpeg"},
  {"id": 6, "name": "Summer Dress", "mainCategory": "Women", "subCategory": "Dresses", "price": 39.99, "image": "demo3.jpeg"},
  {"id": 7, "name": "Running Shoes", "mainCategory": "Shoes", "subCategory": "Athletic", "price": 79.99, "image": "demo1.jpeg"},
  {"id": 8, "name": "Casual Blazer", "mainCategory": "Men", "subCategory": "Blazers", "price": 89.99, "image": "demo2.jpeg"}
];

// Default demo users for offline mode
const DEMO_USERS = [
  {
    id: 1,
    username: "Demo User",
    email: "demo@thriftease.com",
    password: "demo123",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    username: "Test User",
    email: "test@thriftease.com", 
    password: "test123",
    created_at: new Date().toISOString()
  }
];

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
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        headers: {
          'Accept': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('✅ Products loaded from backend:', data.length);
      // Store in localStorage as backup
      localStorage.setItem("products", JSON.stringify(data));
      return data;
    } catch (error) {
      console.warn('⚠️ Backend unavailable, using fallback products');
      // First try localStorage
      const storedProducts = localStorage.getItem("products");
      if (storedProducts) {
        return JSON.parse(storedProducts);
      }
      // Finally use default products
      localStorage.setItem("products", JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
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
        body: JSON.stringify(credentials),
        // Add timeout
        signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined
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
      
      console.log('✅ Sign-in successful via backend');
      return data;
    } catch (error) {
      console.warn('⚠️ Backend unavailable, trying offline authentication');
      
      // Offline authentication with demo users
      const { email, password } = credentials;
      const user = DEMO_USERS.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password (Demo mode: use demo@thriftease.com / demo123)');
      }
      
      // Create mock response
      const mockResponse = {
        message: "Sign-in successful (Demo mode)",
        token: `demo_token_${email}_${Date.now()}`,
        user: { email: user.email, username: user.username }
      };
      
      // Store auth info
      localStorage.setItem('authToken', mockResponse.token);
      localStorage.setItem('userInfo', JSON.stringify(mockResponse.user));
      
      console.log('✅ Sign-in successful via demo mode');
      return mockResponse;
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
        body: JSON.stringify(userData),
        signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Sign-up successful via backend');
      return data;
    } catch (error) {
      console.warn('⚠️ Backend unavailable for sign-up, using demo mode');
      
      // In demo mode, just confirm the sign-up worked
      const mockResponse = {
        message: "Account created successfully (Demo mode)",
        user: {
          id: Date.now(),
          username: userData.username,
          email: userData.email
        }
      };
      
      console.log('✅ Sign-up successful via demo mode');
      return mockResponse;
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

// Function to show demo mode notification
function showDemoModeNotification() {
  // Check if notification already shown in this session
  if (sessionStorage.getItem('demoModeNotified')) return;
  
  // Create and show notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #4CAF50;
    color: white;
    padding: 12px 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 10000;
    font-family: Arial, sans-serif;
    max-width: 300px;
    font-size: 14px;
  `;
  notification.innerHTML = `
    <strong>Demo Mode Active</strong><br>
    Backend unavailable. Using demo data.<br>
    Try: demo@thriftease.com / demo123
    <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: white; font-size: 16px; cursor: pointer;">×</button>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 8 seconds
  setTimeout(() => {
    if (notification.parentElement) notification.remove();
  }, 8000);
  
  // Mark as notified for this session
  sessionStorage.setItem('demoModeNotified', 'true');
}

// Make APIs available globally
window.ThriftEaseAPI = {
  Products: ProductsAPI,
  Auth: AuthAPI,
  Orders: OrdersAPI,
  Bag: BagAPI,
  API_BASE_URL
};

window.BagAPI = BagAPI;

// Test backend connection
async function testBackendConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
    });
    if (response.ok) {
      console.log('✅ Backend connection successful');
      return true;
    }
  } catch (error) {
    console.warn('⚠️ Backend not available, using demo mode');
    showDemoModeNotification();
    return false;
  }
}

// Initialize API connection test
document.addEventListener('DOMContentLoaded', () => {
  testBackendConnection();
});
