import React from 'react';
import './index.css';

const SignIn = () => {
  return (
    <div className="main-container">
      <header className="header">
        <div className="logo-container">
          <h1 className="logo">QuickThrift</h1>
        </div>
      </header>

      <main>
        <section className="auth-section">
          <h1>Sign In to Your Account</h1>
          <form id="sign-in-form" className="auth-form">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" required />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" required />

            <button type="submit" className="auth-button">Sign In</button>
          </form>
          <p>Don't have an account? <a href="/sign-up">Sign Up</a></p>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2025 QuickThrift. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SignIn;