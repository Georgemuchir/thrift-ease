import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/special-offers.css';

const SpecialOffer = () => {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const [specialOffers, setSpecialOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Mock special offers data (in a real app, this would come from API)
  const mockOffers = [
    {
      id: 'offer-1',
      title: 'Flash Sale - 50% Off',
      description: 'Limited time offer on selected women\'s clothing',
      discount: 50,
      category: 'Women',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      products: [
        {
          id: 'sp-1',
          name: 'Designer Floral Dress',
          originalPrice: 89.99,
          salePrice: 44.99,
          image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300',
          category: 'Women',
          description: 'Beautiful floral pattern dress, perfect for summer occasions',
          condition: 'Like New',
          size: 'M'
        },
        {
          id: 'sp-2',
          name: 'Vintage Leather Jacket',
          originalPrice: 129.99,
          salePrice: 64.99,
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300',
          category: 'Women',
          description: 'Classic vintage leather jacket in excellent condition',
          condition: 'Excellent',
          size: 'L'
        },
        {
          id: 'sp-3',
          name: 'Cashmere Sweater',
          originalPrice: 79.99,
          salePrice: 39.99,
          image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300',
          category: 'Women',
          description: 'Soft cashmere sweater in neutral beige',
          condition: 'Very Good',
          size: 'S'
        }
      ]
    },
    {
      id: 'offer-2',
      title: 'Men\'s Clearance - Up to 60% Off',
      description: 'End of season clearance on men\'s apparel',
      discount: 60,
      category: 'Men',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500',
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      products: [
        {
          id: 'sp-4',
          name: 'Business Suit',
          originalPrice: 199.99,
          salePrice: 79.99,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
          category: 'Men',
          description: 'Professional business suit, charcoal gray',
          condition: 'Excellent',
          size: 'L'
        },
        {
          id: 'sp-5',
          name: 'Casual Polo Shirt',
          originalPrice: 39.99,
          salePrice: 15.99,
          image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300',
          category: 'Men',
          description: 'Comfortable cotton polo shirt',
          condition: 'Good',
          size: 'M'
        }
      ]
    },
    {
      id: 'offer-3',
      title: 'Kids\' Back to School Special',
      description: 'Get ready for school with amazing deals on kids\' clothing',
      discount: 40,
      category: 'Kids',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500',
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      products: [
        {
          id: 'sp-6',
          name: 'School Uniform Set',
          originalPrice: 49.99,
          salePrice: 29.99,
          image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300',
          category: 'Kids',
          description: 'Complete school uniform set for ages 6-12',
          condition: 'Good',
          size: '8-10'
        }
      ]
    }
  ];

  useEffect(() => {
    loadSpecialOffers();
    
    // Set up countdown timer
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadSpecialOffers = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const offers = await apiService.getSpecialOffers();
      setSpecialOffers(mockOffers);
    } catch (error) {
      console.error('Error loading special offers:', error);
      toast.error('Failed to load special offers');
    } finally {
      setLoading(false);
    }
  };

  const updateCountdown = () => {
    const now = new Date().getTime();
    const nearestOffer = specialOffers.find(offer => new Date(offer.endTime).getTime() > now);
    
    if (nearestOffer) {
      const distance = new Date(nearestOffer.endTime).getTime() - now;
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }
  };

  const handleAddToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.salePrice,
      image: product.image,
      category: product.category,
      size: product.size,
      condition: product.condition
    };
    
    addToCart(cartItem);
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (product) => {
    toggleWishlist(product);
    const isInWishlist = wishlist.some(item => item.id === product.id);
    toast.success(
      isInWishlist 
        ? `${product.name} removed from wishlist` 
        : `${product.name} added to wishlist`
    );
  };

  const calculateSavings = (originalPrice, salePrice) => {
    const savings = originalPrice - salePrice;
    const percentage = Math.round((savings / originalPrice) * 100);
    return { savings: savings.toFixed(2), percentage };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading special offers...</p>
      </div>
    );
  }

  return (
    <div className="special-offers-page">
      {/* Hero Section */}
      <div className="offers-hero">
        <div className="hero-content">
          <h1 className="hero-title">🔥 Special Offers</h1>
          <p className="hero-subtitle">
            Limited time deals on your favorite thrift finds!
          </p>
          
          {/* Countdown Timer */}
          <div className="countdown-timer">
            <h3>⏰ Next Deal Ends In:</h3>
            <div className="timer-display">
              <div className="time-unit">
                <span className="time-number">{timeLeft.days}</span>
                <span className="time-label">Days</span>
              </div>
              <div className="time-unit">
                <span className="time-number">{timeLeft.hours}</span>
                <span className="time-label">Hours</span>
              </div>
              <div className="time-unit">
                <span className="time-number">{timeLeft.minutes}</span>
                <span className="time-label">Minutes</span>
              </div>
              <div className="time-unit">
                <span className="time-number">{timeLeft.seconds}</span>
                <span className="time-label">Seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Special Offers Grid */}
        <div className="offers-grid">
          {specialOffers.map((offer) => (
            <div key={offer.id} className="offer-section">
              <div className="offer-header">
                <div className="offer-info">
                  <h2 className="offer-title">{offer.title}</h2>
                  <p className="offer-description">{offer.description}</p>
                  <div className="offer-badge">
                    Up to {offer.discount}% OFF
                  </div>
                </div>
                <div className="offer-image">
                  <img src={offer.image} alt={offer.title} />
                </div>
              </div>

              {/* Products Grid */}
              <div className="offer-products">
                <h3>Featured Products</h3>
                <div className="products-grid">
                  {offer.products.map((product) => {
                    const { savings, percentage } = calculateSavings(
                      product.originalPrice, 
                      product.salePrice
                    );
                    const isInWishlist = wishlist.some(item => item.id === product.id);

                    return (
                      <div key={product.id} className="product-card special-offer">
                        <div className="product-image-container">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="product-image"
                          />
                          <div className="discount-badge">
                            -{percentage}%
                          </div>
                          <button
                            className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                            onClick={() => handleToggleWishlist(product)}
                            aria-label="Add to wishlist"
                          >
                            {isInWishlist ? '❤️' : '🤍'}
                          </button>
                        </div>

                        <div className="product-info">
                          <h4 className="product-name">{product.name}</h4>
                          <p className="product-details">
                            {product.condition} • Size {product.size}
                          </p>
                          <p className="product-description">
                            {product.description}
                          </p>

                          <div className="price-section">
                            <div className="prices">
                              <span className="original-price">
                                ${product.originalPrice}
                              </span>
                              <span className="sale-price">
                                ${product.salePrice}
                              </span>
                            </div>
                            <div className="savings">
                              Save ${savings}!
                            </div>
                          </div>

                          <button
                            className="add-to-cart-btn"
                            onClick={() => handleAddToCart(product)}
                          >
                            🛒 Add to Cart
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Don't Miss Out!</h2>
            <p>
              These special offers are available for a limited time only. 
              Shop now to secure these amazing deals on quality thrift items.
            </p>
            <div className="cta-buttons">
              <Link to="/new-women" className="btn primary">
                Shop Women's
              </Link>
              <Link to="/new-men" className="btn primary">
                Shop Men's
              </Link>
              <Link to="/new-kids" className="btn primary">
                Shop Kids'
              </Link>
              <Link to="/new-shoes" className="btn primary">
                Shop Shoes
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h3>Get Notified of Special Offers</h3>
            <p>
              Subscribe to our newsletter to be the first to know about 
              flash sales and exclusive deals.
            </p>
            <form className="newsletter-form" onSubmit={(e) => {
              e.preventDefault();
              toast.success('Thank you for subscribing!');
            }}>
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffer;
