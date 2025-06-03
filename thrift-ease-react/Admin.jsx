import React from 'react';
import './Admin.css';

const Admin = () => {
  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Panel</h1>
      </header>
      <nav className="admin-sidebar">
        <ul>
          <li>Dashboard</li>
          <li>Manage Products</li>
          <li>Manage Users</li>
          <li>Orders</li>
          <li>Settings</li>
        </ul>
      </nav>
      <main className="admin-main">
        <section>
          <h2>Welcome, Admin!</h2>
          <p>Use the sidebar to navigate through admin functionalities.</p>
        </section>
      </main>
    </div>
  );
};

export default Admin;