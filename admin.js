/**
 * QuickThrift Admin Panel JavaScript
 * Comprehensive admin functionality for managing products, orders, and users
 */

// Admin Configuration
const ADMIN_CONFIG = {
    apiBase: '/api',
    itemsPerPage: 10,
    categories: {
        'Women': ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories'],
        'Men': ['Tops', 'Bottoms', 'Outerwear', 'Accessories'],
        'Kids': ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Sleepwear', 'Accessories'],
        'Shoes': ['Sneakers', 'Boots', 'Sandals', 'Dress Shoes', 'Athletic']
    },
    statuses: ['Active', 'Inactive', 'Sold'],
    conditions: ['New', 'Like New', 'Excellent', 'Very Good', 'Good']
};

// Global state
let adminState = {
    products: [],
    orders: [],
    users: [],
    currentFilter: '',
    currentSort: '',
    isLoading: false
};

// DOM Elements
const elements = {
    // Dashboard stats
    totalProducts: document.getElementById('total-products'),
    totalOrders: document.getElementById('total-orders'),
    totalUsers: document.getElementById('total-users'),
    totalRevenue: document.getElementById('total-revenue'),
    
    // Product management
    productsList: document.getElementById('products-list'),
    categoryFilterAdmin: document.getElementById('category-filter-admin'),
    statusFilter: document.getElementById('status-filter'),
    productSearch: document.getElementById('product-search'),
    
    // Modal and forms
    addProductModal: document.getElementById('add-product-modal'),
    addProductForm: document.getElementById('add-product-form'),
    mainCategory: document.getElementById('main-category'),
    subCategory: document.getElementById('sub-category'),
    
    // Loading
    loadingOverlay: document.getElementById('loading-overlay'),
    
    // Mobile menu
    mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
    nav: document.querySelector('.admin-nav')
};

/**
 * Initialize Admin Panel
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Initializing QuickThrift Admin Panel...');
    
    // Check admin authentication
    if (!checkAdminAuth()) {
        redirectToLogin();
        return;
    }
    
    // Initialize components
    initializeEventListeners();
    initializeCategoryDropdowns();
    loadDashboardData();
    setupMobileMenu();
    addAdminNavigationIfAuthorized();
    
    console.log('✅ Admin Panel initialized successfully');
});

/**
 * Admin User Management and Security
 */

// Create default admin user if not exists
function createDefaultAdmin() {
    const users = JSON.parse(localStorage.getItem('quickthrift_users') || '[]');
    const adminExists = users.find(user => user.email === 'admin@quickthrift.com');
    
    if (!adminExists) {
        const adminUser = {
            id: 'admin-001',
            name: 'Admin',
            email: 'admin@quickthrift.com',
            password: 'admin123', // In real app, this would be hashed
            role: 'admin',
            joinDate: new Date().toISOString().split('T')[0],
            status: 'Active'
        };
        
        users.push(adminUser);
        localStorage.setItem('quickthrift_users', JSON.stringify(users));
        console.log('✅ Default admin user created: admin@quickthrift.com / admin123');
    }
}

// Enhanced authentication check
function checkAdminAuth() {
    createDefaultAdmin(); // Ensure admin exists
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isAdmin = currentUser.email && (
        currentUser.role === 'admin' || 
        currentUser.email === 'admin@quickthrift.com'
    );
    
    if (!isAdmin) {
        console.log('🚫 Admin access denied for:', currentUser.email || 'anonymous');
        return false;
    }
    
    console.log('✅ Admin access granted for:', currentUser.email);
    return true;
}

