document.addEventListener("DOMContentLoaded", () => {
  // Check if user is authenticated
  function isUserAuthenticated() {
    const token = localStorage.getItem('authToken');
    return token && token.trim() !== '';
  }

  // Redirect to sign-in if not authenticated
  if (!isUserAuthenticated()) {
    alert('You need to sign in to proceed with checkout.');
    window.location.href = 'sign-in.html';
    return;
  }

  const orderItems = document.getElementById("order-items");
  const orderTotal = document.getElementById("order-total");

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

  // Populate order summary
  function renderOrderSummary() {
    orderItems.innerHTML = ""; // Clear the current list
    let total = 0;

    const bag = getBag();

    bag.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
      `;
      orderItems.appendChild(row);
      total += item.price * item.quantity;
    });

    // Update total price
    orderTotal.textContent = total.toFixed(2);
  }

  // Handle form submission
  const shippingForm = document.getElementById("shipping-form");
  shippingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect shipping details
    const formData = new FormData(shippingForm);
    const shippingDetails = Object.fromEntries(formData.entries());

    const bag = getBag();
    const orderData = {
      items: bag,
      shippingDetails: shippingDetails,
      total: bag.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      orderDate: new Date().toISOString()
    };

    try {
      if (window.ThriftEaseAPI) {
        const response = await window.ThriftEaseAPI.Orders.submitOrder(orderData);
        console.log('Order submitted successfully:', response);
        
        alert("Thank you for your order! Your order has been submitted successfully.\n" +
          `Shipping to: ${shippingDetails.name}, ${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.zip}, ${shippingDetails.country}\n` +
          `Order ID: ${response.orderId || 'N/A'}`);
        
        // The new API automatically clears the bag after successful order
        window.location.href = "index.html";
      } else {
        // Fallback: simulate order placement
        alert("Thank you for your order! Your items will be shipped to:\n" +
          `${shippingDetails.name}, ${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.zip}, ${shippingDetails.country}`);
        
        localStorage.removeItem("bag");
        window.location.href = "index.html";
      }
      
    } catch (error) {
      console.error('Order submission error:', error);
      alert('There was an error processing your order. Please try again.');
    }
  });

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

  // Initial render
  renderOrderSummary();
});