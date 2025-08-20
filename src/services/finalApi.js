// FINAL NUCLEAR FIX - Completely new service with different name
// This bypasses ALL possible caching by using a new filename and class name

console.log('🚨 FINAL NUCLEAR FIX LOADING...')

const RENDER_API_URL = 'https://thrift-ease.onrender.com/api'

console.log('🎯 FINAL API URL:', RENDER_API_URL)
console.log('🌐 Window location:', window.location.href)
console.log('📅 Timestamp:', new Date().toISOString())

// Import token utilities
import { getAuthHeaders } from '../utils/tokenUtils.js'

class FinalApiService {
  constructor() {
    this.baseURL = RENDER_API_URL
    console.log('🔥 FinalApiService initialized with URL:', this.baseURL)
  }

  async makeApiCall(endpoint, options = {}) {
    const fullUrl = `${this.baseURL}${endpoint}`
    
    console.log('🚀 FINAL API CALL:', options.method || 'GET', fullUrl)
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

    console.log('📋 Final request config:', {
      url: fullUrl,
      method: requestConfig.method,
      headers: 'filtered-for-security',
      credentials: requestConfig.credentials
    })

    try {
      const response = await fetch(fullUrl, requestConfig)
      console.log('📡 FINAL API Response:', response.status, response.statusText)
      console.log('🔗 Response URL:', response.url)
      
      if (!response.ok) {
        console.error('❌ FINAL API Error:', response.status, response.statusText)
        throw new Error(`API Error ${response.status}: ${response.statusText}`)
      }
      
      const responseData = await response.json()
      console.log('✅ FINAL API Success:', responseData)
      return responseData
      
    } catch (error) {
      console.error('💥 FINAL API Exception:', error)
      console.error('🔧 URL that failed:', fullUrl)
      throw new Error(`Network error: ${error.message}`)
    }
  }

  // HTTP Methods
  async get(endpoint, options = {}) {
    return this.makeApiCall(endpoint, { ...options, method: 'GET' })
  }

  async post(endpoint, data, options = {}) {
    return this.makeApiCall(endpoint, { 
      ...options, 
      method: 'POST', 
      body: data 
    })
  }

  async put(endpoint, data, options = {}) {
    return this.makeApiCall(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: data 
    })
  }

  async delete(endpoint, options = {}) {
    return this.makeApiCall(endpoint, { ...options, method: 'DELETE' })
  }
}

// Create singleton instance
const finalApiService = new FinalApiService()

console.log('🎉 FINAL API SERVICE READY!')

export default finalApiService
export { RENDER_API_URL }
