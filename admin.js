document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("add-product-form");
  const productList = document.getElementById("product-list");

  // Retrieve products from localStorage or initialize as an empty array
  const products = JSON.parse(localStorage.getItem("products")) || [];

  // Function to render the product list in the admin panel
  function renderProducts() {
    productList.innerHTML = ""; // Clear the current list
    products.forEach((product, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${product.name}</td>
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

  // Handle form submission to add a new product
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("product-name").value;
    const price = parseFloat(document.getElementById("product-price").value);
    const imageInput = document.getElementById("product-image");
    const file = imageInput.files[0];

    console.log("Form submitted:", { name, price, file }); // Debug log

    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const imageBase64 = event.target.result;

        console.log("Image converted to Base64:", imageBase64); // Debug log

        // Add the new product to the array
        products.push({ name, price, image: imageBase64 });

        // Save the updated products array to localStorage
        localStorage.setItem("products", JSON.stringify(products));

        console.log("Product added:", { name, price, image: imageBase64 }); // Debug log

        // Clear the form
        productForm.reset();

        // Re-render the product list
        renderProducts();
      };

      // Read the file as a Base64 string
      reader.readAsDataURL(file);
    } else {
      alert("Please upload an image.");
    }
  });

  // Initial render
  renderProducts();
});