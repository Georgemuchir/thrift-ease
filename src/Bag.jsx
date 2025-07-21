import React, { useState, useEffect } from 'react';
import './index.css';

const Bag = () => {
  const [bag, setBag] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const storedBag = JSON.parse(localStorage.getItem('bag')) || [];
    setBag(storedBag);
    calculateTotal(storedBag);
  }, []);

  const calculateTotal = (items) => {
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(totalAmount);
  };

  const removeItem = (index) => {
    const updatedBag = [...bag];
    updatedBag.splice(index, 1);
    setBag(updatedBag);
    localStorage.setItem('bag', JSON.stringify(updatedBag));
    calculateTotal(updatedBag);
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

  // Updated Bag page structure
  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>Your Bag</h1>
      </header>
      <main>
        <section>
          <h2>Review Your Items</h2>
          <p>Manage the items in your bag before checkout.</p>
          <table id="bag-table" className="bag-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bag.map((item, index) => (
                <tr key={index}>
                  <td><img src={item.image} alt={item.name} className="cart-item-image" /></td>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button onClick={() => removeItem(index)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bag-summary">
            <h3>Total: ${total.toFixed(2)}</h3>
            <button id="checkout-button" className="checkout-button" onClick={() => alert('Proceeding to checkout...')}>
              Checkout
            </button>
          </div>
        </section>
      </main>
      <footer style={footerStyle}>
        <p>&copy; 2025 Thrift Ease. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Bag;