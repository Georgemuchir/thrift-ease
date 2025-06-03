import React, { useState, useEffect } from 'react';
import './Admin.css';
import { FaUsers, FaBox, FaShoppingCart, FaCog } from 'react-icons/fa';
import { fetchUsers, addUser, fetchProducts, addProduct, fetchOrders } from './apiService';

const Admin = () => {
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let isMounted = true; // Prevent state updates after unmount

    const fetchData = async () => {
      try {
        if (activeSection === 'Manage Users') {
          const usersData = await fetchUsers();
          if (isMounted) setUsers(Array.isArray(usersData) ? usersData : []); // Ensure valid array
        } else if (activeSection === 'Manage Products') {
          const productsData = await fetchProducts();
          if (isMounted) setProducts(Array.isArray(productsData) ? productsData : []); // Ensure valid array
        } else if (activeSection === 'Orders') {
          const ordersData = await fetchOrders();
          if (isMounted) setOrders(Array.isArray(ordersData) ? ordersData : []); // Ensure valid array
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [activeSection]);

  const handleAddUser = async () => {
    try {
      const newUser = { name: 'New User', email: 'newuser@example.com' };
      await addUser(newUser);
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const newProduct = { name: 'New Product', price: 100 };
      await addProduct(newProduct);
      const updatedProducts = await fetchProducts();
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Manage Users':
        return (
          <div>
            <h3>Manage Users</h3>
            <button onClick={handleAddUser}>Add New User</button>
            <ul>
              {users.map((user) => (
                <li key={user.id}>{user.name} - {user.email}</li> // Unique key
              ))}
            </ul>
          </div>
        );
      case 'Manage Products':
        return (
          <div>
            <h3>Manage Products</h3>
            <button onClick={handleAddProduct}>Add New Product</button>
            <ul>
              {products.map((product) => (
                <li key={product.id}>{product.name} - ${product.price}</li> // Unique key
              ))}
            </ul>
          </div>
        );
      case 'Orders':
        return (
          <div>
            <h3>Orders</h3>
            <ul>
              {orders.map((order) => (
                <li key={order.id}>Order #{order.id} - {order.status}</li> // Unique key
              ))}
            </ul>
          </div>
        );
      case 'Settings':
        return (
          <div>
            <h3>Settings</h3>
            <p>Here you can update application settings.</p>
          </div>
        );
      default:
        return <p>Welcome to the Admin Dashboard!</p>;
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
      </header>
      <nav className="admin-sidebar">
        <ul>
          <li onClick={() => setActiveSection('Manage Users')}><FaUsers /> Manage Users</li>
          <li onClick={() => setActiveSection('Manage Products')}><FaBox /> Manage Products</li>
          <li onClick={() => setActiveSection('Orders')}><FaShoppingCart /> Orders</li>
          <li onClick={() => setActiveSection('Settings')}><FaCog /> Settings</li>
        </ul>
      </nav>
      <main className="admin-main">
        <section className="admin-content">
          <h2>{activeSection}</h2>
          {renderContent()}
        </section>
      </main>
    </div>
  );
};

export default Admin;