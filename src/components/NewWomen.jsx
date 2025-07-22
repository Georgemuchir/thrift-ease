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
      // Fallback to mock data for development
      setProducts([
        {
          id: 1,
          name: "Vintage Floral Dress",
          price: 29.99,
          image: "/api/placeholder/250/300",
          description: "Beautiful vintage floral dress in excellent condition",
          category: "women"
        },
        {
          id: 2,
          name: "Classic Denim Jacket",
          price: 24.99,
          image: "/api/placeholder/250/300",
          description: "Timeless denim jacket perfect for any outfit",
          category: "women"
        },
        {
          id: 3,
          name: "Silk Blouse",
          price: 19.99,
          image: "/api/placeholder/250/300",
          description: "Elegant silk blouse for professional wear",
          category: "women"
        }
      ])
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
      </div>
    </div>
  )
}

export default NewWomen
