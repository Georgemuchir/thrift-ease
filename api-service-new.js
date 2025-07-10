// API Service for HTML version of ThriftEase - REWRITTEN FOR RELIABILITY
// This file handles all API calls and state management

// Force production API URL for reliability
const API_BASE_URL = 'https://thrift-ease-1.onrender.com';

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
    
    // Start sync interval - faster for production
    setInterval(() => this.syncCheck(), 1000); // Every 1 second for instant sync
  }
  
  loadFromStorage() {
    try {
      // Only load user info and auth token
      this.user = JSON.parse(localStorage.getItem('userInfo') || 'null');
      const token = localStorage.getItem('authToken');
      
      if (token && this.user) {
        console.log('✅ User session restored:', this.user.email);
        // Load user's bag from server
        this.loadUserBagFromServer();
      } else {
        // No authenticated user - clear everything
        this.bag = [];
        this.user = null;
        localStorage.removeItem('bag');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
      this.bag = [];
      this.user = null;
      localStorage.removeItem('bag');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
    }
  }
  
  addListener(eventType, callback) {
    if (typeof eventType === 'function') {
      // Backward compatibility: if only callback is provided
      this.listeners.push(eventType);
    } else {
      // New format: specific event type listeners
      if (!this.eventListeners) {
        this.eventListeners = {};
      }
      if (!this.eventListeners[eventType]) {
        this.eventListeners[eventType] = [];
      }
      this.eventListeners[eventType].push(callback);
    }
  }
  
  notifyListeners(type, data) {
    // Notify general listeners (backward compatibility)
    this.listeners.forEach(callback => {
      try {
        callback(type, data);
      } catch (error) {
        console.error('Error in listener:', error);
      }
    });
    
    // Notify specific event listeners
    if (this.eventListeners && this.eventListeners[type]) {
      this.eventListeners[type].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }
  
  async syncCheck() {
    if (!this.user || !this.isOnline) return;
    
    try {
      const serverBag = await this.fetchBagFromServer();
      const localBagString = JSON.stringify(this.bag);
      const serverBagString = JSON.stringify(serverBag);
      
      if (serverBagString !== localBagString) {
        console.log('📡 Server bag updated, syncing locally');
        this.bag = serverBag;
        localStorage.setItem('bag', serverBagString);
        this.notifyListeners('bagUpdate', serverBag);
        this.showNotification('Data synced', 'success');
      }
    } catch (error) {
      // Silently fail sync checks to avoid spam
      if (error.message && !error.message.includes('Failed to fetch')) {
        console.log('Sync check failed:', error.message);
      }
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
    
    // Trigger storage events for cross-tab sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'authToken',
      newValue: null,
      oldValue: 'some-token'
    }));
    
    this.notifyListeners('userUpdate', null);
    this.notifyListeners('bagUpdate', []);
    this.notifyListeners('signOut', null);
  }
  
  showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.sync-notification');
    existing.forEach(el => el.remove());
    
    const notification = document.createElement('div');
    notification.className = 'sync-notification';
    
    const icon = type === 'success' ? 'fa-check' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-sync';
    const bgColor = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff';
    
    notification.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; background: ${bgColor}; color: white;
      padding: 12px 20px; border-radius: 8px; z-index: 10000; font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease;
      transform: translateX(400px); transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  }
  
  async manualSync() {
    if (!this.user) {
      throw new Error('No user logged in');
    }
    
    try {
      // Force sync check
      await this.syncCheck();
      this.showNotification('Manual sync completed');
      return true;
    } catch (error) {
      console.error('Manual sync failed:', error);
      throw error;
    }
  }
  
  async loadUserBagFromServer() {
    if (!this.user) return;
    
    try {
      const serverBag = await this.fetchBagFromServer();
      this.bag = serverBag;
      localStorage.setItem('bag', JSON.stringify(serverBag));
      this.notifyListeners('bagUpdate', serverBag);
      console.log('✅ User bag loaded from server:', serverBag.length, 'items');
    } catch (error) {
      console.log('Could not load bag from server:', error.message);
      this.bag = [];
      localStorage.setItem('bag', JSON.stringify([]));
    }
  }
}

