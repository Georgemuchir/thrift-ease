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
    
    // Create default admin user
    createDefaultAdmin() {
        const users = this.getUsers();
        const adminExists = users.find(user => user.email === 'admin@quickthrift.com');
        
        if (!adminExists) {
            const adminUser = {
                id: 'admin-001',
                name: 'QuickThrift Admin',
                email: 'admin@quickthrift.com',
                password: 'admin123',
                role: 'admin',
                joinDate: new Date().toISOString().split('T')[0],
                status: 'Active',
                orders: 0
            };
            
            users.push(adminUser);
            this.saveUsers(users);
            
            // Also add to current user if no one is logged in
            const currentUser = this.getCurrentUser();
            if (!currentUser.email) {
                this.setCurrentUser(adminUser);
            }
            
            console.log('✅ Default admin created:', adminUser.email);
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
    
    // Utility methods for user management
    getUsers() {
        return JSON.parse(localStorage.getItem('quickthrift_users') || '[]');
    }
    
    saveUsers(users) {
        localStorage.setItem('quickthrift_users', JSON.stringify(users));
    }
    
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser') || '{}');
    }
    
    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    // Admin login method
    adminLogin(email, password) {
        const users = this.getUsers();
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
    
    // Check admin access for protected pages
    requireAdminAccess() {
        if (!this.isAdmin()) {
            alert('🔐 Admin access required!\n\nDefault credentials:\nEmail: admin@quickthrift.com\nPassword: admin123');
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
