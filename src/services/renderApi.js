// RENDER API SERVICE - Environment-first approach with smart fallbacks
console.log('🔥 RENDER DEPLOYMENT SOLUTION!')

// Environment-first approach with Render-optimized fallbacks
const getApiUrl = () => {
  // Check all possible environment variables
  const envUrl = import.meta.env.VITE_API_URL || 
                 import.meta.env.VITE_API_BASE_URL || 
                 import.meta.env.REACT_APP_API_URL

  console.log('🔍 Environment variables:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    REACT_APP_API_URL: import.meta.env.REACT_APP_API_URL,
    MODE: import.meta.env.MODE,
    PROD: import.meta.env.PROD
  })

  if (envUrl) {
    console.log('🎯 Using environment API URL:', envUrl)
    return envUrl
  }

  // Render-specific fallback - if both are on Render, use main backend URL
  if (window.location.hostname.includes('onrender.com')) {
    const renderUrl = 'https://thrift-ease.onrender.com/api'
    console.log('🎯 Using Render backend URL:', renderUrl)
    return renderUrl
  }

  // Local development fallback
  const localUrl = 'http://localhost:5000/api'
  console.log('🎯 Using local development URL:', localUrl)
  return localUrl
}

export const API_BASE_URL = getApiUrl()

console.log('🚀 Final API Base URL:', API_BASE_URL)

// Import token utilities
import { getAuthHeaders } from '../utils/tokenUtils.js'

class RenderApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    console.log('🔥 RenderApiService initialized with URL:', this.baseURL)
  }

  async makeRequest(endpoint, options = {}) {
    const fullUrl = `${this.baseURL}${endpoint}`
    
    console.log('🌐 RENDER API CALL:', options.method || 'GET', fullUrl)
    console.log('🕐 Request time:', new Date().toISOString())
    
    const requestConfig = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers
      },
      credentials: 'include',
      ...options
    }

    // Handle body data
    if (requestConfig.body && typeof requestConfig.body === 'object') {
      requestConfig.body = JSON.stringify(requestConfig.body)
    }

    console.log('📋 Render request config:', {
      url: fullUrl,
      method: requestConfig.method,
      headers: 'filtered-for-security',
      credentials: requestConfig.credentials
    })

    try {
      const response = await fetch(fullUrl, requestConfig)
      console.log('📡 RENDER Response:', response.status, response.statusText)
      console.log('🔗 Response URL:', response.url)
      
      if (!response.ok) {
        console.error('❌ RENDER API Error:', response.status, response.statusText)
        throw new Error(`API Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('✅ RENDER API Success:', Object.keys(data))
      return data
      
    } catch (error) {
      console.error('💥 RENDER API Exception:', error)
      console.error('🔧 URL that failed:', fullUrl)
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

  async patch(endpoint, data, options = {}) {
    return this.makeRequest(endpoint, { 
      ...options, 
      method: 'PATCH', 
      body: data 
    })
  }

  async delete(endpoint, options = {}) {
    return this.makeRequest(endpoint, { ...options, method: 'DELETE' })
  }
}

// Create singleton instance
const renderApiService = new RenderApiService()

console.log('🎉 RENDER API SERVICE READY!')

export default renderApiService
export { renderApiService }
