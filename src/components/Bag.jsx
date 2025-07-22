import { useCart } from '../contexts/CartContext'

const Bag = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice 
  } = useCart()

  const handleQuantityChange = (productId, size, newQuantity) => {
    updateQuantity(productId, size, parseInt(newQuantity))
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!')
      return
    }
    
    // Here you would integrate with a payment system
    alert(`Proceeding to checkout with total: $${getTotalPrice().toFixed(2)}`)
  }

  if (cartItems.length === 0) {
    return (
      <div className="bag-page">
        <div className="container">
          <h1>Your Bag</h1>
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <a href="/" className="btn btn-primary">Continue Shopping</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bag-page">
      <div className="container">
        <h1>Your Bag</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={`${item.id}-${item.size}`} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>Size: {item.size}</p>
                  <p className="item-price">${item.price}</p>
                </div>
                
                <div className="item-quantity">
                  <label htmlFor={`quantity-${item.id}-${item.size}`}>Qty:</label>
                  <select
                    id={`quantity-${item.id}-${item.size}`}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, item.size, e.target.value)}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id, item.size)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-line total">
              <span>Total:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            
            <button 
              className="btn btn-primary btn-full"
              onClick={handleCheckout}
            >
              Checkout
            </button>
            
            <button 
              className="btn btn-secondary btn-full"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bag
