import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-section">
        <h4>thrift ease</h4>
        <p>Sustainable fashion that's stylish and affordable. Discover unique pieces while helping reduce fashion waste - one thrift at a time.</p>
      </div>
      <div className="footer-section">
        <h5>Shop</h5>
        <ul>
          <li><Link to="/new-women">Women</Link></li>
          <li><Link to="/new-men">Men</Link></li>
          <li><Link to="/new-kids">Kids</Link></li>
          <li><Link to="/new-shoes">Shoes</Link></li>
        </ul>
      </div>
      <div className="footer-section">
        <h5>Account</h5>
        <ul>
          <li><Link to="/sign-in">Sign In</Link></li>
          <li><Link to="/sign-up">Sign Up</Link></li>
          <li><Link to="/bag">Shopping Bag</Link></li>
        </ul>
      </div>
      <div className="footer-section">
        <h5>Follow Us</h5>
        <ul>
          <li><a href="#" aria-label="Instagram">Instagram</a></li>
          <li><a href="#" aria-label="Twitter">Twitter</a></li>
          <li><a href="#" aria-label="Facebook">Facebook</a></li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      <span>&copy; {new Date().getFullYear()} Thrift Ease. All rights reserved.</span>
    </div>
  </footer>
)

export default Footer
