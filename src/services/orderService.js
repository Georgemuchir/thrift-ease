import BaseApiService from './baseApi.js'

class OrderService extends BaseApiService {
  // Create new order
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  // Get user's orders
  async getOrders() {
    return this.request('/orders')
  }

  // Get specific order by ID
  async getOrder(id) {
    return this.request(`/orders/${id}`)
  }

  // Get order status
  async getOrderStatus(orderId) {
    return this.request(`/orders/${orderId}/status`)
  }

  // Update order status (admin only)
  async updateOrderStatus(orderId, status) {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  // Cancel order
  async cancelOrder(orderId, reason = '') {
    return this.request(`/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }

  // Track order
  async trackOrder(orderId) {
    return this.request(`/orders/${orderId}/tracking`)
  }

  // Get order history
  async getOrderHistory(page = 1, limit = 10) {
    const params = new URLSearchParams({ page, limit })
    return this.request(`/orders/history?${params}`)
  }

  // Request order return
  async requestReturn(orderId, items, reason) {
    return this.request(`/orders/${orderId}/return`, {
      method: 'POST',
      body: JSON.stringify({ items, reason }),
    })
  }

  // Get order invoice
  async getOrderInvoice(orderId) {
    return this.request(`/orders/${orderId}/invoice`)
  }

  // Reorder items from previous order
  async reorder(orderId) {
    return this.request(`/orders/${orderId}/reorder`, {
      method: 'POST',
    })
  }

  // Get delivery estimation
  async getDeliveryEstimation(zipCode, items) {
    return this.request('/orders/delivery-estimation', {
      method: 'POST',
      body: JSON.stringify({ zipCode, items }),
    })
  }

  // Get available payment methods
  async getPaymentMethods() {
    return this.request('/orders/payment-methods')
  }

  // Process payment
  async processPayment(orderId, paymentData) {
    return this.request(`/orders/${orderId}/payment`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    })
  }
}

export default new OrderService()
