document.addEventListener("DOMContentLoaded", async () => {
  console.log('🚀 DOM loaded, waiting for API to initialize...');
  
  // Wait for API to be ready
  function waitForAPI() {
    return new Promise((resolve) => {
      if (window.ThriftEaseAPI && window.ThriftEaseAPI.isReady) {
        console.log('✅ API is ready');
        resolve();
      } else {
        console.log('⏳ Waiting for API to initialize...');
        
        // Listen for API ready event
        window.addEventListener('ThriftEaseAPIReady', () => {
          console.log('✅ API ready event received');
          resolve();
        }, { once: true });
        
        // Fallback timeout
        setTimeout(() => {
          if (window.ThriftEaseAPI) {
            console.warn('⚠️ API not marked ready, proceeding anyway...');
            resolve();
          } else {
            console.error('❌ API failed to initialize');
            resolve();
          }
        }, 5000);
      }
    });
  }
  
  await waitForAPI();
  
  const categoryMenu = document.getElementById("category-menu");
  const categoriesSection = document.getElementById("categories-section");
  const productGrid = document.getElementById("product-grid");

  // Retrieve products from API
  let products = [];
  
  console.log('🚀 Starting product loading...');
  
  try {
    if (window.ThriftEaseAPI && window.ThriftEaseAPI.Products) {
      console.log('✅ ThriftEaseAPI found, fetching products...');
      products = await window.ThriftEaseAPI.Products.fetchProducts();
      console.log('✅ Products loaded from API:', products.length);
    } else {
      console.error('❌ ThriftEaseAPI or Products API not found');
      throw new Error('API not available');
    }
  } catch (error) {
    console.error('❌ Error loading products:', error);
    // Show error message instead of using fallback products
    const productGrid = document.getElementById("product-grid");
    if (productGrid) {
      productGrid.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
          <h3>Unable to load products</h3>
          <p>Please check your internet connection and try again.</p>
          <button onclick="location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Retry
          </button>
        </div>
      `;
    }
    return; // Exit early if products can't be loaded
  }

  // Categories and their subcategories
  const categories = {
    women: ["Dresses", "Tops", "Jeans", "Skirts", "Activewear", "Coats & Jackets"],
    men: ["Shirts", "T-Shirts", "Jeans", "Trousers", "Shorts", "Jackets & Coats"],
    kids: {
      boys: ["T-Shirts", "Sweatshirts & Hoodies", "Pants", "Shorts", "Jackets"],
      girls: ["Dresses", "Tops", "Leggings", "Skirts", "Hoodies", "Jackets"]
    },
    shoes: ["Sneakers", "Boots", "Sandals", "Formal Shoes"]
  };

  // Function to render categories in the navigation menu
  function renderCategories() {
    categoryMenu.innerHTML = "";
    Object.keys(categories).forEach((categoryKey) => {
      const categoryName = categoryKey.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const li = document.createElement("li");
      li.innerHTML = `<a href="#" class="dropdown-link" data-category="${categoryKey}">${categoryName}</a>`;
      categoryMenu.appendChild(li);
    });
  }

  // Function to render subcategories in the categories section
  function renderSubcategories(categoryKey, subGroupKey = null) {
    categoriesSection.innerHTML = "";

    if (categoryKey === "kids" && !subGroupKey) {
      ["boys", "girls"].forEach((group) => {
        const a = document.createElement("a");
        a.href = "#";
        a.className = "category-link";
        a.textContent = group.charAt(0).toUpperCase() + group.slice(1);
        a.dataset.subgroup = group;
        a.dataset.category = "kids";
        categoriesSection.appendChild(a);
      });
      return;
    }

    let subcategories = [];
    if (categoryKey === "kids" && subGroupKey) {
      subcategories = categories.kids[subGroupKey] || [];
    } else {
      subcategories = categories[categoryKey] || [];
    }

    subcategories.forEach((subcategory) => {
      const a = document.createElement("a");
      a.href = "#";
      a.className = "category-link";
      a.textContent = subcategory;
      a.dataset.subcategory = subcategory.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
      a.dataset.category = categoryKey;
      if (subGroupKey) a.dataset.subgroup = subGroupKey;
      categoriesSection.appendChild(a);
    });
  }

  // Helper function to generate color options based on product category
  function getColorOptions(mainCategory, subCategory) {
    const colorSets = {
      "Women's": {
        "Dresses": [
          { name: "Navy", hex: "#1B2951" },
          { name: "Burgundy", hex: "#8B1538" },
          { name: "Forest", hex: "#2F4F2F" }
        ],
        "Tops": [
          { name: "White", hex: "#FFFFFF" },
          { name: "Blush", hex: "#F8E8E7" },
          { name: "Sage", hex: "#87A96B" }
        ],
        "Jackets": [
          { name: "Denim", hex: "#4682B4" },
          { name: "Black", hex: "#000000" },
          { name: "Khaki", hex: "#8B7355" }
        ],
        "default": [
          { name: "Navy", hex: "#1B2951" },
          { name: "Cream", hex: "#F5F5DC" },
          { name: "Rose", hex: "#E8B4B8" }
        ]
      },
      "Men's": {
        "Shirts": [
          { name: "White", hex: "#FFFFFF" },
          { name: "Blue", hex: "#2B4C8C" },
          { name: "Gray", hex: "#808080" }
        ],
        "T-Shirts": [
          { name: "Navy", hex: "#1B2951" },
          { name: "Charcoal", hex: "#36454F" },
          { name: "Olive", hex: "#808000" }
        ],
        "default": [
          { name: "Navy", hex: "#1B2951" },
          { name: "Gray", hex: "#808080" },
          { name: "Black", hex: "#000000" }
        ]
      },
      "Kids": {
        "default": [
          { name: "Rainbow", hex: "#FF6B6B" },
          { name: "Sky", hex: "#74C0FC" },
          { name: "Mint", hex: "#51CF66" }
        ]
      },
      "Shoes": {
        "default": [
          { name: "White", hex: "#FFFFFF" },
          { name: "Black", hex: "#000000" },
          { name: "Brown", hex: "#8B4513" }
        ]
      }
    };

    const categoryColors = colorSets[mainCategory] || colorSets["default"] || [];
    const subCategoryColors = categoryColors[subCategory] || categoryColors["default"] || [];
    
    return subCategoryColors.length > 0 ? subCategoryColors : [
      { name: "Default", hex: "#1B2951" },
      { name: "Neutral", hex: "#F5F5DC" }
    ];
  }

  // Helper function to generate size/category information
  function getSizeInfo(mainCategory, subCategory) {
    const sizeInfo = {
      "Women's": {
        "Dresses": "XS-XL Available",
        "Tops": "XS-XXL Available", 
        "Jackets": "S-XL Available",
        "default": "Multiple Sizes"
      },
      "Men's": {
        "Shirts": "S-XXL Available",
        "T-Shirts": "XS-XXL Available",
        "default": "Multiple Sizes"
      },
      "Kids": {
        "default": "Ages 2-12"
      },
      "Shoes": {
        "default": "EU 35-45"
      }
    };

    const categoryInfo = sizeInfo[mainCategory] || {};
    return categoryInfo[subCategory] || categoryInfo["default"] || "One Size";
  }

  // Function to render products in the product grid
  function renderProducts(filterCategory = null, filterSubcategory = null, filterSubgroup = null) {
    console.log('🎨 Rendering products...', {
      totalProducts: products.length,
      filterCategory,
      filterSubcategory,
      filterSubgroup
    });
    
    productGrid.innerHTML = "";

    const filteredProducts = products.filter((product) => {
      // Normalize category names for comparison
      const normalizeCategory = (cat) => cat?.toLowerCase().replace(/[''s-]/g, '').trim();
      const productMainCategory = normalizeCategory(product.mainCategory);
      
      if (filterCategory) {
        const filterCat = normalizeCategory(filterCategory);
        // Handle special cases for kids subcategories
        if (filterSubgroup) {
          const expectedCategory = `kids${filterSubgroup}`;
          if (normalizeCategory(expectedCategory) !== productMainCategory) return false;
        } else if (productMainCategory !== filterCat) {
          return false;
        }
      }
      
      if (filterSubcategory) {
        const normalizeSubCategory = (subCat) => subCat?.toLowerCase().replace(/[&\s-]/g, '').trim();
        const productSubCategory = normalizeSubCategory(product.subCategory);
        const filterSubCat = normalizeSubCategory(filterSubcategory);
        if (productSubCategory !== filterSubCat) return false;
      }
      
      return true;
    });

    if (filteredProducts.length === 0) {
      productGrid.innerHTML = "<p>No products found.</p>";
      return;
    }

    filteredProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      
      // Determine button text based on authentication status
      const isAuth = isUserAuthenticated();
      const buttonText = isAuth 
        ? '<i class="fa-solid fa-bag-shopping"></i> Add to Bag'
        : '<i class="fa-solid fa-sign-in-alt"></i> Sign In to Add';
      const buttonClass = isAuth ? 'add-to-bag-btn' : 'add-to-bag-btn sign-in-required';
      
      // Generate product code similar to TapStitch (#RT00037 format)
      const productCode = `#TE${String(product.id).padStart(5, '0')}`;
      
      // Create color swatches (simulated based on product category)
      const colorOptions = getColorOptions(product.mainCategory, product.subCategory);
      const colorSwatchesHTML = colorOptions.map(color => 
        `<span class="color-swatch" style="background-color: ${color.hex}" title="${color.name}"></span>`
      ).join('');
      
      // Create size/category info
      const sizeInfo = getSizeInfo(product.mainCategory, product.subCategory);
      
      productCard.innerHTML = `
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.name}" class="product-image">
          <div class="product-overlay">
            <span class="product-code">${productCode}</span>
          </div>
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <div class="product-meta">
            <span class="product-category">${product.mainCategory}</span>
            ${product.subCategory ? `<span class="product-subcategory">${product.subCategory}</span>` : ''}
          </div>
          ${sizeInfo ? `<div class="product-size-info">${sizeInfo}</div>` : ''}
          <div class="product-colors">
            ${colorSwatchesHTML}
          </div>
          <div class="product-pricing">
            <span class="product-price">$${product.price.toFixed(2)}</span>
          </div>
          <button class="${buttonClass}" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}" data-product-image="${product.image}">
            ${buttonText}
          </button>
        </div>
      `;
      productGrid.appendChild(productCard);
    });

    // Add event listeners to "Add to Bag" buttons
    document.querySelectorAll('.add-to-bag-btn').forEach(button => {
      button.addEventListener('click', handleAddToBag);
    });
  }

  // Function to handle adding items to bag
  function handleAddToBag(event) {
    // Check if user is authenticated
    if (!isUserAuthenticated()) {
      // Show authentication required message
      const shouldSignIn = confirm(
        'You need to sign in to add items to your bag.\n\n' +
        'Would you like to go to the sign-in page now?'
      );
      
      if (shouldSignIn) {
        window.location.href = 'sign-in.html';
      }
      return;
    }

    const button = event.target.closest('.add-to-bag-btn');
    const productId = button.dataset.productId;
    const productName = button.dataset.productName;
    const productPrice = parseFloat(button.dataset.productPrice);
    const productImage = button.dataset.productImage;

    const item = {
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: 1
    };

    addToBag(item);
    
    // Visual feedback
    button.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
    button.style.backgroundColor = '#28a745';
    
    setTimeout(() => {
      button.innerHTML = '<i class="fa-solid fa-bag-shopping"></i> Add to Bag';
      button.style.backgroundColor = '';
    }, 2000);
  }

  // Function to add item to bag
  async function addToBag(item) {
    try {
      if (!isUserAuthenticated()) {
        throw new Error('Please sign in to add items to your bag');
      }
      
      if (window.ThriftEaseAPI) {
        // Use new API for instant sync
        window.ThriftEaseAPI.Bag.addItem(item);
        updateBagCount();
        console.log('✅ Item added to bag with instant sync:', item);
      } else {
        throw new Error('API not available');
      }
    } catch (error) {
      console.error('❌ Failed to add item to bag:', error);
      
      // Show user-friendly error message
      if (error.message.includes('sign in')) {
        const shouldSignIn = confirm(
          'You need to sign in to add items to your bag.\n\n' +
          'Would you like to go to the sign-in page now?'
        );
        
        if (shouldSignIn) {
          window.location.href = 'sign-in.html';
        }
      } else {
        alert('Failed to add item to bag. Please try again.');
      }
    }
  }

  // Function to update bag count in header
  function updateBagCount() {
    try {
      let bag = [];
      
      if (window.ThriftEaseAPI && isUserAuthenticated()) {
        bag = window.ThriftEaseAPI.Bag.getBag();
      }
      // If not authenticated, bag remains empty
      
      const totalItems = bag.reduce((total, item) => total + item.quantity, 0);
      
      const bagCountElement = document.getElementById('bag-count');
      if (bagCountElement) {
        bagCountElement.textContent = totalItems;
        
        // Show/hide bag count based on items
        if (totalItems > 0) {
          bagCountElement.style.display = 'inline';
        } else {
          bagCountElement.style.display = 'none';
        }
      }
    } catch (error) {
      console.error('❌ Error updating bag count:', error);
      const bagCountElement = document.getElementById('bag-count');
      if (bagCountElement) {
        bagCountElement.textContent = '0';
        bagCountElement.style.display = 'none';
      }
    }
  }

  // Function to get current user email from token/localStorage
  function getCurrentUserEmail() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        return user.email;
      } catch (e) {
        console.error('Error parsing user info:', e);
      }
    }
    return null;
  }

  // Manual sync button functionality with new API
  const syncBtn = document.getElementById('sync-btn');
  if (syncBtn && window.ThriftEaseAPI) {
    syncBtn.style.display = 'inline-block';
    
    syncBtn.addEventListener('click', async () => {
      if (!isUserAuthenticated()) {
        window.ThriftEaseAPI.State.showNotification('Please sign in to sync your data', 'error');
        return;
      }
      
      try {
        syncBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        syncBtn.disabled = true;
        
        await window.ThriftEaseAPI.State.manualSync();
        updateBagCount();
        
        syncBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        console.log('✅ Manual sync completed');
        
        setTimeout(() => {
          syncBtn.innerHTML = '<i class="fa-solid fa-sync"></i>';
          syncBtn.disabled = false;
        }, 2000);
      } catch (error) {
        syncBtn.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i>';
        console.error('❌ Manual sync failed:', error);
        window.ThriftEaseAPI.State.showNotification('Sync failed', 'error');
        
        setTimeout(() => {
          syncBtn.innerHTML = '<i class="fa-solid fa-sync"></i>';
          syncBtn.disabled = false;
        }, 2000);
      }
    });
  }

  // Update product grid when authentication state changes
  function updateProductButtons() {
    const isAuth = isUserAuthenticated();
    document.querySelectorAll('.add-to-bag-btn').forEach(button => {
      if (isAuth) {
        button.innerHTML = '<i class="fa-solid fa-bag-shopping"></i> Add to Bag';
        button.className = 'add-to-bag-btn';
      } else {
        button.innerHTML = '<i class="fa-solid fa-sign-in-alt"></i> Sign In to Add';
        button.className = 'add-to-bag-btn sign-in-required';
      }
    });
  }

  // Initialize bag count on page load
  updateBagCount();

  // Listen for bag updates from other tabs/devices
  if (window.ThriftEaseAPI) {
    window.ThriftEaseAPI.State.addListener('bagUpdate', (newBag) => {
      updateBagCount();
      console.log('🔄 Bag updated from another tab/device');
    });
  }

  // Listen for authentication changes from other tabs/devices
  if (window.ThriftEaseAPI) {
    window.ThriftEaseAPI.State.addListener('signOut', () => {
      updateAuthUI();
      updateBagCount();
      console.log('🔄 User signed out in another tab');
    });
    
    window.ThriftEaseAPI.State.addListener('userUpdate', (user) => {
      updateAuthUI();
      console.log('👤 User updated:', user);
    });
  }

  // Helper function to check if user is authenticated
  function isUserAuthenticated() {
    const token = localStorage.getItem('authToken');
    return token && token.trim() !== '';
  }

  // Function to update user interface based on authentication status
  function updateAuthUI() {
    const loginLink = document.querySelector('.login-link');
    const syncBtn = document.getElementById('sync-btn');
    
    if (loginLink) {
      if (isUserAuthenticated()) {
        // Get user info and display it
        const userInfo = localStorage.getItem('userInfo');
        let displayName = 'Account';
        
        if (userInfo) {
          try {
            const user = JSON.parse(userInfo);
            displayName = user.name || user.email.split('@')[0];
          } catch (e) {
            console.error('Error parsing user info:', e);
          }
        }
        
        // User is signed in
        loginLink.innerHTML = `<i class="fa-solid fa-user"></i> ${displayName} | <span style="cursor: pointer; color: #dc3545;" onclick="signOut()">Sign Out</span>`;
        loginLink.href = '#';
        
        // Show sync button
        if (syncBtn && window.ThriftEaseAPI) {
          syncBtn.style.display = 'inline-block';
        }
      } else {
        // User is not signed in
        loginLink.innerHTML = 'Sign In / Sign Up';
        loginLink.href = 'sign-in.html';
        
        // Hide sync button
        if (syncBtn) {
          syncBtn.style.display = 'none';
        }
      }
    }
    
    // Update product buttons based on auth state
    updateProductButtons();
  }

  // Function to sign out user
  window.signOut = async function() {
    try {
      if (window.ThriftEaseAPI) {
        await window.ThriftEaseAPI.Auth.signOut();
      } else {
        // Fallback: manual cleanup
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('bag');
      }
      
      // Update UI immediately
      updateAuthUI();
      updateBagCount();
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('❌ Error during sign out:', error);
      // Force sign out even if there's an error
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('bag');
      updateAuthUI();
      updateBagCount();
    }
  };

  // Initial render
  renderCategories();
  renderProducts();
  // Initialize the application
  updateBagCount();
  updateAuthUI();
  
  console.log('✅ ThriftEase application initialized successfully');
});
