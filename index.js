document.addEventListener("DOMContentLoaded", async () => {
  const categoryMenu = document.getElementById("category-menu");
  const categoriesSection = document.getElementById("categories-section");
  const productGrid = document.getElementById("product-grid");

  // Retrieve products from API (with localStorage fallback)
  let products = [];
  
  try {
    if (window.ThriftEaseAPI) {
      products = await window.ThriftEaseAPI.Products.fetchProducts();
      console.log('Products loaded from API:', products);
    } else {
      products = JSON.parse(localStorage.getItem("products")) || [];
      console.log('Products loaded from localStorage:', products);
    }
  } catch (error) {
    console.error('Error loading products:', error);
    products = JSON.parse(localStorage.getItem("products")) || [];
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
    let bag = JSON.parse(localStorage.getItem('bag')) || [];
    
    // Check if item already exists in bag
    const existingItemIndex = bag.findIndex(bagItem => bagItem.id === item.id);
    
    if (existingItemIndex > -1) {
      // Item exists, increase quantity
      bag[existingItemIndex].quantity += 1;
    } else {
      // New item, add to bag
      bag.push(item);
    }
    
    // Save to localStorage
    localStorage.setItem('bag', JSON.stringify(bag));
    
    // Save to backend if user is authenticated
    const userEmail = getCurrentUserEmail();
    if (userEmail && typeof BagAPI !== 'undefined') {
      await BagAPI.saveUserBag(userEmail, bag);
    }
    
    // Update bag count in header
    updateBagCount();
    
    console.log('Item added to bag:', item);
  }

  // Function to update bag count in header
  function updateBagCount() {
    const bag = JSON.parse(localStorage.getItem('bag')) || [];
    const totalItems = bag.reduce((total, item) => total + item.quantity, 0);
    
    const bagCountElement = document.getElementById('bag-count');
    if (bagCountElement) {
      bagCountElement.textContent = totalItems;
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

  // Function to load user's bag from backend when signing in
  async function loadUserBag() {
    const userEmail = getCurrentUserEmail();
    if (userEmail && typeof BagAPI !== 'undefined') {
      try {
        const userBag = await BagAPI.getUserBag(userEmail);
        localStorage.setItem('bag', JSON.stringify(userBag));
        updateBagCount();
        console.log('User bag loaded from backend:', userBag);
      } catch (error) {
        console.error('Error loading user bag:', error);
      }
    }
  }

  // Event listener for category menu clicks
  categoryMenu.addEventListener("click", (e) => {
    if (e.target.classList.contains("dropdown-link")) {
      e.preventDefault();
      const categoryKey = e.target.dataset.category;
      renderSubcategories(categoryKey);
      if (categoryKey !== "kids") {
        renderProducts(categoryKey);
      }
    }
  });

  // Event listener for subcategory clicks
  categoriesSection.addEventListener("click", (e) => {
    if (e.target.classList.contains("category-link")) {
      e.preventDefault();

      const categoryKey = e.target.dataset.category;
      const subgroup = e.target.dataset.subgroup;
      const subcategoryKey = e.target.dataset.subcategory;

      if (categoryKey === "kids" && subgroup && !subcategoryKey) {
        renderSubcategories("kids", subgroup);
        return;
      }

      // Final subcategory clicked
      renderProducts(categoryKey, subcategoryKey, subgroup);
    }
  });

  // Helper function to check if user is authenticated
  function isUserAuthenticated() {
    const token = localStorage.getItem('authToken');
    return token && token.trim() !== '';
  }

  // Function to update user interface based on authentication status
  function updateAuthUI() {
    const loginLink = document.querySelector('.login-link');
    if (loginLink) {
      if (isUserAuthenticated()) {
        // User is signed in
        loginLink.innerHTML = '<i class="fa-solid fa-user"></i> Account | <span style="cursor: pointer;" onclick="signOut()">Sign Out</span>';
        loginLink.href = '#';
      } else {
        // User is not signed in
        loginLink.innerHTML = 'Sign In / Sign Up';
        loginLink.href = 'sign-in.html';
      }
    }
  }

  // Function to sign out user
  window.signOut = async function() {
    if (confirm('Are you sure you want to sign out?')) {
      // Save current bag to backend before signing out
      const userEmail = getCurrentUserEmail();
      if (userEmail && typeof BagAPI !== 'undefined') {
        const currentBag = JSON.parse(localStorage.getItem('bag')) || [];
        await BagAPI.saveUserBag(userEmail, currentBag);
      }
      
      // Clear authentication and user data
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      // Clear bag locally - it will be restored when user signs back in
      localStorage.removeItem('bag');
      
      updateAuthUI();
      updateBagCount();
      alert('You have been signed out successfully.');
    }
  };

  // Initial render
  renderCategories();
  renderProducts();
  
  // Initialize bag count and auth UI
  updateBagCount();
  updateAuthUI();
});
