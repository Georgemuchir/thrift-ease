import React, { useState } from 'react';
import './index.css';
import { signUp } from './apiService';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    try {
      const response = await signUp({ username, email, password });
      console.log('Sign-up successful:', response);
    } catch (error) {
      console.error('Error signing up:', error);
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
          <h1>Create an Account</h1>
          <form id="sign-up-form" className="auth-form" onSubmit={handleSignUp}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

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

            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

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