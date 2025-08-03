import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import { FaLock, FaArrowLeft, FaCreditCard, FaPaypal } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    saveInfo: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const shippingCost = cartTotal >= 50 ? 0 : 5.99;
  const tax = cartTotal * 0.08; // 8% tax
  const finalTotal = cartTotal + shippingCost + tax;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv) newErrors.cvv = 'CVV is required';
      if (!formData.nameOnCard) newErrors.nameOnCard = 'Name on card is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please sign in to complete your order');
      navigate('/sign-in');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/');
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        userId: user.id,
        items: cartItems,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        subtotal: cartTotal,
        shipping: shippingCost,
        tax: tax,
        total: finalTotal,
        email: formData.email
      };

      const result = await ordersAPI.createOrder(orderData);

      if (result.success) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/orders', { 
          state: { 
            orderId: result.orderId,
            message: 'Your order has been placed successfully!'
          }
        });
      } else {
        toast.error(result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('An error occurred while placing your order');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => `$${price.toFixed(2)}`;

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-checkout">
            <h2>Your cart is empty</h2>
            <p>Add some items to your cart before proceeding to checkout.</p>
            <button onClick={() => navigate('/')} className="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <button onClick={() => navigate('/bag')} className="back-button">
            <FaArrowLeft /> Back to Cart
          </button>
          <h1>Checkout</h1>
          <div className="security-badge">
            <FaLock /> Secure Checkout
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-content">
            {/* Left Column - Forms */}
            <div className="checkout-forms">
              {/* Contact Information */}
              <div className="form-section">
                <h2>Contact Information</h2>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="Enter your email"
                    disabled={isAuthenticated}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="form-section">
                <h2>Shipping Address</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? 'error' : ''}
                      placeholder="First name"
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? 'error' : ''}
                      placeholder="Last name"
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={errors.address ? 'error' : ''}
                    placeholder="Street address"
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? 'error' : ''}
                      placeholder="City"
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={errors.state ? 'error' : ''}
                      placeholder="State"
                    />
                    {errors.state && <span className="error-message">{errors.state}</span>}
                  </div>
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={errors.zipCode ? 'error' : ''}
                      placeholder="ZIP"
                    />
                    {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="Phone number"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-section">
                <h2>Payment Method</h2>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                    />
                    <div className="payment-option-content">
                      <FaCreditCard />
                      <span>Credit Card</span>
                    </div>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleChange}
                    />
                    <div className="payment-option-content">
                      <FaPaypal />
                      <span>PayPal</span>
                    </div>
                  </label>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="card-details">
                    <div className="form-group">
                      <label>Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className={errors.cardNumber ? 'error' : ''}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          className={errors.expiryDate ? 'error' : ''}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                      </div>
                      <div className="form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          className={errors.cvv ? 'error' : ''}
                          placeholder="123"
                          maxLength="4"
                        />
                        {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Name on Card *</label>
                      <input
                        type="text"
                        name="nameOnCard"
                        value={formData.nameOnCard}
                        onChange={handleChange}
                        className={errors.nameOnCard ? 'error' : ''}
                        placeholder="Full name as shown on card"
                      />
                      {errors.nameOnCard && <span className="error-message">{errors.nameOnCard}</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="order-summary-checkout">
              <div className="summary-card">
                <h2>Order Summary</h2>
                
                <div className="order-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="order-item">
                      <img src={item.image || '/uploads/placeholder.png'} alt={item.name} />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>Qty: {item.quantity}</p>
                      </div>
                      <span className="item-price">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="summary-totals">
                  <div className="summary-line">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="summary-line">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="summary-line">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="summary-line total">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="place-order-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner small"></span>
                      Processing...
                    </>
                  ) : (
                    `Place Order ${formatPrice(finalTotal)}`
                  )}
                </button>

                <div className="security-info">
                  <FaLock />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
