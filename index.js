document.addEventListener("DOMContentLoaded", () => {
  const categoryMenu = document.getElementById("category-menu");
  const categoriesSection = document.getElementById("categories-section");
  const productGrid = document.getElementById("product-grid");

  // Retrieve products from localStorage
  const products = JSON.parse(localStorage.getItem("products")) || [];

  // Categories and their subcategories
  const categories = {
    women: ["Dresses", "Graphic Tees", "Lounge", "Jeans"],
    men: ["Tops", "Shorts", "Graphics"],
    "kids-boys": ["T-Shirts", "Sweatshirts & Sweatpants", "Casual Shirts", "Shorts & Swim", "Jeans & Pants"],
    "kids-girls": ["Dresses & Rompers", "Sweaters", "Sweatshirts & Sweatpants", "T-Shirts & Tops", "Polo Shirts", "Skirts & Shorts"],
    shoes: ["Shoes"]
  };

  // Function to render categories in the navigation menu
  function renderCategories() {
    categoryMenu.innerHTML = ""; // Clear existing categories
    Object.keys(categories).forEach((categoryKey) => {
      const categoryName = categoryKey.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const li = document.createElement("li");
      li.innerHTML = `<a href="#" class="dropdown-link" data-category="${categoryKey}">${categoryName}</a>`;
      categoryMenu.appendChild(li);
    });
  }

  // Function to render subcategories in the categories section
  function renderSubcategories(categoryKey) {
    categoriesSection.innerHTML = ""; // Clear existing subcategories
    const subcategories = categories[categoryKey] || [];
    subcategories.forEach((subcategory) => {
      const a = document.createElement("a");
      a.href = "#";
      a.className = "category-link";
      a.textContent = subcategory;
      a.dataset.subcategory = subcategory.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
      categoriesSection.appendChild(a);
    });
  }

  // Function to render products in the product grid
  function renderProducts(filterCategory = null, filterSubcategory = null) {
    productGrid.innerHTML = ""; // Clear existing products
    const filteredProducts = products.filter((product) => {
      if (filterCategory && product.mainCategory.toLowerCase() !== filterCategory) return false;
      if (filterSubcategory && product.subCategory.toLowerCase() !== filterSubcategory) return false;
      return true;
    });

    if (filteredProducts.length === 0) {
      productGrid.innerHTML = "<p>No products found.</p>";
      return;
    }

    filteredProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">$${product.price.toFixed(2)}</p>
      `;
      productGrid.appendChild(productCard);
    });
  }

  // Event listener for category clicks
  categoryMenu.addEventListener("click", (e) => {
    if (e.target.classList.contains("dropdown-link")) {
      e.preventDefault();
      const categoryKey = e.target.dataset.category;
      renderSubcategories(categoryKey);
      renderProducts(categoryKey);
    }
  });

  // Event listener for subcategory clicks
  categoriesSection.addEventListener("click", (e) => {
    if (e.target.classList.contains("category-link")) {
      e.preventDefault();
      const subcategoryKey = e.target.dataset.subcategory;
      const categoryKey = Object.keys(categories).find((key) =>
        categories[key].some((sub) => sub.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-") === subcategoryKey)
      );
      renderProducts(categoryKey, subcategoryKey);
    }
  });

  // Initial render
  renderCategories();
  renderProducts();
});