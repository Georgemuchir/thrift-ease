// QuickThrift API Configuration
// Update this file with your deployed backend URL

const QUICKTHRIFT_CONFIG = {
    // Replace with your actual backend URL after deployment
    BACKEND_URL: 'https://your-app-name.onrender.com',
    
    // For local development 
    LOCAL_BACKEND_URL: 'http://127.0.0.1:5000',
    
    // Auto-detect environment
    getApiUrl() {
        const isLocal = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.port === '3000';
        return isLocal ? this.LOCAL_BACKEND_URL : this.BACKEND_URL;
    }
};

// Export for use in other files
window.QUICKTHRIFT_CONFIG = QUICKTHRIFT_CONFIG;
