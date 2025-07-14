// QuickThrift E-commerce Functionality
class QuickThriftStore {
    constructor() {
        this.products = [];
        this.cart = JSON.parse(localStorage.getItem('quickthrift_cart') || '[]');
        this.wishlist = JSON.parse(localStorage.getItem('quickthrift_wishlist') || '[]');
        this.currentUser = null;
        this.filters = {
            category: [],
            color: [],
            size: [],
            brand: [],
            priceRange: [0, 100]
        };
        
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.updateCartUI();
        this.updateWishlistUI();
        this.setupEventListeners();
        this.checkAuthStatus();
        this.renderProducts();
    }

    // Product Management
    async loadProducts() {
        // Sample products for demo - in production, load from backend
        this.products = [
            {
                id: 1,
                name: "Vintage Leather Jacket",
                price: 89.99,
                originalPrice: 149.99,
                category: "jackets",
                brand: "premium",
                color: "brown",
                sizes: ["S", "M", "L"],
                image: "demo1.jpeg",
                images: ["demo1.jpeg", "demo2.jpeg"],
                description: "Classic vintage leather jacket in excellent condition",
                condition: "Very Good",
                rating: 4.8,
                reviews: 23,
                inStock: true,
                featured: true
            },
            {
                id: 2,
                name: "Designer Silk Blouse",
                price: 45.99,
                originalPrice: 89.99,
                category: "shirts",
                brand: "premium",
                color: "blue",
                sizes: ["XS", "S", "M"],
                image: "demo2.jpeg",
                images: ["demo2.jpeg", "demo1.jpeg"],
                description: "Elegant silk blouse from luxury brand",
                condition: "Excellent",
                rating: 4.9,
                reviews: 31,
                inStock: true,
                featured: false
            },
            {
                id: 3,
                name: "Retro Wool Coat",
                price: 65.99,
                originalPrice: 120.00,
                category: "coats",
                brand: "quickthrift",
                color: "grey",
                sizes: ["M", "L", "XL"],
                image: "demo3.jpeg",
                images: ["demo3.jpeg", "demo1.jpeg"],
                description: "Warm wool coat perfect for winter",
                condition: "Good",
                rating: 4.6,
                reviews: 18,
                inStock: true,
                featured: true
            },
            {
                id: 4,
                name: "Vintage Band T-Shirt",
                price: 24.99,
                originalPrice: 39.99,
                category: "shirts",
                brand: "quickthrift",
                color: "black",
                sizes: ["S", "M", "L", "XL"],
                image: "demo1.jpeg",
                images: ["demo1.jpeg"],
                description: "Authentic vintage band merchandise",
                condition: "Very Good",
                rating: 4.7,
                reviews: 45,
                inStock: true,
                featured: false
            },
            {
                id: 5,
                name: "Designer Denim Jacket",
                price: 55.99,
                originalPrice: 98.00,
                category: "jackets",
                brand: "premium",
                color: "blue",
                sizes: ["S", "M", "L"],
                image: "demo2.jpeg",
                images: ["demo2.jpeg", "demo3.jpeg"],
                description: "Premium denim jacket with unique distressing",
                condition: "Excellent",
                rating: 4.8,
                reviews: 27,
                inStock: false,
                featured: true
            },
            {
                id: 6,
                name: "Casual Cotton Shirt",
                price: 18.99,
                originalPrice: 35.00,
                category: "shirts",
                brand: "quickthrift",
                color: "white",
                sizes: ["XS", "S", "M", "L", "XL"],
                image: "demo3.jpeg",
                images: ["demo3.jpeg"],
                description: "Comfortable cotton shirt for everyday wear",
                condition: "Good",
                rating: 4.4,
                reviews: 12,
                inStock: true,
                featured: false
            }
        ];
    }

    // Product Rendering
    renderProducts(productsToRender = null) {
        const products = productsToRender || this.getFilteredProducts();
        const productGrid = document.getElementById('product-grid');
        
        if (!productGrid) return;

        if (products.length === 0) {
            productGrid.innerHTML = `
                <div class="no-products">
                    <i class="fa-solid fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            `;
            return;
        }

        productGrid.innerHTML = products.map(product => this.createProductCard(product)).join('');
    }

