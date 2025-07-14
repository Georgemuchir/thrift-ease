// QuickThrift API Configuration
// Update this file with your deployed backend URL

const QUICKTHRIFT_CONFIG = {
    // Replace with your actual backend URL after deployment
    BACKEND_URL: 'YOUR_BACKEND_URL_HERE',
    
    // For local development 
    LOCAL_BACKEND_URL: 'http://127.0.0.1:5000',
    
    // Auto-detect environment
    getApiUrl() {
        const isLocal = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
        return isLocal ? this.LOCAL_BACKEND_URL : this.BACKEND_URL;
    }
};

// Export for use in other files
window.QUICKTHRIFT_CONFIG = QUICKTHRIFT_CONFIG;
