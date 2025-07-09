document.addEventListener("DOMContentLoaded", () => {
  const signInForm = document.getElementById("sign-in-form");

  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const credentials = { email, password };

    try {
      if (window.ThriftEaseAPI) {
        const response = await window.ThriftEaseAPI.Auth.signIn(credentials);
        console.log('Sign-in successful:', response);
        
        alert('Sign-in successful! Welcome back.');
        
        // Load user's bag from backend if BagAPI is available
        if (window.BagAPI && response.user && response.user.email) {
          try {
            const userBag = await window.BagAPI.getUserBag(response.user.email);
            localStorage.setItem('bag', JSON.stringify(userBag));
            console.log('User bag loaded:', userBag);
          } catch (bagError) {
            console.error('Error loading user bag:', bagError);
          }
        }
        
        // Redirect to home page
        window.location.href = 'index.html';
        
      } else {
        // Fallback: simple validation without backend
        console.log('Sign-in attempted (no backend):', credentials);
        alert('Sign-in successful! (Demo mode)');
        window.location.href = 'index.html';
      }
      
    } catch (error) {
      console.error('Sign-in error:', error);
      
      // Show specific error message from the backend
      let errorMessage = 'Sign-in failed. Please try again.';
      if (error.message.includes('Invalid password')) {
        errorMessage = 'Invalid password. Please check your password and try again.';
      } else if (error.message.includes('User not found')) {
        errorMessage = 'User not found. Please check your email or sign up for a new account.';
      } else if (error.message.includes('required')) {
        errorMessage = 'Please fill in all required fields.';
      }
      
      alert(errorMessage);
    }
  });
});
