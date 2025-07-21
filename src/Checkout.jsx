import React, { useState, useEffect } from 'react';
import './index.css';

const Checkout = () => {
  const [bag, setBag] = useState([]);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    zip: '',
    country: ''
  });

  useEffect(() => {
    const storedBag = JSON.parse(localStorage.getItem('bag')) || [];
    setBag(storedBag);
    calculateTotal(storedBag);
  }, []);

  const calculateTotal = (items) => {
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(totalAmount);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Order placed successfully!\nShipping to: ${formData.name}, ${formData.address}, ${formData.city}, ${formData.zip}, ${formData.country}`);
    localStorage.removeItem('bag');
    setBag([]);
    setTotal(0);
  };

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'var(--secondary-color)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  };

  const headerStyle = {
    backgroundColor: 'var(--secondary-color)',
    color: 'var(--primary-color)',
    padding: '20px',
    borderRadius: '8px 8px 0 0',
    textAlign: 'center',
  };

  const footerStyle = {
    marginTop: '20px',
    fontSize: '14px',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    padding: '10px',
    backgroundColor: 'var(--footer-bg)',
    borderRadius: '0 0 8px 8px',
    boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>Checkout</h1>
      </header>
      <main>
        <section>
          <h2>Complete Your Purchase</h2>
          <p>Provide your details to finalize the order.</p>
        </section>

        <section className="checkout-section">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <table id="order-table" className="bag-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {bag.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>

          <div className="shipping-details">
            <h2>Shipping Details</h2>
            <form id="shipping-form" onSubmit={handleSubmit}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="Enter your city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="zip">ZIP Code</label>
              <input
                type="text"
                id="zip"
                name="zip"
                placeholder="Enter your ZIP code"
                value={formData.zip}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                placeholder="Enter your country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />

              <button type="submit" className="checkout-button">Place Order</button>
            </form>
          </div>
        </section>
      </main>

      <footer style={footerStyle}>
        <p>&copy; 2025 Thrift Ease. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Checkout;