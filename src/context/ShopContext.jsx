import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { products as fallbackProducts } from '../data/products';

const ShopContext = createContext();

export const CURRENCIES = {
  INR: { symbol: '₹', rate: 1, label: 'INR (₹)' },
  USD: { symbol: '$', rate: 0.012, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.011, label: 'EUR (€)' },
};

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [settings, setSettings] = useState({
    websiteName: 'TRENDING DART',
    tagline: "Discover What's Trending",
    logoUrl: '/logo.png',
    contactPhone: '82708 82715',
    contactEmail: 'trendingdart@gmail.com',
    socialLinks: {
      instagram: 'https://www.instagram.com/trending_dart?xtok=MWFsZzJhbHhhcTdoNA==',
      facebook: 'https://facebook.com/trendingdart',
      whatsapp: 'https://wa.me/918270882715',
    },
    deliveryFee: 49,
    freeDeliveryThreshold: 499,
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('td_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('td_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [currency, setCurrency] = useState('INR');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Quick Order Modal state
  const [quickOrderProduct, setQuickOrderProduct] = useState(null);

  // Fetch initial data from Backend MongoDB APIs
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await api.get('/products');
      if (res.data?.success && res.data.products?.length > 0) {
        setProducts(res.data.products);
      } else {
        setProducts(fallbackProducts);
      }
    } catch (err) {
      console.warn('Backend API unavailable, using fallback trending catalog:', err.message);
      setProducts(fallbackProducts);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data?.success && res.data.categories?.length > 0) {
        const catNames = res.data.categories.map((c) => c.name);
        setCategories(['All', ...catNames]);
      } else {
        setCategories([
          'All',
          'Bathroom Essentials',
          'Home Organizers',
          'Smart Utility',
          'Kitchen Gadgets',
        ]);
      }
    } catch (err) {
      setCategories([
        'All',
        'Bathroom Essentials',
        'Home Organizers',
        'Smart Utility',
        'Kitchen Gadgets',
      ]);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data?.success && res.data.settings) {
        setSettings(res.data.settings);
      }
    } catch (err) {
      // Keep defaults
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSettings();
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('td_cart', JSON.stringify(cart));
  }, [cart]);

  // Save Wishlist to LocalStorage
  useEffect(() => {
    localStorage.setItem('td_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart Operations
  const addToCart = (product, quantity = 1, variant = '') => {
    setCart((prev) => {
      const pId = product._id || product.id;
      const existingIndex = prev.findIndex(
        (item) => (item._id || item.id) === pId && item.variant === variant
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].qty + quantity;
        const maxStock = product.stock || 50;
        updated[existingIndex].qty = Math.min(newQty, maxStock);
        return updated;
      } else {
        return [
          ...prev,
          {
            ...product,
            _id: pId,
            id: pId,
            qty: quantity,
            variant,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId, variant = '') => {
    setCart((prev) =>
      prev.filter((item) => !((item._id || item.id) === productId && item.variant === variant))
    );
  };

  const updateQuantity = (productId, newQty, variant = '') => {
    if (newQty <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if ((item._id || item.id) === productId && item.variant === variant) {
          const maxStock = item.stock || 99;
          return { ...item, qty: Math.min(newQty, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist Operations
  const toggleWishlist = (product) => {
    const pId = product._id || product.id;
    setWishlist((prev) => {
      const exists = prev.some((item) => (item._id || item.id) === pId);
      if (exists) {
        return prev.filter((item) => (item._id || item.id) !== pId);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item.id) === productId);
  };

  // Pricing & Calculations
  const formatPrice = (price) => {
    const num = Number(price) || 0;
    const curr = CURRENCIES[currency] || CURRENCIES.INR;
    return `${curr.symbol}${Math.round(num * curr.rate).toLocaleString('en-IN')}`;
  };

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.qty || 1),
    0
  );

  const deliveryCharge =
    cartSubtotal >= (settings?.freeDeliveryThreshold || 499) || cartSubtotal === 0
      ? 0
      : settings?.deliveryFee || 49;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      couponDiscount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && couponDiscount > appliedCoupon.maxDiscount) {
        couponDiscount = appliedCoupon.maxDiscount;
      }
    } else {
      couponDiscount = appliedCoupon.discountValue;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - couponDiscount + deliveryCharge);
  const cartSavings = cart.reduce((sum, item) => {
    const orig = Number(item.originalPrice) || Number(item.price);
    const curr = Number(item.price);
    return sum + (orig - curr) * (item.qty || 1);
  }, 0) + couponDiscount;

  // Coupon Operations
  const applyCoupon = async (code) => {
    try {
      const res = await api.post('/coupons/validate', {
        code,
        cartAmount: cartSubtotal,
      });
      if (res.data?.success) {
        setAppliedCoupon(res.data.coupon);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data?.message || 'Invalid coupon' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to apply coupon',
      };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        settings,
        cart,
        wishlist,
        appliedCoupon,
        currency,
        searchQuery,
        loadingProducts,
        quickOrderProduct,
        setQuickOrderProduct,
        setCurrency,
        setSearchQuery,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        formatPrice,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        deliveryCharge,
        couponDiscount,
        cartTotal,
        cartSavings,
        fetchProducts,
        fetchCategories,
        fetchSettings,
        CURRENCIES,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
