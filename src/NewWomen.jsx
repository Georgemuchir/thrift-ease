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

const NewWomen = () => {
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
        <h1>New Arrivals - Women</h1>
        <p>Discover the latest trends and styles for women.</p>
        <ul>
          <li>Dresses</li>
          <li>Tops</li>
          <li>Jeans</li>
          <li>Skirts</li>
          <li>Activewear</li>
          <li>Coats & Jackets</li>
        </ul>
      </main>
    </div>
  );
};

export default NewWomen;