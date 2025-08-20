import proxyApiService from './proxyApi.js'

console.log('🛍️ ProductService loading with PROXY API (CORS BYPASS)...')

class ProductService {
  constructor() {
    console.log('🏪 ProductService initialized with proxyApiService - NO CORS!')
  }

  // Get all products with optional filtering - PROXY VERSION
  async getProducts(category = null, filters = {}) {
    try {
      console.log('🌟 PROXY getProducts called with:', { category, filters })
      
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key])
      })
      
      const queryString = params.toString()
      const endpoint = `/products/${queryString ? `?${queryString}` : ''}`
      
      console.log(`🛍️ PROXY Fetching products: ${endpoint}`)
      const response = await proxyApiService.get(endpoint)
      
      // Handle both array response and object with products array
      const products = Array.isArray(response) ? response : (response.products || [])
      console.log(`✅ PROXY Fetched ${products.length} products`)
      
      return { products, pagination: response.pagination }
    } catch (error) {
      console.error('❌ PROXY Failed to fetch products:', error)
      return { products: [], pagination: null }
    }
  }

  // Get single product by ID
  async getProduct(id) {
    return proxyApiService.get(`/products/${id}/`)
  }

  // Create new product (admin only) - Enhanced for working backend
  async createProduct(productData) {
    try {
      console.log('🏗️ Creating product:', productData)
      
      // Ensure proper data formatting for backend
      const formattedData = {
        name: productData.name?.trim(),
        price: parseFloat(productData.price),
        category: productData.category,
        description: productData.description?.trim() || '',
        brand: productData.brand?.trim() || '',
        condition: productData.condition || 'good',
        image: productData.image || '/api/placeholder/400/400'
      }
      
      const response = await proxyApiService.post('/products', formattedData)
      
      console.log('✅ Product created successfully:', response)
      return response
    } catch (error) {
      console.error('❌ Product creation failed:', error)
      throw error
    }
  }

  // Update existing product (admin only)
  async updateProduct(id, productData) {
    return proxyApiService.put(`/products/${id}`, productData)
  }

  // Delete product (admin only) - Fixed for CORS preflight
  async deleteProduct(id) {
    try {
      console.log(`🗑️ Deleting product with ID: ${id}`)
      
      // Ensure we're using numeric ID for backend route matching
      const numericId = parseInt(id)
      if (isNaN(numericId)) {
        throw new Error('Invalid product ID - must be numeric')
      }
      
      const response = await proxyApiService.delete(`/products/${numericId}`)
      
      console.log('✅ Product deleted successfully')
      return response
    } catch (error) {
      console.error('❌ Product deletion failed:', error)
      throw error
    }
  }

  // Search products
  async searchProducts(query, filters = {}) {
    const params = new URLSearchParams({
      q: query || '',
      ...filters
    })
    return proxyApiService.get(`/products/search?${params}`)
  }

  // Get products by category
  async getProductsByCategory(category) {
    return this.getProducts(category)
  }

  // Get featured products
  async getFeaturedProducts() {
    return proxyApiService.get('/products/featured')
  }

  // Get new arrivals (use featured products as fallback since backend doesn't have this endpoint)
  async getNewArrivals() {
    return proxyApiService.get('/products/featured')
  }

  // Get product categories
  async getCategories() {
    return proxyApiService.get('/products/categories')
  }

  // Get product reviews
  async getProductReviews(productId) {
    return proxyApiService.get(`/products/${productId}/reviews`)
  }

  // Add product review
  async addProductReview(productId, reviewData) {
    return proxyApiService.post(`/products/${productId}/reviews`, reviewData)
  }

  // Get related products
  async getRelatedProducts(productId) {
    return proxyApiService.get(`/products/${productId}/related`)
  }
}

export default new ProductService()