// Add admin navigation dynamically
function addAdminNavigationIfAuthorized() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isAdmin = currentUser.role === 'admin' || currentUser.email === 'admin@quickthrift.com';
    
    if (isAdmin) {
        // Add admin link to main navigation
        const navList = document.querySelector('.nav-list');
        if (navList) {
            const adminLink = document.createElement('li');
            adminLink.innerHTML = `<a href="admin.html" class="nav-link admin-access">⚙️ Admin</a>`;
            navList.appendChild(adminLink);
        }
        
        // Add admin quick access button to header icons
        const headerIcons = document.querySelector('.header-icons');
        if (headerIcons) {
            const adminBtn = document.createElement('button');
            adminBtn.className = 'icon-btn admin-btn';
            adminBtn.innerHTML = `
                <i class="fa-solid fa-cog" aria-hidden="true"></i>
                <span class="admin-label">Admin</span>
            `;
            adminBtn.onclick = () => window.location.href = 'admin.html';
            headerIcons.insertBefore(adminBtn, headerIcons.firstChild);
        }
    }
}

/**
 * Event Listeners Setup
 */
function initializeEventListeners() {
    // Form submissions
    if (elements.addProductForm) {
        elements.addProductForm.addEventListener('submit', handleAddProduct);
    }
    
    // Category change handler
    if (elements.mainCategory) {
        elements.mainCategory.addEventListener('change', updateSubcategories);
    }
    
    // Search and filters
    if (elements.productSearch) {
        elements.productSearch.addEventListener('input', debounce(searchProducts, 300));
    }
    
    if (elements.categoryFilterAdmin) {
        elements.categoryFilterAdmin.addEventListener('change', filterProducts);
    }
    
    if (elements.statusFilter) {
        elements.statusFilter.addEventListener('change', filterProducts);
    }
    
    // Navigation clicks
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            scrollToSection(sectionId);
        });
    });
    
    // Modal close on backdrop click
    if (elements.addProductModal) {
        elements.addProductModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAddProductModal();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

/**
 * Mobile Menu Setup
 */
function setupMobileMenu() {
    if (elements.mobileMenuBtn && elements.nav) {
        elements.mobileMenuBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            elements.nav.classList.toggle('nav-open');
            document.body.classList.toggle('nav-open');
        });
    }
}

/**
 * Initialize Category Dropdowns
 */
function initializeCategoryDropdowns() {
    if (elements.mainCategory) {
        elements.mainCategory.innerHTML = '<option value="" disabled selected>Select a main category</option>';
        Object.keys(ADMIN_CONFIG.categories).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            elements.mainCategory.appendChild(option);
        });
    }
}

/**
 * Update Subcategories based on Main Category
 */
function updateSubcategories() {
    const mainCategory = elements.mainCategory.value;
    const subCategories = ADMIN_CONFIG.categories[mainCategory] || [];
    
    if (elements.subCategory) {
        elements.subCategory.innerHTML = '<option value="" disabled selected>Select a subcategory</option>';
        subCategories.forEach(subCat => {
            const option = document.createElement('option');
            option.value = subCat;
            option.textContent = subCat;
            elements.subCategory.appendChild(option);
        });
    }
}

/**
 * Dashboard Data Loading
 */
