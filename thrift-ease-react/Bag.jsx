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

  return (
    <div className="bag-section">
      <header className="header">
        <div className="logo">QuickThrift</div>
        <nav className="nav">
          <ul>
            <li><a href="/" className="nav-link">Home</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="bag-section">
          <h1>Your Bag</h1>
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

      <footer className="footer">
        <p>&copy; 2025 QuickThrift. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Bag;