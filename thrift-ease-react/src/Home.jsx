import React, { useState, useEffect } from 'react';
import './App.css'; // Ensure styles are applied

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

  const [products, setProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("products")) || [];
  });

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentSubgroup, setCurrentSubgroup] = useState(null);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);

  useEffect(() => {
    if (currentCategory) {
      const filtered = products.filter((product) => {
        if (currentCategory && product.mainCategory.toLowerCase() !== currentCategory) return false;
        if (currentSubgroup && product.subGroup?.toLowerCase() !== currentSubgroup) return false;
        if (currentSubcategory && product.subCategory.toLowerCase() !== currentSubcategory) return false;
        return true;
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [currentCategory, currentSubgroup, currentSubcategory, products]);

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
    if (filteredProducts.length === 0) {
      return <p>No products found.</p>;
    }

    return filteredProducts.map((product) => (
      <div key={product.name} className="product-card">
        <img src={product.image} alt={product.name} className="product-image" />
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>
    ));
  };

  return (
    <div className="main-container">
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

      <nav className="nav">
        <ul id="category-menu">{renderCategories()}</ul>
      </nav>

      <main>
        <section className="categories" id="categories-section">
          {renderSubcategories()}
        </section>

        <div className="product-grid-container">
          <section className="product-grid" id="product-grid">
            {renderProducts()}
          </section>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 QuickThrift. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;