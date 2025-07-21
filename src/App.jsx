import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Bag from './components/Bag';
import Checkout from './components/Checkout';
import Admin from './components/Admin';
import SpecialOffer from './components/SpecialOffer';
import AddProduct from './components/AddProduct';
import NewWomen from './components/NewWomen';
import NewMen from './components/NewMen';
import NewKids from './components/NewKids';
import NewShoes from './components/NewShoes';
import './styles/App.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            {/* Skip link for accessibility */}
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            
            <Header />
            
            <main id="main-content" className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/special-offer" element={<SpecialOffer />} />
                <Route path="/new-women" element={<NewWomen />} />
                <Route path="/new-men" element={<NewMen />} />
                <Route path="/new-kids" element={<NewKids />} />
                <Route path="/new-shoes" element={<NewShoes />} />
                
                {/* Protected Routes */}
                <Route path="/add-product" element={
                  <ProtectedRoute>
                    <AddProduct />
                  </ProtectedRoute>
                } />
                <Route path="/bag" element={
                  <ProtectedRoute>
                    <Bag />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                } />
                
                {/* Fallback for unmatched routes */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            
            <Footer />
            
            {/* Toast notifications */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
