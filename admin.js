document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("add-product-form");
  const productList = document.getElementById("product-list");
  const mainCategory = document.getElementById("main-category");
  const subCategory = document.getElementById("sub-category");

  // Load existing products or initialize empty array
  const products = JSON.parse(localStorage.getItem("products")) || [];

  // Updated categories and subcategories
  const categories = {
    women: ["Dresses", "Tops", "Jeans", "Skirts", "Activewear", "Coats & Jackets"],
    men: ["Shirts", "T-Shirts", "Jeans", "Trousers", "Shorts", "Jackets & Coats"],
    "kids-boys": ["T-Shirts", "Sweatshirts & Hoodies", "Pants", "Shorts", "Jackets"],
    "kids-girls": ["Dresses", "Tops", "Leggings", "Skirts", "Hoodies", "Jackets"],
    shoes: ["Sneakers", "Boots", "Sandals", "Formal Shoes"]
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
  productForm.addEventListener("submit", (e) => {
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
    reader.onload = function (event) {
      const imageBase64 = event.target.result;

      // Add new product
      products.push({
        name,
        mainCategory: mainCategoryValue,
        subCategory: subCategoryValue,
        price,
        image: imageBase64,
        key: mainCategoryKey // optional: keep internal key if needed later
      });

      localStorage.setItem("products", JSON.stringify(products));
      productForm.reset();
      renderProducts();
    };

    reader.readAsDataURL(file);
  });

  // Initial render
  renderProducts();
});
