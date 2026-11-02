import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashIntro from './components/common/SplashIntro';
import QuickOrderModal from './components/common/QuickOrderModal';

// Customer Pages
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import OrderDetails from './pages/OrderDetails';
import OrderTracking from './pages/OrderTracking';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Splash animation runs once when app opens for 2 seconds
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash once per browser session
    const hasSeen = sessionStorage.getItem('td_splash_shown');
    return !hasSeen;
  });

  const handleSplashFinish = () => {
    sessionStorage.setItem('td_splash_shown', 'true');
    setShowSplash(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-orange-500 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* 2-Second Logo Opening Animation */}
      {showSplash && <SplashIntro onFinish={handleSplashFinish} />}

      {/* Global Quick Order Modal for direct "Order Now" flow */}
      <QuickOrderModal />

      {!isAdminRoute && <Navbar />}

      <div className="flex-1">
        <Routes>
          {/* Customer Storefront Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/track" element={<OrderTracking />} />
          <Route path="/track/:orderId" element={<OrderTracking />} />

          {/* Admin Management Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Fallback 404 Route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}
    </div>
  );
}
