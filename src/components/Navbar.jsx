import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Package,
  Compass,
  Phone,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function Navbar() {
  const { user, adminUser, isAuthenticated, isAdmin, logout } = useAuth();
  const {
    cart = [],
    wishlist = [],
    searchQuery = '',
    setSearchQuery = () => {},
    settings,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const wishlistCount = wishlist.length;

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/?search=' + encodeURIComponent(searchQuery));
    }
  };

  const contactNumber = settings?.contactPhone || '82708 82715';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      
      {/* Top Announcement Bar with Contact & Instagram Direct Link */}
      <div className="bg-slate-950 text-white text-[11px] py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-orange-400 font-bold">
              <Sparkles size={12} /> Discover What's Trending in 2026
            </span>
            <span className="text-slate-400">|</span>
            <a
              href={`tel:${contactNumber.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Phone size={11} className="text-orange-400" />
              <span>Helpline: {contactNumber}</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={settings?.socialLinks?.instagram || 'https://www.instagram.com/trending_dart'}
              target="_blank"
              rel="noreferrer"
              className="hover:text-orange-400 transition-colors flex items-center gap-1 font-semibold"
            >
              Follow on Instagram @trending_dart
            </a>
            <span className="text-slate-500">·</span>
            <Link to="/track" className="hover:text-orange-400 transition-colors">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink min-w-0 group">
            <img
              src="/logo.png"
              alt="Trending Dart Logo"
              className="w-8 h-8 sm:w-11 sm:h-11 object-contain rounded-xl p-0.5 border border-slate-200 shadow-sm group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="min-w-0">
              <span className="text-sm sm:text-xl font-black tracking-wider text-slate-950 block leading-tight truncate">
                TRENDING <span className="text-orange-500">DART</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest block truncate hidden sm:block">
                Discover What's Trending
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-6 relative"
          >
            <input
              type="text"
              placeholder="Search trending bathroom essentials, organisers, gadgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs sm:text-sm rounded-full border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all placeholder:text-slate-400 text-slate-800"
            />
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </form>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-700">
            <Link to="/" className="hover:text-orange-500 transition-colors">
              Home
            </Link>
            <a href="/#catalog" className="hover:text-orange-500 transition-colors">
              Shop
            </a>
            <a href="/#categories" className="hover:text-orange-500 transition-colors">
              Categories
            </a>
            <Link to="/track" className="hover:text-orange-500 transition-colors">
              Track Order
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-1.5 sm:p-2 rounded-xl text-slate-700 hover:text-orange-500 hover:bg-slate-100 transition-all"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-rose-500 text-white text-[9px] sm:text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-1.5 sm:p-2 rounded-xl text-slate-700 hover:text-orange-500 hover:bg-slate-100 transition-all"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 text-white text-[9px] sm:text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1 sm:gap-2 p-1 sm:px-3 sm:py-2 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 transition-all text-xs font-bold text-slate-800"
                >
                  <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{user?.name}</span>
                  <ChevronDown size={14} className="text-slate-400 hidden sm:inline" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-1"
                >
                  <User size={14} />
                  <span className="hidden xs:inline">Login</span>
                </Link>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && isAuthenticated && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    <User size={15} className="text-slate-400" /> My Profile
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    <Package size={15} className="text-slate-400" /> My Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-orange-600 hover:bg-orange-50 font-bold border-t border-slate-100"
                    >
                      <ShieldCheck size={15} /> Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 font-semibold border-t border-slate-100 text-left"
                  >
                    <LogOut size={15} /> Log Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search trending products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-100 text-xs rounded-xl border border-transparent focus:border-orange-500 outline-none"
            />
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </form>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-slate-800 hover:text-orange-500"
          >
            Home
          </Link>
          <a
            href="/#catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-slate-800 hover:text-orange-500"
          >
            Shop All Products
          </a>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-slate-800 hover:text-orange-500"
          >
            Track Order
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-slate-800 hover:text-orange-500"
          >
            Wishlist ({wishlistCount})
          </Link>
          {isAuthenticated ? (
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-800 hover:text-orange-500"
            >
              My Account & Orders
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-orange-600"
            >
              Login / Register
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-purple-600"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
