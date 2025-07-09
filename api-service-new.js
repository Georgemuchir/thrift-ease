// API Service for HTML version of ThriftEase - REWRITTEN FOR RELIABILITY
// This file handles all API calls and state management

// Auto-detect API URL based on environment
const API_BASE_URL = (() => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  if (window.location.hostname.includes('github.io') || 
      window.location.hostname.includes('netlify.app') ||
      window.location.hostname.includes('vercel.app')) {
    return 'https://thrift-ease-1.onrender.com';
  }
  
  return `${window.location.protocol}//${window.location.hostname}:5000`;
})();

console.log('🔗 API Base URL:', API_BASE_URL);

// Global state management for instant sync
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
    // Online/offline detection
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
    
    // Cross-tab communication
    window.addEventListener('storage', (e) => {
      if (e.key === 'bag') {
        this.bag = JSON.parse(e.newValue || '[]');
        this.notifyListeners('bagUpdate', this.bag);
      }
      if (e.key === 'userInfo') {
        this.user = JSON.parse(e.newValue || 'null');
        this.notifyListeners('userUpdate', this.user);
      }
      if (e.key === 'authToken') {
        // Handle sign-out across tabs
        if (!e.newValue || e.newValue === '') {
          this.user = null;
          this.bag = [];
          this.notifyListeners('signOut', null);
          this.notifyListeners('bagUpdate', []);
        }
      }
    });
    
    // Load initial state
    this.loadFromStorage();
    
    // Start sync interval
    setInterval(() => this.syncCheck(), 3000);
  }
  
  loadFromStorage() {
    try {
      this.bag = JSON.parse(localStorage.getItem('bag') || '[]');
      this.user = JSON.parse(localStorage.getItem('userInfo') || 'null');
      const token = localStorage.getItem('authToken');
      if (token && this.user) {
        console.log('✅ User session restored:', this.user.email);
      }
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
  
  async syncCheck() {
    if (!this.user || !this.isOnline) return;
    
    try {
      const serverBag = await this.fetchBagFromServer();
      if (JSON.stringify(serverBag) !== JSON.stringify(this.bag)) {
        console.log('📡 Server bag different, updating local');
        this.bag = serverBag;
        localStorage.setItem('bag', JSON.stringify(serverBag));
        this.notifyListeners('bagUpdate', serverBag);
        this.showNotification('Data synced from server');
      }
    } catch (error) {
      console.log('Sync check failed:', error.message);
    }
  }
  
  async fetchBagFromServer() {
    if (!this.user) return [];
    
    const response = await fetch(`${API_BASE_URL}/api/bag/${this.user.email}`);
    if (!response.ok) throw new Error('Failed to fetch bag');
    return await response.json();
  }
  
  async syncToServer(action, data) {
    if (!this.isOnline || !this.user) {
      this.syncQueue.push({ action, data, timestamp: Date.now() });
      return;
    }
    
    try {
      if (action === 'saveBag') {
        const response = await fetch(`${API_BASE_URL}/api/bag/${this.user.email}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to save bag');
        console.log('✅ Bag synced to server instantly');
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
    
    // Broadcast to other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'bag',
      newValue: JSON.stringify(newBag)
    }));
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
  
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'sync-notification';
    notification.innerHTML = `<i class="fa-solid fa-sync"></i> ${message}`;
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; background: #28a745; color: white;
      padding: 12px 20px; border-radius: 8px; z-index: 10000; font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
}

// Initialize global state
const globalState = new ThriftEaseState();

// Default products for fallback
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

// API request helper
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      timeout: 8000,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

// API implementations
const ProductsAPI = {
  async fetchProducts() {
    try {
      const data = await makeRequest(`${API_BASE_URL}/api/products`);
      console.log('✅ Products loaded from backend:', data.length);
      localStorage.setItem("products", JSON.stringify(data));
      globalState.products = data;
      return data;
    } catch (error) {
      console.warn('⚠️ Backend unavailable, using fallback products');
      const storedProducts = localStorage.getItem("products");
      if (storedProducts) {
        const products = JSON.parse(storedProducts);
        globalState.products = products;
        return products;
      }
      localStorage.setItem("products", JSON.stringify(DEFAULT_PRODUCTS));
      globalState.products = DEFAULT_PRODUCTS;
      return DEFAULT_PRODUCTS;
    }
  },

  async addProduct(productData) {
    try {
      return await makeRequest(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        body: JSON.stringify(productData)
      });
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  }
};

const AuthAPI = {
  async signIn(credentials) {
    try {
      const data = await makeRequest(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      // Store auth data immediately
      localStorage.setItem('authToken', data.token);
      globalState.setUser(data.user);
      
      // Load user's bag immediately and merge
      await this.loadUserBag(data.user.email);
      
      return data;
    } catch (error) {
      throw new Error(error.message || 'Sign-in failed');
    }
  },

  async signUp(userData) {
    try {
      return await makeRequest(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    } catch (error) {
      throw new Error(error.message || 'Sign-up failed');
    }
  },
  
  async loadUserBag(email) {
    try {
      const serverBag = await makeRequest(`${API_BASE_URL}/api/bag/${email}`);
      const localBag = globalState.bag;
      
      // Merge bags - server takes precedence
      const mergedBag = this.mergeBags(localBag, serverBag);
      globalState.updateBag(mergedBag);
      
      console.log('✅ User bag loaded and merged instantly');
      return mergedBag;
    } catch (error) {
      console.error('Failed to load user bag:', error);
      return globalState.bag;
    }
  },
  
  mergeBags(localBag, serverBag) {
    const merged = [...serverBag];
    
    // Add any local items not on server
    localBag.forEach(localItem => {
      const existsOnServer = serverBag.find(serverItem => serverItem.id === localItem.id);
      if (!existsOnServer) {
        merged.push(localItem);
      }
    });
    
    return merged;
  },

  async signOut() {
    try {
      // Save current bag to backend before signing out
      if (globalState.user && globalState.bag.length > 0) {
        await globalState.syncToServer('saveBag', globalState.bag);
      }
      
      // Clear authentication and user data
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      
      // Clear global state
      globalState.setUser(null);
      globalState.updateBag([]);
      
      // Notify listeners
      globalState.notifyListeners('signOut', null);
      globalState.showNotification('Signed out successfully');
      
      console.log('✅ User signed out successfully');
      return true;
    } catch (error) {
      console.error('❌ Error during sign out:', error);
      // Force sign out even if backend sync fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      globalState.setUser(null);
      globalState.updateBag([]);
      return true;
    }
  }
};

const BagAPI = {
  addItem(item) {
    const bag = [...globalState.bag];
    const existingIndex = bag.findIndex(bagItem => bagItem.id === item.id);
    
    if (existingIndex > -1) {
      bag[existingIndex].quantity += 1;
    } else {
      bag.push({ ...item, quantity: 1 });
    }
    
    globalState.updateBag(bag);
    globalState.showNotification('Item added to bag');
    return bag;
  },
  
  removeItem(itemId) {
    const bag = globalState.bag.filter(item => item.id !== itemId);
    globalState.updateBag(bag);
    globalState.showNotification('Item removed from bag');
    return bag;
  },
  
  updateQuantity(itemId, quantity) {
    const bag = [...globalState.bag];
    const itemIndex = bag.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        bag.splice(itemIndex, 1);
      } else {
        bag[itemIndex].quantity = quantity;
      }
      globalState.updateBag(bag);
    }
    
    return bag;
  },
  
  clear() {
    globalState.updateBag([]);
    globalState.showNotification('Bag cleared');
  },
  
  getBag() {
    return globalState.bag;
  }
};

const OrdersAPI = {
  async submitOrder(orderData) {
    try {
      const data = await makeRequest(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
      
      // Clear bag after successful order
      globalState.updateBag([]);
      
      return data;
    } catch (error) {
      throw new Error(error.message || 'Order submission failed');
    }
  }
};

// Make APIs available globally
window.ThriftEaseAPI = {
  Products: ProductsAPI,
  Auth: AuthAPI,
  Bag: BagAPI,
  Orders: OrdersAPI,
  State: globalState,
  API_BASE_URL
};

// Backward compatibility
window.BagAPI = BagAPI;

// Initialize on load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await makeRequest(`${API_BASE_URL}/api/health`);
    console.log('✅ Backend connection successful');
  } catch (error) {
    console.warn('⚠️ Backend not available, using offline mode');
  }
});

console.log('🚀 ThriftEase API v2.0 initialized with instant sync');
