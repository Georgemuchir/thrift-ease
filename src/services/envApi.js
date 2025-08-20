// Environment-based API service - Uses Netlify environment variables
console.log('🌍 ENV API SERVICE LOADING...')

// Read from Netlify environment variables
const API_URL = import.meta.env.VITE_API_URL || 
                import.meta.env.VITE_API_BASE_URL || 
                import.meta.env.REACT_APP_API_URL ||
                'https://thrift-ease.onrender.com/api'  // fallback

console.log('🔍 Environment variables check:')
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
console.log('REACT_APP_API_URL:', import.meta.env.REACT_APP_API_URL)
console.log('🎯 Final API URL:', API_URL)

// Import token utilities
import { getAuthHeaders } from '../utils/tokenUtils.js'

class EnvApiService {
  constructor() {
    this.baseURL = API_URL
    console.log('🌍 EnvApiService initialized with URL:', this.baseURL)
    console.log('📅 Timestamp:', new Date().toISOString())
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    console.log('🌍 ENV API CALL:', options.method || 'GET', url)
    
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers
      },
      credentials: 'include',
      ...options
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    console.log('📋 ENV request config:', {
      url: url,
      method: config.method,
      headers: 'filtered-for-security',
      credentials: config.credentials
    })

    try {
      const response = await fetch(url, config)
      console.log('📡 ENV Response:', response.status, response.statusText)
      
      if (!response.ok) {
        console.error('❌ ENV API Error:', response.status, response.statusText)
        throw new Error(`API Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('✅ ENV API Success:', data)
      return data
      
    } catch (error) {
      console.error('💥 ENV API Exception:', error)
      console.error('🔧 URL that failed:', url)
      throw new Error(`Network error: ${error.message}`)
    }
  }

  // HTTP Methods
  async get(endpoint, options = {}) {
    return this.makeRequest(endpoint, { ...options, method: 'GET' })
  }

  async post(endpoint, data, options = {}) {
    return this.makeRequest(endpoint, { 
      ...options, 
      method: 'POST', 
      body: data 
    })
  }

  async put(endpoint, data, options = {}) {
    return this.makeRequest(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: data 
    })
  }

  async delete(endpoint, options = {}) {
    return this.makeRequest(endpoint, { ...options, method: 'DELETE' })
  }
}

const envApiService = new EnvApiService()

console.log('✅ ENV API SERVICE READY!')
console.log('🎯 Using URL:', API_URL)

export default envApiService
export { API_URL }
