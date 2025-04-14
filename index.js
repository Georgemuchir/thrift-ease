document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("product-grid");
  const bagCountElement = document.getElementById("bag-count");

  // Retrieve products and bag from localStorage
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const bag = JSON.parse(localStorage.getItem("bag")) || [];

  // Function to save the bag to localStorage
  function saveBag() {
    localStorage.setItem("bag", JSON.stringify(bag));
  }

  // Function to update the bag count display
  function updateBagCount() {
    const totalItems = bag.reduce((total, item) => total + item.quantity, 0);
    if (bagCountElement) {
      bagCountElement.textContent = totalItems;
    }
  }

  // Function to render products on the homepage
  function renderProducts() {
    productGrid.innerHTML = ""; // Clear the current product grid

    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <button class="add-to-bag">Add to Bag</button>
      `;
      productGrid.appendChild(productCard);

      // Add event listener to the "Add to Bag" button
      const addToBagButton = productCard.querySelector(".add-to-bag");
      addToBagButton.addEventListener("click", () => {
        const existingItem = bag.find((item) => item.name === product.name);
        if (existingItem) {
          existingItem.quantity += 1; // Increment quantity if the item already exists
        } else {
          bag.push({ ...product, quantity: 1 }); // Add new item to the bag
        }
        saveBag(); // Save the updated bag to localStorage
        updateBagCount(); // Update the bag count display
        alert(`${product.name} has been added to your bag!`);
      });
    });
  }

  // Initial render
  renderProducts();
  updateBagCount(); // Update the bag count on page load
});