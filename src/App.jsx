import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
// Page imports
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Bag from './pages/Bag'
import ProductDetails from './pages/ProductDetails'
import Admin from './pages/Admin'
// Category page imports
import All from './pages/Category/All'
import Women from './pages/Category/Women'
import Men from './pages/Category/Men'
import Kids from './pages/Category/Kids'
import Shoes from './pages/Category/Shoes'
// Development/Testing components
import BackendTest from './components/BackendTest'
import './App.css'

function App() {
  return (
    <>
      <ErrorBoundary>
        <AuthProvider>
          <CartProvider>
            <div className="App">
              <Header />
              <main>
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/all" element={<All />} />
                <Route path="/new-women" element={<Women />} />
                <Route path="/new-men" element={<Men />} />
                <Route path="/new-kids" element={<Kids />} />
                <Route path="/new-shoes" element={<Shoes />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                {/* Development/Testing route - remove in production */}
                <Route path="/test-backend" element={<BackendTest />} />
                <Route 
                  path="/bag" 
                  element={
                    <ProtectedRoute>
                      <Bag />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
      </ErrorBoundary>
    </>
  )
}

export default App