async function loadDashboardData() {
    showLoading(true);
    
    try {
        // Load all data in parallel
        const [products, orders, users] = await Promise.all([
            fetchProducts(),
            fetchOrders(),
            fetchUsers()
        ]);
        
        adminState.products = products;
        adminState.orders = orders;
        adminState.users = users;
        
        // Update dashboard stats
        updateDashboardStats();
        
        // Render data
        renderProducts();
        renderOrders();
        renderUsers();
        
    } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        showNotification('Error loading dashboard data', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * API Calls
 */
async function fetchProducts() {
    try {
        const response = await fetch(`${ADMIN_CONFIG.apiBase}/products`);
        if (response.ok) {
            return await response.json();
        }
        return getMockProducts();
    } catch (error) {
        console.log('Using mock data for products');
        return getMockProducts();
    }
}

async function fetchOrders() {
    try {
        const response = await fetch(`${ADMIN_CONFIG.apiBase}/orders`);
        if (response.ok) {
            return await response.json();
        }
        return getMockOrders();
    } catch (error) {
        console.log('Using mock data for orders');
        return getMockOrders();
    }
}

async function fetchUsers() {
    try {
        const response = await fetch(`${ADMIN_CONFIG.apiBase}/users`);
        if (response.ok) {
            return await response.json();
        }
        return getMockUsers();
    } catch (error) {
        console.log('Using mock data for users');
        return getMockUsers();
    }
}

/**
 * Mock Data for Development
 */
function getMockProducts() {
    return [
        {
            id: 1,
            name: 'Vintage Denim Jacket',
            category: 'Women',
            subcategory: 'Outerwear',
            price: 24.99,
            originalPrice: 45.00,
            condition: 'Excellent',
            status: 'Active',
            image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=200',
            added: '2025-01-10'
        },
        {
            id: 2,
            name: 'Classic White Sneakers',
            category: 'Shoes',
            subcategory: 'Sneakers',
            price: 18.99,
            originalPrice: 35.00,
            condition: 'Very Good',
            status: 'Active',
            image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200',
            added: '2025-01-12'
        },
        {
            id: 3,
            name: 'Rainbow T-shirt',
            category: 'Kids',
            subcategory: 'Tops',
            price: 8.99,
            originalPrice: 15.99,
            condition: 'Like New',
            status: 'Active',
            image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=200',
            added: '2025-01-13'
        }
    ];
}

function getMockOrders() {
    return [
        {
            id: 'ORD-001',
            customer: 'Jane Smith',
            email: 'jane@example.com',
            items: 2,
            total: 43.98,
            status: 'Pending',
            date: '2025-01-14'
        },
        {
            id: 'ORD-002',
            customer: 'John Doe',
            email: 'john@example.com',
            items: 1,
            total: 18.99,
            status: 'Completed',
            date: '2025-01-13'
        }
    ];
}

function getMockUsers() {
    return [
        {
            id: 1,
            name: 'Jane Smith',
            email: 'jane@example.com',
            joinDate: '2024-12-15',
            orders: 3,
            status: 'Active'
        },
        {
            id: 2,
            name: 'John Doe',
            email: 'john@example.com',
            joinDate: '2025-01-05',
            orders: 1,
            status: 'Active'
        }
    ];
}

/**
 * Dashboard Stats Update
 */
function updateDashboardStats() {
    if (elements.totalProducts) {
        elements.totalProducts.textContent = adminState.products.length;
    }
    
    if (elements.totalOrders) {
        elements.totalOrders.textContent = adminState.orders.length;
    }
    
    if (elements.totalUsers) {
        elements.totalUsers.textContent = adminState.users.length;
    }
    
    if (elements.totalRevenue) {
        const revenue = adminState.orders.reduce((sum, order) => sum + order.total, 0);
        elements.totalRevenue.textContent = `$${revenue.toFixed(2)}`;
    }
}

/**
 * Product Management
 */
function renderProducts() {
    if (!elements.productsList) return;
    
    elements.productsList.innerHTML = '';
    
    adminState.products.forEach(product => {
        const row = createProductRow(product);
        elements.productsList.appendChild(row);
    });
}

function createProductRow(product) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <img src="${product.image}" alt="${product.name}" class="product-thumb" loading="lazy">
        </td>
        <td>
            <div class="product-name">${product.name}</div>
            <div class="product-condition">${product.condition}</div>
        </td>
        <td>
            <span class="category-badge">${product.category}</span>
            <small>${product.subcategory}</small>
        </td>
        <td>
            <span class="price-current">$${product.price}</span>
            ${product.originalPrice ? `<span class="price-original">$${product.originalPrice}</span>` : ''}
        </td>
        <td>
            <span class="status-badge status-${product.status.toLowerCase()}">${product.status}</span>
        </td>
        <td>${formatDate(product.added)}</td>
        <td>
            <div class="action-buttons">
                <button class="btn-icon edit" onclick="editProduct(${product.id})" title="Edit">✏️</button>
                <button class="btn-icon delete" onclick="deleteProduct(${product.id})" title="Delete">🗑️</button>
                <button class="btn-icon toggle" onclick="toggleProductStatus(${product.id})" title="Toggle Status">👁️</button>
            </div>
        </td>
    `;
    return row;
}

/**
 * Product Actions
 */
function showAddProductModal() {
    if (elements.addProductModal) {
        elements.addProductModal.style.display = 'flex';
        elements.addProductModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        const firstInput = elements.addProductModal.querySelector('input[type="text"]');
        if (firstInput) firstInput.focus();
    }
}

function closeAddProductModal() {
    if (elements.addProductModal) {
        elements.addProductModal.style.display = 'none';
        elements.addProductModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Reset form
        if (elements.addProductForm) {
            elements.addProductForm.reset();
        }
    }
}

async function handleAddProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(elements.addProductForm);
    const productData = {
        name: formData.get('product-name'),
        brand: formData.get('product-brand'),
        category: formData.get('main-category'),
        subcategory: formData.get('sub-category'),
        size: formData.get('product-size'),
        condition: formData.get('product-condition'),
        price: parseFloat(formData.get('product-price')),
        originalPrice: parseFloat(formData.get('original-price')) || null,
        description: formData.get('product-description'),
        status: 'Active',
        added: new Date().toISOString().split('T')[0]
    };
    
    // Validate required fields
    if (!productData.name || !productData.category || !productData.subcategory || !productData.price || !productData.condition) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        // Handle image upload (mock for now)
        const imageFile = formData.get('product-image');
        if (imageFile && imageFile.size > 0) {
            productData.image = await handleImageUpload(imageFile);
        } else {
            productData.image = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200';
        }
        
        // Add to local state (in real app, would POST to API)
        productData.id = Date.now();
        adminState.products.unshift(productData);
        
        // Update UI
        renderProducts();
        updateDashboardStats();
        closeAddProductModal();
        
        showNotification('Product added successfully!', 'success');
        
    } catch (error) {
        console.error('❌ Error adding product:', error);
        showNotification('Error adding product', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleImageUpload(file) {
    // Mock image upload - in real app would upload to cloud storage
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

function editProduct(id) {
    const product = adminState.products.find(p => p.id === id);
    if (product) {
        // Populate form with product data
        showAddProductModal();
        
        // Fill form fields
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-brand').value = product.brand || '';
        document.getElementById('main-category').value = product.category;
        updateSubcategories();
        document.getElementById('sub-category').value = product.subcategory;
        document.getElementById('product-size').value = product.size || '';
        document.getElementById('product-condition').value = product.condition;
        document.getElementById('product-price').value = product.price;
        document.getElementById('original-price').value = product.originalPrice || '';
        document.getElementById('product-description').value = product.description || '';
        
        // Update form to edit mode
        elements.addProductForm.dataset.editId = id;
        elements.addProductModal.querySelector('h2').textContent = 'Edit Product';
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        adminState.products = adminState.products.filter(p => p.id !== id);
        renderProducts();
        updateDashboardStats();
        showNotification('Product deleted successfully', 'success');
    }
}

function toggleProductStatus(id) {
    const product = adminState.products.find(p => p.id === id);
    if (product) {
        product.status = product.status === 'Active' ? 'Inactive' : 'Active';
        renderProducts();
        showNotification(`Product ${product.status.toLowerCase()}`, 'success');
    }
}

/**
 * Search and Filter Functions
 */
function searchProducts() {
    const searchTerm = elements.productSearch.value.toLowerCase();
    const filteredProducts = adminState.products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.subcategory.toLowerCase().includes(searchTerm)
    );
    renderFilteredProducts(filteredProducts);
}

function filterProducts() {
    const categoryFilter = elements.categoryFilterAdmin.value;
    const statusFilter = elements.statusFilter.value;
    
    let filteredProducts = adminState.products;
    
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
    }
    
    if (statusFilter) {
        filteredProducts = filteredProducts.filter(p => p.status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    renderFilteredProducts(filteredProducts);
}

function renderFilteredProducts(products) {
    if (!elements.productsList) return;
    
    elements.productsList.innerHTML = '';
    products.forEach(product => {
        const row = createProductRow(product);
        elements.productsList.appendChild(row);
    });
}

/**
 * Order Management
 */
function renderOrders() {
    const ordersList = document.getElementById('orders-list');
    if (!ordersList) return;
    
    ordersList.innerHTML = '';
    
    adminState.orders.forEach(order => {
        const row = createOrderRow(order);
        ordersList.appendChild(row);
    });
    
    updateOrderStats();
}

function createOrderRow(order) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><code>${order.id}</code></td>
        <td>
            <div class="customer-info">
                <div class="customer-name">${order.customer}</div>
                <div class="customer-email">${order.email}</div>
            </div>
        </td>
        <td>${order.items}</td>
        <td>$${order.total.toFixed(2)}</td>
        <td>
            <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
        </td>
        <td>${formatDate(order.date)}</td>
        <td>
            <div class="action-buttons">
                <button class="btn-icon view" onclick="viewOrder('${order.id}')" title="View Details">👁️</button>
                <button class="btn-icon edit" onclick="updateOrderStatus('${order.id}')" title="Update Status">✏️</button>
            </div>
        </td>
    `;
    return row;
}

function updateOrderStats() {
    const pendingOrders = adminState.orders.filter(o => o.status === 'Pending').length;
    const completedOrders = adminState.orders.filter(o => o.status === 'Completed').length;
    
    const pendingElement = document.getElementById('pending-orders');
    const completedElement = document.getElementById('completed-orders');
    
    if (pendingElement) pendingElement.textContent = pendingOrders;
    if (completedElement) completedElement.textContent = completedOrders;
}

/**
 * Enhanced User Management with Admin-Only Creation
 */
function renderUsers() {
    const usersList = document.getElementById('users-list');
    if (!usersList) return;
    
    usersList.innerHTML = '';
    
    // Add "Create User" button at the top
    const createUserButton = document.createElement('div');
    createUserButton.className = 'admin-section-header';
    createUserButton.innerHTML = `
        <h3>User Management</h3>
        <button class="btn-primary" onclick="showCreateUserModal()">
            <i class="fas fa-plus"></i> Create New User
        </button>
    `;
    usersList.parentElement.insertBefore(createUserButton, usersList);
    
    adminState.users.forEach(user => {
        const row = createUserRow(user);
        usersList.appendChild(row);
    });
    
    updateUserStats();
}

function createUserRow(user) {
    const row = document.createElement('tr');
    const mustChangePassword = user.must_change_password ? ' (Must Change Password)' : '';
    const roleClass = user.role === 'admin' ? 'role-admin' : 'role-user';
    
    row.innerHTML = `
        <td>${user.name || user.username}</td>
        <td>${user.email}</td>
        <td>
            <span class="role-badge ${roleClass}">${user.role || 'user'}</span>
            ${mustChangePassword ? '<span class="password-warning">⚠️</span>' : ''}
        </td>
        <td>${formatDate(user.joinDate || user.created_at)}</td>
        <td>${user.orders || 0}</td>
        <td>
            <span class="status-badge status-${(user.status || 'active').toLowerCase()}">${user.status || 'Active'}</span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="btn-icon view" onclick="viewUser(${user.id})" title="View Profile">👁️</button>
                <button class="btn-icon edit" onclick="editUser(${user.id})" title="Edit User">✏️</button>
                ${user.must_change_password ? 
                    '<button class="btn-icon reset" onclick="resetUserPassword(' + user.id + ')" title="Reset Password">🔑</button>' : 
                    ''
                }
            </div>
        </td>
    `;
    return row;
}

// Show Create User Modal
function showCreateUserModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'create-user-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Create New User</h2>
                <button class="close-btn" onclick="closeCreateUserModal()">&times;</button>
            </div>
            <form id="create-user-form" onsubmit="createNewUser(event)">
                <div class="form-group">
                    <label for="new-username">Username *</label>
                    <input type="text" id="new-username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="new-email">Email *</label>
                    <input type="email" id="new-email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="new-role">Role *</label>
                    <select id="new-role" name="role" required>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="modal-note">
                    <p><strong>Note:</strong> User will be created with temporary password "TempPass123!" and must change it on first login.</p>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="closeCreateUserModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Create User</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeCreateUserModal() {
    const modal = document.getElementById('create-user-modal');
    if (modal) {
        modal.remove();
    }
}

// Create New User (Admin Only)
async function createNewUser(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        role: formData.get('role')
    };
    
    try {
        showLoading('Creating user...');
        
        const response = await fetch(`${ADMIN_CONFIG.apiBase}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Admin ' + getCurrentUser().email // Simple auth for demo
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create user');
        }
        
        const newUser = await response.json();
        
        // Add to local state
        adminState.users.push(newUser);
        renderUsers();
        closeCreateUserModal();
        
        showNotification(`User "${newUser.username}" created successfully! Temporary password: TempPass123!`, 'success');
        
    } catch (error) {
        console.error('Error creating user:', error);
        showNotification(`Error creating user: ${error.message}`, 'error');
    } finally {
        hideLoading();
    }
}

// Reset User Password
async function resetUserPassword(userId) {
    if (!confirm('Reset password for this user? They will need to change it on next login.')) {
        return;
    }
    
    try {
        showLoading('Resetting password...');
        
        const response = await fetch(`${ADMIN_CONFIG.apiBase}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Admin ' + getCurrentUser().email
            },
            body: JSON.stringify({
                password: 'TempPass123!',
                must_change_password: true
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to reset password');
        }
        
        // Update local state
        const userIndex = adminState.users.findIndex(u => u.id === userId);
        if (userIndex >= 0) {
            adminState.users[userIndex].must_change_password = true;
            renderUsers();
        }
        
        showNotification('Password reset successfully! New temporary password: TempPass123!', 'success');
        
    } catch (error) {
        console.error('Error resetting password:', error);
        showNotification(`Error resetting password: ${error.message}`, 'error');
    } finally {
        hideLoading();
    }
}

// Get current user (admin)
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
}

/**
 * Navigation Functions
 */
function viewOrders() {
    scrollToSection('orders');
}

function manageUsers() {
    scrollToSection('users');
}

function viewAnalytics() {
    scrollToSection('analytics');
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[href="#${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');
    }
}

/**
 * Utility Functions
 */
function showLoading(show) {
    if (elements.loadingOverlay) {
        elements.loadingOverlay.style.display = show ? 'flex' : 'none';
        elements.loadingOverlay.setAttribute('aria-hidden', !show);
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function handleKeyboardNavigation(e) {
    // ESC key to close modals
    if (e.key === 'Escape') {
        if (elements.addProductModal && elements.addProductModal.style.display === 'flex') {
            closeAddProductModal();
        }
    }
}

/**
 * Placeholder functions for actions that need implementation
 */
function viewOrder(orderId) {
    alert(`View order details for ${orderId} - Feature coming soon!`);
}

function updateOrderStatus(orderId) {
    const order = adminState.orders.find(o => o.id === orderId);
    if (order) {
        order.status = order.status === 'Pending' ? 'Completed' : 'Pending';
        renderOrders();
        showNotification(`Order ${orderId} status updated`, 'success');
    }
}

function viewUser(userId) {
    alert(`View user profile for user ${userId} - Feature coming soon!`);
}

function editUser(userId) {
    alert(`Edit user ${userId} - Feature coming soon!`);
}

// Export for global access
window.AdminPanel = {
    showAddProductModal,
    closeAddProductModal,
    viewOrders,
    manageUsers,
    viewAnalytics,
    editProduct,
    deleteProduct,
    toggleProductStatus,
    viewOrder,
    updateOrderStatus,
    viewUser,
    editUser
};

console.log('📊 Admin Panel JavaScript loaded successfully');
