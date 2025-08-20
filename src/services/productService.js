import envApiService from './envApi.js'

console.log('🛍️ ProductService loading with ENV API (Netlify variables)...')

class ProductService {
  constructor() {
    console.log('🏪 ProductService initialized with envApiService - Reading Netlify env vars!')
  }

  // Get all products with optional filtering - ENV VERSION
  async getProducts(category = null, filters = {}) {
    try {
      console.log('🌟 ENV getProducts called with:', { category, filters })
      
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key])
      })
      
      const queryString = params.toString()
      const endpoint = `/products/${queryString ? `?${queryString}` : ''}`
      
      console.log(`🛍️ ENV Fetching products: ${endpoint}`)
      const response = await envApiService.get(endpoint)
      
      // Handle both array response and object with products array
      const products = Array.isArray(response) ? response : (response.products || [])
      console.log(`✅ ENV Fetched ${products.length} products`)
      
      return { products, pagination: response.pagination }
    } catch (error) {
      console.error('❌ ENV Failed to fetch products:', error)
      return { products: [], pagination: null }
    }
  }

  // Get single product by ID
  async getProduct(id) {
    return envApiService.get(`/products/${id}/`)
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
      
      const response = await envApiService.post('/products', formattedData)
      
      console.log('✅ Product created successfully:', response)
      return response
    } catch (error) {
      console.error('❌ Product creation failed:', error)
      throw error
    }
  }

  // Update existing product (admin only)
  async updateProduct(id, productData) {
    return envApiService.put(`/products/${id}`, productData)
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
      
      const response = await envApiService.delete(`/products/${numericId}`)
      
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
    return envApiService.get(`/products/search?${params}`)
  }

  // Get products by category
  async getProductsByCategory(category) {
    return this.getProducts(category)
  }

  // Get featured products
  async getFeaturedProducts() {
    return envApiService.get('/products/featured')
  }

  // Get new arrivals (use featured products as fallback since backend doesn't have this endpoint)
  async getNewArrivals() {
    return envApiService.get('/products/featured')
  }

  // Get product categories
  async getCategories() {
    return envApiService.get('/products/categories')
  }

  // Get product reviews
  async getProductReviews(productId) {
    return envApiService.get(`/products/${productId}/reviews`)
  }

  // Add product review
  async addProductReview(productId, reviewData) {
    return envApiService.post(`/products/${productId}/reviews`, reviewData)
  }

  // Get related products
  async getRelatedProducts(productId) {
    return envApiService.get(`/products/${productId}/related`)
  }
}

export default new ProductService()
