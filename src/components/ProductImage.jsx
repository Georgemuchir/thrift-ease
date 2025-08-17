import { useState } from 'react'

/**
 * Enhanced ProductImage component for working backend integration
 * Handles proper image URLs, fallbacks, and loading states
 */
const ProductImage = ({ 
  product, 
  className = "product-image", 
  alt = "Product image",
  showPlaceholder = true 
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Generate proper image URL based on backend response
  const getImageUrl = () => {
    if (!product?.image) {
      return showPlaceholder ? '/api/placeholder/400/400' : null
    }

    // If it's already a full URL, use it
    if (product.image.startsWith('http')) {
      return product.image
    }

    // If it's a backend uploads path, construct full URL
    if (product.image.startsWith('/uploads/') || product.image.startsWith('uploads/')) {
      const filename = product.image.replace(/^\/?(uploads\/)?/, '')
      return `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/uploads/${filename}`
    }

    // Default fallback
    return product.image
  }

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  const handleImageError = (e) => {
    console.warn('Image failed to load:', product?.image)
    setImageLoading(false)
    setImageError(true)
    
    // Set fallback image
    if (showPlaceholder && e.target.src !== '/api/placeholder/400/400') {
      e.target.src = '/api/placeholder/400/400'
    }
  }

  const imageUrl = getImageUrl()
  
  if (!imageUrl) {
    return showPlaceholder ? (
      <div className={`${className} placeholder-container`}>
        <span>No Image</span>
      </div>
    ) : null
  }

  return (
    <div className={`${className}-container`}>
      {imageLoading && (
        <div className={`${className} loading-placeholder`}>
          <span>Loading...</span>
        </div>
      )}
      <img
        src={imageUrl}
        alt={alt || product?.name || 'Product'}
        className={`${className} ${imageLoading ? 'loading' : ''} ${imageError ? 'error' : ''}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: imageLoading ? 'none' : 'block' }}
      />
    </div>
  )
}

export default ProductImage
