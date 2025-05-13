import React from 'react';
import './index.css';

const SignUp = () => {
  return (
    <div className="main-container">
      <header className="header">
        <div className="logo-container">
          <h1 className="logo">QuickThrift</h1>
        </div>
      </header>

      <main>
        <section className="auth-section">
          <h1>Create an Account</h1>
          <form id="sign-up-form" className="auth-form">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" placeholder="Enter your username" required />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" required />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" required />

            <label htmlFor="confirm-password">Confirm Password</label>
            <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm your password" required />

            <button type="submit" className="auth-button">Sign Up</button>
          </form>
          <p>Already have an account? <a href="/sign-in">Sign In</a></p>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2025 QuickThrift. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SignUp;