import React, { useState } from 'react';
import './index.css';
import { signUp } from './apiService';

// Updated centralized color palette for minimalist & high-end fashion vibe
const colors = {
  primary: '#1C1C1C', // Charcoal for primary text and headers
  textPrimary: '#FFFFFF', // White text for contrast
  textSecondary: '#E0E0E0', // Light gray for secondary text
  border: '#F5F5F5', // Light gray for borders
  background: '#FFFFFF', // White for background
  accent: '#CBA135', // Gold accents for highlights
};

// Updated styles for SignUp page to align with the new global styles
const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
  maxWidth: '400px',
  margin: '50px auto',
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

// Sidebar and content styles
const sidebarStyle = {
  width: '250px',
  backgroundColor: '#2C3E50',
  color: '#FFFFFF',
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
  padding: '20px',
};

const contentStyle = {
  marginLeft: '250px',
  padding: '20px',
  backgroundColor: '#ECF0F1',
  minHeight: '100vh',
};

const navItemStyle = {
  display: 'block',
  color: '#FFFFFF',
  textDecoration: 'none',
  padding: '10px 15px',
  margin: '10px 0',
  borderRadius: '5px',
  backgroundColor: '#34495E',
  transition: 'background-color 0.3s',
};

const navItemHoverStyle = {
  backgroundColor: '#1ABC9C',
};

// Updated SignUp page structure
const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending sign-up request with:', { username, email, password }); // Debugging log
      const response = await signUp({ username, email, password });
      console.log('Sign-up response:', response); // Debugging log
      alert('Sign-up successful! You can now sign in.');
    } catch (error) {
      console.error('Error signing up:', error.response || error.message); // Improved error logging
      alert('Sign-up failed. Please try again.');
    }
  };

  return (
    <div>
      <header className="header">
        <div className="logo-container">
          <h1 className="logo">QuickThrift</h1>
        </div>
        <div className="user-options">
          <a href="/sign-in" className="login-link">Sign In / Sign Up</a>
          <a href="/bag" className="bag-link">
            <i className="fa-solid fa-bag-shopping"></i> Bag
            <span id="bag-count" className="bag-count">0</span>
          </a>
        </div>
      </header>
      <aside style={sidebarStyle}>
        <h2>Thrift Ease</h2>
        <a href="/home" style={navItemStyle}>Home</a>
        <a href="/sign-in" style={navItemStyle}>Sign In</a>
      </aside>
      <main style={contentStyle}>
        <div style={containerStyle}>
          <header style={headerStyle}>
            <h1>Sign Up</h1>
          </header>
          <section>
            <h2>Create Your Account</h2>
            <form onSubmit={handleSignUp}>
              <label>Username:</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label>Email:</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Password:</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Sign Up</button>
            </form>
          </section>
          <footer style={footerStyle}>
            <p>&copy; 2025 Thrift Ease. All rights reserved.</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default SignUp;