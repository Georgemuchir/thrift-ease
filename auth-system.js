// QuickThrift Authentication System - Professional Implementation
class QuickThriftAuth {
  constructor() {
    this.apiBaseUrl = 'http://127.0.0.1:5000'; // Local Flask backend
    this.tokenKey = 'quickthrift_auth_token';
    this.userKey = 'quickthrift_user_data';
    this.refreshTokenKey = 'quickthrift_refresh_token';
    this.tokenExpiry = 'quickthrift_token_expiry';
    
    // Initialize auth state
    this.currentUser = null;
    this.isAuthenticated = false;
    
    // Check authentication on load
    this.checkAuthStatus();
  }

  // API Communication Methods
  async makeRequest(endpoint, options = {}) {
    const token = this.getToken();
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    const requestOptions = { ...defaultOptions, ...options };
    
    try {
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`, requestOptions);
      
      // Handle token expiry
      if (response.status === 401) {
        await this.refreshToken();
        // Retry with new token
        const newToken = this.getToken();
        if (newToken) {
          requestOptions.headers['Authorization'] = `Bearer ${newToken}`;
          return await fetch(`${this.apiBaseUrl}${endpoint}`, requestOptions);
        }
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication Methods
  async login(email, password) {
    try {
      this.showLoading('Signing in...');
      
      try {
        const response = await this.makeRequest('/api/auth/signin', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });

        if (response.token) {
          const authData = {
            token: response.token,
            user: response.user,
            expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
          };
          this.setAuthData(authData);
          this.showNotification('Login successful!', 'success');
          return { success: true, user: response.user };
        } else {
          throw new Error(response.error || 'Login failed');
        }
      } catch (apiError) {
        // Fallback to local authentication when backend is not available
        console.warn('Backend not available, using local auth:', apiError.message);
        
        // Demo account for testing
        if (email === 'demo@quickthrift.com' && password === 'demo123') {
          const authData = {
            token: `local_token_${Date.now()}`,
            user: { email: email, username: 'Demo User' },
            expires: Date.now() + (24 * 60 * 60 * 1000)
          };
          this.setAuthData(authData);
          this.showNotification('Demo login successful!', 'success');
          return { success: true, user: authData.user };
        }
        
        // Check localStorage for existing users
        const storedUsers = JSON.parse(localStorage.getItem('quickthrift_users') || '[]');
        const user = storedUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          const authData = {
            token: `local_token_${Date.now()}`,
            user: { email: user.email, username: user.username },
            expires: Date.now() + (24 * 60 * 60 * 1000)
          };
          this.setAuthData(authData);
          this.showNotification('Login successful!', 'success');
          return { success: true, user: authData.user };
        }
        
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      this.showNotification(error.message || 'Login failed. Please try again.', 'error');
      return { success: false, error: error.message };
    } finally {
      this.hideLoading();
    }
  }

  async register(userData) {
    try {
      this.showLoading('Creating account...');
      
      try {
        const response = await this.makeRequest('/api/auth/signup', {
          method: 'POST',
          body: JSON.stringify({
            username: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            password: userData.password
          })
        });

        if (response.token) {
          const authData = {
            token: response.token,
            user: response.user,
            expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
          };
          this.setAuthData(authData);
          this.showNotification('Account created successfully!', 'success');
          return { success: true, user: response.user };
        } else {
          throw new Error(response.error || 'Registration failed');
        }
      } catch (apiError) {
        // Fallback to local registration when backend is not available
        console.warn('Backend not available, using local registration:', apiError.message);
        
        // Check if user already exists locally
        const storedUsers = JSON.parse(localStorage.getItem('quickthrift_users') || '[]');
        if (storedUsers.find(u => u.email === userData.email)) {
          throw new Error('User already exists');
        }
        
        // Create new user locally
        const newUser = {
          username: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          password: userData.password,
          createdAt: new Date().toISOString()
        };
        
        storedUsers.push(newUser);
        localStorage.setItem('quickthrift_users', JSON.stringify(storedUsers));
        
        const authData = {
          token: `local_token_${Date.now()}`,
          user: { email: newUser.email, username: newUser.username },
          expires: Date.now() + (24 * 60 * 60 * 1000)
        };
        
        this.setAuthData(authData);
        this.showNotification('Account created successfully!', 'success');
        return { success: true, user: authData.user };
      }
    } catch (error) {
      this.showNotification(error.message || 'Registration failed. Please try again.', 'error');
      return { success: false, error: error.message };
    } finally {
      this.hideLoading();
    }
  }

  async logout() {
    try {
      // Call logout endpoint if needed
      await this.makeRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      this.clearAuthData();
      this.showNotification('Logged out successfully', 'info');
      window.location.href = '/';
    }
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem(this.refreshTokenKey);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.makeRequest('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
      });

      if (response.success) {
        this.setAuthData(response.data);
        return true;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuthData();
      return false;
    }
  }

  // Token Management
  setAuthData(authData) {
    const { token, refreshToken, user, expiresIn } = authData;
    
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
    
    if (expiresIn) {
      const expiryTime = Date.now() + (expiresIn * 1000);
      localStorage.setItem(this.tokenExpiry, expiryTime.toString());
    }
    
    this.currentUser = user;
    this.isAuthenticated = true;
    
    // Dispatch auth state change event
    this.dispatchAuthEvent('login', user);
  }

  getToken() {
    const token = localStorage.getItem(this.tokenKey);
    const expiry = localStorage.getItem(this.tokenExpiry);
    
    if (!token) return null;
    
    // Check if token is expired
    if (expiry && Date.now() > parseInt(expiry)) {
      this.clearAuthData();
      return null;
    }
    
    return token;
  }

  clearAuthData() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.tokenExpiry);
    
    this.currentUser = null;
    this.isAuthenticated = false;
    
    // Dispatch auth state change event
    this.dispatchAuthEvent('logout');
  }

  checkAuthStatus() {
    const token = this.getToken();
    const userData = localStorage.getItem(this.userKey);
    
    if (token && userData) {
      try {
        this.currentUser = JSON.parse(userData);
        this.isAuthenticated = true;
        this.dispatchAuthEvent('auth-check', this.currentUser);
      } catch (error) {
        console.error('Invalid user data in localStorage:', error);
        this.clearAuthData();
      }
    }
  }

  // Event System
  dispatchAuthEvent(type, user = null) {
    const event = new CustomEvent('auth-state-change', {
      detail: { type, user, isAuthenticated: this.isAuthenticated }
    });
    document.dispatchEvent(event);
  }

  // UI Helper Methods
  showLoading(message = 'Loading...') {
    const loadingEl = document.getElementById('auth-loading');
    if (loadingEl) {
      loadingEl.textContent = message;
      loadingEl.style.display = 'block';
    }
  }

  hideLoading() {
    const loadingEl = document.getElementById('auth-loading');
    if (loadingEl) {
      loadingEl.style.display = 'none';
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fa-solid fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
      <button class="notification-close"><i class="fa-solid fa-times"></i></button>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });
  }

  // Form Validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  // Social Authentication (Optional)
  async loginWithGoogle() {
    try {
      // Implement Google OAuth
      this.showNotification('Google login not implemented yet', 'info');
    } catch (error) {
      this.showNotification('Google login failed', 'error');
    }
  }

  async loginWithFacebook() {
    try {
      // Implement Facebook login
      this.showNotification('Facebook login not implemented yet', 'info');
    } catch (error) {
      this.showNotification('Facebook login failed', 'error');
    }
  }

  // Password Reset
  async resetPassword(email) {
    try {
      this.showLoading('Sending reset email...');
      
      const response = await this.makeRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      if (response.success) {
        this.showNotification('Password reset email sent!', 'success');
        return { success: true };
      } else {
        throw new Error(response.message || 'Reset failed');
      }
    } catch (error) {
      this.showNotification(error.message || 'Reset failed. Please try again.', 'error');
      return { success: false, error: error.message };
    } finally {
      this.hideLoading();
    }
  }

  // User Profile Management
  async updateProfile(userData) {
    try {
      this.showLoading('Updating profile...');
      
      const response = await this.makeRequest('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(userData)
      });

      if (response.success) {
        this.currentUser = { ...this.currentUser, ...response.data };
        localStorage.setItem(this.userKey, JSON.stringify(this.currentUser));
        this.showNotification('Profile updated successfully!', 'success');
        return { success: true, user: this.currentUser };
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      this.showNotification(error.message || 'Update failed. Please try again.', 'error');
      return { success: false, error: error.message };
    } finally {
      this.hideLoading();
    }
  }

  // Two-Factor Authentication
  async enableTwoFactor() {
    try {
      const response = await this.makeRequest('/user/2fa/enable', {
        method: 'POST'
      });

      if (response.success) {
        this.showNotification('Two-factor authentication enabled!', 'success');
        return { success: true, qrCode: response.data.qrCode };
      } else {
        throw new Error(response.message || '2FA setup failed');
      }
    } catch (error) {
      this.showNotification(error.message || '2FA setup failed', 'error');
      return { success: false, error: error.message };
    }
  }

  async verifyTwoFactor(code) {
    try {
      const response = await this.makeRequest('/user/2fa/verify', {
        method: 'POST',
        body: JSON.stringify({ code })
      });

      if (response.success) {
        this.showNotification('Two-factor authentication verified!', 'success');
        return { success: true };
      } else {
        throw new Error(response.message || 'Verification failed');
      }
    } catch (error) {
      this.showNotification(error.message || 'Verification failed', 'error');
      return { success: false, error: error.message };
    }
  }
}

// Initialize global auth instance
window.QuickThriftAuth = new QuickThriftAuth();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuickThriftAuth;
}
