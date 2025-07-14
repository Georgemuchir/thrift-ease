document.addEventListener("DOMContentLoaded", () => {
  const signInForm = document.getElementById("sign-in-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const submitButton = signInForm.querySelector('button[type="submit"]');

  // Wait for API to be ready
  function waitForAPI() {
    return new Promise((resolve) => {
      if (window.ThriftEaseAPI && window.ThriftEaseAPI.isReady) {
        console.log('✅ API is ready');
        resolve();
      } else {
        console.log('⏳ Waiting for API to initialize...');
        
        // Listen for API ready event
        window.addEventListener('ThriftEaseAPIReady', () => {
          console.log('✅ API ready event received');
          resolve();
        }, { once: true });
        
        // Fallback timeout
        setTimeout(() => {
          if (window.ThriftEaseAPI) {
            console.warn('⚠️ API not marked ready, proceeding anyway...');
            resolve();
          } else {
            console.error('❌ API failed to initialize');
            resolve();
          }
        }, 3000);
      }
    });
  }

  // Add loading state management
  function setLoadingState(isLoading) {
    if (isLoading) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';
      emailInput.disabled = true;
      passwordInput.disabled = true;
    } else {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Sign In';
      emailInput.disabled = false;
      passwordInput.disabled = false;
    }
  }

  // Show error message
  function showError(message) {
    // Remove existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
      background: #f8d7da;
      color: #721c24;
      padding: 12px;
      border-radius: 6px;
      margin: 10px 0;
      border: 1px solid #f5c6cb;
      font-size: 14px;
    `;
    errorDiv.textContent = message;
    
    signInForm.insertBefore(errorDiv, signInForm.firstChild);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }

  // Show success message
  function showSuccess(message) {
    // Remove existing success messages
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
      existingSuccess.remove();
    }

    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
      background: #d4edda;
      color: #155724;
      padding: 12px;
      border-radius: 6px;
      margin: 10px 0;
      border: 1px solid #c3e6cb;
      font-size: 14px;
    `;
    successDiv.textContent = message;
    
    signInForm.insertBefore(successDiv, signInForm.firstChild);
  }

  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validate inputs
    if (!email || !password) {
      showError('Please fill in all fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      showError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters long.');
      return;
    }

    setLoadingState(true);

    try {
      console.log('🔐 Attempting sign-in for:', email);
      
      // Wait for API to be ready
      await waitForAPI();
      
      if (window.ThriftEaseAPI && window.ThriftEaseAPI.Auth) {
        console.log('📡 Calling ThriftEaseAPI.Auth.signIn...');
        const response = await window.ThriftEaseAPI.Auth.signIn({ email, password });
        console.log('✅ Sign-in successful:', response);
        
        showSuccess('Sign-in successful! Redirecting...');
        
        // Redirect after a short delay to show success message
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
        
      } else {
        throw new Error('Authentication service is not available. Please refresh the page and try again.');
      }
      
    } catch (error) {
      console.error('❌ Sign-in error:', error);
      
      // Show user-friendly error messages
      let errorMessage = 'Sign-in failed. Please try again.';
      
      if (error.message.toLowerCase().includes('invalid password')) {
        errorMessage = 'Incorrect password. Please check your password and try again.';
      } else if (error.message.toLowerCase().includes('user not found') || 
                 error.message.toLowerCase().includes('invalid email')) {
        errorMessage = 'No account found with this email address. Please check your email or sign up for a new account.';
      } else if (error.message.toLowerCase().includes('network') || 
                 error.message.toLowerCase().includes('fetch')) {
        errorMessage = 'Connection error. Please check your internet connection and try again.';
      } else if (error.message.toLowerCase().includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.message.toLowerCase().includes('server')) {
        errorMessage = 'Server error. Please try again in a moment.';
      } else if (error.message.toLowerCase().includes('not available')) {
        errorMessage = 'Authentication service is loading. Please wait a moment and try again.';
      }
      
      showError(errorMessage);
    } finally {
      setLoadingState(false);
    }
  });

  // Add real-time validation
  emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    if (email && (!email.includes('@') || !email.includes('.'))) {
      emailInput.style.borderColor = '#dc3545';
    } else {
      emailInput.style.borderColor = '';
    }
  });

  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    if (password.length > 0 && password.length < 6) {
      passwordInput.style.borderColor = '#dc3545';
    } else {
      passwordInput.style.borderColor = '';
    }
  });

  // Show loading message initially
  console.log('🚀 Sign-in page loaded, waiting for API...');
  waitForAPI().then(() => {
    console.log('🎯 Sign-in page ready');
  });
});
