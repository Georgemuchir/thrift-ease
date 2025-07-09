// Helper function to merge local and server bags
function mergeBags(localBag, serverBag) {
  const merged = [...serverBag];
  
  // Add any local items that aren't on the server
  localBag.forEach(localItem => {
    const existsOnServer = serverBag.find(serverItem => serverItem.id === localItem.id);
    if (!existsOnServer) {
      merged.push(localItem);
    }
  });
  
  return merged;
}

document.addEventListener("DOMContentLoaded", () => {
  const signInForm = document.getElementById("sign-in-form");

  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const credentials = { email, password };

    try {
      console.log('🔐 Attempting sign-in...', { email });
      
      if (window.ThriftEaseAPI) {
        console.log('✅ API available, making request to:', window.ThriftEaseAPI.API_BASE_URL);
        const response = await window.ThriftEaseAPI.Auth.signIn(credentials);
        console.log('✅ Sign-in successful:', response);
        
        alert('Sign-in successful! Welcome back.');
        
        // The new API handles authentication and bag syncing automatically
        // Just redirect to home page
        window.location.href = 'index.html';
        
      } else {
        console.log('⚠️ No API available, using demo mode');
        // Fallback: simple validation without backend
        console.log('Sign-in attempted (no backend):', credentials);
        alert('Sign-in successful! (Demo mode)');
        window.location.href = 'index.html';
      }
      
    } catch (error) {
      console.error('❌ Sign-in error:', error);
      console.error('🔗 API URL being used:', window.ThriftEaseAPI?.API_BASE_URL || 'No API available');
      
      // Show specific error message from the backend
      let errorMessage = 'Sign-in failed. Please try again.';
      if (error.message.includes('Invalid password')) {
        errorMessage = 'Invalid password. Please check your password and try again.';
      } else if (error.message.includes('User not found')) {
        errorMessage = 'User not found. Please check your email or sign up for a new account.';
      } else if (error.message.includes('required')) {
        errorMessage = 'Please fill in all required fields.';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Connection error. Please check your internet connection and try again.';
      }
      
      // Add debugging info for development
      if (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')) {
        errorMessage += `\n\nDebug info: ${error.message}`;
      }
      
      alert(errorMessage);
    }
  });
});