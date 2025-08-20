import { getAuthHeaders } from '../utils/tokenUtils.js'

// FORCE PRODUCTION API URL - TEMPORARY FIX
const PRODUCTION_API_URL = 'https://thrift-ease.onrender.com/api'  
const DEVELOPMENT_API_URL = 'http://localhost:5000/api'

// FORCE the production URL for now
export const API_BASE_URL = 'https://thrift-ease.onrender.com/api'

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
    
    // Smart credentials handling - use 'omit' for requests that explicitly set it
    const useCredentials = options.credentials !== 'omit' ? 'include' : 'omit'
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
      credentials: useCredentials, // ✅ Respect explicit credential settings
      ...options,
    }

    console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`)
    console.log('📦 Request config:', { ...config, headers: 'filtered' }) // Don't log sensitive headers

    try {
      const response = await fetch(url, config)
      console.log(`📡 API Response: ${response.status} ${response.statusText}`)
      
      // Enhanced error handling for backend fixes
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch (jsonError) {
          // If response isn't JSON, use status text
          console.warn('Non-JSON error response:', response.statusText)
        }
        
        // Specific error handling for fixed endpoints
        if (response.status === 405) {
          console.error('❌ Method not allowed - check if CORS allows this method')
        } else if (response.status === 404 && endpoint.includes('/upload-image')) {
          console.error('❌ Upload endpoint not found - this should be fixed now')
        } else if (response.status === 0 || response.status === 404) {
          console.error('❌ CORS preflight may have failed - check backend CORS config')
        }
        
        throw new Error(errorMessage)
      }
      
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
