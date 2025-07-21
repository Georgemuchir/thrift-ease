import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { FaShoppingBag, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Promotional Banner */}
      <div className="promo-banner">
        <div className="promo-content">
          <span className="promo-text">🎉 Free Shipping on orders over $50! Use code: FREESHIP</span>
          <button className="promo-close" onClick={(e) => e.target.closest('.promo-banner').style.display = 'none'}>
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="guza-header" role="banner">
        <div className="header-container">
          {/* Logo */}
          <div className="logo-container">
            <Link to="/" className="logo-link" onClick={closeMenu}>
              <h1 className="logo">QuickThrift</h1>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Navigation */}
          <nav className={`main-nav ${isMenuOpen ? 'nav-open' : ''}`} role="navigation">
            <ul className="nav-menu">
              <li className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle">
                  Women's
                </a>
                <ul className="dropdown-menu">
                  <li><Link to="/new-women" onClick={closeMenu}>Dresses</Link></li>
                  <li><Link to="/new-women" onClick={closeMenu}>Tops</Link></li>
                  <li><Link to="/new-women" onClick={closeMenu}>Jeans</Link></li>
                  <li><Link to="/new-women" onClick={closeMenu}>Skirts</Link></li>
                  <li><Link to="/new-women" onClick={closeMenu}>Activewear</Link></li>
                  <li><Link to="/new-women" onClick={closeMenu}>Coats & Jackets</Link></li>
                </ul>
              </li>
              
              <li className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle">
                  Men's
                </a>
                <ul className="dropdown-menu">
                  <li><Link to="/new-men" onClick={closeMenu}>Shirts</Link></li>
                  <li><Link to="/new-men" onClick={closeMenu}>T-Shirts</Link></li>
                  <li><Link to="/new-men" onClick={closeMenu}>Jeans</Link></li>
                  <li><Link to="/new-men" onClick={closeMenu}>Trousers</Link></li>
                  <li><Link to="/new-men" onClick={closeMenu}>Shorts</Link></li>
                  <li><Link to="/new-men" onClick={closeMenu}>Jackets & Coats</Link></li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle">
                  Kids
                </a>
                <ul className="dropdown-menu">
                  <li><Link to="/new-kids" onClick={closeMenu}>Boys</Link></li>
                  <li><Link to="/new-kids" onClick={closeMenu}>Girls</Link></li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle">
                  Shoes
                </a>
                <ul className="dropdown-menu">
                  <li><Link to="/new-shoes" onClick={closeMenu}>Sneakers</Link></li>
                  <li><Link to="/new-shoes" onClick={closeMenu}>Boots</Link></li>
                  <li><Link to="/new-shoes" onClick={closeMenu}>Sandals</Link></li>
                  <li><Link to="/new-shoes" onClick={closeMenu}>Formal Shoes</Link></li>
                </ul>
              </li>

              <li className="nav-item">
                <Link to="/special-offer" className="nav-link" onClick={closeMenu}>
                  Special Offers
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/add-product" className="nav-link sell-link" onClick={closeMenu}>
                  💰 Sell
                </Link>
              </li>
            </ul>
          </nav>

          {/* User Actions */}
          <div className="user-actions">
            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-greeting">Hi, {user?.firstName || user?.name}!</span>
                <div className="user-dropdown">
                  <button className="user-toggle">
                    <FaUser />
                  </button>
                  <div className="user-dropdown-menu">
                    {user?.isAdmin && (
                      <Link to="/admin" className="dropdown-item" onClick={closeMenu}>
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/sign-in" className="auth-button sign-in" onClick={closeMenu}>
                  Sign In
                </Link>
                <Link to="/sign-up" className="auth-button sign-up" onClick={closeMenu}>
                  Sign Up
                </Link>
              </div>
            )}

            {/* Shopping Bag */}
            <Link to="/bag" className="bag-button" onClick={closeMenu}>
              <FaShoppingBag />
              {cartCount > 0 && (
                <span className="bag-count">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="mobile-nav-overlay" onClick={closeMenu}>
            <div className="mobile-nav-content" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-nav-header">
                <h3>Menu</h3>
                <button onClick={closeMenu} className="close-mobile-nav">
                  <FaTimes />
                </button>
              </div>
              
              <div className="mobile-nav-body">
                <div className="mobile-nav-section">
                  <h4>Categories</h4>
                  <Link to="/new-women" onClick={closeMenu}>Women's</Link>
                  <Link to="/new-men" onClick={closeMenu}>Men's</Link>
                  <Link to="/new-kids" onClick={closeMenu}>Kids</Link>
                  <Link to="/new-shoes" onClick={closeMenu}>Shoes</Link>
                  <Link to="/special-offer" onClick={closeMenu}>Special Offers</Link>
                </div>

                {isAuthenticated ? (
                  <div className="mobile-nav-section">
                    <h4>Account</h4>
                    {user?.isAdmin && (
                      <Link to="/admin" onClick={closeMenu}>Admin Panel</Link>
                    )}
                    <button onClick={handleLogout} className="mobile-logout-btn">
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="mobile-nav-section">
                    <h4>Account</h4>
                    <Link to="/sign-in" onClick={closeMenu}>Sign In</Link>
                    <Link to="/sign-up" onClick={closeMenu}>Sign Up</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
