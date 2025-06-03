import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Bag from './Bag';
import Admin from './Admin';
import NewWomen from './NewWomen';
import NewMen from './NewMen';
import NewKids from './NewKids';
import NewShoes from './NewShoes';
import { fetchProducts, signIn, signUp } from './apiService';

function App() {
  useEffect(() => {
    fetchProducts().then(data => console.log(data));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/bag" element={<Bag />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/women" element={<NewWomen />} />
        <Route path="/men" element={<NewMen />} />
        <Route path="/kids" element={<NewKids />} />
        <Route path="/shoes" element={<NewShoes />} />
      </Routes>
    </Router>
  );
}

export default App;
