import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminSettings from './pages/AdminSettings';
import AdminCustomerManager from './pages/AdminCustomerManager';
import CustomerDashboard from './pages/CustomerDashboard';
import CartPage from './pages/CartPage';
import WelcomePage from './pages/WelcomePage';
import OrderManagement from './pages/OrderManagement'; // add import
import Payment from "./pages/Payment";
import CustomerProfile from "./pages/CustomerProfile";



const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/customers" element={<AdminCustomerManager />} />
      <Route path="/admin/orders" element={<OrderManagement />} />


      {/* Customer Routes */}
      <Route path="/customer/home" element={<CustomerDashboard />} />
      <Route path="/customer/cart" element={<CartPage />} /> {/* 🎯 New Cart Route */}
      <Route path="/customer/profile" element={<CustomerProfile />} />

      <Route path="/customer/payment" element={<Payment />} />

    </Routes>
  );
};

export default App;
