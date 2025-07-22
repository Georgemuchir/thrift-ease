import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { FaShoppingBag, FaHeart, FaArrowLeft, FaStar, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [wishlist, setWishlist] = useState(new Set());
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.fetchProducts();
      const foundProduct = data.find(p => p.id === parseInt(id));
      
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        toast.error('Product not found');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      const productToAdd = selectedSize ? { ...product, selectedSize } : product;
      addToCart(productToAdd);
      toast.success('Added to cart!');
    }
  };

  const toggleWishlist = () => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(product.id)) {
      newWishlist.delete(product.id);
      toast.success('Removed from wishlist');
    } else {
      newWishlist.add(product.id);
      toast.success('Added to wishlist');
    }
    setWishlist(newWishlist);
  };

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'excellent': return '#22c55e';
      case 'good': return '#3b82f6';
      case 'fair': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')} className="back-button">
          <FaArrowLeft /> Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      <div className="product-details-content">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Back
        </button>

        <div className="product-details-grid">
          {/* Product Image */}
          <div className="product-image-section">
            <div className="main-image-container">
              <img 
                src={product.image || '/api/placeholder/500/500'} 
                alt={product.name}
                className="main-product-image"
                onError={(e) => {
                  e.target.src = '/api/placeholder/500/500';
                }}
              />
              <button 
                className={`wishlist-btn ${wishlist.has(product.id) ? 'active' : ''}`}
                onClick={toggleWishlist}
              >
                <FaHeart />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-meta">
                {product.brand && (
                  <span className="product-brand">{product.brand}</span>
                )}
                <div className="product-rating">
                  <FaStar className="star" />
                  <span>4.5 (12 reviews)</span>
                </div>
              </div>
            </div>

            <div className="product-price">
              <span className="current-price">${product.price}</span>
              {product.originalPrice && (
                <span className="original-price">${product.originalPrice}</span>
              )}
            </div>

            {/* Product Condition */}
            <div className="product-condition">
              <span className="condition-label">Condition:</span>
              <span 
                className="condition-badge"
                style={{ backgroundColor: getConditionColor(product.condition) }}
              >
                {product.condition || 'Good'}
              </span>
            </div>

            {/* Product Category */}
            <div className="product-category">
              <span className="category-label">Category:</span>
              <span className="category-value">{product.category}</span>
            </div>

            {/* Size Selection (if applicable) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="size-selection">
                <h3>Select Size:</h3>
                <div className="size-options">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="cart-section">
              <button 
                className={`add-to-cart-btn ${isInCart(product.id) ? 'in-cart' : ''}`}
                onClick={handleAddToCart}
                disabled={isInCart(product.id)}
              >
                {isInCart(product.id) ? (
                  <>
                    <FaCheck /> Already in Cart
                  </>
                ) : (
                  <>
                    <FaShoppingBag /> Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Product Description */}
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description || 'No description available for this product.'}</p>
            </div>

            {/* Additional Info */}
            <div className="additional-info">
              <div className="info-item">
                <strong>Material:</strong> {product.material || 'Not specified'}
              </div>
              <div className="info-item">
                <strong>Care Instructions:</strong> {product.careInstructions || 'Standard care recommended'}
              </div>
              {product.measurements && (
                <div className="info-item">
                  <strong>Measurements:</strong> {product.measurements}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
