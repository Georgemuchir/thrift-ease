import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('An error occurred during sign in');
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login will be available soon!`);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          {/* Left Side - Branding */}
          <div className="auth-branding">
            <div className="branding-content">
              <h1 className="brand-title">Welcome Back to QuickThrift</h1>
              <p className="brand-subtitle">
                Sign in to access your account and continue your sustainable fashion journey.
              </p>
              <div className="feature-list">
                <div className="feature-item">
                  <span className="feature-icon">🛍️</span>
                  <span>Save your favorite items</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📦</span>
                  <span>Track your orders</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💖</span>
                  <span>Get personalized recommendations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="auth-form-container">
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-header">
                <h2>Sign In</h2>
                <p>Enter your credentials to access your account</p>
              </div>

              {/* Social Login Buttons */}
              <div className="social-login">
                <button 
                  type="button" 
                  className="social-btn google-btn"
                  onClick={() => handleSocialLogin('Google')}
                >
                  <FaGoogle />
                  Continue with Google
                </button>
                <button 
                  type="button" 
                  className="social-btn facebook-btn"
                  onClick={() => handleSocialLogin('Facebook')}
                >
                  <FaFacebook />
                  Continue with Facebook
                </button>
              </div>

              <div className="divider">
                <span>Or sign in with email</span>
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <span id="email-error" className="error-message">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password *
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <span id="password-error" className="error-message">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options">
                <label className="checkbox-container">
                  <input type="checkbox" className="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner small"></span>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Sign Up Link */}
              <div className="auth-switch">
                <p>
                  Don't have an account?{' '}
                  <Link to="/sign-up" className="auth-link">
                    Sign up here
                  </Link>
                </p>
              </div>

              {/* Demo Account */}
              <div className="demo-account">
                <p className="demo-text">Demo Account:</p>
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => {
                    setFormData({
                      email: 'demo@example.com',
                      password: 'demo123'
                    });
                  }}
                >
                  Use Demo Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