    createProductCard(product) {
        const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        const isInWishlist = this.wishlist.includes(product.id);
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image" onclick="openProductModal(${product.id})">
                    ${product.featured ? '<span class="product-badge featured">Featured</span>' : ''}
                    ${discountPercent > 0 ? `<span class="product-badge discount">-${discountPercent}%</span>` : ''}
                    ${!product.inStock ? '<span class="product-badge out-of-stock">Out of Stock</span>' : ''}
                    
                    <div class="product-actions">
                        <button class="action-btn wishlist-btn ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(${product.id})" title="${isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}">
                            <i class="fa-solid fa-heart"></i>
                        </button>
                        <button class="action-btn quick-view-btn" onclick="openProductModal(${product.id})" title="Quick view">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        ${product.inStock ? 
                            `<button class="action-btn add-to-cart-btn" onclick="addToCart(${product.id})" title="Add to cart">
                                <i class="fa-solid fa-shopping-bag"></i>
                            </button>` : ''
                        }
                    </div>
                </div>
                
                <div class="product-info">
                    <div class="product-rating">
                        <div class="stars">
                            ${this.renderStars(product.rating)}
                        </div>
                        <span class="review-count">(${product.reviews})</span>
                    </div>
                    
                    <h3 class="product-name" onclick="openProductModal(${product.id})">${product.name}</h3>
                    
                    <div class="product-condition">
                        <span class="condition-label">Condition:</span>
                        <span class="condition-value">${product.condition}</span>
                    </div>
                    
                    <div class="product-pricing">
                        <span class="current-price">$${product.price}</span>
                        ${product.originalPrice > product.price ? 
                            `<span class="original-price">$${product.originalPrice}</span>` : ''
                        }
                    </div>
                    
                    <div class="product-sizes">
                        <span class="sizes-label">Sizes:</span>
                        <div class="size-options">
                            ${product.sizes.map(size => `<span class="size-option">${size}</span>`).join('')}
                        </div>
                    </div>
                    
                    ${product.inStock ? 
                        `<button class="btn btn-primary add-to-cart-main" onclick="addToCart(${product.id})">
                            Add to Cart
                        </button>` :
                        `<button class="btn btn-disabled" disabled>Out of Stock</button>`
                    }
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fa-solid fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fa-solid fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="fa-regular fa-star"></i>';
        }
        
