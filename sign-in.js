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
        
        // Store authentication token and user info immediately
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userInfo', JSON.stringify(response.user));
        
        console.log('✅ Sign-in successful, loading user data...');
        
        // Load user's bag from backend immediately
        if (window.BagAPI && response.user && response.user.email) {
          try {
            console.log('🛒 Loading user bag from backend...');
            const userBag = await window.BagAPI.getUserBag(response.user.email);
            
            // Merge local and server bags
            const localBag = JSON.parse(localStorage.getItem('bag')) || [];
            const mergedBag = mergeBags(localBag, userBag);
            
            localStorage.setItem('bag', JSON.stringify(mergedBag));
            
            // Save merged bag back to server
            await window.BagAPI.saveUserBag(response.user.email, mergedBag);
            
            console.log('✅ User bag loaded and merged:', mergedBag);
          } catch (bagError) {
            console.error('⚠️ Error loading user bag:', bagError);
            // If bag loading fails, start with empty bag
            localStorage.setItem('bag', JSON.stringify([]));
          }
        }
        
        alert('Sign-in successful! Your data has been synced.');
        
        // Redirect to home page
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
