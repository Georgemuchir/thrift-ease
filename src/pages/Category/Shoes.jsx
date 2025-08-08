import { useState, useEffect } from 'react'
import { useCart } from '../../contexts/CartContext'
import { productService } from '../../services'

const NewShoes = () => {
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
      const data = await productService.getProducts('shoes')
      console.log("🧪 Raw response:", data) // ✅ Step 1: Log raw response
      setProducts(data.products || data || []) // ✅ Step 2: Handle both formats
      setError('')
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setError('Failed to load products')
      // Fallback to mock data for development
      setProducts([
        {
          id: 10,
          name: "Classic Sneakers",
          price: 34.99,
          image: "/api/placeholder/250/300",
          description: "Comfortable sneakers for everyday wear",
          category: "shoes"
        },
        {
          id: 11,
          name: "Leather Boots",
          price: 42.99,
          image: "/api/placeholder/250/300",
          description: "Durable leather boots in excellent condition",
          category: "shoes"
        },
        {
          id: 12,
          name: "Summer Sandals",
          price: 19.99,
          image: "/api/placeholder/250/300",
          description: "Lightweight sandals perfect for summer",
          category: "shoes"
        }
      ])
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
        <h1>Shoes</h1>
        <p>Step into style with our footwear collection</p>
        
        <div className="products-grid">
          {Array.isArray(products) && products.map(product => (
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

export default NewShoes
