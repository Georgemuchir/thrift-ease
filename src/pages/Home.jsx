import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useCart } from '../contexts/CartContext'
import { productService } from '../services'

const Home = () => {
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
      console.log("🌐 Fetching all products...")
      const data = await productService.getProducts()
      console.log("🧪 Raw response:", data)
      console.log("📊 Response type:", typeof data)
      console.log("📈 Is array:", Array.isArray(data))
      console.log("🔢 Data length:", Array.isArray(data) ? data.length : 'N/A')
      setProducts(data.products || data || []) // ✅ Step 2: Handle both formats
      setError('')
    } catch (error) {
      console.error('💥 Failed to fetch products:', error)
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
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Thrift is Old School</h1>
            <p>Discover premium quality thrift fashion at unbeatable prices. Style that doesn't cost the earth.</p>
            <Link to="/all" className="btn btn-primary btn-large">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section className="featured-categories">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="category-grid">
            <Link to="/all" className="category-card">
              <div className="category-image">
                <img src="/api/placeholder/300/400" alt="All Products" />
              </div>
              <h3>All Products</h3>
              <p>Browse our complete collection</p>
            </Link>
            
            <Link to="/new-women" className="category-card">
              <div className="category-image">
                <img src="/api/placeholder/300/400" alt="Women's Fashion" />
              </div>
              <h3>Women</h3>
              <p>Trendy and stylish pieces</p>
            </Link>
            
            <Link to="/new-men" className="category-card">
              <div className="category-image">
                <img src="/api/placeholder/300/400" alt="Men's Fashion" />
              </div>
              <h3>Men</h3>
              <p>Classic and contemporary styles</p>
            </Link>
            
            <Link to="/new-kids" className="category-card">
              <div className="category-image">
                <img src="/api/placeholder/300/400" alt="Kids Fashion" />
              </div>
              <h3>Kids</h3>
              <p>Comfortable and fun clothing</p>
            </Link>
            
            <Link to="/new-shoes" className="category-card">
              <div className="category-image">
                <img src="/api/placeholder/300/400" alt="Shoes" />
              </div>
              <h3>Shoes</h3>
              <p>Footwear for every occasion</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2>All Products</h2>
          <p>Browse our complete collection of thrift fashion</p>
          
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : error && products.length === 0 ? (
            <div className="error">Error: {error}</div>
          ) : products.length === 0 ? (
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
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose Thrift Ease?</h2>
          <div className="features-grid">
            <div className="feature">
              <h3>Quality Guaranteed</h3>
              <p>Every item is carefully inspected for quality and authenticity</p>
            </div>
            <div className="feature">
              <h3>Affordable Prices</h3>
              <p>Great fashion doesn't have to break the bank</p>
            </div>
            <div className="feature">
              <h3>Sustainable Fashion</h3>
              <p>Help reduce waste by giving pre-loved items a new home</p>
            </div>
            <div className="feature">
              <h3>Easy Returns</h3>
              <p>Not satisfied? Return within 30 days for a full refund</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
