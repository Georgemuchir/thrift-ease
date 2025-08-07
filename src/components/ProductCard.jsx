import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../utils/formatters'
import uploadService from '../services/uploadService'

const ProductCard = ({ product, showActions = true }) => {
  const { addToCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLoading) return
    
    setIsLoading(true)
    try {
      await addToCart(product.id, 1)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const getImageUrl = () => {
    if (imageError || !product.image) {
      return '/placeholder-image.jpg' // Add a placeholder image to your public folder
    }
    
    if (product.image.startsWith('http')) {
      return product.image
    }
    
    return uploadService.getImageUrl(product.image)
  }

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img
            src={getImageUrl()}
            alt={product.name}
            className="product-image"
            onError={handleImageError}
            loading="lazy"
          />
          {product.isNew && (
            <span className="product-badge new">New</span>
          )}
          {product.onSale && (
            <span className="product-badge sale">Sale</span>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>
          
          <div className="product-pricing">
            <span className="product-price">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="product-original-price">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          {product.rating && (
            <div className="product-rating">
              <span className="stars">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </span>
              <span className="rating-count">({product.reviewCount || 0})</span>
            </div>
          )}
        </div>
      </Link>
      
      {showActions && (
        <div className="product-actions">
          <button
            onClick={handleAddToCart}
            disabled={isLoading || !product.inStock}
            className={`add-to-cart-btn ${isLoading ? 'loading' : ''} ${!product.inStock ? 'disabled' : ''}`}
          >
            {isLoading ? 'Adding...' : !product.inStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductCard
