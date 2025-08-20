// NUCLEAR FIX - New API service with forced URL
import { getAuthHeaders } from '../utils/tokenUtils.js'

// HARDCODED - NO ENVIRONMENT VARIABLES
const API_BASE_URL = 'https://thrift-ease.onrender.com/api'

console.log('🔥 NUCLEAR FIX - API Base URL:', API_BASE_URL)

class NewApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    }
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    console.log('🌐 API Request:', options.method || 'GET', url)
    
    const config = {
      method: options.method || 'GET',
      headers: {
        ...this.defaultHeaders,
        ...getAuthHeaders(),
        ...options.headers
      },
      credentials: 'include',
      ...options
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      console.log('📡 API Response:', response.status, response.statusText)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('📋 Response data:', data)
      return data
    } catch (error) {
      console.error('💥 API Error for', url, ':', error)
      throw new Error('🌐 Network error. Please check your internet connection and try again.')
    }
  }

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

export default new NewApiService()
export { API_BASE_URL }
