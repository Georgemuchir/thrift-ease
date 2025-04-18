document.addEventListener("DOMContentLoaded", () => {
  const categoryMenu = document.getElementById("category-menu");
  const categoriesSection = document.getElementById("categories-section");
  const productGrid = document.getElementById("product-grid");

  // Retrieve products from localStorage
  const products = JSON.parse(localStorage.getItem("products")) || [];

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
      if (filterCategory && product.mainCategory.toLowerCase() !== filterCategory) return false;
      if (filterSubgroup && product.subGroup?.toLowerCase() !== filterSubgroup) return false;
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

  // Initial render
  renderCategories();
  renderProducts();
});
