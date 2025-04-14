document.addEventListener("DOMContentLoaded", () => {
  const orderItems = document.getElementById("order-items");
  const orderTotal = document.getElementById("order-total");

  // Retrieve bag data from localStorage
  const bag = JSON.parse(localStorage.getItem("bag")) || [];

  // Populate order summary
  function renderOrderSummary() {
    orderItems.innerHTML = ""; // Clear the current list
    let total = 0;

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
  shippingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect shipping details
    const formData = new FormData(shippingForm);
    const shippingDetails = Object.fromEntries(formData.entries());

    // Simulate order placement
    alert("Thank you for your order! Your items will be shipped to:\n" +
      `${shippingDetails.name}, ${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.zip}, ${shippingDetails.country}`);

    // Clear bag and redirect to homepage
    localStorage.removeItem("bag");
    window.location.href = "index.html";
  });

  // Initial render
  renderOrderSummary();
});