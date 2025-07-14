/**
 * QuickThrift Admin Authentication Helper
 * Integrates with existing authentication system
 */

// Admin setup and authentication utilities
class AdminAuth {
    constructor() {
        this.init();
    }
    
    init() {
        this.createDefaultAdmin();
        this.setupAdminAccess();
    }
    
    // Create default admin user with proper security
    async createDefaultAdmin() {
        try {
            // Check if admin exists via API
            const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://127.0.0.1:5000'
                : 'https://thrift-ease-1.onrender.com';
            
            const response = await fetch(`${API_BASE_URL}/api/users`);
            if (response.ok) {
                const users = await response.json();
                const adminExists = users.find(user => user.email === 'admin@quickthrift.com');
                
                if (adminExists) {
                    console.log('✅ Default admin already exists');
                    return;
                }
            }
            
            console.log('🔐 Default admin will be created by backend on startup');
            console.log('📧 Email: admin@quickthrift.com');
            console.log('🔑 Password: TempPass123! (must be changed on first login)');
            
        } catch (error) {
            console.log('📝 Backend will handle admin creation on startup');
        }
    }
    
    // Check if current user is admin
    isAdmin() {
        const currentUser = this.getCurrentUser();
        return currentUser.email && (
            currentUser.role === 'admin' || 
            currentUser.email === 'admin@quickthrift.com'
        );
    }
    
    // Setup admin access features
    setupAdminAccess() {
        if (this.isAdmin() && !window.location.pathname.includes('admin.html')) {
            this.addAdminNavigation();
        }
    }
    
    // Add admin navigation to main site
    addAdminNavigation() {
        // Add to main navigation
        const navList = document.querySelector('.nav-list');
        if (navList && !document.querySelector('.admin-access')) {
            const adminLi = document.createElement('li');
            adminLi.innerHTML = `<a href="admin.html" class="nav-link admin-access" title="Admin Panel">⚙️ Admin</a>`;
            navList.appendChild(adminLi);
        }
        
        // Add admin button to header icons
        const headerIcons = document.querySelector('.header-icons');
        if (headerIcons && !document.querySelector('.admin-btn')) {
            const adminBtn = document.createElement('button');
            adminBtn.className = 'icon-btn admin-btn';
            adminBtn.setAttribute('aria-label', 'Admin Panel');
            adminBtn.innerHTML = `
                <i class="fa-solid fa-cog" aria-hidden="true"></i>
                <span class="admin-label">Admin</span>
            `;
            adminBtn.onclick = () => window.location.href = 'admin.html';
            headerIcons.insertBefore(adminBtn, headerIcons.firstChild);
        }
    }
     // Utility methods for user management (now using backend API)
    async getUsers() {
        try {
            const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://127.0.0.1:5000'
                : 'https://thrift-ease-1.onrender.com';
            
            const response = await fetch(`${API_BASE_URL}/api/users`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Could not fetch users from backend, using fallback');
        }
        
        // Fallback to localStorage if backend is not available
        return JSON.parse(localStorage.getItem('quickthrift_users') || '[]');
    }

    saveUsers(users) {
        // This method is now deprecated - users are saved via API calls
        console.warn('saveUsers is deprecated - users are now saved via backend API');
        localStorage.setItem('quickthrift_users', JSON.stringify(users));
    }
    
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser') || '{}');
    }
    
    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    // Admin login method using backend API
    async adminLogin(email, password) {
        try {
            const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://127.0.0.1:5000'
                : 'https://thrift-ease-1.onrender.com';
            
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            if (response.ok) {
                const result = await response.json();
                const user = result.user;
                
                // Check if user is admin
                if (user.role === 'admin' || user.email === 'admin@quickthrift.com') {
                    this.setCurrentUser(user);
                    return true;
                }
                
                return false; // Not an admin
            }
            
            return false;
            
        } catch (error) {
            console.error('Admin login error:', error);
            
            // Fallback to localStorage if backend is not available
            const users = await this.getUsers();
            const adminUser = users.find(user => 
                user.email === email && 
                user.password === password && 
                (user.role === 'admin' || user.email === 'admin@quickthrift.com')
            );
            
            if (adminUser) {
                this.setCurrentUser(adminUser);
                return true;
            }
            
            return false;
        }
    }
    
    // Check admin access for protected pages
    requireAdminAccess() {
        if (!this.isAdmin()) {
            alert('🔐 Admin access required!\n\nDefault admin credentials:\nEmail: admin@quickthrift.com\nPassword: TempPass123!\n\n⚠️ You will be required to change the password on first login.');
            window.location.href = 'sign-in-new.html?redirect=admin.html';
            return false;
        }
        return true;
    }
}

// Initialize admin auth when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if not already done
    if (!window.adminAuth) {
        window.adminAuth = new AdminAuth();
        
        // For admin pages, check access immediately
        if (window.location.pathname.includes('admin.html')) {
            if (!window.adminAuth.requireAdminAccess()) {
                return;
            }
        }
    }
});

// Export for global access
window.AdminAuth = AdminAuth;
