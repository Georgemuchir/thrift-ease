document.addEventListener("DOMContentLoaded", async () => {
  // API Configuration
  const API_BASE_URL = 'http://127.0.0.1:5000';
  
  // Fetch products from backend
  let allProducts = [];
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (response.ok) {
      allProducts = await response.json();
      console.log('Products loaded from backend:', allProducts.length);
    } else {
      throw new Error('Failed to fetch products');
    }
  } catch (error) {
    console.warn('Failed to load products from backend, using fallback data:', error);
    // Fallback products if backend is not available
    allProducts = [
    {
      id: 1, name: "Lace Shirt Cut II", price: 16.00, image: "demo1.jpeg",
      colors: ["#8B4513", "#DC143C", "#2F4F2F"], category: "shirts", brand: "quickthrift", sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 2, name: "Vintage Denim Jacket", price: 45.00, image: "demo2.jpeg",
      colors: ["#4A90E2", "#FF69B4", "#32CD32"], category: "jackets", brand: "premium", sizes: ["XS", "S", "M", "L"]
    },
    {
      id: 3, name: "Classic Wool Coat", price: 89.00, image: "demo3.jpeg",
      colors: ["#000000", "#9B9B9B", "#FF69B4"], category: "coats", brand: "quickthrift", sizes: ["M", "L", "XL"]
    },
    {
      id: 4, name: "Cotton Casual Shirt", price: 22.00, image: "demo1.jpeg",
      colors: ["#87CEEB", "#32CD32", "#FF69B4"], category: "shirts", brand: "premium", sizes: ["S", "M", "L"]
    },
    {
      id: 5, name: "Leather Biker Jacket", price: 125.00, image: "demo2.jpeg",
      colors: ["#000000", "#8B4513"], category: "jackets", brand: "quickthrift", sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 6, name: "Trench Coat", price: 75.00, image: "demo3.jpeg",
      colors: ["#D2B48C", "#8B4513", "#2F4F4F"], category: "coats", brand: "premium", sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
      id: 7, name: "Flannel Shirt", price: 18.00, image: "demo1.jpeg",
      colors: ["#FF0000", "#0000FF", "#008000"], category: "shirts", brand: "quickthrift", sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 8, name: "Windbreaker Jacket", price: 35.00, image: "demo2.jpeg",
      colors: ["#FFD700", "#FF69B4", "#32CD32"], category: "jackets", brand: "premium", sizes: ["M", "L", "XL"]
    },
    {
      id: 9, name: "Peacoat", price: 95.00, image: "demo3.jpeg",
      colors: ["#000080", "#8B0000", "#2F4F4F"], category: "coats", brand: "quickthrift", sizes: ["S", "M", "L"]
    },
    {
      id: 10, name: "Striped Shirt", price: 28.00, image: "demo1.jpeg",
      colors: ["#FFFFFF", "#000000", "#FF69B4"], category: "shirts", brand: "premium", sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
      id: 11, name: "Bomber Jacket", price: 65.00, image: "demo2.jpeg",
      colors: ["#228B22", "#8B4513", "#FF69B4"], category: "jackets", brand: "quickthrift", sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 12, name: "Wool Overcoat", price: 110.00, image: "demo3.jpeg",
      colors: ["#2F4F4F", "#8B4513", "#000000"], category: "coats", brand: "premium", sizes: ["M", "L", "XL"]
    }
    ]; // Close fallback products array
  } // Close try-catch block

  // State management
  let currentFilters = { category: [], brand: [], size: [], color: null, priceRange: [0, 150] };
  let currentSort = 'default', currentView = 'grid', currentPage = 1, itemsPerPage = 12;
  let cart = JSON.parse(localStorage.getItem('quickthrift-cart') || '[]');
  let wishlist = JSON.parse(localStorage.getItem('quickthrift-wishlist') || '[]');

  // Render products with filtering and sorting
  function renderProducts() {
    const productGrid = document.getElementById("product-grid");
    if (!productGrid) return;

    // Apply filters
    let filteredProducts = allProducts.filter(product => {
      if (currentFilters.category.length > 0 && !currentFilters.category.includes(product.category)) return false;
      if (currentFilters.brand.length > 0 && !currentFilters.brand.includes(product.brand)) return false;
      if (currentFilters.size.length > 0 && !currentFilters.size.some(size => product.sizes.includes(size))) return false;
      if (product.price < currentFilters.priceRange[0] || product.price > currentFilters.priceRange[1]) return false;
      if (currentFilters.color && !product.colors.some(color => color.toLowerCase().includes(currentFilters.color))) return false;
      return true;
    });

    // Apply sorting
    switch (currentSort) {
      case 'price-low': filteredProducts.sort((a, b) => a.price - b.price); break;
      case 'price-high': filteredProducts.sort((a, b) => b.price - a.price); break;
      case 'name': filteredProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    // Clear and set view
    productGrid.innerHTML = "";
    productGrid.className = currentView === 'list' ? 'products-grid list-view' : 'products-grid';

    if (currentPageProducts.length === 0) {
      productGrid.innerHTML = `
        <div class="no-products">
          <h3>No products found</h3>
          <p>Try adjusting your filters</p>
          <button onclick="clearAllFilters()" class="btn-clear-filters">Clear Filters</button>
        </div>`;
      return;
    }

    currentPageProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      
      const colorDots = product.colors.map(color => 
        `<span class="product-color-dot" style="background-color: ${color}" title="${color}"></span>`
      ).join('');
      
      const isInWishlist = wishlist.some(item => item.id === product.id);
      
      productCard.innerHTML = `
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.name}" class="product-image">
          <div class="product-overlay">
            <button class="btn-wishlist ${isInWishlist ? 'active' : ''}" data-product-id="${product.id}">
              <i class="fa-solid fa-heart"></i>
            </button>
            <button class="btn-quick-view" data-product-id="${product.id}">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <div class="product-colors">${colorDots}</div>
          <div class="product-sizes">
            ${product.sizes.map(size => `<span class="size-option">${size}</span>`).join('')}
          </div>
          <button class="btn-add-to-cart" data-product-id="${product.id}">
            <i class="fa-solid fa-shopping-bag"></i> Add to Cart
          </button>
        </div>
      `;
      
      productGrid.appendChild(productCard);
    });

    updatePagination(totalPages);
    addProductEventListeners();
  }

  // Add product event listeners
  function addProductEventListeners() {
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
      btn.addEventListener('click', handleAddToCart);
    });
    document.querySelectorAll('.btn-wishlist').forEach(btn => {
      btn.addEventListener('click', handleWishlistToggle);
    });
    document.querySelectorAll('.btn-quick-view').forEach(btn => {
      btn.addEventListener('click', handleQuickView);
    });
  }

  // Handle add to cart
  function handleAddToCart(e) {
    const productId = parseInt(e.target.closest('.btn-add-to-cart').dataset.productId);
    const product = allProducts.find(p => p.id === productId);
    
    if (product) {
      const existingItem = cart.find(item => item.id === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
      }
      
      localStorage.setItem('quickthrift-cart', JSON.stringify(cart));
      updateCartCount();
      
      const btn = e.target.closest('.btn-add-to-cart');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
      btn.style.backgroundColor = '#28a745';
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = '';
      }, 2000);

      showNotification('Product added to cart!', 'success');
    }
  }

  // Handle wishlist toggle
  function handleWishlistToggle(e) {
    const productId = parseInt(e.target.closest('.btn-wishlist').dataset.productId);
    const product = allProducts.find(p => p.id === productId);
    const btn = e.target.closest('.btn-wishlist');
    
    if (product) {
      const existingIndex = wishlist.findIndex(item => item.id === productId);
      
      if (existingIndex !== -1) {
        wishlist.splice(existingIndex, 1);
        btn.classList.remove('active');
        showNotification('Removed from wishlist', 'info');
      } else {
        wishlist.push({ id: product.id, name: product.name, price: product.price, image: product.image });
        btn.classList.add('active');
        showNotification('Added to wishlist!', 'success');
      }
      
      localStorage.setItem('quickthrift-wishlist', JSON.stringify(wishlist));
      updateWishlistCount();
    }
  }

  // Handle quick view
  function handleQuickView(e) {
    const productId = parseInt(e.target.closest('.btn-quick-view').dataset.productId);
    const product = allProducts.find(p => p.id === productId);
    if (product) showQuickViewModal(product);
  }

  // Initialize filters
  function initializeFilters() {
    // Color filters
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        if (currentFilters.color === swatch.dataset.color) {
          currentFilters.color = null;
        } else {
          swatch.classList.add('active');
          currentFilters.color = swatch.dataset.color;
        }
        currentPage = 1;
        renderProducts();
      });
    });

    // Category filters
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          currentFilters.category.push(checkbox.value);
        } else {
          currentFilters.category = currentFilters.category.filter(cat => cat !== checkbox.value);
        }
        currentPage = 1;
        renderProducts();
      });
    });

    // Brand filters
    document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          currentFilters.brand.push(checkbox.value);
        } else {
          currentFilters.brand = currentFilters.brand.filter(brand => brand !== checkbox.value);
        }
        currentPage = 1;
        renderProducts();
      });
    });

    // Size filters
    document.querySelectorAll('input[name="size"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          currentFilters.size.push(checkbox.value.toUpperCase());
        } else {
          currentFilters.size = currentFilters.size.filter(size => size !== checkbox.value.toUpperCase());
        }
        currentPage = 1;
        renderProducts();
      });
    });

    // Price slider
    const priceSlider = document.getElementById('price-slider');
    const priceDisplay = document.querySelector('.price-display');
    if (priceSlider && priceDisplay) {
      const maxPrice = Math.max(...allProducts.map(p => p.price));
      priceSlider.max = maxPrice;
      priceSlider.value = maxPrice;
      currentFilters.priceRange[1] = maxPrice;
      priceDisplay.textContent = `$0 - $${maxPrice}`;
      
      priceSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        currentFilters.priceRange[1] = value;
        priceDisplay.textContent = `$0 - $${value}`;
        
        clearTimeout(priceSlider.debounceTimeout);
        priceSlider.debounceTimeout = setTimeout(() => {
          currentPage = 1;
          renderProducts();
        }, 300);
      });
    }
  }

  // Initialize controls
  function initializeControls() {
    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentView = btn.dataset.view;
        renderProducts();
      });
    });

    // Sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
      });
    }

    // Pagination
    document.querySelector('.pagination')?.addEventListener('click', (e) => {
      if (e.target.classList.contains('pagination-btn')) {
        e.preventDefault();
        
        if (e.target.classList.contains('next')) {
          const totalPages = Math.ceil(allProducts.length / itemsPerPage);
          if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
          }
        } else if (e.target.classList.contains('prev')) {
          if (currentPage > 1) {
            currentPage--;
            renderProducts();
          }
        } else {
          const pageNum = parseInt(e.target.textContent);
          if (pageNum && pageNum !== currentPage) {
            currentPage = pageNum;
            renderProducts();
          }
        }
      }
    });
  }

  // Update pagination
  function updatePagination(totalPages) {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    if (currentPage > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'pagination-btn prev';
      prevBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
      paginationContainer.appendChild(prevBtn);
    }

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
      pageBtn.textContent = i;
      paginationContainer.appendChild(pageBtn);
    }

    if (currentPage < totalPages) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'pagination-btn next';
      nextBtn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
      paginationContainer.appendChild(nextBtn);
    }
  }

  // Initialize header functionality
  function initializeHeader() {
    // Newsletter
    document.querySelector('.newsletter-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = e.target.querySelector('.newsletter-input').value;
      if (email) {
        showNotification('Thank you for subscribing to QuickThrift updates!', 'success');
        e.target.querySelector('.newsletter-input').value = '';
      }
    });

    // Cart
    document.querySelector('.cart-btn')?.addEventListener('click', () => showCartModal());
    
    // Search
    document.querySelector('.search-btn')?.addEventListener('click', () => showSearchModal());
    
    // Wishlist
    document.querySelector('.wishlist-btn')?.addEventListener('click', () => showWishlistModal());
    
    // Account button will be handled by checkAuthStatus function

    updateCartCount();
    updateWishlistCount();
  }

  // Check user authentication status
  function checkAuthStatus() {
    // Wait for QuickThriftAuth to be available
    if (typeof QuickThriftAuth === 'undefined') {
      setTimeout(checkAuthStatus, 100);
      return;
    }
    
    if (QuickThriftAuth.isAuthenticated && QuickThriftAuth.currentUser) {
      const user = QuickThriftAuth.currentUser;
      
      // Update account button to show user info
      const accountBtn = document.querySelector('.account-btn');
      if (accountBtn) {
        accountBtn.innerHTML = `
          <i class="fa-solid fa-user"></i> 
          <span class="account-label">${user.firstName || user.name || 'Account'}</span>
        `;
        accountBtn.title = `Signed in as ${user.email}`;
        
        // Add dropdown menu for logged in user
        accountBtn.addEventListener('click', () => {
          showUserMenu(user);
        });
      }
    } else {
      // Update account button to go to sign-in
      const accountBtn = document.querySelector('.account-btn');
      if (accountBtn) {
        accountBtn.innerHTML = `
          <i class="fa-solid fa-user"></i>
          <span class="account-label">Sign In</span>
        `;
        accountBtn.addEventListener('click', () => {
          window.location.href = 'sign-in.html';
        });
      }
    }
  }

  // Show user menu dropdown
  function showUserMenu(user) {
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
      existingMenu.remove();
      return;
    }

    const userMenu = document.createElement('div');
    userMenu.className = 'user-menu';
    userMenu.innerHTML = `
      <div class="user-menu-header">
        <div class="user-avatar">
          <i class="fa-solid fa-user"></i>
        </div>
        <div class="user-info">
          <div class="user-name">${user.firstName} ${user.lastName}</div>
          <div class="user-email">${user.email}</div>
        </div>
      </div>
      <div class="user-menu-items">
        <a href="#" class="user-menu-item" onclick="showProfileModal()">
          <i class="fa-solid fa-user-edit"></i> Profile
        </a>
        <a href="#" class="user-menu-item" onclick="showOrderHistory()">
          <i class="fa-solid fa-shopping-bag"></i> Orders
        </a>
        <a href="#" class="user-menu-item" onclick="showAccountSettings()">
          <i class="fa-solid fa-cog"></i> Settings
        </a>
        <div class="user-menu-divider"></div>
        <a href="#" class="user-menu-item logout" onclick="handleLogout()">
          <i class="fa-solid fa-sign-out-alt"></i> Sign Out
        </a>
      </div>
    `;

    document.body.appendChild(userMenu);

    // Position the menu
    const accountBtn = document.querySelector('.account-btn');
    const rect = accountBtn.getBoundingClientRect();
    userMenu.style.top = `${rect.bottom + 10}px`;
    userMenu.style.right = `${window.innerWidth - rect.right}px`;

    // Close menu when clicking outside
    setTimeout(() => {
      document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target) && !accountBtn.contains(e.target)) {
          userMenu.remove();
        }
      }, { once: true });
    }, 0);
  }

  // Global functions for user menu
  window.showProfileModal = function() {
    const user = QuickThriftAuth.currentUser;
    const content = `
      <div class="profile-form">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input type="text" id="firstName" value="${user.firstName || ''}" />
        </div>
        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input type="text" id="lastName" value="${user.lastName || ''}" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" value="${user.email || ''}" />
        </div>
        <div class="form-group">
          <label for="phone">Phone</label>
          <input type="tel" id="phone" value="${user.phone || ''}" />
        </div>
        <div class="form-actions">
          <button onclick="updateProfile()">Update Profile</button>
          <button onclick="closeModal()">Cancel</button>
        </div>
      </div>
    `;
    
    const modal = createModal('Profile Settings', content);
    document.body.appendChild(modal);
    document.querySelector('.user-menu')?.remove();
  };

  window.showOrderHistory = function() {
    const content = `
      <div class="order-history">
        <p>Order history feature coming soon!</p>
        <p>You'll be able to view all your past orders here.</p>
      </div>
    `;
    
    const modal = createModal('Order History', content);
    document.body.appendChild(modal);
    document.querySelector('.user-menu')?.remove();
  };

  window.showAccountSettings = function() {
    const content = `
      <div class="account-settings">
        <div class="setting-group">
          <h3>Security</h3>
          <button onclick="changePassword()">Change Password</button>
          <button onclick="enable2FA()">Enable 2FA</button>
        </div>
        <div class="setting-group">
          <h3>Notifications</h3>
          <label><input type="checkbox" checked> Email notifications</label>
          <label><input type="checkbox" checked> SMS notifications</label>
        </div>
        <div class="setting-group">
          <h3>Privacy</h3>
          <button onclick="downloadData()">Download My Data</button>
          <button onclick="deleteAccount()" class="danger">Delete Account</button>
        </div>
      </div>
    `;
    
    const modal = createModal('Account Settings', content);
    document.body.appendChild(modal);
    document.querySelector('.user-menu')?.remove();
  };

  window.handleLogout = function() {
    QuickThriftAuth.logout();
    document.querySelector('.user-menu')?.remove();
  };

  window.updateProfile = async function() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    const result = await QuickThriftAuth.updateProfile({
      firstName, lastName, email, phone
    });

    if (result.success) {
      closeModal();
      checkAuthStatus(); // Refresh user display
    }
  };

  window.changePassword = function() {
    const currentPassword = prompt('Enter your current password:');
    const newPassword = prompt('Enter your new password:');
    const confirmPassword = prompt('Confirm your new password:');

    if (newPassword !== confirmPassword) {
      QuickThriftAuth.showNotification('Passwords do not match', 'error');
      return;
    }

    if (!QuickThriftAuth.validatePassword(newPassword)) {
      QuickThriftAuth.showNotification('Password must be at least 8 characters with uppercase, lowercase, and number', 'error');
      return;
    }

    QuickThriftAuth.showNotification('Password change feature coming soon', 'info');
  };

  window.enable2FA = function() {
    QuickThriftAuth.enableTwoFactor();
  };

  window.downloadData = function() {
    QuickThriftAuth.showNotification('Data download feature coming soon', 'info');
  };

  window.deleteAccount = function() {
    const confirm = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirm) {
      QuickThriftAuth.showNotification('Account deletion feature coming soon', 'info');
    }
  };

  // Update counts
  function updateCartCount() {
    const cartCount = document.getElementById('bag-count');
    if (cartCount) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  }

  function updateWishlistCount() {
    const wishlistCount = document.querySelector('.wishlist-btn .icon-badge');
    if (wishlistCount) {
      wishlistCount.textContent = wishlist.length;
      wishlistCount.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
  }

  // Notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fa-solid fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
      <button class="notification-close"><i class="fa-solid fa-times"></i></button>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);

    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });
  }

  // Modal functions
  function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2>${title}</h2>
          <button class="modal-close" onclick="closeModal()"><i class="fa-solid fa-times"></i></button>
        </div>
        <div class="modal-body">${content}</div>
      </div>
    `;
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    return modal;
  }

  window.closeModal = function() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.classList.add('closing');
      setTimeout(() => modal.remove(), 300);
    }
  };

  // Cart modal
  function showCartModal() {
    const content = cart.length === 0 ? `
      <div class="empty-cart">
        <i class="fa-solid fa-shopping-bag"></i>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started!</p>
      </div>
    ` : `
      <div class="cart-items">
        ${cart.map(item => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
              <h4>${item.name}</h4>
              <p>$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
              <button class="qty-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
            </div>
            <button onclick="removeFromCart(${item.id})"><i class="fa-solid fa-trash"></i></button>
          </div>
        `).join('')}
      </div>
      <div class="cart-summary">
        <div class="cart-total"><strong>Total: $${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</strong></div>
        <div class="cart-actions">
          <button onclick="closeModal()">Continue Shopping</button>
          <button>Checkout</button>
        </div>
      </div>
    `;
    
    const modal = createModal('Shopping Cart', content);
    document.body.appendChild(modal);
  }

  // Wishlist modal
  function showWishlistModal() {
    const content = wishlist.length === 0 ? `
      <div class="empty-wishlist">
        <i class="fa-solid fa-heart"></i>
        <h3>Your wishlist is empty</h3>
        <p>Save your favorite items here!</p>
      </div>
    ` : `
      <div class="wishlist-items">
        ${wishlist.map(item => `
          <div class="wishlist-item">
            <img src="${item.image}" alt="${item.name}">
            <div>
              <h4>${item.name}</h4>
              <p>$${item.price.toFixed(2)}</p>
              <button onclick="addToCartFromWishlist(${item.id})"><i class="fa-solid fa-shopping-bag"></i> Add to Cart</button>
              <button onclick="removeFromWishlist(${item.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    const modal = createModal('Wishlist', content);
    document.body.appendChild(modal);
  }

  // Search modal
  function showSearchModal() {
    const content = `
      <div class="search-container">
        <input type="text" id="search-input" placeholder="Search products..." class="search-input">
        <div class="search-results" id="search-results">
          <p>Start typing to search products...</p>
        </div>
      </div>
    `;
    
    const modal = createModal('Search Products', content);
    document.body.appendChild(modal);
    
    const searchInput = modal.querySelector('#search-input');
    const searchResults = modal.querySelector('#search-results');
    
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      if (query.length === 0) {
        searchResults.innerHTML = '<p>Start typing to search products...</p>';
        return;
      }

      const results = allProducts.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );

      searchResults.innerHTML = results.length === 0 ? '<p>No products found</p>' : 
        results.map(product => `
          <div class="search-result" onclick="closeModal(); showQuickViewModal(${JSON.stringify(product).replace(/"/g, '&quot;')})">
            <img src="${product.image}" alt="${product.name}">
            <div>
              <h4>${product.name}</h4>
              <p>$${product.price.toFixed(2)}</p>
            </div>
          </div>
        `).join('');
    });
    
    setTimeout(() => searchInput.focus(), 100);
  }

  // Quick view modal
  function showQuickViewModal(product) {
    const content = `
      <div class="quick-view-content">
        <div class="quick-view-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="quick-view-details">
          <h2>${product.name}</h2>
          <p class="quick-view-price">$${product.price.toFixed(2)}</p>
          <div class="quick-view-colors">
            ${product.colors.map(color => `<span style="background-color: ${color}"></span>`).join('')}
          </div>
          <div class="quick-view-sizes">
            ${product.sizes.map(size => `<button>${size}</button>`).join('')}
          </div>
          <div class="quick-view-actions">
            <button onclick="addToCartQuick(${product.id}); closeModal();">Add to Cart</button>
            <button onclick="toggleWishlistQuick(${product.id});">${wishlist.some(item => item.id === product.id) ? 'Remove from' : 'Add to'} Wishlist</button>
          </div>
        </div>
      </div>
    `;
    
    const modal = createModal('Quick View', content);
    document.body.appendChild(modal);
  }

  // Enhanced error handling
  function safeInitialize() {
    try {
      renderProducts();
      initializeFilters();
      initializeControls();
      initializeHeader();
      initializeImages();
      checkAuthStatus();
      
      // Test core functionality
      setTimeout(() => {
        const productCount = document.querySelectorAll('.product-card').length;
        if (productCount === 0) {
          console.warn('Warning: No products displayed - check product data or rendering');
        }
      }, 1000);
      
    } catch (error) {
      console.error('QuickThrift initialization error:', error);
    }
  }

  // Global helper functions
  window.updateCartQuantity = function(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
      }
      localStorage.setItem('quickthrift-cart', JSON.stringify(cart));
      updateCartCount();
      showCartModal(); // Refresh modal
    }
  };

  window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('quickthrift-cart', JSON.stringify(cart));
    updateCartCount();
    showCartModal(); // Refresh modal
  };

  window.addToCartFromWishlist = function(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      const existingItem = cart.find(item => item.id === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
      }
      localStorage.setItem('quickthrift-cart', JSON.stringify(cart));
      updateCartCount();
      showNotification('Added to cart from wishlist!', 'success');
    }
  };

  window.removeFromWishlist = function(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('quickthrift-wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    showWishlistModal(); // Refresh modal
  };

  window.addToCartQuick = function(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      const existingItem = cart.find(item => item.id === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
      }
      localStorage.setItem('quickthrift-cart', JSON.stringify(cart));
      updateCartCount();
      showNotification('Product added to cart!', 'success');
    }
  };

  window.toggleWishlistQuick = function(productId) {
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    if (existingIndex !== -1) {
      wishlist.splice(existingIndex, 1);
      showNotification('Removed from wishlist', 'info');
    } else {
      const product = allProducts.find(p => p.id === productId);
      if (product) {
        wishlist.push({ id: product.id, name: product.name, price: product.price, image: product.image });
        showNotification('Added to wishlist!', 'success');
      }
    }
    localStorage.setItem('quickthrift-wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
  };

  window.clearAllFilters = function() {
    currentFilters = { category: [], brand: [], size: [], color: null, priceRange: [0, 150] };
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.color-swatch').forEach(swatch => swatch.classList.remove('active'));
    
    const priceSlider = document.getElementById('price-slider');
    if (priceSlider) {
      const maxPrice = Math.max(...allProducts.map(p => p.price));
      priceSlider.value = maxPrice;
      currentFilters.priceRange[1] = maxPrice;
      document.querySelector('.price-display').textContent = `$0 - $${maxPrice}`;
    }
    
    currentPage = 1;
    renderProducts();
    showNotification('All filters cleared', 'info');
  };

  // Handle image loading errors
  function handleImageError(img) {
    img.onerror = () => {
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMDAgNjBMMTQwIDEwMEgxMjBWMTQwSDgwVjEwMEg2MEwxMDAgNjBaIiBmaWxsPSIjQ0NDQ0NDIi8+CjwvZXZnPgo=';
      img.alt = 'Product image not available';
    };
  }

  // Initialize all images with error handling
  function initializeImages() {
    document.querySelectorAll('img').forEach(handleImageError);
  }

  // Initialize everything
  function initialize() {
    renderProducts();
    initializeFilters();
    initializeControls();
    initializeHeader();
    initializeImages();
  }

  safeInitialize();
});
