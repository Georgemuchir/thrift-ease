import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/admin.css';

const Admin = () => {
  const { user, logout } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext);
  
  // Admin state
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Product form state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    condition: 'Good',
    size: '',
    brand: ''
  });
  
  // Filters and search
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      return;
    }
    
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard stats
      const stats = await apiService.getAdminStats();
      setDashboardStats(stats);
      
      // Load initial data
      const [productsData, ordersData, usersData] = await Promise.all([
        apiService.getProducts(),
        apiService.getOrders(),
        apiService.getUsers()
      ]);
      
      setProducts(productsData);
      setOrders(ordersData);
      setUsers(usersData);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProduct = {
        ...productForm,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString(),
        status: 'active'
      };
      
      await apiService.addProduct(newProduct);
      setProducts([...products, newProduct]);
      setProductForm({
        name: '',
        price: '',
        category: '',
        description: '',
        image: '',
        condition: 'Good',
        size: '',
        brand: ''
      });
      setShowAddProductModal(false);
      toast.success('Product added successfully!');
      
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      await apiService.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success('Order status updated!');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await apiService.updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      toast.success('User role updated!');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesStatus = !filters.status || product.status === filters.status;
    const matchesSearch = !filters.search || 
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.brand.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleLogout = () => {
    clearCart();
    logout();
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <h1 className="admin-title">
            <span className="admin-icon">⚙️</span>
            QuickThrift Admin
          </h1>
          <div className="admin-nav">
            <button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              📦 Products
            </button>
            <button 
              className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📋 Orders
            </button>
            <button 
              className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Users
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading admin data...</p>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="dashboard-section">
                <h2>Dashboard Overview</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                      <span className="stat-number">{dashboardStats.totalProducts}</span>
                      <span className="stat-label">Products</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-info">
                      <span className="stat-number">{dashboardStats.totalOrders}</span>
                      <span className="stat-label">Orders</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                      <span className="stat-number">{dashboardStats.totalUsers}</span>
                      <span className="stat-label">Users</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                      <span className="stat-number">${dashboardStats.totalRevenue}</span>
                      <span className="stat-label">Revenue</span>
                    </div>
                  </div>
                </div>

                <div className="quick-actions">
                  <h3>Quick Actions</h3>
                  <div className="action-grid">
                    <button 
                      className="action-card"
                      onClick={() => setShowAddProductModal(true)}
                    >
                      <div className="action-icon">➕</div>
                      <div className="action-text">Add Product</div>
                    </button>
                    <button 
                      className="action-card"
                      onClick={() => setActiveTab('orders')}
                    >
                      <div className="action-icon">📋</div>
                      <div className="action-text">View Orders</div>
                    </button>
                    <button 
                      className="action-card"
                      onClick={() => setActiveTab('users')}
                    >
                      <div className="action-icon">👥</div>
                      <div className="action-text">Manage Users</div>
                    </button>
                    <button 
                      className="action-card"
                      onClick={() => window.print()}
                    >
                      <div className="action-icon">📊</div>
                      <div className="action-text">Print Report</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="products-section">
                <div className="section-header">
                  <h2>Product Management</h2>
                  <button 
                    className="btn primary"
                    onClick={() => setShowAddProductModal(true)}
                  >
                    ➕ Add Product
                  </button>
                </div>

                {/* Filters */}
                <div className="admin-filters">
                  <select 
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="filter-select"
                  >
                    <option value="">All Categories</option>
                    <option value="Women">Women's</option>
                    <option value="Men">Men's</option>
                    <option value="Kids">Kids</option>
                    <option value="Shoes">Shoes</option>
                  </select>

                  <select 
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="filter-select"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="sold">Sold</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="search-input"
                  />
                </div>

                {/* Products Table */}
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(product => (
                        <tr key={product.id}>
                          <td>
                            <img 
                              src={product.image || '/icons/placeholder.jpg'} 
                              alt={product.name}
                              className="product-thumb"
                            />
                          </td>
                          <td>{product.name}</td>
                          <td>{product.category}</td>
                          <td>${product.price}</td>
                          <td>
                            <span className={`status-badge ${product.status}`}>
                              {product.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn-icon edit"
                              title="Edit Product"
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn-icon delete"
                              onClick={() => handleDeleteProduct(product.id)}
                              title="Delete Product"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="orders-section">
                <div className="section-header">
                  <h2>Order Management</h2>
                  <div className="order-stats">
                    <span>Pending: <strong>{orders.filter(o => o.status === 'pending').length}</strong></span>
                    <span>Completed: <strong>{orders.filter(o => o.status === 'completed').length}</strong></span>
                  </div>
                </div>

                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.customerName}</td>
                          <td>{order.items?.length || 0} items</td>
                          <td>${order.total}</td>
                          <td>
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="status-select"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>
                            <button className="btn-icon view" title="View Details">
                              👁️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="users-section">
                <div className="section-header">
                  <h2>User Management</h2>
                  <div className="user-stats">
                    <span>Active: <strong>{users.filter(u => u.status === 'active').length}</strong></span>
                    <span>Total: <strong>{users.length}</strong></span>
                  </div>
                </div>

                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Join Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <select
                              value={user.role}
                              onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                              className="role-select"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge ${user.status}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn-icon view" title="View Profile">
                              👁️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="modal-overlay" onClick={() => setShowAddProductModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Product</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAddProductModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleProductSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="product-name">Product Name</label>
                  <input
                    id="product-name"
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="product-price">Price ($)</label>
                  <input
                    id="product-price"
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="product-category">Category</label>
                  <select
                    id="product-category"
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Women">Women's</option>
                    <option value="Men">Men's</option>
                    <option value="Kids">Kids</option>
                    <option value="Shoes">Shoes</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="product-condition">Condition</label>
                  <select
                    id="product-condition"
                    value={productForm.condition}
                    onChange={(e) => setProductForm({...productForm, condition: e.target.value})}
                  >
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="product-size">Size</label>
                  <input
                    id="product-size"
                    type="text"
                    value={productForm.size}
                    onChange={(e) => setProductForm({...productForm, size: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="product-brand">Brand</label>
                  <input
                    id="product-brand"
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="product-image">Image URL</label>
                <input
                  id="product-image"
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-description">Description</label>
                <textarea
                  id="product-description"
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn primary">
                  Add Product
                </button>
                <button 
                  type="button" 
                  className="btn secondary"
                  onClick={() => setShowAddProductModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
