document.addEventListener("DOMContentLoaded", () => {
  console.log('🚀 QuickThrift Sign-In loaded');
  
  const signInForm = document.getElementById("sign-in-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const submitButton = signInForm.querySelector('button[type="submit"]');

  // Demo credentials
  const demoCredentials = {
    email: "demo@quickthrift.com",
    password: "demo123"
  };

  // Additional valid credentials for testing
  const validCredentials = [
    { email: "demo@quickthrift.com", password: "demo123" },
    { email: "admin@quickthrift.com", password: "admin123" },
    { email: "user@quickthrift.com", password: "user123" },
    { email: "test@quickthrift.com", password: "test123" }
  ];

  // Notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fa-solid fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
      <button class="notification-close"><i class="fa-solid fa-times"></i></button>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);

    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });
  }

  // Loading state management
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

  // Simulate authentication process
  function authenticateUser(email, password) {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        const isValid = validCredentials.some(cred => 
          cred.email === email && cred.password === password
        );
        
        if (isValid) {
          resolve({
            success: true,
            user: {
              email: email,
              name: email.split('@')[0],
              id: Math.random().toString(36).substr(2, 9)
            }
          });
        } else {
          resolve({
            success: false,
            error: 'Invalid email or password'
          });
        }
      }, 1000); // 1 second delay to simulate real authentication
    });
  }

  // Handle form submission
  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Basic validation
    if (!email || !password) {
      showNotification('Please enter both email and password', 'error');
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    if (password.length < 6) {
      showNotification('Password must be at least 6 characters long', 'error');
      return;
    }
    
    setLoadingState(true);
    
    try {
      const result = await authenticateUser(email, password);
      
      if (result.success) {
        // Store user data in localStorage
        localStorage.setItem('quickthrift-user', JSON.stringify(result.user));
        localStorage.setItem('quickthrift-auth-token', 'demo-token-' + Date.now());
        
        showNotification('Successfully signed in! Redirecting...', 'success');
        
        // Redirect to main page after short delay
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
        
      } else {
        showNotification(result.error || 'Authentication failed', 'error');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      showNotification('Authentication service error. Please try again.', 'error');
    } finally {
      setLoadingState(false);
    }
  });

  // Auto-fill demo credentials button
  function createDemoButton() {
    const demoButton = document.createElement('button');
    demoButton.type = 'button';
    demoButton.className = 'demo-fill-btn';
    demoButton.innerHTML = '<i class="fa-solid fa-magic"></i> Use Demo Credentials';
    demoButton.style.cssText = `
      background: #28a745;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 10px;
      width: 100%;
      transition: background 0.3s ease;
    `;
    
    demoButton.addEventListener('click', () => {
      emailInput.value = demoCredentials.email;
      passwordInput.value = demoCredentials.password;
      showNotification('Demo credentials filled in', 'info');
    });
    
    demoButton.addEventListener('mouseenter', () => {
      demoButton.style.background = '#218838';
    });
    
    demoButton.addEventListener('mouseleave', () => {
      demoButton.style.background = '#28a745';
    });
    
    return demoButton;
  }

  // Add demo button to form
  const demoButton = createDemoButton();
  signInForm.appendChild(demoButton);

  // Add real-time validation
  emailInput.addEventListener('input', () => {
    const email = emailInput.value.trim();
    if (email && (!email.includes('@') || !email.includes('.'))) {
      emailInput.style.borderColor = '#dc3545';
    } else {
      emailInput.style.borderColor = '#ddd';
    }
  });

  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value.trim();
    if (password && password.length < 6) {
      passwordInput.style.borderColor = '#dc3545';
    } else {
      passwordInput.style.borderColor = '#ddd';
    }
  });

  // Check if user is already logged in
  function checkExistingAuth() {
    const user = localStorage.getItem('quickthrift-user');
    const token = localStorage.getItem('quickthrift-auth-token');
    
    if (user && token) {
      showNotification('Already signed in. Redirecting...', 'info');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    }
  }

  // Initialize
  checkExistingAuth();
  
  console.log('✅ QuickThrift Sign-In ready');
  console.log('💡 Demo credentials: demo@quickthrift.com / demo123');
});
