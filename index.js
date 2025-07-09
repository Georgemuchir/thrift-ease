document.addEventListener("DOMContentLoaded", async () => {
  console.log('🚀 DOM loaded, waiting for API to initialize...');
  
  // Wait a moment for API to initialize
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const categoryMenu = document.getElementById("category-menu");
  const categoriesSection = document.getElementById("categories-section");
  const productGrid = document.getElementById("product-grid");

  // Retrieve products from API
  let products = [];
  
  console.log('🚀 Starting product loading...');
  
  try {
    if (window.ThriftEaseAPI) {
      console.log('✅ ThriftEaseAPI found, fetching products...');
      products = await window.ThriftEaseAPI.Products.fetchProducts();
      console.log('✅ Products loaded from API:', products.length);
    } else {
      console.error('❌ ThriftEaseAPI not found');
      throw new Error('API not available');
    }
  } catch (error) {
    console.error('❌ Error loading products:', error);
    // Fallback: use default products
    products = [
      {"id": 1, "name": "Vintage Denim Jacket", "mainCategory": "Women", "subCategory": "Jackets", "price": 45.99, "image": "demo1.jpeg"},
      {"id": 2, "name": "Classic White Sneakers", "mainCategory": "Shoes", "subCategory": "Sneakers", "price": 35.50, "image": "demo2.jpeg"},
      {"id": 3, "name": "Cotton T-Shirt", "mainCategory": "Men", "subCategory": "T-Shirts", "price": 15.99, "image": "demo3.jpeg"},
      {"id": 4, "name": "Kids Rainbow T-Shirt", "mainCategory": "Kids", "subCategory": "T-Shirts", "subGroup": "Girls", "price": 12.99, "image": "demo1.jpeg"},
      {"id": 5, "name": "Boys Denim Shorts", "mainCategory": "Kids", "subCategory": "Shorts", "subGroup": "Boys", "price": 18.50, "image": "demo2.jpeg"},
      {"id": 6, "name": "Summer Dress", "mainCategory": "Women", "subCategory": "Dresses", "price": 39.99, "image": "demo3.jpeg"},
      {"id": 7, "name": "Running Shoes", "mainCategory": "Shoes", "subCategory": "Athletic", "price": 79.99, "image": "demo1.jpeg"},
      {"id": 8, "name": "Casual Blazer", "mainCategory": "Men", "subCategory": "Blazers", "price": 89.99, "image": "demo2.jpeg"}
    ];
    console.log('🔄 Using fallback products:', products.length);
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
      
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <button class="${buttonClass}" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}" data-product-image="${product.image}">
          ${buttonText}
        </button>
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
      if (window.ThriftEaseAPI) {
        // Use new API for instant sync
        window.ThriftEaseAPI.Bag.addItem(item);
        updateBagCount();
        console.log('✅ Item added to bag with instant sync:', item);
      } else {
        // Fallback to localStorage
        let bag = JSON.parse(localStorage.getItem('bag')) || [];
        const existingItemIndex = bag.findIndex(bagItem => bagItem.id === item.id);
        
        if (existingItemIndex > -1) {
          bag[existingItemIndex].quantity += 1;
        } else {
          bag.push(item);
        }
        
        localStorage.setItem('bag', JSON.stringify(bag));
        updateBagCount();
        console.log('Item added to bag (fallback):', item);
      }
    } catch (error) {
      console.error('❌ Failed to add item to bag:', error);
    }
  }

  // Function to update bag count in header
  function updateBagCount() {
    try {
      let bag = [];
      if (window.ThriftEaseAPI) {
        bag = window.ThriftEaseAPI.Bag.getBag();
      } else {
        bag = JSON.parse(localStorage.getItem('bag')) || [];
      }
      
      const totalItems = bag.reduce((total, item) => total + item.quantity, 0);
      
      const bagCountElement = document.getElementById('bag-count');
      if (bagCountElement) {
        bagCountElement.textContent = totalItems;
      }
    } catch (error) {
      console.error('❌ Error updating bag count:', error);
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
        updateAuthUI();
        updateBagCount();
        console.log('✅ User signed out successfully');
      } else {
        // Fallback: manual cleanup
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        updateAuthUI();
        updateBagCount();
      }
    } catch (error) {
      console.error('❌ Error during sign out:', error);
      // Force sign out even if there's an error
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
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
