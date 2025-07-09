document.addEventListener("DOMContentLoaded", () => {
  const signUpForm = document.getElementById("sign-up-form");

  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Validate password confirmation
    if (password !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    const userData = { username, email, password };

    try {
      if (window.ThriftEaseAPI) {
        const response = await window.ThriftEaseAPI.Auth.signUp(userData);
        console.log('Sign-up successful:', response);
        
        alert('Account created successfully! You can now sign in.');
        
        // Redirect to sign-in page
        window.location.href = 'sign-in.html';
        
      } else {
        // Fallback: simple registration without backend
        console.log('Sign-up attempted (no backend):', userData);
        alert('Account created successfully! (Demo mode)');
        window.location.href = 'sign-in.html';
      }
      
    } catch (error) {
      console.error('Sign-up error:', error);
      alert('Sign-up failed. Please try again.');
    }
  });
});
