import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import Home from './src/components/Home';
import SignIn from './src/components/SignIn';
import SignUp from './src/components/SignUp';
import Bag from './src/components/Bag';
import Checkout from './src/components/Checkout';
import NewWomen from './src/components/NewWomen';
import NewMen from './src/components/NewMen';
import NewKids from './src/components/NewKids';
import NewShoes from './src/components/NewShoes';
import SpecialOffer from './src/components/SpecialOffer';
import Admin from './src/components/Admin';
import Header from './src/components/Header';
import Footer from './src/components/Footer';
import ProtectedRoute from './src/components/ProtectedRoute';

import 'react-toastify/dist/ReactToastify.css';
import './src/styles/App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/bag" element={<Bag />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/new-women" element={<NewWomen />} />
                <Route path="/new-men" element={<NewMen />} />
                <Route path="/new-kids" element={<NewKids />} />
                <Route path="/new-shoes" element={<NewShoes />} />
                <Route path="/special-offer" element={<SpecialOffer />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
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
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
