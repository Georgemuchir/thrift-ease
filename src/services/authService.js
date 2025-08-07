import BaseApiService from './baseApi.js'
import { setStoredUser, removeStoredUser } from '../utils/tokenUtils.js'

class AuthService extends BaseApiService {
  // Login user
  async login(email, password) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      
      // Store user data on successful login
      if (response.user && response.token) {
        const userData = { ...response.user, token: response.token }
        setStoredUser(userData)
      }
      
      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  // Register new user
  async register(userData) {
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      })
      
      // Store user data on successful registration
      if (response.user && response.token) {
        const userDataWithToken = { ...response.user, token: response.token }
        setStoredUser(userDataWithToken)
      }
      
      return response
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  // Logout user
  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout request failed:', error)
      // Continue with local logout even if server request fails
    } finally {
      // Always remove local user data
      removeStoredUser()
    }
  }

  // Get current user profile
  async getProfile() {
    return this.request('/users/profile')
  }

  // Update user profile
  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  // Verify token validity
  async verifyToken() {
    try {
      return await this.request('/auth/verify')
    } catch (error) {
      console.error('Token verification failed:', error)
      removeStoredUser()
      throw error
    }
  }

  // Request password reset
  async requestPasswordReset(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  // Reset password with token
  async resetPassword(token, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password: newPassword }),
    })
  }
}

export default new AuthService()