        return stars;
    }

    // Cart Management
    addToCart(productId, size = null) {
        const product = this.products.find(p => p.id === productId);
        if (!product || !product.inStock) {
            this.showNotification('Product is not available', 'error');
            return;
        }

        const existingItem = this.cart.find(item => item.id === productId && item.size === size);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                size: size || product.sizes[0],
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${product.name} added to cart!`, 'success');
        
        // Show mini cart for 3 seconds
        this.showMiniCart();
    }

    removeFromCart(productId, size = null) {
        this.cart = this.cart.filter(item => !(item.id === productId && item.size === size));
        this.saveCart();
        this.updateCartUI();
        this.updateCartSidebar();
    }

    updateCartQuantity(productId, size, quantity) {
        const item = this.cart.find(item => item.id === productId && item.size === size);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId, size);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartUI();
                this.updateCartSidebar();
            }
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('quickthrift_cart', JSON.stringify(this.cart));
    }

    updateCartUI() {
        const cartCount = document.getElementById('bag-count');
        if (cartCount) {
            cartCount.textContent = this.getCartItemCount();
        }
    }

    // Wishlist Management
    toggleWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        const product = this.products.find(p => p.id === productId);
        
        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.showNotification(`${product.name} removed from wishlist`, 'info');
        } else {
            this.wishlist.push(productId);
            this.showNotification(`${product.name} added to wishlist!`, 'success');
        }
        
        this.saveWishlist();
        this.updateWishlistUI();
        this.renderProducts(); // Re-render to update wishlist buttons
    }

    saveWishlist() {
        localStorage.setItem('quickthrift_wishlist', JSON.stringify(this.wishlist));
    }

    updateWishlistUI() {
        const wishlistCount = document.getElementById('wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = this.wishlist.length;
        }
    }

    // Filtering and Search
    getFilteredProducts() {
        let filtered = [...this.products];

        // Category filter
        if (this.filters.category.length > 0) {
            filtered = filtered.filter(product => 
                this.filters.category.includes(product.category)
            );
        }

        // Color filter
        if (this.filters.color.length > 0) {
            filtered = filtered.filter(product => 
                this.filters.color.includes(product.color)
            );
        }

        // Size filter
        if (this.filters.size.length > 0) {
            filtered = filtered.filter(product => 
                product.sizes.some(size => this.filters.size.includes(size.toLowerCase()))
            );
        }

        // Brand filter
        if (this.filters.brand.length > 0) {
            filtered = filtered.filter(product => 
                this.filters.brand.includes(product.brand)
            );
        }

        // Price filter
        filtered = filtered.filter(product => 
            product.price >= this.filters.priceRange[0] && 
            product.price <= this.filters.priceRange[1]
        );

        return filtered;
    }

    searchProducts(query) {
        if (!query.trim()) {
            this.renderProducts();
            return;
        }

        const searchResults = this.products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()) ||
            product.brand.toLowerCase().includes(query.toLowerCase())
        );

        this.renderProducts(searchResults);
    }

    // Event Listeners
    setupEventListeners() {
        // Filter checkboxes
        document.querySelectorAll('input[name="category"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateFilters());
        });

        document.querySelectorAll('input[name="size"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateFilters());
        });

        document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateFilters());
        });

        // Color swatches
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', () => this.toggleColorFilter(swatch));
        });

        // Price slider
        const priceSlider = document.getElementById('price-slider');
        if (priceSlider) {
            priceSlider.addEventListener('input', () => this.updatePriceFilter());
        }

        // Sort dropdown
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => this.sortProducts());
        }

        // Search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchProducts(e.target.value));
        }

        // Mobile menu
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
    }

    updateFilters() {
        // Update category filters
        this.filters.category = Array.from(document.querySelectorAll('input[name="category"]:checked'))
            .map(cb => cb.value);

        // Update size filters
        this.filters.size = Array.from(document.querySelectorAll('input[name="size"]:checked'))
            .map(cb => cb.value);

        // Update brand filters
        this.filters.brand = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
            .map(cb => cb.value);

        this.renderProducts();
    }

    toggleColorFilter(swatch) {
        const color = swatch.getAttribute('data-color');
        swatch.classList.toggle('active');
        
        if (swatch.classList.contains('active')) {
            if (!this.filters.color.includes(color)) {
                this.filters.color.push(color);
            }
        } else {
            this.filters.color = this.filters.color.filter(c => c !== color);
        }

        this.renderProducts();
    }

    updatePriceFilter() {
        const slider = document.getElementById('price-slider');
        const display = document.querySelector('.price-display');
        
        if (slider && display) {
            const maxPrice = parseInt(slider.value);
            this.filters.priceRange = [0, maxPrice];
            display.textContent = `$0 - $${maxPrice}`;
            this.renderProducts();
        }
    }

    sortProducts() {
        const sortSelect = document.getElementById('sort-select');
        const sortValue = sortSelect.value;
        
        let sorted = [...this.getFilteredProducts()];
        
        switch (sortValue) {
            case 'price-low':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // Default sorting - featured first, then by id
                sorted.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return a.id - b.id;
                });
        }
        
        this.renderProducts(sorted);
    }

    // UI Helpers
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    showMiniCart() {
        const miniCart = document.createElement('div');
        miniCart.className = 'mini-cart';
        miniCart.innerHTML = `
            <div class="mini-cart-content">
                <i class="fa-solid fa-check-circle"></i>
                <span>Item added to cart!</span>
                <button onclick="openCart()" class="btn btn-sm">View Cart</button>
            </div>
        `;
        
        document.body.appendChild(miniCart);
        
        setTimeout(() => {
            miniCart.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            miniCart.remove();
        }, 3000);
    }

    checkAuthStatus() {
        // Check if user is logged in and update UI accordingly
        const authToken = localStorage.getItem('quickthrift_auth_token');
        const userData = localStorage.getItem('quickthrift_user_data');
        
        if (authToken && userData) {
            this.currentUser = JSON.parse(userData);
            this.updateAuthUI();
        }
    }

    updateAuthUI() {
        const accountUserInfo = document.getElementById('account-user-info');
        const signInLink = document.getElementById('sign-in-link');
        const signUpLink = document.getElementById('sign-up-link');
        const profileLink = document.getElementById('profile-link');
        const ordersLink = document.getElementById('orders-link');
        const signoutLink = document.getElementById('signout-link');

        if (this.currentUser) {
            if (accountUserInfo) {
                accountUserInfo.innerHTML = `
                    <div class="user-avatar">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <div class="user-details">
                        <span class="user-name">${this.currentUser.username || this.currentUser.email}</span>
                        <span class="user-email">${this.currentUser.email}</span>
                    </div>
                `;
            }
            
            if (signInLink) signInLink.style.display = 'none';
            if (signUpLink) signUpLink.style.display = 'none';
            if (profileLink) profileLink.style.display = 'block';
            if (ordersLink) ordersLink.style.display = 'block';
            if (signoutLink) signoutLink.style.display = 'block';
        }
    }

    toggleMobileMenu() {
        const nav = document.querySelector('.main-nav');
        const toggle = document.getElementById('mobile-menu-toggle');
        
        nav.classList.toggle('active');
        toggle.setAttribute('aria-expanded', nav.classList.contains('active'));
    }
}

// Global functions for onclick handlers
function toggleSearch() {
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    
    searchOverlay.classList.toggle('active');
    
    if (searchOverlay.classList.contains('active')) {
        searchInput.focus();
    }
}

function toggleAccountMenu() {
    const accountMenu = document.getElementById('account-menu');
    accountMenu.classList.toggle('active');
}

function openCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.classList.add('cart-open');
    
    // Update cart sidebar content
    window.quickThriftStore.updateCartSidebar();
}

function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.classList.remove('cart-open');
}

function openWishlist() {
    // For now, just show notification - could open wishlist page
    window.quickThriftStore.showNotification('Wishlist feature - coming soon!', 'info');
}

function addToCart(productId) {
    window.quickThriftStore.addToCart(productId);
}

function toggleWishlist(productId) {
    window.quickThriftStore.toggleWishlist(productId);
}

function searchFor(query) {
    const searchInput = document.getElementById('search-input');
    searchInput.value = query;
    window.quickThriftStore.searchProducts(query);
    toggleSearch();
}

function openProductModal(productId) {
    const product = window.quickThriftStore.products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-body');
    
    const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const isInWishlist = window.quickThriftStore.wishlist.includes(product.id);

    modalBody.innerHTML = `
        <div class="modal-product">
            <div class="modal-product-image">
                <img src="${product.image}" alt="${product.name}" id="modal-main-image">
                <div class="modal-image-thumbnails">
                    ${product.images.map((img, index) => `
                        <img src="${img}" alt="${product.name}" 
                             class="thumbnail ${index === 0 ? 'active' : ''}"
                             onclick="changeModalImage('${img}')">
                    `).join('')}
                </div>
            </div>
            <div class="modal-product-info">
                <div class="modal-product-header">
                    <h2 class="modal-product-name">${product.name}</h2>
                    <button class="modal-wishlist-btn ${isInWishlist ? 'active' : ''}" 
                            onclick="toggleWishlist(${product.id})">
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
                
                <div class="modal-product-rating">
                    <div class="stars">${window.quickThriftStore.renderStars(product.rating)}</div>
                    <span class="review-count">(${product.reviews} reviews)</span>
                </div>
                
                <div class="modal-product-pricing">
                    <span class="current-price">$${product.price}</span>
                    ${product.originalPrice > product.price ? 
                        `<span class="original-price">$${product.originalPrice}</span>
                         <span class="discount-badge">Save ${discountPercent}%</span>` : ''
                    }
                </div>
                
                <div class="modal-product-condition">
                    <span class="condition-label">Condition:</span>
                    <span class="condition-value">${product.condition}</span>
                </div>
                
                <p class="modal-product-description">${product.description}</p>
                
                <div class="modal-size-selection">
                    <label>Select Size:</label>
                    <div class="size-options-modal">
                        ${product.sizes.map(size => `
                            <button class="size-option-btn" onclick="selectSize('${size}')">
                                ${size}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="modal-actions">
                    ${product.inStock ? 
                        `<button class="btn btn-primary btn-large" onclick="addToCartFromModal(${product.id})">
                            Add to Cart - $${product.price}
                        </button>` :
                        `<button class="btn btn-disabled btn-large" disabled>
                            Out of Stock
                        </button>`
                    }
                    <button class="btn btn-outline" onclick="toggleWishlist(${product.id})">
                        ${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </button>
                </div>
                
                <div class="modal-product-features">
                    <div class="feature">
                        <i class="fa-solid fa-truck"></i>
                        <span>Free shipping on orders over $50</span>
                    </div>
                    <div class="feature">
                        <i class="fa-solid fa-shield-alt"></i>
                        <span>30-day return policy</span>
                    </div>
                    <div class="feature">
                        <i class="fa-solid fa-leaf"></i>
                        <span>Sustainable & eco-friendly</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

function changeModalImage(imageSrc) {
    const mainImage = document.getElementById('modal-main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    mainImage.src = imageSrc;
    
    thumbnails.forEach(thumb => {
        thumb.classList.toggle('active', thumb.src.includes(imageSrc));
    });
}

function selectSize(size) {
    const sizeButtons = document.querySelectorAll('.size-option-btn');
    sizeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.textContent.trim() === size);
    });
}

function addToCartFromModal(productId) {
    const selectedSize = document.querySelector('.size-option-btn.active')?.textContent.trim();
    window.quickThriftStore.addToCart(productId, selectedSize);
    closeProductModal();
}

function openSearch() {
    toggleSearch();
}

// Update the products count display
QuickThriftStore.prototype.updateProductsCount = function() {
    const productsCount = document.getElementById('products-count');
    if (productsCount) {
        const filtered = this.getFilteredProducts();
        productsCount.textContent = `Showing ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;
    }
};

// Override the renderProducts method to update count
const originalRenderProducts = QuickThriftStore.prototype.renderProducts;
QuickThriftStore.prototype.renderProducts = function(productsToRender = null) {
    originalRenderProducts.call(this, productsToRender);
    this.updateProductsCount();
};

// Enhanced cart sidebar functionality
QuickThriftStore.prototype.updateCartSidebar = function() {
    const cartContent = document.getElementById('cart-content');
    const cartEmpty = document.getElementById('cart-empty');
    const cartItems = document.getElementById('cart-items');
    const cartFooter = document.getElementById('cart-footer');
    
    if (this.cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartItems.style.display = 'none';
        cartFooter.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        cartItems.style.display = 'block';
        cartFooter.style.display = 'block';
        
        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-size">Size: ${item.size}</p>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button onclick="window.quickThriftStore.updateCartQuantity(${item.id}, '${item.size}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="window.quickThriftStore.updateCartQuantity(${item.id}, '${item.size}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item" onclick="window.quickThriftStore.removeFromCart(${item.id}, '${item.size}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        const subtotal = this.getCartTotal();
        document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `$${subtotal.toFixed(2)}`;
    }
};

// Initialize the store when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quickThriftStore = new QuickThriftStore();
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    const accountMenu = document.getElementById('account-menu');
    const accountBtn = document.querySelector('.account-btn');
    
    if (accountMenu && !accountMenu.contains(e.target) && !accountBtn.contains(e.target)) {
        accountMenu.classList.remove('active');
    }
});
