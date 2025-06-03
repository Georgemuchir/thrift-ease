import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Bag from './Bag';
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
      </Routes>
    </Router>
  );
}

export default App;
