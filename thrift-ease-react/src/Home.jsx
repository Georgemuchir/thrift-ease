import React, { useState, useEffect } from 'react';
import './App.css'; // Ensure styles are applied
import { fetchProducts } from './apiService';

// Updated centralized color palette for minimalist & high-end fashion vibe
const colors = {
  primary: '#1C1C1C', // Charcoal for primary text and headers
  textPrimary: '#FFFFFF', // White text for contrast
  textSecondary: '#E0E0E0', // Light gray for secondary text
  border: '#F5F5F5', // Light gray for borders
  background: '#FFFFFF', // White for background
  accent: '#CBA135', // Gold accents for highlights
};

// Updated styles for Home page to align with the new global styles
const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
  maxWidth: '1200px',
  margin: '0 auto',
  backgroundColor: 'var(--secondary-color)',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
};

const headerStyle = {
  backgroundColor: 'var(--secondary-color)',
  color: 'var(--primary-color)',
  padding: '20px',
  borderRadius: '8px 8px 0 0',
  textAlign: 'center',
};

const footerStyle = {
  marginTop: '20px',
  fontSize: '14px',
  color: 'var(--text-secondary)',
  textAlign: 'center',
  padding: '10px',
  backgroundColor: 'var(--footer-bg)',
  borderRadius: '0 0 8px 8px',
  boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
};

// Sidebar and content styles
const sidebarStyle = {
  width: '250px',
  backgroundColor: '#2C3E50',
  color: '#FFFFFF',
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
  padding: '20px',
};

const contentStyle = {
  marginLeft: '250px',
  padding: '20px',
  backgroundColor: '#ECF0F1',
  minHeight: '100vh',
};

const navItemStyle = {
  display: 'block',
  color: '#FFFFFF',
  textDecoration: 'none',
  padding: '10px 15px',
  margin: '10px 0',
  borderRadius: '5px',
  backgroundColor: '#34495E',
  transition: 'background-color 0.3s',
};

const navItemHoverStyle = {
  backgroundColor: '#1ABC9C',
};

// Updated Home page structure
const Home = () => {
  const [categories, setCategories] = useState({
    women: ["Dresses", "Tops", "Jeans", "Skirts", "Activewear", "Coats & Jackets"],
    men: ["Shirts", "T-Shirts", "Jeans", "Trousers", "Shorts", "Jackets & Coats"],
    kids: {
      boys: ["T-Shirts", "Sweatshirts & Hoodies", "Pants", "Shorts", "Jackets"],
      girls: ["Dresses", "Tops", "Leggings", "Skirts", "Hoodies", "Jackets"],
    },
    shoes: ["Sneakers", "Boots", "Sandals", "Formal Shoes"],
  });

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentSubgroup, setCurrentSubgroup] = useState(null);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        console.log('Fetched products:', data); // Debugging log
        setProducts(data);
        setFilteredProducts(data); // Directly set filteredProducts to fetched data
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    getProducts();
  }, []);

  const renderCategories = () => {
    return Object.keys(categories).map((categoryKey) => {
      const categoryName = categoryKey.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return (
        <li key={categoryKey}>
          <a
            href="#"
            className="dropdown-link"
            onClick={(e) => {
              e.preventDefault();
              setCurrentCategory(categoryKey);
              setCurrentSubgroup(null);
              setCurrentSubcategory(null);
            }}
          >
            {categoryName}
          </a>
        </li>
      );
    });
  };

  const renderSubcategories = () => {
    if (!currentCategory) return null;

    if (currentCategory === "kids" && !currentSubgroup) {
      return ["boys", "girls"].map((group) => (
        <a
          key={group}
          href="#"
          className="category-link"
          onClick={(e) => {
            e.preventDefault();
            setCurrentSubgroup(group);
            setCurrentSubcategory(null);
          }}
        >
          {group.charAt(0).toUpperCase() + group.slice(1)}
        </a>
      ));
    }

    const subcategories =
      currentCategory === "kids" && currentSubgroup
        ? categories.kids[currentSubgroup] || []
        : categories[currentCategory] || [];

    return subcategories.map((subcategory) => (
      <a
        key={subcategory}
        href="#"
        className="category-link"
        onClick={(e) => {
          e.preventDefault();
          setCurrentSubcategory(subcategory.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-"));
        }}
      >
        {subcategory}
      </a>
    ));
  };

  const renderProducts = () => {
    return (
      <div>
        <h1>Welcome to QuickThrift</h1>
        <p>This is a static test to ensure the Home component renders correctly.</p>
      </div>
    );
  };

  return (
    <div>
      <header className="header">
        <div className="logo-container">
          <h1 className="logo">QuickThrift</h1>
        </div>
        <div className="user-options">
          <a href="/sign-in" className="login-link">Sign In / Sign Up</a>
          <a href="/bag" className="bag-link">
            <i className="fa-solid fa-bag-shopping"></i> Bag
            <span id="bag-count" className="bag-count">0</span>
          </a>
        </div>
      </header>
      <aside style={sidebarStyle}>
        <h2>Thrift Ease</h2>
        <a href="/women" style={navItemStyle}>Women</a>
        <a href="/men" style={navItemStyle}>Men</a>
        <a href="/kids" style={navItemStyle}>Kids</a>
        <a href="/shoes" style={navItemStyle}>Shoes</a>
      </aside>
      <main style={contentStyle}>
        <h1>Welcome to Thrift Ease</h1>
        <p>Explore our categories and find the best deals on clothing, shoes, and accessories.</p>
      </main>
    </div>
  );
};

export default Home;