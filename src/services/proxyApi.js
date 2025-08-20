// PROXY API SERVICE - Uses Netlify proxy to bypass CORS completely
// This calls /api/* which gets proxied to https://thrift-ease.onrender.com/api/*

console.log('🔀 PROXY API SERVICE LOADING - CORS BYPASS ACTIVE')
console.log('🌐 Using Netlify proxy: /api/* → https://thrift-ease.onrender.com/api/*')

// Import token utilities
import { getAuthHeaders } from '../utils/tokenUtils.js'

class ProxyApiService {
  constructor() {
    // Use relative URLs - Netlify will proxy to backend
    this.baseURL = '/api'
    console.log('🔀 ProxyApiService initialized - NO CORS NEEDED!')
    console.log('🎯 Proxy Base URL:', this.baseURL)
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    console.log('🔀 PROXY API CALL:', options.method || 'GET', url)
    console.log('🕐 Request time:', new Date().toISOString())
    console.log('📡 Will be proxied to: https://thrift-ease.onrender.com/api' + endpoint)
    
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers
      },
      // NO credentials needed for proxy
      ...options
    }

    // Handle body data
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    console.log('📋 Proxy request config:', {
      url: url,
      method: config.method,
      headers: 'filtered-for-security'
    })

    try {
      const response = await fetch(url, config)
      console.log('📡 PROXY Response:', response.status, response.statusText)
      console.log('🔗 Response URL:', response.url)
      
      if (!response.ok) {
        console.error('❌ PROXY API Error:', response.status, response.statusText)
        throw new Error(`API Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('✅ PROXY API Success:', data)
      return data
      
    } catch (error) {
      console.error('💥 PROXY API Exception:', error)
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

// Create singleton instance
const proxyApiService = new ProxyApiService()

console.log('🎉 PROXY API SERVICE READY - CORS COMPLETELY BYPASSED!')

export default proxyApiService
export { proxyApiService }
