import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../../services'

const All = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAllProducts()
  }, [])

  const fetchAllProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch products from all categories
      const categories = ['women', 'men', 'kids', 'shoes']
      const allProductsPromises = categories.map(category => 
        productService.getProducts(category).catch(err => {
          console.error(`Failed to fetch ${category} products:`, err)
          return { products: [] } // Return empty array on error
        })
      )
      
      const results = await Promise.allSettled(allProductsPromises)
      console.log('All products fetch results:', results)
      
      // Combine all products from different categories
      const allProducts = results.reduce((acc, result) => {
        if (result.status === 'fulfilled' && result.value?.products) {
          // Add category badge to each product
          const productsWithCategory = Array.isArray(result.value.products) 
            ? result.value.products.map(product => ({
                ...product,
                categoryBadge: product.category || 'general'
              }))
            : []
          return [...acc, ...productsWithCategory]
        }
        return acc
      }, [])
      
      console.log('Combined all products:', allProducts)
      setProducts(allProducts)
    } catch (error) {
      console.error('Error fetching all products:', error)
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryBadgeColor = (category) => {
    const colors = {
      women: '#ff6b9d',
      men: '#4ecdc4',
      kids: '#45b7d1',
      shoes: '#96ceb4',
      general: '#95a5a6'
    }
    return colors[category?.toLowerCase()] || colors.general
  }

  if (loading) {
    return (
      <div className="category-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading all products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="category-container">
        <div className="error-message">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button onClick={fetchAllProducts} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="category-container">
      <div className="category-header">
        <h1 className="category-title">All Products</h1>
        <p className="category-subtitle">
          Discover our complete collection of thrift finds
        </p>
        <div className="products-count">
          {products.length} {products.length === 1 ? 'item' : 'items'} available
        </div>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <h3>No products available</h3>
          <p>Check back soon for new arrivals!</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={`${product.category}-${product.id}`} className="product-card">
              <div className="product-image-container">
                <img
                  src={product.image || '/demo1.jpeg'}
                  alt={product.name || 'Product'}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = '/demo1.jpeg'
                  }}
                />
                <div 
                  className="category-badge"
                  style={{ backgroundColor: getCategoryBadgeColor(product.categoryBadge) }}
                >
                  {product.categoryBadge?.toUpperCase() || 'GENERAL'}
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name || 'Unnamed Product'}</h3>
                <p className="product-price">
                  ${product.price ? Number(product.price).toFixed(2) : '0.00'}
                </p>
                <p className="product-description">
                  {product.description || 'No description available'}
                </p>
                <Link 
                  to={`/product/${product.id}`} 
                  className="view-details-btn"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default All
