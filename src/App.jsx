import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './loginpage';
import HomePage from './Homepage';
import ProductPage from './ProductPage';
import ProducerPage from './ProducerPage';
import CartPage from './CartPage';





function Login() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/producer" element={<ProducerPage />} />
        <Route path="/cart" element={<CartPage/>} />
      </Routes>
    </BrowserRouter>
  );
}
export default Login