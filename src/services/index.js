// Unified API service exports
import authService from './authService.js'
import productService from './productService.js'
import cartService from './cartService.js'
import orderService from './orderService.js'
import uploadService from './uploadService.js'
import adminService from './adminService.js'
import BaseApiService from './baseApi.js'

// Export individual services
export {
  authService,
  productService,
  cartService,
  orderService,
  uploadService,
  adminService,
  BaseApiService
}

// Create unified API object for backward compatibility
const api = {
  // Auth methods
  login: authService.login.bind(authService),
  register: authService.register.bind(authService),
  logout: authService.logout.bind(authService),
  getProfile: authService.getProfile.bind(authService),
  updateProfile: authService.updateProfile.bind(authService),
  verifyToken: authService.verifyToken.bind(authService),

  // Product methods
  getProducts: productService.getProducts.bind(productService),
  getProduct: productService.getProduct.bind(productService),
  createProduct: productService.createProduct.bind(productService),
  updateProduct: productService.updateProduct.bind(productService),
  deleteProduct: productService.deleteProduct.bind(productService),
  searchProducts: productService.searchProducts.bind(productService),
  getFeaturedProducts: productService.getFeaturedProducts.bind(productService),

  // Cart methods
  getCart: cartService.getCart.bind(cartService),
  addToCart: cartService.addToCart.bind(cartService),
  updateCartItem: cartService.updateCartItem.bind(cartService),
  removeFromCart: cartService.removeFromCart.bind(cartService),
  clearCart: cartService.clearCart.bind(cartService),

  // Order methods
  createOrder: orderService.createOrder.bind(orderService),
  getOrders: orderService.getOrders.bind(orderService),
  getOrder: orderService.getOrder.bind(orderService),
  updateOrderStatus: orderService.updateOrderStatus.bind(orderService),
  cancelOrder: orderService.cancelOrder.bind(orderService),

  // Upload methods
  uploadImage: uploadService.uploadImage.bind(uploadService),
  uploadMultipleImages: uploadService.uploadMultipleImages.bind(uploadService),
  getImageUrl: uploadService.getImageUrl.bind(uploadService),
  uploadAvatar: uploadService.uploadAvatar.bind(uploadService),

  // Admin methods
  getUsers: adminService.getUsers.bind(adminService),
  updateUser: adminService.updateUser.bind(adminService),
  deleteUser: adminService.deleteUser.bind(adminService),
  getDashboardStats: adminService.getDashboardStats.bind(adminService),
  getAllOrders: adminService.getAllOrders.bind(adminService),
  getSpecialOffers: adminService.getSpecialOffers.bind(adminService),
  createSpecialOffer: adminService.createSpecialOffer.bind(adminService),

  // Health check
  healthCheck: authService.healthCheck.bind(authService),
}

// Default export for backward compatibility
export default api
