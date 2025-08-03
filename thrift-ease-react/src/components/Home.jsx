import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { FaHeart, FaShoppingBag, FaStar, FaFilter, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedPriceRange, setSelectedPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('newest');
  const [wishlist, setWishlist] = useState(new Set());

  const { addToCart, isInCart } = useCart();

  const categories = {
    women: ["Dresses", "Tops", "Jeans", "Skirts", "Activewear", "Coats & Jackets"],
    men: ["Shirts", "T-Shirts", "Jeans", "Trousers", "Shorts", "Jackets & Coats"],
    kids: {
      boys: ["T-Shirts", "Sweatshirts & Hoodies", "Pants", "Shorts", "Jackets"],
      girls: ["Dresses", "Tops", "Leggings", "Skirts", "Hoodies", "Jackets"],
    },
    shoes: ["Sneakers", "Boots", "Sandals", "Formal Shoes"],
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, currentCategory, currentSubcategory, selectedPriceRange, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.fetchProducts();
      setProducts(data);
      
      // Calculate price range
      if (data.length > 0) {
        const prices = data.map(p => p.price);
        const min = Math.floor(Math.min(...prices));
        const max = Math.ceil(Math.max(...prices));
        setPriceRange({ min, max });
        setSelectedPriceRange({ min, max });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (currentCategory) {
      filtered = filtered.filter(product => {
        const mainCat = product.mainCategory?.toLowerCase();
        return mainCat === currentCategory || 
               mainCat === `${currentCategory}'s` ||
               (currentCategory === 'women' && (mainCat === "women's" || mainCat === 'women')) ||
               (currentCategory === 'men' && (mainCat === "men's" || mainCat === 'men'));
      });
    }

    // Filter by subcategory
    if (currentSubcategory) {
      filtered = filtered.filter(product => 
        product.subCategory?.toLowerCase().includes(currentSubcategory.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max
    );

    // Sort products
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
    setCurrentCategory(null);
    setCurrentSubcategory(null);
    setSelectedPriceRange(priceRange);
    setSortBy('newest');
  };

  const renderHeroSection = () => (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">Discover Amazing Thrift Finds</h1>
          <p className="hero-subtitle">
            Sustainable fashion that doesn't compromise on style. Shop unique pieces at unbeatable prices.
          </p>
          <div className="hero-buttons">
            <Link to="/new-women" className="hero-button primary">
              Shop Women's
            </Link>
            <Link to="/new-men" className="hero-button secondary">
              Shop Men's
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/uploads/placeholder.png" alt="Fashion collection" />
        </div>
      </div>
    </section>
  );

  const renderCategoryFilter = () => (
    <div className="category-filter">
      <h3>Categories</h3>
      <div className="category-buttons">
        <button 
          className={`category-btn ${!currentCategory ? 'active' : ''}`}
          onClick={() => {
            setCurrentCategory(null);
            setCurrentSubcategory(null);
          }}
        >
          All
        </button>
        {Object.keys(categories).map(category => (
          <button
            key={category}
            className={`category-btn ${currentCategory === category ? 'active' : ''}`}
            onClick={() => {
              setCurrentCategory(category);
              setCurrentSubcategory(null);
            }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {currentCategory && (
        <div className="subcategory-filter">
          <h4>Subcategories</h4>
          <div className="subcategory-buttons">
            {(categories[currentCategory] || []).map(subcat => (
              <button
                key={subcat}
                className={`subcategory-btn ${currentSubcategory === subcat ? 'active' : ''}`}
                onClick={() => setCurrentSubcategory(
                  currentSubcategory === subcat ? null : subcat
                )}
              >
                {subcat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderFilters = () => (
    <div className={`filters-panel ${showFilters ? 'open' : ''}`}>
      <div className="filters-header">
        <h3>Filters</h3>
        <button onClick={() => setShowFilters(false)} className="close-filters">
          <FaTimes />
        </button>
      </div>
      
      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-range">
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={selectedPriceRange.min}
            onChange={(e) => setSelectedPriceRange(prev => ({
              ...prev,
              min: Number(e.target.value)
            }))}
          />
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={selectedPriceRange.max}
            onChange={(e) => setSelectedPriceRange(prev => ({
              ...prev,
              max: Number(e.target.value)
            }))}
          />
          <div className="price-display">
            ${selectedPriceRange.min} - ${selectedPriceRange.max}
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h4>Sort By</h4>
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

      <button onClick={clearFilters} className="clear-filters-btn">
        Clear All Filters
      </button>
    </div>
  );

  const renderProductCard = (product) => (
    <div key={product.id} className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={product.image || '/uploads/placeholder.png'} 
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.src = '/uploads/placeholder.png';
            }}
          />
          <button 
            className={`wishlist-btn ${wishlist.has(product.id) ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
          >
            <FaHeart />
          </button>
          <div className="product-overlay">
            <button 
              className="quick-add-btn"
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart(product);
              }}
            >
              <FaShoppingBag /> Quick Add
            </button>
          </div>
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>
          {product.condition && (
            <span className="product-condition">{product.condition}</span>
          )}
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
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart(product);
              }}
            >
              {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {renderHeroSection()}
      
      <main className="main-content" id="main-content">
        <div className="content-container">
          {/* Mobile filter toggle */}
          <div className="mobile-controls">
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> Filters
            </button>
            <div className="results-count">
              {filteredProducts.length} products
            </div>
          </div>

          <div className="content-layout">
            {/* Sidebar Filters */}
            <aside className="sidebar">
              {renderCategoryFilter()}
              <div className="desktop-filters">
                {renderFilters()}
              </div>
            </aside>

            {/* Products Grid */}
            <section className="products-section">
              <div className="section-header">
                <h2>
                  {currentCategory 
                    ? `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}'s Fashion`
                    : 'All Products'
                  }
                </h2>
                {(currentCategory || currentSubcategory) && (
                  <button onClick={clearFilters} className="clear-filters-desktop">
                    Clear Filters
                  </button>
                )}
              </div>
              
              <div className="product-grid" id="product-grid">
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
        </div>
      </main>

      {/* Mobile Filters Overlay */}
      {showFilters && (
        <div className="mobile-filters-overlay" onClick={() => setShowFilters(false)}>
          <div className="mobile-filters-content" onClick={(e) => e.stopPropagation()}>
            {renderFilters()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
