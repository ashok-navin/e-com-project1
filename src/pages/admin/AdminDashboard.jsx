import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import api from '../../services/api';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  Sparkles,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Eye,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  AlertCircle,
  ExternalLink,
  X,
  Save,
  Check,
  Percent,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

export default function AdminDashboard() {
  const { adminUser, isAdmin, logout } = useAuth();
  const { formatPrice, fetchProducts, fetchCategories, fetchSettings } = useShop();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Products state
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageMode, setImageMode] = useState('upload'); // 'upload' or 'url'
  const [uploadingImage, setUploadingImage] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Bathroom Essentials',
    price: '',
    originalPrice: '',
    stock: 20,
    image: '',
    images: [],
    badge: 'TRENDING',
    description: '',
  });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderUpdateStatus, setOrderUpdateStatus] = useState('');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [carrierInput, setCarrierInput] = useState('Express Logistics');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Categories state
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Customers state
  const [customers, setCustomers] = useState([]);

  // Coupons state
  const [coupons, setCoupons] = useState([]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState('');
  const [newCouponType, setNewCouponType] = useState('percentage');
  const [newCouponMin, setNewCouponMin] = useState(299);

  // Settings state
  const [settingsForm, setSettingsForm] = useState({
    websiteName: 'TRENDING DART',
    tagline: "Discover What's Trending",
    contactPhone: '82708 82715',
    contactEmail: 'trendingdart@gmail.com',
    instagram: 'https://www.instagram.com/trending_dart?xtok=MWFsZzJhbHhhcTdoNA==',
    deliveryFee: 49,
    freeDeliveryThreshold: 499,
  });

  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const triggerSuccess = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3500);
  };

  const triggerError = (msg) => {
    setActionError(msg);
    setTimeout(() => setActionError(''), 4000);
  };

  // Auth Guard
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  // Load Dashboard Overview Stats
  const loadDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.get('/admin/dashboard-stats');
      if (res.data?.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.warn('Dashboard stats error:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Load Products
  const loadProducts = async () => {
    try {
      const res = await api.get('/products?limit=100&includeInactive=true');
      if (res.data?.success) {
        setProducts(res.data.products || []);
      }
    } catch (err) {}
  };

  // Load Orders
  const loadOrders = async () => {
    try {
      const res = await api.get('/orders/admin/all?limit=100');
      if (res.data?.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {}
  };

  // Load Categories
  const loadCategories = async () => {
    try {
      const res = await api.get('/categories/admin');
      if (res.data?.success) {
        setCategories(res.data.categories || []);
      }
    } catch (err) {}
  };

  // Load Customers
  const loadCustomers = async () => {
    try {
      const res = await api.get('/admin/customers');
      if (res.data?.success) {
        setCustomers(res.data.users || []);
      }
    } catch (err) {}
  };

  // Load Coupons
  const loadCoupons = async () => {
    try {
      const res = await api.get('/coupons/admin');
      if (res.data?.success) {
        setCoupons(res.data.coupons || []);
      }
    } catch (err) {}
  };

  // Load Settings
  const loadSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data?.success && res.data.settings) {
        const s = res.data.settings;
        setSettingsForm({
          websiteName: s.websiteName || 'TRENDING DART',
          tagline: s.tagline || "Discover What's Trending",
          contactPhone: s.contactPhone || '82708 82715',
          contactEmail: s.contactEmail || 'trendingdart@gmail.com',
          instagram:
            s.socialLinks?.instagram ||
            'https://www.instagram.com/trending_dart?xtok=MWFsZzJhbHhhcTdoNA==',
          deliveryFee: s.deliveryFee || 49,
          freeDeliveryThreshold: s.freeDeliveryThreshold || 499,
        });
      }
    } catch (err) {}
  };

  useEffect(() => {
    loadDashboardStats();
    loadProducts();
    loadOrders();
    loadCategories();
    loadCustomers();
    loadCoupons();
    loadSettings();
  }, []);

  // 1. PRODUCT HANDLERS
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      category: categories[0]?.name || 'Bathroom Essentials',
      price: '',
      originalPrice: '',
      stock: 25,
      image: '/hero-soap-holder.jpg',
      images: ['/hero-soap-holder.jpg'],
      badge: 'TRENDING',
      description: '',
    });
    setGalleryUrlInput('');
    setImageMode('upload');
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      title: prod.title,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      stock: prod.stock,
      image: prod.image,
      images: prod.images?.length > 0 ? prod.images : prod.image ? [prod.image] : [],
      badge: prod.badge || '',
      description: prod.description,
    });
    setGalleryUrlInput('');
    setImageMode('upload');
    setProductModalOpen(true);
  };

  // Upload image file handler (for primary or gallery images)
  const handleImageUpload = async (e, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success && res.data.url) {
        const uploadedUrl = res.data.url;
        if (isGallery) {
          const current = productForm.images || [];
          setProductForm({
            ...productForm,
            images: [...current, uploadedUrl],
          });
          triggerSuccess('Gallery image uploaded!');
        } else {
          const current = productForm.images || [];
          setProductForm({
            ...productForm,
            image: uploadedUrl,
            images: current.length > 0 ? [uploadedUrl, ...current.filter((img) => img !== uploadedUrl)] : [uploadedUrl],
          });
          triggerSuccess('Product cover image uploaded!');
        }
      }
    } catch (err) {
      triggerError(err.response?.data?.message || 'Failed to upload image file.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    const current = productForm.images || [];
    setProductForm({
      ...productForm,
      images: [...current, galleryUrlInput.trim()],
    });
    setGalleryUrlInput('');
    triggerSuccess('Gallery image added!');
  };

  const handleRemoveGalleryImage = (imgUrl) => {
    const updated = (productForm.images || []).filter((i) => i !== imgUrl);
    setProductForm({
      ...productForm,
      images: updated,
      image: productForm.image === imgUrl ? (updated[0] || '') : productForm.image,
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const res = await api.put(`/products/${editingProduct._id}`, productForm);
        if (res.data?.success) {
          triggerSuccess('Product updated successfully!');
        }
      } else {
        const res = await api.post('/products', productForm);
        if (res.data?.success) {
          triggerSuccess('New product created successfully!');
        }
      }
      setProductModalOpen(false);
      loadProducts();
      fetchProducts();
    } catch (err) {
      triggerError(err.response?.data?.message || 'Failed to save product.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      triggerSuccess('Product deleted.');
      loadProducts();
      fetchProducts();
    } catch (err) {
      triggerError('Failed to delete product.');
    }
  };

  // 2. ORDER STATUS HANDLER
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/admin/${orderId}/status`, {
        status: newStatus,
        carrier: carrierInput,
        trackingNumber: trackingNumberInput,
        note: `Status updated by Admin to ${newStatus}.`,
      });
      if (res.data?.success) {
        triggerSuccess(`Order status updated to ${newStatus}! Customer notification sent.`);
        loadOrders();
        loadDashboardStats();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.data.order);
        }
      }
    } catch (err) {
      triggerError(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  // 3. CATEGORY HANDLERS
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await api.post('/categories', { name: newCategoryName.trim() });
      setNewCategoryName('');
      triggerSuccess('Category added.');
      loadCategories();
      fetchCategories();
    } catch (err) {
      triggerError('Failed to add category.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      triggerSuccess('Category deleted.');
      loadCategories();
      fetchCategories();
    } catch (err) {
      triggerError('Failed to delete category.');
    }
  };

  // 4. COUPON HANDLERS
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponValue) return;
    try {
      await api.post('/coupons/admin', {
        code: newCouponCode.trim().toUpperCase(),
        discountType: newCouponType,
        discountValue: Number(newCouponValue),
        minPurchase: Number(newCouponMin) || 0,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      });
      setNewCouponCode('');
      setNewCouponValue('');
      triggerSuccess('Coupon created.');
      loadCoupons();
    } catch (err) {
      triggerError(err.response?.data?.message || 'Failed to create coupon.');
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      await api.delete(`/coupons/admin/${id}`);
      triggerSuccess('Coupon deleted.');
      loadCoupons();
    } catch (err) {
      triggerError('Failed to delete coupon.');
    }
  };

  // 5. SETTINGS HANDLER
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put('/settings/admin', {
        websiteName: settingsForm.websiteName,
        tagline: settingsForm.tagline,
        contactPhone: settingsForm.contactPhone,
        contactEmail: settingsForm.contactEmail,
        socialLinks: {
          instagram: settingsForm.instagram,
        },
        deliveryFee: Number(settingsForm.deliveryFee),
        freeDeliveryThreshold: Number(settingsForm.freeDeliveryThreshold),
      });
      triggerSuccess('Website settings updated across customer storefront!');
      fetchSettings();
    } catch (err) {
      triggerError('Failed to update settings.');
    }
  };

  const handleAdminLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Trending Dart"
              className="w-10 h-10 object-contain rounded-xl p-0.5 bg-white shadow"
            />
            <div>
              <span className="font-black text-sm tracking-wider text-white block">
                TRENDING <span className="text-orange-500">DART</span>
              </span>
              <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest block">
                ADMIN CONSOLE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'orders'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={16} />
                <span>Orders Management</span>
              </div>
              <span className="bg-slate-800 text-[10px] px-2 py-0.5 rounded-full text-slate-300">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'products'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package size={16} />
                <span>Products Catalog</span>
              </div>
              <span className="bg-slate-800 text-[10px] px-2 py-0.5 rounded-full text-slate-300">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'categories'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FolderTree size={16} />
              <span>Categories</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'customers'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users size={16} />
              <span>Registered Customers</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'coupons'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Tag size={16} />
              <span>Coupons & Offers</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'settings'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings size={16} />
              <span>Website Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <span>Live Storefront</span>
            <ExternalLink size={13} />
          </Link>
          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10 text-left"
          >
            <LogOut size={14} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Stage */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl">
        
        {/* Global Notifications */}
        {actionSuccess && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {actionError && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg">
            <AlertCircle size={16} className="shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Dashboard Overview</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Real-time database analytics from MongoDB Atlas
                </p>
              </div>
              <button
                onClick={loadDashboardStats}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Refresh Data
              </button>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Gross Sales
                </span>
                <div className="text-2xl sm:text-3xl font-black text-orange-400">
                  {formatPrice(stats?.totalSales || 0)}
                </div>
                <span className="text-[10px] text-emerald-400 font-bold block">
                  ↑ Real-time confirmed revenue
                </span>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Orders
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {stats?.totalOrders || orders.length}
                </div>
                <span className="text-[10px] text-slate-400 block">All orders logged</span>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Registered Customers
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {stats?.totalCustomers || customers.length}
                </div>
                <span className="text-[10px] text-slate-400 block">Verified user accounts</span>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Catalog Products
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {stats?.totalProducts || products.length}
                </div>
                <span className="text-[10px] text-slate-400 block">Active listings in database</span>
              </div>
            </div>

            {/* Order Status Breakdown Grid */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
                Order Pipeline by Status
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
                {stats?.statusCounts &&
                  Object.entries(stats.statusCounts).map(([st, count]) => (
                    <div key={st} className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {st}
                      </span>
                      <span className="text-lg font-black text-white mt-1 block">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
                  Recent Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-orange-400 hover:underline font-bold"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord._id} className="hover:bg-slate-800/40">
                        <td className="py-3 font-mono font-bold text-orange-400">
                          #{ord.orderId}
                        </td>
                        <td className="py-3 font-medium text-white">{ord.customer?.name}</td>
                        <td className="py-3 font-bold">{formatPrice(ord.totalAmount)}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-200">
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400">
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setActiveTab('orders');
                            }}
                            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-bold"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: MANAGE PRODUCTS */}
        {/* ============================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">Manage Products</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Add, edit, manage stock, and toggle active catalog items
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/25 self-start"
              >
                <Plus size={16} />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/40">
                      <th className="p-4">Item</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Badge</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {products.map((prod) => (
                      <tr key={prod._id} className="hover:bg-slate-800/40">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-white line-clamp-1">{prod.title}</h4>
                            <span className="text-[11px] text-slate-500">{prod.brand}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">{prod.category}</td>
                        <td className="p-4 font-black text-orange-400">{formatPrice(prod.price)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            prod.stock > 10 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {prod.stock} in stock
                          </span>
                        </td>
                        <td className="p-4">
                          {prod.badge && (
                            <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-bold text-slate-300">
                              {prod.badge}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: MANAGE ORDERS (CRITICAL REQUIREMENT) */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">Orders Management</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Inspect customer orders, update tracking numbers & trigger automatic delivery status emails
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">Filter:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs font-bold outline-none"
                >
                  <option value="ALL">All Statuses ({orders.length})</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="OUT FOR DELIVERY">OUT FOR DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/40">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Order Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {orders
                      .filter(
                        (o) =>
                          orderStatusFilter === 'ALL' || o.orderStatus === orderStatusFilter
                      )
                      .map((ord) => (
                        <tr key={ord._id} className="hover:bg-slate-800/40">
                          <td className="p-4 font-mono font-bold text-orange-400">
                            #{ord.orderId}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white">{ord.customer?.name}</div>
                            <div className="text-[11px] text-slate-400">
                              {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-white font-mono">{ord.customer?.phone}</div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                              {ord.customer?.email}
                            </div>
                          </td>
                          <td className="p-4 font-black text-white">{formatPrice(ord.totalAmount)}</td>
                          <td className="p-4">
                            <span className="font-bold">{ord.paymentMethod}</span>
                            <span className="text-[10px] text-slate-400 block">
                              ({ord.paymentStatus})
                            </span>
                          </td>
                          <td className="p-4">
                            <select
                              value={ord.orderStatus}
                              onChange={(e) =>
                                handleUpdateOrderStatus(ord._id, e.target.value)
                              }
                              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs font-bold outline-none"
                            >
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="PROCESSING">PROCESSING</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="OUT FOR DELIVERY">OUT FOR DELIVERY</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 ml-auto"
                            >
                              <Eye size={13} />
                              <span>Details</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Order Full Modal */}
            {selectedOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
                <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-200">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-black text-white">
                        Order #{selectedOrder.orderId}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Placed: {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-2 text-slate-400 hover:text-white rounded-xl"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Customer & Address */}
                  <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <span className="font-bold text-slate-400 uppercase tracking-wider block">
                        Customer
                      </span>
                      <p className="font-bold text-white mt-1">{selectedOrder.customer?.name}</p>
                      <p className="text-slate-400">{selectedOrder.customer?.phone}</p>
                      <p className="text-slate-400">{selectedOrder.customer?.email}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 uppercase tracking-wider block">
                        Shipping Destination
                      </span>
                      <p className="text-slate-300 mt-1">{selectedOrder.shippingAddress?.street}</p>
                      <p className="text-slate-300">
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} -{' '}
                        {selectedOrder.shippingAddress?.pinCode}
                      </p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Ordered Products
                    </span>
                    <div className="divide-y divide-slate-800 bg-slate-950/60 rounded-2xl p-3 border border-slate-800 max-h-48 overflow-y-auto">
                      {selectedOrder.items?.map((it, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={it.image}
                              alt={it.title}
                              className="w-10 h-10 object-cover rounded-lg border border-slate-800"
                            />
                            <div>
                              <p className="font-bold text-white">{it.title}</p>
                              <p className="text-slate-400">Qty: {it.quantity}</p>
                            </div>
                          </div>
                          <span className="font-bold text-white">
                            {formatPrice(it.price * it.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status & Courier Tracking Input */}
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl space-y-3 text-xs">
                    <h5 className="font-bold text-orange-400">Update Courier & Live Status</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Carrier Name</label>
                        <input
                          type="text"
                          value={carrierInput}
                          onChange={(e) => setCarrierInput(e.target.value)}
                          placeholder="e.g. Express Logistics / Delhivery"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          Tracking AWB Number
                        </label>
                        <input
                          type="text"
                          value={trackingNumberInput}
                          onChange={(e) => setTrackingNumberInput(e.target.value)}
                          placeholder="e.g. TDTRK93019482"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT FOR DELIVERY', 'DELIVERED', 'CANCELLED'].map(
                        (st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateOrderStatus(selectedOrder._id, st)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                              selectedOrder.orderStatus === st
                                ? 'bg-orange-500 text-white shadow'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            Mark {st}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: CATEGORIES */}
        {/* ============================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Manage Categories</h2>

            {/* Add Category Form */}
            <form
              onSubmit={handleAddCategory}
              className="p-5 bg-slate-900 border border-slate-800 rounded-3xl flex gap-3 max-w-md"
            >
              <input
                type="text"
                required
                placeholder="New Category Name (e.g. Smart Utility)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs"
              >
                Add Category
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between"
                >
                  <span className="font-bold text-white text-xs">{cat.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: REGISTERED CUSTOMERS */}
        {/* ============================================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Registered Customers</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/40">
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Mobile</th>
                    <th className="p-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {customers.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-white">{c.name}</td>
                      <td className="p-4 text-slate-400">{c.email}</td>
                      <td className="p-4 font-mono text-slate-300">{c.phone || 'N/A'}</td>
                      <td className="p-4 text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: COUPONS & OFFERS */}
        {/* ============================================================== */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Coupons & Discounts</h2>

            {/* Create Coupon Form */}
            <form
              onSubmit={handleAddCoupon}
              className="p-6 bg-slate-900 border border-slate-800 rounded-3xl grid grid-cols-1 sm:grid-cols-4 gap-3 max-w-2xl text-xs"
            >
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH20"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 text-white border border-slate-700 uppercase font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Discount Type</label>
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Discount Value</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 15"
                  value={newCouponValue}
                  onChange={(e) => setNewCouponValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs"
                >
                  Create Code
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div
                  key={c._id}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono font-black text-orange-400 text-sm">{c.code}</span>
                    <p className="text-[11px] text-slate-400">
                      {c.discountValue}
                      {c.discountType === 'percentage' ? '%' : '₹'} OFF (Min ₹{c.minPurchase})
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteCoupon(c._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: WEBSITE SETTINGS (DYNAMIC FRONTEND SYNC) */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-2xl font-black text-white">Website & Contact Settings</h2>

            <form
              onSubmit={handleSaveSettings}
              className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-300 mb-1">Website Brand Name</label>
                <input
                  type="text"
                  value={settingsForm.websiteName}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, websiteName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Tagline</label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, tagline: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Helpline Phone Number
                  </label>
                  <input
                    type="text"
                    value={settingsForm.contactPhone}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, contactPhone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Customer Support Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.contactEmail}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, contactEmail: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Instagram Profile Link
                </label>
                <input
                  type="url"
                  value={settingsForm.instagram}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, instagram: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Standard Delivery Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.deliveryFee}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, deliveryFee: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Free Delivery Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.freeDeliveryThreshold}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        freeDeliveryThreshold: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-500/25 flex items-center gap-2"
              >
                <Save size={15} />
                <span>Save Website Settings</span>
              </button>
            </form>
          </div>
        )}

        {/* Product Add/Edit Modal */}
        {productModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-black text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => setProductModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) =>
                        setProductForm({ ...productForm, originalPrice: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c._id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Initial Stock *</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none"
                    />
                  </div>
                </div>

                {/* Image Selection Section: Upload vs URL */}
                <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-300">
                      Primary Product Cover Image *
                    </label>
                    
                    {/* Mode Toggle */}
                    <div className="flex bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setImageMode('upload')}
                        className={`px-2.5 py-1 rounded-md transition-colors ${
                          imageMode === 'upload'
                            ? 'bg-orange-500 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Upload Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`px-2.5 py-1 rounded-md transition-colors ${
                          imageMode === 'url'
                            ? 'bg-orange-500 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Image URL
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: File Upload */}
                  {imageMode === 'upload' ? (
                    <div className="space-y-2">
                      <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700 hover:border-orange-500/50 rounded-xl cursor-pointer bg-slate-900/60 transition-colors group">
                        <Upload size={20} className="text-slate-400 group-hover:text-orange-400 mb-1" />
                        <span className="text-xs font-bold text-slate-300 group-hover:text-white">
                          {uploadingImage ? 'Uploading Image...' : 'Click to Browse & Upload Image File'}
                        </span>
                        <span className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingImage}
                          onChange={(e) => handleImageUpload(e, false)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    /* Mode 2: Direct Image URL */
                    <div>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... or /hero-soap-holder.jpg"
                        value={productForm.image}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProductForm({
                            ...productForm,
                            image: val,
                            images: productForm.images?.length > 0 ? productForm.images : [val],
                          });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none"
                      />
                    </div>
                  )}

                  {/* Primary Image Preview */}
                  {productForm.image && (
                    <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-xl border border-slate-800">
                      <img
                        src={productForm.image}
                        alt="Cover Preview"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block">
                          ✓ Selected Primary Cover
                        </span>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {productForm.image}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Additional Product Gallery Images */}
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-400">
                      Additional Gallery Images ({productForm.images?.length || 0})
                    </label>

                    {/* Gallery Thumbnails List */}
                    {productForm.images?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {productForm.images.map((imgUrl, i) => (
                          <div
                            key={i}
                            className={`relative group rounded-lg overflow-hidden border ${
                              productForm.image === imgUrl ? 'border-orange-500' : 'border-slate-700'
                            }`}
                          >
                            <img src={imgUrl} alt="gallery" className="w-12 h-12 object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(imgUrl)}
                              className="absolute top-0 right-0 p-1 bg-rose-600 text-white rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove image"
                            >
                              <X size={10} />
                            </button>
                            {productForm.image !== imgUrl && (
                              <button
                                type="button"
                                onClick={() => setProductForm({ ...productForm, image: imgUrl })}
                                className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] text-white py-0.5 text-center opacity-0 group-hover:opacity-100"
                              >
                                Set Cover
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add More Gallery Images Controls */}
                    <div className="flex gap-2">
                      <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-bold flex items-center gap-1.5 cursor-pointer">
                        <Upload size={12} />
                        <span>Upload More</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, true)}
                          className="hidden"
                        />
                      </label>

                      <div className="flex-1 flex gap-1">
                        <input
                          type="url"
                          placeholder="or paste image URL"
                          value={galleryUrlInput}
                          onChange={(e) => setGalleryUrlInput(e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] text-white border border-slate-700 outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddGalleryUrl}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Badge (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. VIRAL, TRENDING #1"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-500/25"
                >
                  Save Product to Catalog
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
