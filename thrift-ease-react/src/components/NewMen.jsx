import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { FaHeart, FaShoppingBag, FaStar, FaFilter, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const NewMen = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());

  const { addToCart, isInCart } = useCart();

  const subcategories = [
    "Shirts", "T-Shirts", "Jeans", "Trousers", "Shorts", "Jackets & Coats"
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedSubcategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.fetchProductsByCategory('men');
      setProducts(data);
    } catch (error) {
      console.error('Error fetching men products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (selectedSubcategory) {
      filtered = filtered.filter(product =>
        product.subCategory?.toLowerCase().includes(selectedSubcategory.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const toggleWishlist = (productId) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
      toast.success('Removed from wishlist');
    } else {
      newWishlist.add(productId);
      toast.success('Added to wishlist');
    }
    setWishlist(newWishlist);
  };

  const clearFilters = () => {
    setSelectedSubcategory(null);
    setSortBy('newest');
  };

  const renderProductCard = (product) => (
    <div key={product.id} className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image || '/uploads/placeholder.png'} 
          alt={product.name}
          className="product-image"
        />
        <button 
          className={`wishlist-btn ${wishlist.has(product.id) ? 'active' : ''}`}
          onClick={() => toggleWishlist(product.id)}
        >
          <FaHeart />
        </button>
        <div className="product-overlay">
          <button 
            className="quick-add-btn"
            onClick={() => handleAddToCart(product)}
          >
            <FaShoppingBag /> Quick Add
          </button>
        </div>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.subCategory}</p>
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < 4 ? 'star filled' : 'star'} />
          ))}
          <span className="rating-text">(4.0)</span>
        </div>
        <div className="product-footer">
          <span className="product-price">${product.price?.toFixed(2)}</span>
          <button 
            className={`add-to-cart-btn ${isInCart(product.id) ? 'in-cart' : ''}`}
            onClick={() => handleAddToCart(product)}
          >
            {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading men's products...</p>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="container">
        <div className="page-header">
          <div className="page-title-section">
            <h1>Men's Fashion</h1>
            <p>Discover amazing thrift finds in men's clothing</p>
          </div>
          <div className="results-info">
            {filteredProducts.length} products found
          </div>
        </div>

        <div className="mobile-controls">
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters
          </button>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="mobile-sort"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        <div className="content-layout">
          <aside className="sidebar">
            <div className="filters-panel">
              <h3>Categories</h3>
              <div className="category-filters">
                <button 
                  className={`filter-btn ${!selectedSubcategory ? 'active' : ''}`}
                  onClick={() => setSelectedSubcategory(null)}
                >
                  All Men's
                </button>
                {subcategories.map(subcat => (
                  <button
                    key={subcat}
                    className={`filter-btn ${selectedSubcategory === subcat ? 'active' : ''}`}
                    onClick={() => setSelectedSubcategory(
                      selectedSubcategory === subcat ? null : subcat
                    )}
                  >
                    {subcat}
                  </button>
                ))}
              </div>

              <div className="sort-section">
                <h3>Sort By</h3>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              {(selectedSubcategory || sortBy !== 'newest') && (
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          <section className="products-section">
            <div className="section-header">
              <h2>
                {selectedSubcategory 
                  ? `Men's ${selectedSubcategory}`
                  : "All Men's Products"
                }
              </h2>
              {selectedSubcategory && (
                <button onClick={clearFilters} className="clear-filters-desktop">
                  Clear Filters
                </button>
              )}
            </div>
            
            <div className="product-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(renderProductCard)
              ) : (
                <div className="no-products">
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search criteria</p>
                  <button onClick={clearFilters} className="reset-filters-btn">
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        {showFilters && (
          <div className="mobile-filters-overlay" onClick={() => setShowFilters(false)}>
            <div className="mobile-filters-content" onClick={(e) => e.stopPropagation()}>
              <div className="filters-header">
                <h3>Filters</h3>
                <button onClick={() => setShowFilters(false)} className="close-filters">
                  <FaTimes />
                </button>
              </div>
              
              <div className="mobile-filter-section">
                <h4>Categories</h4>
                <div className="category-filters">
                  <button 
                    className={`filter-btn ${!selectedSubcategory ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedSubcategory(null);
                      setShowFilters(false);
                    }}
                  >
                    All Men's
                  </button>
                  {subcategories.map(subcat => (
                    <button
                      key={subcat}
                      className={`filter-btn ${selectedSubcategory === subcat ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedSubcategory(selectedSubcategory === subcat ? null : subcat);
                        setShowFilters(false);
                      }}
                    >
                      {subcat}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={clearFilters} className="clear-filters-btn">
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewMen;
