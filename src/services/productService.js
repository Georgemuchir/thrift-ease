import BaseApiService from './baseApi.js'

class ProductService extends BaseApiService {
  // Get all products with optional filtering
  async getProducts(category = null, filters = {}) {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key])
    })
    
    const queryString = params.toString()
    return this.request(`/products${queryString ? `?${queryString}` : ''}`)
  }

  // Get single product by ID
  async getProduct(id) {
    return this.request(`/products/${id}`)
  }

  // Create new product (admin only)
  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  // Update existing product (admin only)
  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  }

  // Delete product (admin only)
  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    })
  }

  // Search products
  async searchProducts(query, filters = {}) {
    const params = new URLSearchParams({
      q: query || '',
      ...filters
    })
    return this.request(`/products/search?${params}`)
  }

  // Get products by category
  async getProductsByCategory(category) {
    return this.getProducts(category)
  }

  // Get featured products
  async getFeaturedProducts() {
    return this.request('/products/featured')
  }

  // Get new arrivals
  async getNewArrivals() {
    return this.request('/products/new-arrivals')
  }

  // Get product categories
  async getCategories() {
    return this.request('/products/categories')
  }

  // Get product reviews
  async getProductReviews(productId) {
    return this.request(`/products/${productId}/reviews`)
  }

  // Add product review
  async addProductReview(productId, reviewData) {
    return this.request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    })
  }

  // Get related products
  async getRelatedProducts(productId) {
    return this.request(`/products/${productId}/related`)
  }
}

export default new ProductService()
