import React from 'react';

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
  backgroundColor: '#FFFFFF',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
};

const navItemStyle = {
  display: 'block',
  color: '#FFFFFF',
  textDecoration: 'none',
  padding: '10px 15px',
  margin: '10px 0',
  borderRadius: '5px',
  backgroundColor: '#CBA135',
  transition: 'background-color 0.3s',
};

const NewKids = () => {
  return (
    <div>
      <aside style={sidebarStyle}>
        <h2>Thrift Ease</h2>
        <a href="/women" style={navItemStyle}>Women</a>
        <a href="/men" style={navItemStyle}>Men</a>
        <a href="/kids" style={navItemStyle}>Kids</a>
        <a href="/shoes" style={navItemStyle}>Shoes</a>
      </aside>
      <main style={contentStyle}>
        <h1>New Arrivals - Kids</h1>
        <p>Find the latest styles for boys and girls.</p>
        <ul>
          <li>Boys: T-Shirts, Sweatshirts & Hoodies, Pants, Shorts, Jackets</li>
          <li>Girls: Dresses, Tops, Leggings, Skirts, Hoodies, Jackets</li>
        </ul>
      </main>
    </div>
  );
};

export default NewKids;