// Initialize global state
const globalState = new ThriftEaseState();

// API request helper with improved error handling
async function makeRequest(url, options = {}) {
  try {
    console.log('🌐 Making API request to:', url);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || errorData.message || `Server error (${response.status})`;
      console.error('❌ API Error:', errorMessage);
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('✅ API request successful');
    return data;
  } catch (error) {
    console.error('❌ API Request failed:', error);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection and try again.');
    } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Connection error. Please check your internet connection and try again.');
    } else {
      throw error;
    }
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
      console.error('⚠️ Failed to load products from backend:', error);
      
      // Try to use cached products
      const storedProducts = localStorage.getItem("products");
      if (storedProducts) {
        try {
          const products = JSON.parse(storedProducts);
          console.log('📦 Using cached products:', products.length);
          globalState.products = products;
          return products;
        } catch (parseError) {
          console.error('Failed to parse cached products:', parseError);
        }
      }
      
      // No products available
      throw new Error('No products available. Please check your internet connection.');
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
      console.log('🔐 Attempting sign-in with API...', { email: credentials.email });
      
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }
      
      const data = await makeRequest(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      console.log('✅ Sign-in API response received:', { 
        success: !!data.token, 
        user: data.user?.email,
        hasToken: !!data.token
      });
      
      if (!data.token || !data.user) {
        throw new Error('Invalid response from server');
      }
      
      // Store auth data immediately
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      globalState.setUser(data.user);
      
      // Load user's bag immediately and merge
      try {
        await this.loadUserBag(data.user.email);
      } catch (bagError) {
        console.warn('⚠️ Could not load user bag:', bagError.message);
        // Don't fail the entire sign-in for bag loading issues
      }
      
      // Trigger events for UI updates
      globalState.notifyListeners('userUpdate', data.user);
      globalState.showNotification(`Welcome back, ${data.user.username || data.user.email}!`, 'success');
      
      return data;
    } catch (error) {
      console.error('❌ Sign-in failed:', error);
      
      // Provide more specific error messages based on the actual error
      let errorMessage = error.message;
      
      if (error.message.includes('Invalid password')) {
        errorMessage = 'Invalid password';
      } else if (error.message.includes('User not found')) {
        errorMessage = 'User not found';
      } else if (error.message.includes('Email and password required')) {
        errorMessage = 'Email and password are required';
      } else if (error.message.includes('Connection error') || 
                 error.message.includes('Failed to fetch') || 
                 error.message.includes('NetworkError')) {
        errorMessage = 'Connection error. Please check your internet connection and try again.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.message.includes('500') || error.message.includes('server')) {
        errorMessage = 'Server error. Please try again in a moment.';
      } else if (error.message.includes('Invalid response')) {
        errorMessage = 'Invalid response from server. Please try again.';
      }
      
      throw new Error(errorMessage);
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
      localStorage.removeItem('bag');
      
      // Clear global state
      globalState.user = null;
      globalState.bag = [];
      
      // Trigger storage events for cross-tab sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'authToken',
        newValue: null,
        oldValue: 'some-token'
      }));
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'userInfo',
        newValue: null,
        oldValue: 'some-user'
      }));
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'bag',
        newValue: '[]',
        oldValue: JSON.stringify(globalState.bag)
      }));
      
      // Notify listeners
      globalState.notifyListeners('signOut', null);
      globalState.notifyListeners('userUpdate', null);
      globalState.notifyListeners('bagUpdate', []);
      globalState.showNotification('Signed out successfully');
      
      console.log('✅ User signed out successfully');
      return true;
    } catch (error) {
      console.error('❌ Error during sign out:', error);
      // Force sign out even if backend sync fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('bag');
      globalState.user = null;
      globalState.bag = [];
      globalState.notifyListeners('signOut', null);
      globalState.notifyListeners('userUpdate', null);
      globalState.notifyListeners('bagUpdate', []);
      return true;
    }
  }
};

