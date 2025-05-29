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
};

const NewShoes = () => {
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
        <h1>New Arrivals - Shoes</h1>
        <p>Step into style with the latest shoe trends.</p>
        <ul>
          <li>Sneakers</li>
          <li>Boots</li>
          <li>Sandals</li>
          <li>Formal Shoes</li>
        </ul>
      </main>
    </div>
  );
};

export default NewShoes;