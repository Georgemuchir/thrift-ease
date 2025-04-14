document.addEventListener("DOMContentLoaded", () => {
  // Restrict access to the admin page
  if (window.location.pathname.includes("admin.html")) {
    const isAdmin = confirm("Are you authorized to access the admin panel?");
    if (!isAdmin) {
      alert("Access denied!");
      window.location.href = "index.html"; // Redirect unauthorized users to the homepage
    }
  }

  // Admin functionality (adding and removing items)
  const addItemForm = document.getElementById("add-item-form");
  const inventoryTable = document.getElementById("inventory-table")?.querySelector("tbody");

  if (addItemForm) {
    addItemForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const itemName = document.getElementById("item-name").value;
      const itemPrice = document.getElementById("item-price").value;
      const itemQuantity = document.getElementById("item-quantity").value;

      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${itemName}</td>
        <td>$${itemPrice}</td>
        <td>${itemQuantity}</td>
        <td>
          <button class="delete-item">Remove</button>
        </td>
      `;

      newRow.querySelector(".delete-item").addEventListener("click", () => {
        newRow.remove();
      });

      inventoryTable.appendChild(newRow);
      addItemForm.reset();
    });
  }

  // Cart functionality
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const bagCountElement = document.getElementById("bag-count");
  const bagDropdown = document.getElementById("bag-dropdown");
  const bagItemsElement = document.getElementById("bag-items");
  const bagTotalElement = document.getElementById("bag-total");
  const checkoutButton = document.getElementById("checkout-button");

  let bagCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Update the bag count display
  function updateBagCount() {
    bagCountElement.textContent = bagCount;
  }

  // Update the bag dropdown display
  function updateBagDropdown() {
    bagItemsElement.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const listItem = document.createElement("li");
      listItem.innerHTML = `
        ${item.name} (x${item.quantity}) - $${itemTotal.toFixed(2)}
        <button data-index="${index}" class="remove-item">Remove</button>
      `;
      bagItemsElement.appendChild(listItem);
    });

    bagTotalElement.textContent = `Total: $${total.toFixed(2)}`;

    // Add event listeners to remove buttons
    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        bagCount -= cart[index].quantity;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateBagCount();
        updateBagDropdown();
      });
    });
  }

  // Add to cart function
  function addToCart(itemName, itemPrice) {
    const existingItem = cart.find((item) => item.name === itemName);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name: itemName, price: parseFloat(itemPrice), quantity: 1 });
    }
    bagCount++;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateBagCount();
    updateBagDropdown();
    alert(`${itemName} has been added to your bag.`);
  }

  // Add event listeners to "Add to Cart" buttons
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    const addButton = card.querySelector(".add-to-cart");

    addButton.addEventListener("click", () => {
      const itemName = card.querySelector("h3").textContent;
      const itemPrice = card.querySelector("p").textContent.replace("$", "");
      addToCart(itemName, itemPrice);
    });
  });

  // Toggle bag dropdown visibility
  document.querySelector(".cart-link").addEventListener("click", (e) => {
    e.preventDefault();
    bagDropdown.style.display =
      bagDropdown.style.display === "block" ? "none" : "block";
  });

  // Close the dropdown if clicked outside
  document.addEventListener("click", (e) => {
    if (!bagDropdown.contains(e.target) && !document.querySelector(".cart-link").contains(e.target)) {
      bagDropdown.style.display = "none";
    }
  });

  // Initialize bag count and dropdown
  updateBagCount();
  updateBagDropdown();

  // Checkout button functionality
  checkoutButton.addEventListener("click", () => {
    alert("Proceeding to checkout...");
    // Add checkout logic here
  });

  console.log("QuickThrift website loaded!");
});
document.addEventListener("DOMContentLoaded", () => {
  const createAccountButton = document.getElementById("create-account-button");
  const signUpForm = document.getElementById("sign-up-form");

  // Add event listener to the "Create Account" button
  createAccountButton.addEventListener("click", () => {
    // Toggle the visibility of the Sign Up form
    signUpForm.classList.toggle("hidden");

    // Optionally, scroll to the Sign Up form when it becomes visible
    if (!signUpForm.classList.contains("hidden")) {
      signUpForm.scrollIntoView({ behavior: "smooth" });
    }
  });
});