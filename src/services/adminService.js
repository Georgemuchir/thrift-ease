import BaseApiService from './baseApi.js'

class AdminService extends BaseApiService {
  // User Management
  async getUsers(page = 1, limit = 10, search = '') {
    const params = new URLSearchParams({ page, limit, search })
    return this.request(`/admin/users?${params}`)
  }

  async getUser(userId) {
    return this.request(`/admin/users/${userId}`)
  }

  async updateUser(userId, userData) {
    return this.request(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    })
  }

  async updateUserRole(userId, role) {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    })
  }

  async banUser(userId, reason = '') {
    return this.request(`/admin/users/${userId}/ban`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }

  async unbanUser(userId) {
    return this.request(`/admin/users/${userId}/unban`, {
      method: 'POST',
    })
  }

  // Order Management
  async getAllOrders(page = 1, limit = 10, status = '') {
    const params = new URLSearchParams({ page, limit, status })
    return this.request(`/admin/orders?${params}`)
  }

  async getOrder(orderId) {
    return this.request(`/admin/orders/${orderId}`)
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  async processRefund(orderId, amount, reason) {
    return this.request(`/admin/orders/${orderId}/refund`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason }),
    })
  }

  // Product Management
  async getAllProducts(page = 1, limit = 10, category = '') {
    const params = new URLSearchParams({ page, limit, category })
    return this.request(`/admin/products?${params}`)
  }

  async approveProduct(productId) {
    return this.request(`/admin/products/${productId}/approve`, {
      method: 'POST',
    })
  }

  async rejectProduct(productId, reason) {
    return this.request(`/admin/products/${productId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }

  async bulkUpdateProducts(productIds, updateData) {
    return this.request('/admin/products/bulk-update', {
      method: 'PUT',
      body: JSON.stringify({ productIds, updateData }),
    })
  }

  async bulkDeleteProducts(productIds) {
    return this.request('/admin/products/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify({ productIds }),
    })
  }

  // Analytics & Reports
  async getDashboardStats() {
    return this.request('/admin/dashboard/stats')
  }

  async getSalesReport(startDate, endDate) {
    const params = new URLSearchParams({ startDate, endDate })
    return this.request(`/admin/reports/sales?${params}`)
  }

  async getUserReport(startDate, endDate) {
    const params = new URLSearchParams({ startDate, endDate })
    return this.request(`/admin/reports/users?${params}`)
  }

  async getProductReport() {
    return this.request('/admin/reports/products')
  }

  async getRevenueReport(period = 'monthly') {
    return this.request(`/admin/reports/revenue?period=${period}`)
  }

  // System Management
  async getSystemSettings() {
    return this.request('/admin/settings')
  }

  async updateSystemSettings(settings) {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  }

  async getActivityLogs(page = 1, limit = 50) {
    const params = new URLSearchParams({ page, limit })
    return this.request(`/admin/logs?${params}`)
  }

  async exportData(type, format = 'csv') {
    return this.request(`/admin/export/${type}?format=${format}`)
  }

  async backupDatabase() {
    return this.request('/admin/backup', {
      method: 'POST',
    })
  }

  // Special Offers & Promotions
  async getSpecialOffers() {
    return this.request('/admin/special-offers')
  }

  async createSpecialOffer(offerData) {
    return this.request('/admin/special-offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    })
  }

  async updateSpecialOffer(offerId, offerData) {
    return this.request(`/admin/special-offers/${offerId}`, {
      method: 'PUT',
      body: JSON.stringify(offerData),
    })
  }

  async deleteSpecialOffer(offerId) {
    return this.request(`/admin/special-offers/${offerId}`, {
      method: 'DELETE',
    })
  }
}

export default new AdminService()
