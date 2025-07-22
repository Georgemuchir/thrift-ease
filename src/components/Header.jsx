import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useState } from 'react'

const Header = () => {
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Thrift Ease</h1>
        </Link>
        
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link to="/new-women" onClick={() => setIsMenuOpen(false)}>Women</Link>
          <Link to="/new-men" onClick={() => setIsMenuOpen(false)}>Men</Link>
          <Link to="/new-kids" onClick={() => setIsMenuOpen(false)}>Kids</Link>
          <Link to="/new-shoes" onClick={() => setIsMenuOpen(false)}>Shoes</Link>
        </nav>

        <div className={`header-actions ${isMenuOpen ? 'actions-open' : ''}`}>
          {user ? (
            <>
              <span className="user-greeting">Hello, {user.firstName || user.email}</span>
              <Link to="/bag" className="cart-link" onClick={() => setIsMenuOpen(false)}>
                Cart ({getTotalItems()})
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/sign-up" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