const BagAPI = {
  addItem(item) {
    // Only allow adding items if user is authenticated
    if (!globalState.user) {
      throw new Error('Please sign in to add items to your bag');
    }
    
    const bag = [...globalState.bag];
    const existingIndex = bag.findIndex(bagItem => bagItem.id === item.id);
    
    if (existingIndex > -1) {
      bag[existingIndex].quantity += 1;
    } else {
      bag.push({ ...item, quantity: 1 });
    }
    
    globalState.updateBag(bag);
    globalState.showNotification('Item added to bag', 'success');
    return bag;
  },
  
  removeItem(itemId) {
    if (!globalState.user) {
      throw new Error('Please sign in to modify your bag');
    }
    
    const bag = globalState.bag.filter(item => item.id !== itemId);
    globalState.updateBag(bag);
    globalState.showNotification('Item removed from bag', 'success');
    return bag;
  },
  
  updateQuantity(itemId, quantity) {
    if (!globalState.user) {
      throw new Error('Please sign in to modify your bag');
    }
    
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
    if (!globalState.user) {
      return [];
    }
    
    globalState.updateBag([]);
    globalState.showNotification('Bag cleared', 'success');
  },
  
  getBag() {
    // Return empty bag if not authenticated
    return globalState.user ? globalState.bag : [];
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

// Initialize APIs immediately and make them available globally
function setupGlobalAPI() {
  window.ThriftEaseAPI = {
    Products: ProductsAPI,
    Auth: AuthAPI,
    Bag: BagAPI,
    Orders: OrdersAPI,
    State: globalState,
    API_BASE_URL,
    isReady: false,
    
    // Diagnostic function for debugging
    async diagnose() {
      console.log('🔍 ThriftEase API Diagnostics:');
      console.log('- API Object:', !!window.ThriftEaseAPI);
      console.log('- Auth API:', !!window.ThriftEaseAPI.Auth);
      console.log('- Is Ready:', window.ThriftEaseAPI.isReady);
      console.log('- Global State:', !!globalState);
      console.log('- Current User:', globalState.user);
      console.log('- Auth Token:', !!localStorage.getItem('authToken'));
      
      try {
        const health = await makeRequest(`${API_BASE_URL}/api/health`);
        console.log('- Backend Health:', health);
        return { status: 'ok', backend: 'connected', health };
      } catch (error) {
        console.log('- Backend Error:', error.message);
        return { status: 'offline', backend: 'disconnected', error: error.message };
      }
    }
  };

  // Backward compatibility
  window.BagAPI = BagAPI;
  
  console.log('🔧 ThriftEase API object created');
}

// Set up API immediately
setupGlobalAPI();

// Enhanced initialization with better error handling
async function initializeAPI() {
  console.log('🚀 API Service initializing...');
  console.log('🔗 API Base URL:', API_BASE_URL);
  
  try {
    const healthData = await makeRequest(`${API_BASE_URL}/api/health`);
    console.log('✅ Backend connection successful:', healthData);
    window.ThriftEaseAPI.isReady = true;
    
    if (globalState && globalState.showNotification) {
      globalState.showNotification('Connected to server', 'success');
    }
    
    // Dispatch ready event for other scripts
    window.dispatchEvent(new CustomEvent('ThriftEaseAPIReady', { detail: window.ThriftEaseAPI }));
    
  } catch (error) {
    console.warn('⚠️ Backend not available:', error.message);
    window.ThriftEaseAPI.isReady = true; // Still mark as ready for offline mode
    
    if (globalState && globalState.showNotification) {
      globalState.showNotification('Working offline - some features may be limited', 'warning');
    }
    
    // Still dispatch ready event for offline mode
    window.dispatchEvent(new CustomEvent('ThriftEaseAPIReady', { detail: window.ThriftEaseAPI }));
  }
  
  console.log('🎯 ThriftEase API v2.0 ready');
}

// Multiple initialization strategies for reliability
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAPI);
} else {
  // DOM already loaded
  setTimeout(initializeAPI, 0);
}

// Fallback initialization after 1 second if not ready
setTimeout(() => {
  if (!window.ThriftEaseAPI || !window.ThriftEaseAPI.isReady) {
    console.log('🔄 Fallback API initialization...');
    initializeAPI();
  }
}, 1000);

console.log('🚀 ThriftEase API v2.0 initialized with instant sync');
