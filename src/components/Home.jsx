import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Thrift is Old School</h1>
            <p>Discover premium quality thrift fashion at unbeatable prices. Style that doesn't cost the earth.</p>
            <Link to="/new-women" className="btn btn-primary btn-large">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section className="featured-categories">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="category-grid">
            <Link to="/new-women" className="category-card">
              <div className="category-image">
                <img src="/api/placeholder/300/400" alt="Women's Fashion" />
              </div>
              <h3>Women</h3>
              <p>Trendy and stylish pieces</p>
            </Link>
            
            <Link to="/new-men" className="category-card">
              <div className="category-image">
                <img src="/api/placeholder/300/400" alt="Men's Fashion" />
              </div>
              <h3>Men</h3>
              <p>Classic and contemporary styles</p>
            </Link>
            
            <Link to="/new-kids" className="category-card">
              <div className="category-image">
                <img src="/api/placeholder/300/400" alt="Kids Fashion" />
              </div>
              <h3>Kids</h3>
              <p>Comfortable and fun clothing</p>
            </Link>
            
            <Link to="/new-shoes" className="category-card">
              <div className="category-image">
                <img src="/api/placeholder/300/400" alt="Shoes" />
              </div>
              <h3>Shoes</h3>
              <p>Footwear for every occasion</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            <div className="product-card">
              <div className="product-image">
                <img src="/api/placeholder/280/300" alt="Vintage Denim Jacket" />
              </div>
              <div className="product-info">
                <h3>Vintage Denim Jacket</h3>
                <p className="product-price">$45</p>
              </div>
            </div>
            
            <div className="product-card">
              <div className="product-image">
                <img src="/api/placeholder/280/300" alt="Classic Sneakers" />
              </div>
              <div className="product-info">
                <h3>Classic Sneakers</h3>
                <p className="product-price">$35</p>
              </div>
            </div>
            
            <div className="product-card">
              <div className="product-image">
                <img src="/api/placeholder/280/300" alt="Cotton T-Shirt" />
              </div>
              <div className="product-info">
                <h3>Cotton T-Shirt</h3>
                <p className="product-price">$15</p>
              </div>
            </div>
            
            <div className="product-card">
              <div className="product-image">
                <img src="/api/placeholder/280/300" alt="Wool Sweater" />
              </div>
              <div className="product-info">
                <h3>Wool Sweater</h3>
                <p className="product-price">$28</p>
              </div>
            </div>
            
            <div className="product-card">
              <div className="product-image">
                <img src="/api/placeholder/280/300" alt="Leather Boots" />
              </div>
              <div className="product-info">
                <h3>Leather Boots</h3>
                <p className="product-price">$65</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose Thrift Ease?</h2>
          <div className="features-grid">
            <div className="feature">
              <h3>Quality Guaranteed</h3>
              <p>Every item is carefully inspected for quality and authenticity</p>
            </div>
            <div className="feature">
              <h3>Affordable Prices</h3>
              <p>Great fashion doesn't have to break the bank</p>
            </div>
            <div className="feature">
              <h3>Sustainable Fashion</h3>
              <p>Help reduce waste by giving pre-loved items a new home</p>
            </div>
            <div className="feature">
              <h3>Easy Returns</h3>
              <p>Not satisfied? Return within 30 days for a full refund</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
