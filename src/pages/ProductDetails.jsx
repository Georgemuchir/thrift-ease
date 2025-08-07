import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { productService } from '../services'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const data = await productService.getProduct(id)
      setProduct(data)
      setError('')
    } catch (error) {
      console.error('Failed to fetch product:', error)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedSize, quantity)
      alert(`${product.name} added to cart!`)
    }
  }

  if (loading) return <div className="loading">Loading product...</div>
  if (error) return <div className="error">Error: {error}</div>
  if (!product) return <div className="error">Product not found</div>

  return (
    <div className="product-details">
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn btn-secondary back-btn">
          ← Back
        </button>
        
        <div className="product-details-content">
          <div className="product-image-large">
            <img src={product.image} alt={product.name} />
          </div>
          
          <div className="product-info-detailed">
            <h1>{product.name}</h1>
            <p className="product-price-large">${product.price}</p>
            <p className="product-description-detailed">{product.description}</p>
            
            {product.details && (
              <div className="product-details-section">
                <h3>Product Details</h3>
                <p>{product.details}</p>
              </div>
            )}
            
            <div className="product-options">
              <div className="size-selector">
                <label htmlFor="size">Size:</label>
                <select
                  id="size"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>
              
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="product-actions">
              <button 
                className="btn btn-primary btn-large"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
            
            {product.condition && (
              <div className="product-condition">
                <strong>Condition:</strong> {product.condition}
              </div>
            )}
            
            {product.brand && (
              <div className="product-brand">
                <strong>Brand:</strong> {product.brand}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
