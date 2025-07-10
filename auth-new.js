/**
 * QuickThrift Authentication System - Complete Rebuild
 * Simple, reliable authentication that works with or without backend
 */

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      const icon = mobileMenuToggle.querySelector('i');
      if (mainNav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mainNav.classList.remove('active');
        const icon = mobileMenuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });

    // Close mobile menu when clicking on navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        const icon = mobileMenuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      });
    });
  }
});

class QuickThriftAuthSystem {
  constructor() {
    this.isAuthenticated = false;
    this.currentUser = null;
    
    // Auto-detect environment and set API URL
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      this.API_URL = 'http://127.0.0.1:5000/api'; // Local development
    } else if (window.location.hostname.includes('staging') || window.location.hostname.includes('dev')) {
      this.API_URL = 'https://quickthrift-backend-staging.onrender.com/api'; // Staging backend
    } else {
      this.API_URL = 'https://quickthrift-backend.onrender.com/api'; // Production backend
    }
    
    // Check if user is already logged in
    this.checkAuthStatus();
    this.setupNotificationSystem();
  }

  // Check authentication status on page load
  checkAuthStatus() {
    const token = localStorage.getItem('qt_auth_token');
    const userData = localStorage.getItem('qt_user_data');
    
    if (token && userData) {
      try {
        this.currentUser = JSON.parse(userData);
        this.isAuthenticated = true;
        this.updateUIForAuthenticatedUser();
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.logout();
      }
    }
  }

  // Set up notification system
  setupNotificationSystem() {
    if (!document.getElementById('qt-notification-container')) {
      const container = document.createElement('div');
      container.id = 'qt-notification-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }
  }

  // Show notification
  showNotification(message, type = 'info') {
    const container = document.getElementById('qt-notification-container');
    const notification = document.createElement('div');
    
    const colors = {
      success: '#d4edda',
      error: '#f8d7da',
      warning: '#fff3cd',
      info: '#cce7ff'
    };
    
    const borderColors = {
      success: '#28a745',
      error: '#dc3545',
      warning: '#ffc107',
      info: '#007bff'
    };
    
    notification.style.cssText = `
      background: ${colors[type] || colors.info};
      border: 2px solid ${borderColors[type] || borderColors.info};
      color: #333;
      padding: 15px 20px;
      border-radius: 8px;
      margin-bottom: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-width: 350px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      pointer-events: auto;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: none; border: none; font-size: 18px; cursor: pointer; color: #666;">×</button>
      </div>
    `;
    
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  // Show loading spinner
  showLoading(message = 'Loading...') {
    let loader = document.getElementById('qt-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'qt-loader';
      document.body.appendChild(loader);
    }
    
    loader.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
      color: white;
      font-family: Arial, sans-serif;
    `;
    
    loader.innerHTML = `
      <div style="text-align: center;">
        <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
        <div>${message}</div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
  }

  // Hide loading spinner
  hideLoading() {
    const loader = document.getElementById('qt-loader');
    if (loader) {
      loader.remove();
    }
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  validatePassword(password) {
    return password && password.length >= 6; // Simplified validation
  }

  // Login function
  async login(email, password) {
    if (!email || !password) {
      this.showNotification('Please enter both email and password', 'error');
      return { success: false, error: 'Missing credentials' };
    }

    if (!this.validateEmail(email)) {
      this.showNotification('Please enter a valid email address', 'error');
      return { success: false, error: 'Invalid email' };
    }

    this.showLoading('Signing in...');

    try {
      // Try backend first
      const response = await fetch(`${this.API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.token) {
          // Backend authentication successful
          this.setAuthData(data.token, data.user);
          this.showNotification('Welcome back! Login successful.', 'success');
          return { success: true, user: data.user };
        }
      }
    } catch (error) {
      console.warn('Backend login failed, trying local authentication:', error);
    }

    // Fallback to local authentication
    return this.localLogin(email, password);
  }

  // Local authentication fallback
  localLogin(email, password) {
    // Demo account
    if (email === 'demo@quickthrift.com' && password === 'demo123') {
      const user = { email, username: 'Demo User', id: 'demo-user' };
      this.setAuthData('demo-token-' + Date.now(), user);
      this.showNotification('Demo login successful! Welcome to QuickThrift.', 'success');
      return { success: true, user };
    }

    // Check local storage for users
    const localUsers = JSON.parse(localStorage.getItem('qt_local_users') || '[]');
    const user = localUsers.find(u => u.email === email && u.password === password);

    if (user) {
      const userData = { email: user.email, username: user.username, id: user.id };
      this.setAuthData('local-token-' + Date.now(), userData);
      this.showNotification('Welcome back! Login successful.', 'success');
      return { success: true, user: userData };
    }

    this.showNotification('Invalid email or password. Try the demo account: demo@quickthrift.com', 'error');
    return { success: false, error: 'Invalid credentials' };
  }

  // Register function
  async register(userData) {
    const { firstName, lastName, email, password, confirmPassword } = userData;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      this.showNotification('Please fill in all required fields', 'error');
      return { success: false, error: 'Missing fields' };
    }

    if (!this.validateEmail(email)) {
      this.showNotification('Please enter a valid email address', 'error');
      return { success: false, error: 'Invalid email' };
    }

    if (!this.validatePassword(password)) {
      this.showNotification('Password must be at least 6 characters long', 'error');
      return { success: false, error: 'Weak password' };
    }

    if (password !== confirmPassword) {
      this.showNotification('Passwords do not match', 'error');
      return { success: false, error: 'Password mismatch' };
    }

    this.showLoading('Creating your account...');

    try {
      // Try backend first
      const response = await fetch(`${this.API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: `${firstName} ${lastName}`,
          email,
          password
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.token) {
          // Backend registration successful
          this.setAuthData(data.token, data.user);
          this.showNotification('Account created successfully! Welcome to QuickThrift.', 'success');
          return { success: true, user: data.user };
        }
      }
    } catch (error) {
      console.warn('Backend registration failed, using local storage:', error);
    }

    // Fallback to local registration
    return this.localRegister({ firstName, lastName, email, password });
  }

  // Local registration fallback
  localRegister({ firstName, lastName, email, password }) {
    const localUsers = JSON.parse(localStorage.getItem('qt_local_users') || '[]');
    
    // Check if user already exists
    if (localUsers.find(u => u.email === email)) {
      this.showNotification('An account with this email already exists', 'error');
      return { success: false, error: 'User exists' };
    }

    // Create new user
    const newUser = {
      id: 'user-' + Date.now(),
      username: `${firstName} ${lastName}`,
      email,
      password, // In production, this should be hashed
      createdAt: new Date().toISOString()
    };

    localUsers.push(newUser);
    localStorage.setItem('qt_local_users', JSON.stringify(localUsers));

    const userData = { email: newUser.email, username: newUser.username, id: newUser.id };
    this.setAuthData('local-token-' + Date.now(), userData);
    this.showNotification('Account created successfully! Welcome to QuickThrift.', 'success');
    
    return { success: true, user: userData };
  }

  // Set authentication data
  setAuthData(token, user) {
    localStorage.setItem('qt_auth_token', token);
    localStorage.setItem('qt_user_data', JSON.stringify(user));
    this.isAuthenticated = true;
    this.currentUser = user;
    this.updateUIForAuthenticatedUser();
  }

  // Update UI for authenticated user
  updateUIForAuthenticatedUser() {
    // Update account button if it exists
    const accountBtn = document.querySelector('.account-btn');
    if (accountBtn && this.currentUser) {
      accountBtn.innerHTML = `<i class="fa-solid fa-user"></i> ${this.currentUser.username}`;
    }
  }

  // Logout function
  logout() {
    localStorage.removeItem('qt_auth_token');
    localStorage.removeItem('qt_user_data');
    this.isAuthenticated = false;
    this.currentUser = null;
    this.showNotification('You have been logged out', 'info');
    
    // Redirect to sign-in page if not already there
    if (!window.location.pathname.includes('sign-in.html')) {
      setTimeout(() => {
        window.location.href = 'sign-in.html';
      }, 1000);
    }
  }

  // Check if user is authenticated
  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }
}

// Initialize authentication system when page loads
let qtAuth;
document.addEventListener('DOMContentLoaded', () => {
  qtAuth = new QuickThriftAuthSystem();
  
  // Make it globally accessible
  window.qtAuth = qtAuth;
});
