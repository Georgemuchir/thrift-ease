import { useState, useEffect } from 'react'
import { useCart } from '../contexts/CartContext'
import apiService from '../services/api'

const NewWomen = () => {
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
      const data = await apiService.getProducts('women')
      setProducts(data)
      setError('')
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setError('Failed to load products')
      setProducts([]) // No fallback data - show empty state
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    // You could add a toast notification here
    alert(`${product.name} added to cart!`)
  }

  if (loading) return <div className="loading">Loading products...</div>
  if (error && products.length === 0) return <div className="error">Error: {error}</div>

  return (
    <div className="products-page">
      <div className="container">
        <h1>Women's Fashion</h1>
        <p>Discover our curated collection of women's thrift fashion</p>
        
        {products.length === 0 && !loading ? (
          <div className="empty-state">
            <h3>🛍️ No products available yet</h3>
            <p>Our women's collection is currently empty. Check back soon for new arrivals!</p>
            <p><em>Admin users can add products through the admin panel.</em></p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">${product.price}</div>
                <div className="product-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <a 
                    href={`/product/${product.id}`}
                    className="btn btn-secondary"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NewWomen
