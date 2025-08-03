import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Bag = () => {
  const { 
    cartItems, 
    cartCount, 
    cartTotal, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item.id);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  const calculateItemTotal = (item) => {
    return (item.price * item.quantity).toFixed(2);
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="bag-page">
        <div className="container">
          <div className="empty-bag">
            <div className="empty-bag-content">
              <FaShoppingBag className="empty-bag-icon" />
              <h2>Your bag is empty</h2>
              <p>Looks like you haven't added anything to your bag yet.</p>
              <div className="empty-bag-actions">
                <Link to="/" className="continue-shopping-btn primary">
                  Start Shopping
                </Link>
                <div className="suggestions">
                  <h3>Popular Categories</h3>
                  <div className="suggestion-links">
                    <Link to="/new-women" className="suggestion-link">Women's</Link>
                    <Link to="/new-men" className="suggestion-link">Men's</Link>
                    <Link to="/new-shoes" className="suggestion-link">Shoes</Link>
                    <Link to="/special-offer" className="suggestion-link">Special Offers</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bag-page">
      <div className="container">
        {/* Header */}
        <div className="bag-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <FaArrowLeft /> Back
          </button>
          <h1 className="page-title">
            Shopping Bag ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
          <button onClick={handleClearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        </div>

        <div className="bag-content">
          {/* Cart Items */}
          <div className="bag-items">
            <div className="items-header">
              <h2>Items in your bag</h2>
            </div>
            
            <div className="items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img 
                      src={item.image || '/uploads/placeholder.png'} 
                      alt={item.name}
                    />
                  </div>
                  
                  <div className="item-details">
                    <div className="item-info">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-category">{item.subCategory}</p>
                      <p className="item-price">{formatPrice(item.price)}</p>
                    </div>
                    
                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button 
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <FaMinus />
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <FaPlus />
                        </button>
                      </div>
                      
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  <div className="item-total">
                    <span className="total-price">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <span className="quantity-text">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-header">
              <h2>Order Summary</h2>
            </div>
            
            <div className="summary-content">
              <div className="summary-line">
                <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              
              <div className="summary-line">
                <span>Shipping</span>
                <span className="free-shipping">
                  {cartTotal >= 50 ? 'FREE' : formatPrice(5.99)}
                </span>
              </div>
              
              {cartTotal < 50 && (
                <div className="shipping-notice">
                  <p>
                    Add {formatPrice(50 - cartTotal)} more for FREE shipping!
                  </p>
                </div>
              )}
              
              <div className="summary-line tax-line">
                <span>Tax (calculated at checkout)</span>
                <span>—</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-line total-line">
                <span>Total</span>
                <span className="total-amount">
                  {formatPrice(cartTotal + (cartTotal < 50 ? 5.99 : 0))}
                </span>
              </div>
              
              <div className="checkout-actions">
                <button 
                  className="checkout-btn primary"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
                
                <Link to="/" className="continue-shopping-btn secondary">
                  Continue Shopping
                </Link>
              </div>
              
              <div className="security-badges">
                <div className="security-item">
                  <span className="security-icon">🔒</span>
                  <span>Secure Checkout</span>
                </div>
                <div className="security-item">
                  <span className="security-icon">↩️</span>
                  <span>Easy Returns</span>
                </div>
                <div className="security-item">
                  <span className="security-icon">🚚</span>
                  <span>Fast Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations">
          <h3>You might also like</h3>
          <div className="recommendation-links">
            <Link to="/new-women" className="recommendation-link">
              <span>Women's New Arrivals</span>
            </Link>
            <Link to="/new-men" className="recommendation-link">
              <span>Men's New Arrivals</span>
            </Link>
            <Link to="/special-offer" className="recommendation-link">
              <span>Special Offers</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bag;
