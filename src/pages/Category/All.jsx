import { useState, useEffect } from 'react'
import { useCart } from '../../contexts/CartContext'
import { productService } from '../../services'
import { logApiResponse, logError } from '../../utils/logger'

const All = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getProducts()
      logApiResponse('/products', data, 'All Products Page')
      setProducts(data.products || data || [])
      setError('')
    } catch (error) {
      logError('All Products fetchProducts', error, { component: 'All.jsx' })
      setError('Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    alert(`${product.name} added to cart!`)
  }

  if (loading) return <div className="loading">Loading products...</div>
  if (error && products.length === 0) return <div className="error">Error: {error}</div>

  return (
    <div className="products-page">
      <div className="container">
        <h1>All Products</h1>
        <p>Browse our complete collection of thrift fashion for everyone</p>
        
        {products.length === 0 && !loading ? (
          <div className="empty-state">
            <h3>🛍️ No products available yet</h3>
            <p>Our store is currently empty. Check back soon for new arrivals!</p>
            <p><em>Admin users can add products through the admin panel.</em></p>
          </div>
        ) : (
          <div className="products-grid">
            {Array.isArray(products) && products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img 
                    src={product.image || "/api/placeholder/300/400"} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = "/api/placeholder/300/400"
                    }}
                  />
                  <div className="product-category-badge">
                    {product.category}
                  </div>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-brand">{product.brand}</p>
                  <p className="product-condition">Condition: {product.condition}</p>
                  <p className="product-price">${product.price}</p>
                  <p className="product-description">{product.description}</p>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-primary"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && products.length > 0 && (
          <div className="error-notice">
            <p>⚠️ Some products may not be displaying correctly</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default All
