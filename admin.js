document.addEventListener("DOMContentLoaded", async () => {
  const productForm = document.getElementById("add-product-form");
  const productList = document.getElementById("product-list");
  const mainCategory = document.getElementById("main-category");
  const subCategory = document.getElementById("sub-category");

  // Load existing products from API (with localStorage fallback)
  let products = [];
  
  try {
    if (window.ThriftEaseAPI) {
      products = await window.ThriftEaseAPI.Products.fetchProducts();
      console.log('Admin: Products loaded from API:', products);
    } else {
      products = JSON.parse(localStorage.getItem("products")) || [];
      console.log('Admin: Products loaded from localStorage:', products);
    }
  } catch (error) {
    console.error('Error loading products:', error);
    products = JSON.parse(localStorage.getItem("products")) || [];
  }

  // Updated categories and subcategories - matching frontend
  const categories = {
    "Women": ["Dresses", "Tops", "Jeans", "Skirts", "Activewear", "Coats & Jackets"],
    "Men": ["Shirts", "T-Shirts", "Jeans", "Trousers", "Shorts", "Jackets & Coats"],
    "Kids-Boys": ["T-Shirts", "Sweatshirts & Hoodies", "Pants", "Shorts", "Jackets"],
    "Kids-Girls": ["Dresses", "Tops", "Leggings", "Skirts", "Hoodies", "Jackets"],
    "Shoes": ["Sneakers", "Boots", "Sandals", "Formal Shoes"]
  };

  // Render existing products in table
  function renderProducts() {
    productList.innerHTML = "";
    products.forEach((product, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.mainCategory}</td>
        <td>${product.subCategory}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
        <td>
          <button class="delete-product" data-index="${index}" style="background-color: #ff4d4d; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Delete</button>
        </td>
      `;
      productList.appendChild(row);
    });

    // Handle deletion
    document.querySelectorAll(".delete-product").forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        renderProducts();
      });
    });
  }

  // Populate subcategories based on main category selection
  mainCategory.addEventListener("change", () => {
    const selected = mainCategory.value;
    const subcategories = categories[selected] || [];
    subCategory.innerHTML = '<option value="" disabled selected>Select a subcategory</option>';

    subcategories.forEach((sub) => {
      const option = document.createElement("option");
      option.value = sub.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
      option.textContent = sub;
      subCategory.appendChild(option);
    });
  });

  // Handle form submission
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("product-name").value;
    const mainCategoryValue = mainCategory.options[mainCategory.selectedIndex]?.text;
    const mainCategoryKey = mainCategory.value;
    const subCategoryValue = subCategory.options[subCategory.selectedIndex]?.text || "N/A";
    const price = parseFloat(document.getElementById("product-price").value);
    const imageInput = document.getElementById("product-image");
    const file = imageInput.files[0];

    if (!file) {
      alert("Please upload an image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
      const imageBase64 = event.target.result;

      const newProduct = {
        name,
        mainCategory: mainCategoryKey, // Use the key value directly
        subCategory: subCategoryValue,
        price,
        image: imageBase64
      };

      // Add subGroup for Kids categories
      if (mainCategoryKey.startsWith('Kids-')) {
        newProduct.subGroup = mainCategoryKey.split('-')[1].toLowerCase(); // "boys" or "girls"
        newProduct.mainCategory = 'Kids'; // Normalize to just "Kids"
      }

      try {
        // Try to add product via API first
        if (window.ThriftEaseAPI) {
          await window.ThriftEaseAPI.Products.addProduct(newProduct);
          console.log('Product added via API');
        } else {
          // Fallback to localStorage
          products.push(newProduct);
          localStorage.setItem("products", JSON.stringify(products));
          console.log('Product added to localStorage');
        }

        productForm.reset();
        
        // Reload products and refresh display
        try {
          if (window.ThriftEaseAPI) {
            const updatedProducts = await window.ThriftEaseAPI.Products.fetchProducts();
            // Update local products array
            products.length = 0;
            products.push(...updatedProducts);
          }
        } catch (error) {
          console.error('Error reloading products:', error);
        }
        
        renderProducts();
        alert('Product added successfully!');
        
      } catch (error) {
        console.error('Error adding product:', error);
        alert('Error adding product. Please try again.');
      }
    };

    reader.readAsDataURL(file);
  });

  // Initial render
  renderProducts();
});
