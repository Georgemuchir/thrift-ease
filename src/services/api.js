const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }))
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    })
  }

  // Product endpoints
  async getProducts(category = null, filters = {}) {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key])
    })
    
    const queryString = params.toString()
    return this.request(`/products${queryString ? `?${queryString}` : ''}`)
  }

  async getProduct(id) {
    return this.request(`/products/${id}`)
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    })
  }

  // User/Profile endpoints
  async getProfile() {
    return this.request('/users/profile')
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  // Cart endpoints (if you want server-side cart management)
  async getCart() {
    return this.request('/cart')
  }

  async addToCart(productId, quantity = 1, size = 'M') {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, size }),
    })
  }

  async updateCartItem(cartItemId, quantity) {
    return this.request(`/cart/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    })
  }

  async removeFromCart(cartItemId) {
    return this.request(`/cart/${cartItemId}`, {
      method: 'DELETE',
    })
  }

  async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE',
    })
  }

  // Order endpoints
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async getOrders() {
    return this.request('/orders')
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`)
  }

  // Admin endpoints
  async getUsers() {
    return this.request('/admin/users')
  }

  async updateUser(id, userData) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    })
  }

  // Health check
  async healthCheck() {
    return this.request('/health')
  }

  // Image upload endpoint
  async uploadImage(imageFile) {
    const formData = new FormData()
    formData.append('image', imageFile)

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const headers = {}
    if (user.token) {
      headers.Authorization = `Bearer ${user.token}`
    }

    try {
      const response = await fetch(`${this.baseURL}/upload-image`, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }))
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Image upload failed:', error)
      throw error
    }
  }
}

export default new ApiService()
