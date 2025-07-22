import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        {/* Footer Top */}
        <div className="footer-top">
          <div className="footer-section">
            <h3 className="footer-title">QuickThrift</h3>
            <p className="footer-description">
              Discover amazing thrift finds with our modern, mobile-optimized shopping experience. 
              Sustainable fashion that doesn't compromise on style.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="section-title">Shop</h4>
            <ul className="footer-links">
              <li><Link to="/new-women">Women's</Link></li>
              <li><Link to="/new-men">Men's</Link></li>
              <li><Link to="/new-kids">Kids</Link></li>
              <li><Link to="/new-shoes">Shoes</Link></li>
              <li><Link to="/special-offer">Special Offers</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="section-title">Customer Service</h4>
            <ul className="footer-links">
              <li><a href="#help">Help Center</a></li>
              <li><a href="#returns">Returns & Exchanges</a></li>
              <li><a href="#shipping">Shipping Info</a></li>
              <li><a href="#size-guide">Size Guide</a></li>
              <li><a href="#track-order">Track Your Order</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="section-title">Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>hello@quickthrift.com</span>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>123 Fashion Street, Style City, SC 12345</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="section-title">Newsletter</h4>
            <p className="newsletter-text">
              Subscribe to get updates on new arrivals and exclusive offers!
            </p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input"
                aria-label="Email for newsletter"
              />
              <button type="submit" className="newsletter-button">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-legal">
              <p>&copy; 2025 QuickThrift. All rights reserved.</p>
              <div className="legal-links">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="#cookies">Cookie Policy</a>
              </div>
            </div>
            
            <div className="payment-methods">
              <span className="payment-text">We Accept:</span>
              <div className="payment-icons">
                <div className="payment-icon">VISA</div>
                <div className="payment-icon">MC</div>
                <div className="payment-icon">AMEX</div>
                <div className="payment-icon">PayPal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
