import BaseApiService from './baseApi.js'

class CartService extends BaseApiService {
  // Get user's cart
  async getCart() {
    return this.request('/cart')
  }

  // Add item to cart
  async addToCart(productId, quantity = 1, size = 'M') {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, size }),
    })
  }

  // Update cart item quantity
  async updateCartItem(cartItemId, quantity) {
    return this.request(`/cart/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    })
  }

  // Update cart item size
  async updateCartItemSize(cartItemId, size) {
    return this.request(`/cart/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ size }),
    })
  }

  // Remove item from cart
  async removeFromCart(cartItemId) {
    return this.request(`/cart/${cartItemId}`, {
      method: 'DELETE',
    })
  }

  // Clear entire cart
  async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE',
    })
  }

  // Get cart total
  async getCartTotal() {
    return this.request('/cart/total')
  }

  // Get cart item count
  async getCartItemCount() {
    return this.request('/cart/count')
  }

  // Apply coupon to cart
  async applyCoupon(couponCode) {
    return this.request('/cart/coupon', {
      method: 'POST',
      body: JSON.stringify({ couponCode }),
    })
  }

  // Remove coupon from cart
  async removeCoupon() {
    return this.request('/cart/coupon', {
      method: 'DELETE',
    })
  }

  // Validate cart before checkout
  async validateCart() {
    return this.request('/cart/validate')
  }

  // Move item to wishlist
  async moveToWishlist(cartItemId) {
    return this.request(`/cart/${cartItemId}/move-to-wishlist`, {
      method: 'POST',
    })
  }
}

export default new CartService()
