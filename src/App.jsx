import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Bag from './components/Bag'
import NewWomen from './components/NewWomen'
import NewMen from './components/NewMen'
import NewKids from './components/NewKids'
import NewShoes from './components/NewShoes'
import ProductDetails from './components/ProductDetails'
import Admin from './components/Admin'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/new-women" element={<NewWomen />} />
                <Route path="/new-men" element={<NewMen />} />
                <Route path="/new-kids" element={<NewKids />} />
                <Route path="/new-shoes" element={<NewShoes />} />
                <Route path="/product/:id" element={<ProductDetails />} />
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
    </>
  )
}

export default App
