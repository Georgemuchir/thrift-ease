import React, { useState } from 'react';
import './index.css';
import { signIn } from './apiService';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await signIn({ email, password });
      console.log('Sign-in successful:', response);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

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
          <form id="sign-in-form" className="auth-form" onSubmit={handleSignIn}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

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