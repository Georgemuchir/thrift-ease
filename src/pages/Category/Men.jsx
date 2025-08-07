import { useState, useEffect } from 'react'
import { useCart } from '../../contexts/CartContext'
import { productService } from '../../services'

const NewMen = () => {
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
      const data = await productService.getProducts('men')
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
    alert(`${product.name} added to cart!`)
  }

  if (loading) return <div className="loading">Loading products...</div>
  if (error && products.length === 0) return <div className="error">Error: {error}</div>

  return (
    <div className="products-page">
      <div className="container">
        <h1>Men's Fashion</h1>
        <p>Explore our selection of quality men's thrift clothing</p>
        
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
                <button 
                  className="btn btn-primary"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NewMen
