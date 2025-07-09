document.addEventListener("DOMContentLoaded", () => {
  // Check if user is authenticated
  function isUserAuthenticated() {
    const token = localStorage.getItem('authToken');
    return token && token.trim() !== '';
  }

  // Redirect to sign-in if not authenticated
  if (!isUserAuthenticated()) {
    alert('You need to sign in to view your bag.');
    window.location.href = 'sign-in.html';
    return;
  }

  const bagItemsElement = document.getElementById("bag-items");
  const bagTotalElement = document.getElementById("bag-total");
  const bagCountElement = document.getElementById("bag-count");
  const checkoutButton = document.getElementById("checkout-button");

  // Function to get bag from API or localStorage
  function getBag() {
    try {
      if (window.ThriftEaseAPI && isUserAuthenticated()) {
        return window.ThriftEaseAPI.Bag.getBag();
      } else {
        // Not authenticated - return empty bag
        return [];
      }
    } catch (error) {
      console.error('❌ Error getting bag:', error);
      return [];
    }
  }

  // Function to update the bag count display
  function updateBagCount() {
    const bag = getBag();
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

    const bag = getBag();

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
        <td><button class="remove-item" data-id="${item.id}" style="background-color: #ff4d4d; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Remove</button></td>
      `;
      bagItemsElement.appendChild(row);
    });

    // Update the total price
    bagTotalElement.textContent = `$${total.toFixed(2)}`;

    // Add event listeners to remove buttons
    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const itemId = parseInt(e.target.getAttribute("data-id"));
        
        try {
          if (window.ThriftEaseAPI) {
            // Use new API to remove item
            window.ThriftEaseAPI.Bag.removeItem(itemId);
          } else {
            // Fallback to localStorage
            const bag = getBag();
            const itemIndex = bag.findIndex(item => item.id === itemId);
            if (itemIndex > -1) {
              bag.splice(itemIndex, 1);
              localStorage.setItem("bag", JSON.stringify(bag));
            }
          }
          
          updateBag(); // Refresh the bag
          updateBagCount(); // Refresh the bag count
        } catch (error) {
          console.error('❌ Error removing item from bag:', error);
        }
      });
    });
  }

  // Function to get current user email
  function getCurrentUserEmail() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        return user.email;
      } catch (e) {
        console.error('Error parsing user info:', e);
      }
    }
    return null;
  }

  // Function to sync bag with backend (deprecated - new API handles this automatically)
  async function syncBagWithBackend() {
    // This is now handled automatically by the new API service
    console.log('ℹ️ Sync is handled automatically by new API service');
  }

  // Add event listener to the checkout button
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      const bag = getBag();
      if (bag.length === 0) {
        alert("Your bag is empty. Add items before checking out.");
      } else {
        window.location.href = "checkout.html"; // Redirect to the checkout page
      }
    });
  }

  // Listen for bag updates from other tabs/devices
  if (window.ThriftEaseAPI) {
    window.ThriftEaseAPI.State.addListener('bagUpdate', (newBag) => {
      updateBag();
      updateBagCount();
    });
  }

  // Initialize the bag
  updateBagCount();
  updateBag();
});