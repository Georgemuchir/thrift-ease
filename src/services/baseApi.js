import { getAuthHeaders } from '../utils/tokenUtils.js'

// Environment configuration
// Set VITE_API_URL in your environment or .env file to point to your backend
const PRODUCTION_API_URL = 'https://your-backend-url.com/api'  // Update this to your actual backend URL
const DEVELOPMENT_API_URL = 'http://localhost:5000/api'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' || window.location.hostname !== 'localhost' 
    ? PRODUCTION_API_URL 
    : DEVELOPMENT_API_URL)

console.log('Environment:', import.meta.env.MODE)
console.log('Hostname:', window.location.hostname)
console.log('API Base URL:', API_BASE_URL)

// Base API service class
class BaseApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
      credentials: 'include', // Important for CORS
      ...options,
    }

    console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`)
    console.log('📦 Request config:', config)

    try {
      const response = await fetch(url, config)
      console.log(`📡 API Response: ${response.status} ${response.statusText}`)
      
      // Handle different response types
      const contentType = response.headers.get('content-type')
      let data
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
        console.log('⚠️ Non-JSON response:', data)
      }

      console.log('📋 Response data:', data)

      if (!response.ok) {
        // Extract error message from response
        const errorMessage = data?.error || data?.message || data || `HTTP ${response.status}: ${response.statusText}`
        console.error(`❌ API Error: ${errorMessage}`)
        throw new Error(errorMessage)
      }

      return data
    } catch (error) {
      console.error(`💥 API Error for ${url}:`, error)
      
      // Network or parsing errors
      if (error instanceof TypeError || error.message.includes('fetch')) {
        throw new Error('🌐 Network error. Please check your internet connection and try again.')
      }
      
      throw error
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health')
  }
}

export default BaseApiService
