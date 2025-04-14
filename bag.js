document.addEventListener("DOMContentLoaded", () => {
  const bagItemsElement = document.getElementById("bag-items");
  const bagTotalElement = document.getElementById("bag-total");
  const bagCountElement = document.getElementById("bag-count");
  const checkoutButton = document.getElementById("checkout-button");

  // Retrieve the bag from localStorage or initialize it as an empty array
  const bag = JSON.parse(localStorage.getItem("bag")) || [];

  // Function to update the bag count display
  function updateBagCount() {
    const totalItems = bag.reduce((total, item) => total + item.quantity, 0);
    if (bagCountElement) {
      bagCountElement.textContent = totalItems;
    }
  }

  // Function to update the bag table
  function updateBag() {
    if (!bagItemsElement || !bagTotalElement) return; // Ensure elements exist
    bagItemsElement.innerHTML = ""; // Clear the current list
    let total = 0;

    bag.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      // Create a table row for each item
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>$${itemTotal.toFixed(2)}</td>
        <td><button class="remove-item" data-index="${index}" style="background-color: #ff4d4d; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Remove</button></td>
      `;
      bagItemsElement.appendChild(row);
    });

    // Update the total price
    bagTotalElement.textContent = `$${total.toFixed(2)}`;

    // Add event listeners to remove buttons
    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        bag.splice(index, 1); // Remove the item from the bag
        localStorage.setItem("bag", JSON.stringify(bag)); // Update localStorage
        updateBag(); // Refresh the bag
        updateBagCount(); // Refresh the bag count
      });
    });
  }

  // Add event listener to the checkout button
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      if (bag.length === 0) {
        alert("Your bag is empty. Add items before checking out.");
      } else {
        window.location.href = "checkout.html"; // Redirect to the checkout page
      }
    });
  }

  // Initialize the bag
  updateBagCount();
  updateBag();
});