document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("add-product-form");
  const productList = document.getElementById("product-list");
  const mainCategory = document.getElementById("main-category");
  const subCategory = document.getElementById("sub-category");

  // Retrieve products from localStorage or initialize as an empty array
  const products = JSON.parse(localStorage.getItem("products")) || [];

  // Categories and their subcategories
  const categories = {
    women: ["Dresses", "Graphic Tees", "Lounge", "Jeans"],
    men: ["Tops", "Shorts", "Graphics"],
    "kids-boys": ["T-Shirts", "Sweatshirts & Sweatpants", "Casual Shirts", "Shorts & Swim", "Jeans & Pants"],
    "kids-girls": ["Dresses & Rompers", "Sweaters", "Sweatshirts & Sweatpants", "T-Shirts & Tops", "Polo Shirts", "Skirts & Shorts"],
    shoes: ["Shoes"]
  };

  // Function to render the product list in the admin panel
  function renderProducts() {
    productList.innerHTML = ""; // Clear the current list
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

    // Add event listeners to delete buttons
    document.querySelectorAll(".delete-product").forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        products.splice(index, 1); // Remove the product from the array
        localStorage.setItem("products", JSON.stringify(products)); // Update localStorage
        renderProducts(); // Re-render the product list
      });
    });
  }

  // Populate subcategories based on the selected main category
  mainCategory.addEventListener("change", () => {
    const selectedCategory = mainCategory.value;
    const subcategories = categories[selectedCategory] || [];

    // Clear existing options
    subCategory.innerHTML = '<option value="" disabled selected>Select a subcategory</option>';

    // Populate subcategories
    subcategories.forEach((sub) => {
      const option = document.createElement("option");
      option.value = sub.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
      option.textContent = sub;
      subCategory.appendChild(option);
    });
  });

  // Handle form submission to add a new product
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("product-name").value;
    const mainCategoryValue = mainCategory.options[mainCategory.selectedIndex].text;
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

      // Add the new product to the array
      products.push({
        name,
        mainCategory: mainCategoryValue,
        subCategory: subCategoryValue,
        price,
        image: imageBase64
      });

      // Save the updated products array to localStorage
      localStorage.setItem("products", JSON.stringify(products));

      // Clear the form
      productForm.reset();

      // Re-render the product list
      renderProducts();
    };

    // Read the file as a Base64 string
    reader.readAsDataURL(file);
  });

  // Initial render
  renderProducts();
});