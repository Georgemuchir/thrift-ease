import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../styles/add-product.css';

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    subCategory: '',
    description: '',
    condition: 'Good',
    size: '',
    brand: '',
    image: '',
    color: '',
    material: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const categories = {
    'Women': ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Shoes'],
    'Men': ['Tops', 'Bottoms', 'Outerwear', 'Accessories', 'Shoes'],
    'Kids': ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Sleepwear', 'Accessories', 'Shoes'],
    'Shoes': ['Sneakers', 'Boots', 'Sandals', 'Formal Shoes', 'Athletic', 'Casual']
  };

  const conditions = ['New', 'Like New', 'Excellent', 'Very Good', 'Good', 'Fair'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Handle image preview
    if (name === 'image' && value) {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to add products');
      navigate('/sign-in');
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        sellerId: user.id,
        sellerEmail: user.email,
        sellerName: user.name || user.username
      };

      const response = await apiService.addProduct(productData);
      
      toast.success('Product added successfully!');
      navigate('/'); // Redirect to home page
      
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.response?.data?.error || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      subCategory: '',
      description: '',
      condition: 'Good',
      size: '',
      brand: '',
      image: '',
      color: '',
      material: ''
    });
    setImagePreview('');
  };

  return (
    <div className="add-product-page">
      <div className="container">
        <div className="page-header">
          <h1>Sell Your Item</h1>
          <p>Add your pre-loved items to our thrift marketplace</p>
        </div>

        <div className="add-product-container">
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-section">
              <h3>Basic Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Product Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Vintage Denim Jacket"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="price">Price ($) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {Object.keys(categories).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="subCategory">Subcategory</label>
                  <select
                    id="subCategory"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    disabled={!formData.category}
                  >
                    <option value="">Select Subcategory</option>
                    {formData.category && categories[formData.category]?.map(subcat => (
                      <option key={subcat} value={subcat}>{subcat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your item's features, style, and any special details..."
                  rows={4}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Item Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="condition">Condition *</label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    required
                  >
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="size">Size</label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="e.g., M, 32, 9.5"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="brand">Brand</label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., Nike, Zara, H&M"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="color">Color</label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g., Blue, Black, Multi-color"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="material">Material</label>
                <input
                  type="text"
                  id="material"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  placeholder="e.g., Cotton, Polyester, Leather"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Product Image</h3>
              
              <div className="form-group">
                <label htmlFor="image">Image URL</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
                <small className="form-help">
                  Enter a direct link to your product image. You can upload images to services like Imgur or use existing web images.
                </small>
              </div>

              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview || '/uploads/placeholder.png'} alt="Product preview" onError={() => setImagePreview('/uploads/placeholder.png')} />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={resetForm}
                className="btn secondary"
                disabled={loading}
              >
                Reset Form
              </button>
              
              <button
                type="submit"
                className="btn primary"
                disabled={loading}
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </form>

          <div className="form-tips">
            <h3>📝 Tips for Better Listings</h3>
            <ul>
              <li>Use clear, well-lit photos showing the item from multiple angles</li>
              <li>Be honest about the condition and any flaws</li>
              <li>Include measurements for better fit information</li>
              <li>Research similar items to price competitively</li>
              <li>Write detailed descriptions highlighting unique features</li>
              <li>Use relevant keywords to help buyers find your item</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
