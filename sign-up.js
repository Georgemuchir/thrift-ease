document.addEventListener("DOMContentLoaded", () => {
  const signUpForm = document.getElementById("sign-up-form");
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const submitButton = signUpForm.querySelector('button[type="submit"]');

  // Wait for API to be ready before allowing sign-up
  let isAPIReady = false;
  
  function checkAPIReady() {
    if (window.ThriftEaseAPI && window.ThriftEaseAPI.isReady) {
      isAPIReady = true;
      console.log('✅ ThriftEase API is ready for sign-up');
      return true;
    }
    return false;
  }
  
  // Check immediately
  checkAPIReady();
  
  // Listen for API ready event
  window.addEventListener('ThriftEaseAPIReady', () => {
    isAPIReady = true;
    console.log('✅ ThriftEase API ready event received for sign-up');
  });
  
  // Fallback check after 2 seconds
  setTimeout(() => {
    if (!isAPIReady) {
      console.log('⚠️ API not ready for sign-up after 2 seconds, checking again...');
      checkAPIReady();
    }
  }, 2000);

  // Add loading state management
  function setLoadingState(isLoading) {
    if (isLoading) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating account...';
      [usernameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.disabled = true;
      });
    } else {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Sign Up';
      [usernameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.disabled = false;
      });
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
    
    signUpForm.insertBefore(errorDiv, signUpForm.firstChild);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }

  // Show success message
  function showSuccess(message) {
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
    
    signUpForm.insertBefore(successDiv, signUpForm.firstChild);
  }

  // Validate form inputs
  function validateForm() {
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!username || !email || !password || !confirmPassword) {
      showError('Please fill in all fields.');
      return false;
    }

    if (username.length < 3) {
      showError('Username must be at least 3 characters long.');
      return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      showError('Please enter a valid email address.');
      return false;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters long.');
      return false;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match. Please try again.');
      return false;
    }

    return true;
  }

  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check if API is ready
    if (!isAPIReady) {
      showError('System is still loading. Please wait a moment and try again.');
      console.log('🔄 API not ready for sign-up, checking again...');
      checkAPIReady();
      return;
    }

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const userData = { 
      username, 
      email, 
      password,
      name: username // Add name field for better user display
    };

    setLoadingState(true);

    try {
      console.log('📝 Attempting sign-up for:', email);
      console.log('🔧 ThriftEaseAPI available:', !!window.ThriftEaseAPI);
      console.log('🔧 ThriftEaseAPI.Auth available:', !!window.ThriftEaseAPI?.Auth);
      
      if (window.ThriftEaseAPI && window.ThriftEaseAPI.Auth) {
        const response = await window.ThriftEaseAPI.Auth.signUp(userData);
        console.log('✅ Sign-up successful:', response);
        
        showSuccess('Account created successfully! Redirecting to sign-in...');
        
        // Redirect after a short delay to show success message
        setTimeout(() => {
          window.location.href = 'sign-in.html';
        }, 2000);
        
      } else {
        throw new Error('Registration service is not available. Please refresh the page and try again.');
      }
      
    } catch (error) {
      console.error('❌ Sign-up error:', error);
      
      // Show user-friendly error messages
      let errorMessage = 'Account creation failed. Please try again.';
      
      if (error.message.toLowerCase().includes('email already exists') || 
          error.message.toLowerCase().includes('user already exists')) {
        errorMessage = 'An account with this email already exists. Please sign in or use a different email.';
      } else if (error.message.toLowerCase().includes('username already exists')) {
        errorMessage = 'This username is already taken. Please choose a different username.';
      } else if (error.message.toLowerCase().includes('invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.message.toLowerCase().includes('network') || 
                 error.message.toLowerCase().includes('fetch') ||
                 error.message.toLowerCase().includes('connection error')) {
        errorMessage = 'Connection error. Please check your internet connection and try again.';
      } else if (error.message.toLowerCase().includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.message.toLowerCase().includes('server')) {
        errorMessage = 'Server error. Please try again in a moment.';
      } else if (error.message.toLowerCase().includes('service') || 
                 error.message.toLowerCase().includes('not available')) {
        errorMessage = 'Registration service is temporarily unavailable. Please refresh the page and try again.';
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

  usernameInput.addEventListener('blur', () => {
    const username = usernameInput.value.trim();
    if (username && username.length < 3) {
      usernameInput.style.borderColor = '#dc3545';
    } else {
      usernameInput.style.borderColor = '';
    }
  });

  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    if (password.length > 0 && password.length < 6) {
      passwordInput.style.borderColor = '#dc3545';
    } else {
      passwordInput.style.borderColor = '';
    }
    
    // Check confirm password if it has value
    if (confirmPasswordInput.value) {
      if (password !== confirmPasswordInput.value) {
        confirmPasswordInput.style.borderColor = '#dc3545';
      } else {
        confirmPasswordInput.style.borderColor = '#28a745';
      }
    }
  });

  confirmPasswordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (confirmPassword.length > 0) {
      if (password !== confirmPassword) {
        confirmPasswordInput.style.borderColor = '#dc3545';
      } else {
        confirmPasswordInput.style.borderColor = '#28a745';
      }
    } else {
      confirmPasswordInput.style.borderColor = '';
    }
  });

  // Auto-focus username field
  usernameInput.focus();
});
