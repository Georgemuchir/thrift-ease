import { useState, useEffect } from 'react'
import { useCart } from '../../contexts/CartContext'
import { productService } from '../../services'

const NewKids = () => {
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
      const data = await productService.getProducts('kids')
      setProducts(data)
      setError('')
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setError('Failed to load products')
      // Fallback to mock data for development
      setProducts([
        {
          id: 7,
          name: "Rainbow T-Shirt",
          price: 12.99,
          image: "/api/placeholder/250/300",
          description: "Colorful t-shirt perfect for active kids",
          category: "kids"
        },
        {
          id: 8,
          name: "Denim Overalls",
          price: 18.99,
          image: "/api/placeholder/250/300",
          description: "Cute and comfortable denim overalls",
          category: "kids"
        },
        {
          id: 9,
          name: "Summer Dress",
          price: 16.99,
          image: "/api/placeholder/250/300",
          description: "Light and breezy summer dress",
          category: "kids"
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
        <h1>Kids' Fashion</h1>
        <p>Fun and comfortable clothing for children</p>
        
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

export default NewKids
