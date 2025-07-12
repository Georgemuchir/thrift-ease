document.addEventListener("DOMContentLoaded", async () => {
  console.log('🚀 QuickThrift template loaded');
  
  // Enhanced products data with more variety
  const allProducts = [
    {
      id: 1,
      name: "Lace Shirt Cut II",
      price: 16.00,
      image: "demo1.jpeg",
      colors: ["#8B4513", "#DC143C", "#2F4F2F"],
      category: "shirts",
      brand: "quickthrift",
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 2,
      name: "Vintage Denim Jacket",
      price: 45.00,
      image: "demo2.jpeg",
      colors: ["#4A90E2", "#FF69B4", "#32CD32"],
      category: "jackets",
      brand: "premium",
      sizes: ["XS", "S", "M", "L"]
    },
    {
      id: 3,
      name: "Classic Wool Coat",
      price: 89.00,
      image: "demo3.jpeg",
      colors: ["#000000", "#9B9B9B", "#FF69B4"],
      category: "coats",
      brand: "quickthrift",
      sizes: ["M", "L", "XL"]
    },
    {
      id: 4,
      name: "Cotton Casual Shirt",
      price: 22.00,
      image: "demo1.jpeg",
      colors: ["#87CEEB", "#32CD32", "#FF69B4"],
      category: "shirts",
      brand: "premium",
      sizes: ["S", "M", "L"]
    },
    {
      id: 5,
      name: "Leather Biker Jacket",
      price: 125.00,
      image: "demo2.jpeg",
      colors: ["#000000", "#8B4513"],
      category: "jackets",
      brand: "quickthrift",
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 6,
      name: "Trench Coat",
      price: 75.00,
      image: "demo3.jpeg",
      colors: ["#D2B48C", "#8B4513", "#2F4F4F"],
      category: "coats",
      brand: "premium",
      sizes: ["XS", "S", "M", "L", "XL"]
    }
  ];

  // Current state management
  let currentFilters = {
    category: [],
    brand: [],
    size: [],
    color: null,
    priceRange: [0, 150]
  };
  
  let currentSort = 'default';
  let currentView = 'grid';
  let currentPage = 1;
  let itemsPerPage = 12;
  let cart = JSON.parse(localStorage.getItem('quickthrift-cart') || '[]');
  let wishlist = JSON.parse(localStorage.getItem('quickthrift-wishlist') || '[]');

  // Render products with filtering and sorting
  function renderProducts() {
    const productGrid = document.getElementById("product-grid");
    if (!productGrid) return;

    // Apply filters
    let filteredProducts = allProducts.filter(product => {
      // Category filter
      if (currentFilters.category.length > 0 && !currentFilters.category.includes(product.category)) {
        return false;
      }
      
      // Brand filter
      if (currentFilters.brand.length > 0 && !currentFilters.brand.includes(product.brand)) {
        return false;
      }
      
      // Price filter
      if (product.price < currentFilters.priceRange[0] || product.price > currentFilters.priceRange[1]) {
        return false;
      }
      
      return true;
    });

    // Apply sorting
    switch (currentSort) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageProducts = filteredProducts.slice(startIndex, endIndex);

    // Clear grid
    productGrid.innerHTML = "";

    // Add view class
    productGrid.className = currentView === 'list' ? 'products-grid list-view' : 'products-grid';

    if (currentPageProducts.length === 0) {
      productGrid.innerHTML = `
        <div class="no-products">
          <h3>No products found</h3>
          <p>Try adjusting your filters or search criteria</p>
          <button onclick="clearAllFilters()" class="btn-clear-filters">Clear All Filters</button>
        </div>
      `;
      return;
    }

    currentPageProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.dataset.productId = product.id;
      
      // Create color dots
      const colorDots = product.colors.map(color => 
        `<span class="product-color-dot" style="background-color: ${color}" title="${color}"></span>`
      ).join('');
      
      // Check if in wishlist
      const isInWishlist = wishlist.some(item => item.id === product.id);
      const wishlistClass = isInWishlist ? 'active' : '';
      
      productCard.innerHTML = `
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.name}" class="product-image">
          <div class="product-overlay">
            <button class="btn-wishlist ${wishlistClass}" data-product-id="${product.id}">
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
          <div class="product-colors">
            ${colorDots}
          </div>
          <div class="product-sizes">
            ${product.sizes ? product.sizes.map(size => `<span class="size-option">${size}</span>`).join('') : ''}
          </div>
          <button class="btn-add-to-cart" data-product-id="${product.id}">
            <i class="fa-solid fa-shopping-bag"></i>
            Add to Cart
          </button>
        </div>
      `;
      
      productGrid.appendChild(productCard);
    });

    // Add event listeners
    addProductEventListeners();
  }

  // Add event listeners to product cards
  function addProductEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
      btn.addEventListener('click', handleAddToCart);
    });

    // Wishlist buttons
    document.querySelectorAll('.btn-wishlist').forEach(btn => {
      btn.addEventListener('click', handleWishlistToggle);
    });

    // Quick view buttons
    document.querySelectorAll('.btn-quick-view').forEach(btn => {
      btn.addEventListener('click', handleQuickView);
    });
  }

  // Handle add to cart
  function handleAddToCart(e) {
    const productId = parseInt(e.target.closest('.btn-add-to-cart').dataset.productId);
    const product = allProducts.find(p => p.id === productId);
    
    if (product) {
      // Check if product already in cart
      const existingItem = cart.find(item => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
      
      localStorage.setItem('quickthrift-cart', JSON.stringify(cart));
      updateCartCount();
      
      // Visual feedback
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
        // Remove from wishlist
        wishlist.splice(existingIndex, 1);
        btn.classList.remove('active');
        showNotification('Removed from wishlist', 'info');
      } else {
        // Add to wishlist
        wishlist.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image
        });
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
    
    if (product) {
      showQuickViewModal(product);
    }
  }

  // Initialize color filter functionality
  function initializeColorFilters() {
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        // Remove active class from all swatches
        colorSwatches.forEach(s => s.classList.remove('active'));
        
        // If clicking the same color, deactivate filter
        if (currentFilters.color === swatch.dataset.color) {
          currentFilters.color = null;
        } else {
          // Add active class to clicked swatch
          swatch.classList.add('active');
          currentFilters.color = swatch.dataset.color;
        }
        
        currentPage = 1; // Reset to first page
        renderProducts();
      });
    });
  }

  // Initialize category filters
  function initializeCategoryFilters() {
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    categoryCheckboxes.forEach(checkbox => {
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
  }

  // Initialize brand filters
  function initializeBrandFilters() {
    const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
    brandCheckboxes.forEach(checkbox => {
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
  }

  // Initialize pagination
  function initializePagination() {
    const paginationContainer = document.querySelector('.pagination');
    if (paginationContainer) {
      paginationContainer.addEventListener('click', (e) => {
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
  }

  // Initialize view toggle
  function initializeViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        viewBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        currentView = btn.dataset.view;
        renderProducts();
      });
    });
  }

  // Initialize sort functionality
  function initializeSort() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
      });
    }
  }

  // Initialize newsletter form
  function initializeNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('.newsletter-input').value;
        
        if (email) {
          showNotification('Thank you for subscribing to QuickThrift updates!', 'success');
          e.target.querySelector('.newsletter-input').value = '';
        }
      });
    }
  }

  // Initialize shopping cart
  function initializeCart() {
    const cartBtn = document.querySelector('.cart-btn');
    
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        showCartModal();
      });
    }
    
    updateCartCount();
  }

  // Update cart count
  function updateCartCount() {
    const cartCount = document.getElementById('bag-count');
    if (cartCount) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  }

  // Update wishlist count
  function updateWishlistCount() {
    const wishlistCount = document.querySelector('.wishlist-btn .icon-badge');
    if (wishlistCount) {
      wishlistCount.textContent = wishlist.length;
      wishlistCount.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
  }

  // Initialize search functionality
  function initializeSearch() {
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        showSearchModal();
      });
    }
  }

  // Initialize wishlist functionality
  function initializeWishlist() {
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        showWishlistModal();
      });
    }
    
    updateWishlistCount();
  }

  // Initialize account functionality
  function initializeAccount() {
    const accountBtn = document.querySelector('.account-btn');
    if (accountBtn) {
      accountBtn.addEventListener('click', () => {
        window.location.href = 'sign-in.html';
      });
    }
  }

  // Show notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fa-solid fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
      <button class="notification-close">
        <i class="fa-solid fa-times"></i>
      </button>
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

  // Show cart modal
  function showCartModal() {
    const modal = createModal('Shopping Cart', getCartModalContent());
    document.body.appendChild(modal);
  }

  // Get cart modal content
  function getCartModalContent() {
    if (cart.length === 0) {
      return `
        <div class="empty-cart">
          <i class="fa-solid fa-shopping-bag"></i>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started!</p>
        </div>
      `;
    }

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return `
      <div class="cart-items">
        ${cart.map(item => `
          <div class="cart-item" data-item-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
              <h4>${item.name}</h4>
              <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
              <span class="qty-value">${item.quantity}</span>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="cart-summary">
        <div class="cart-total">
          <strong>Total: $${cartTotal.toFixed(2)}</strong>
        </div>
        <div class="cart-actions">
          <button class="btn-secondary" onclick="closeModal()">Continue Shopping</button>
          <button class="btn-primary">Checkout</button>
        </div>
      </div>
    `;
  }

  // Show wishlist modal
  function showWishlistModal() {
    const modal = createModal('Wishlist', getWishlistModalContent());
    document.body.appendChild(modal);
  }

  // Get wishlist modal content
  function getWishlistModalContent() {
    if (wishlist.length === 0) {
      return `
        <div class="empty-wishlist">
          <i class="fa-solid fa-heart"></i>
          <h3>Your wishlist is empty</h3>
          <p>Save your favorite items here!</p>
        </div>
      `;
    }

    return `
      <div class="wishlist-items">
        ${wishlist.map(item => `
          <div class="wishlist-item" data-item-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
            <div class="wishlist-item-details">
              <h4>${item.name}</h4>
              <p class="wishlist-item-price">$${item.price.toFixed(2)}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Show search modal
  function showSearchModal() {
    const modal = createModal('Search Products', getSearchModalContent());
    document.body.appendChild(modal);
  }

  // Get search modal content
  function getSearchModalContent() {
    return `
      <div class="search-container">
        <div class="search-input-container">
          <input type="text" id="search-input" placeholder="Search for products..." class="search-input">
          <button class="search-submit">
            <i class="fa-solid fa-search"></i>
          </button>
        </div>
        <div class="search-results" id="search-results">
          <p class="search-placeholder">Start typing to search products...</p>
        </div>
      </div>
    `;
  }

  // Show quick view modal
  function showQuickViewModal(product) {
    const modal = createModal('Quick View', getQuickViewModalContent(product));
    document.body.appendChild(modal);
  }

  // Get quick view modal content
  function getQuickViewModalContent(product) {
    const colorOptions = product.colors.map(color => 
      `<button class="color-option" style="background-color: ${color}" data-color="${color}"></button>`
    ).join('');

    return `
      <div class="quick-view-content">
        <div class="quick-view-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="quick-view-details">
          <h2>${product.name}</h2>
          <p class="quick-view-price">$${product.price.toFixed(2)}</p>
          
          <div class="quick-view-options">
            <div class="color-selection">
              <h4>Colors:</h4>
              <div class="color-options">
                ${colorOptions}
              </div>
            </div>
          </div>
          
          <div class="quick-view-actions">
            <button class="btn-add-to-cart-quick" data-product-id="${product.id}">
              <i class="fa-solid fa-shopping-bag"></i> Add to Cart
            </button>
            <button class="btn-wishlist-quick ${wishlist.some(item => item.id === product.id) ? 'active' : ''}" data-product-id="${product.id}">
              <i class="fa-solid fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Create modal element
  function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2>${title}</h2>
          <button class="modal-close" onclick="closeModal()">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
      </div>
    `;
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    return modal;
  }

  // Close modal function (global)
  window.closeModal = function() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.classList.add('closing');
      setTimeout(() => modal.remove(), 300);
    }
  };

  // Clear all filters function (global)
  window.clearAllFilters = function() {
    currentFilters = {
      category: [],
      brand: [],
      size: [],
      color: null,
      priceRange: [0, 150]
    };
    
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.color-swatch').forEach(swatch => swatch.classList.remove('active'));
    
    currentPage = 1;
    renderProducts();
    showNotification('All filters cleared', 'info');
  };

  // Initialize all components
  function initialize() {
    renderProducts();
    initializeColorFilters();
    initializeCategoryFilters();
    initializeBrandFilters();
    initializePagination();
    initializeViewToggle();
    initializeSort();
    initializeNewsletter();
    initializeCart();
    initializeSearch();
    initializeWishlist();
    initializeAccount();
  }

  // Start the application
  initialize();
  
  console.log('✅ QuickThrift template initialized successfully');
});
