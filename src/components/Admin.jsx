import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import apiService from '../services/api'

const Admin = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('products')
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: 'women',
    image: '',
    condition: 'good',
    brand: ''
  })

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      setLoading(true)
      if (activeTab === 'products') {
        const productsData = await apiService.getProducts()
        setProducts(productsData)
      } else if (activeTab === 'users') {
        const usersData = await apiService.getUsers()
        setUsers(usersData)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      setIsUploading(true)
      
      let imageUrl = newProduct.image || '/api/placeholder/400/400'
      
      // Upload image if a file was selected
      if (imageFile) {
        try {
          const uploadResult = await apiService.uploadImage(imageFile)
          imageUrl = uploadResult.url
        } catch (uploadError) {
          console.warn('Image upload failed, using placeholder:', uploadError)
          // Continue with placeholder image instead of failing
          imageUrl = '/api/placeholder/400/400'
        }
      }
      
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        image: imageUrl
      }
      
      await apiService.createProduct(productData)
      
      // Reset form
      setNewProduct({
        name: '',
        price: '',
        description: '',
        category: 'women',
        image: '',
        condition: 'good',
        brand: ''
      })
      setImageFile(null)
      setImagePreview('')
      setShowAddProduct(false)
      fetchData()
      alert('Product added successfully!')
    } catch (error) {
      console.error('Failed to add product:', error)
      alert('Failed to add product: ' + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await apiService.deleteProduct(id)
        fetchData()
        alert('Product deleted successfully!')
      } catch (error) {
        console.error('Failed to delete product:', error)
        alert('Failed to delete product')
      }
    }
  }

  const handleDeleteUser = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await apiService.deleteUser(id)
        fetchData()
        alert('User deleted successfully!')
      } catch (error) {
        console.error('Failed to delete user:', error)
        alert('Failed to delete user')
      }
    }
  }

  const handleImageFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (PNG, JPG, JPEG, GIF, or WebP)')
        return
      }
      
      // Validate file size (16MB max)
      if (file.size > 16 * 1024 * 1024) {
        alert('File size must be less than 16MB')
        return
      }
      
      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
      
      // Clear URL input if file is selected
      setNewProduct({...newProduct, image: ''})
    }
  }

  const handleImageUrlChange = (e) => {
    const url = e.target.value
    setNewProduct({...newProduct, image: url})
    if (url) {
      setImageFile(null)
      setImagePreview(url)
    } else {
      setImagePreview('')
    }
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview('')
    setNewProduct({...newProduct, image: ''})
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You need admin privileges to access this page.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="container">
        <h1>Admin Dashboard</h1>
        
        <div className="admin-tabs">
          <button 
            className={`tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="products-admin">
            <div className="admin-header">
              <h2>Manage Products</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddProduct(true)}
              >
                Add New Product
              </button>
            </div>

            {showAddProduct && (
              <div className="add-product-form">
                <h3>Add New Product</h3>
                <form onSubmit={handleAddProduct}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      >
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="kids">Kids</option>
                        <option value="shoes">Shoes</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Condition</label>
                      <select
                        value={newProduct.condition}
                        onChange={(e) => setNewProduct({...newProduct, condition: e.target.value})}
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Image</label>
                    <div className="image-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        disabled={isUploading}
                      />
                      {imagePreview && (
                        <div className="image-preview">
                          <img src={imagePreview} alt="Image preview" />
                          <button 
                            className="btn btn-clear"
                            onClick={clearImage}
                          >
                            &times;
                          </button>
                        </div>
                      )}
                    </div>
                    <input
                      type="url"
                      placeholder="Or enter image URL"
                      value={newProduct.image}
                      onChange={handleImageUrlChange}
                      disabled={isUploading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Brand</label>
                    <input
                      type="text"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Add Product</button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowAddProduct(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="loading">Loading products...</div>
            ) : (
              <div className="products-table">
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Condition</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>
                          <img src={product.image} alt={product.name} className="product-thumb" />
                        </td>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.category}</td>
                        <td>{product.condition}</td>
                        <td>
                          <button 
                            className="btn btn-danger btn-small"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-admin">
            <h2>Manage Users</h2>
            
            {loading ? (
              <div className="loading">Loading users...</div>
            ) : (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          {user.role !== 'admin' && (
                            <button 
                              className="btn btn-danger btn-small"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
