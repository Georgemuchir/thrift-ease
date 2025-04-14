document.addEventListener("DOMContentLoaded", () => {
  console.log("QuickThrift website loaded!");

  const productGrid = document.getElementById("product-grid");

  // Ensure productGrid exists
  if (!productGrid) {
    console.error("Product grid element not found!");
    return;
  }

  const sampleProduct = {
    name: "Men's Casual Shirt",
    price: 1200,
    image: "images/shirt1.jpg"
  };

  function createCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>KES ${product.price.toLocaleString()}</p>
      <button class="add-to-bag">Add to Bag</button>
    `;

    // Add event listener to the "Add to Bag" button
    const addToBagButton = card.querySelector(".add-to-bag");
    addToBagButton.addEventListener("click", () => {
      console.log(`${product.name} added to the bag!`);
      // Add functionality to update the bag here
    });

    productGrid.appendChild(card);
  }

  // Call function for each product (you probably already do this)
  createCard(sampleProduct);
});