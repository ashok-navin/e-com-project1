import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import api from '../services/api';
import {
  User,
  Package,
  MapPin,
  Lock,
  LogOut,
  Clock,
  CheckCircle2,
  Truck,
  ChevronRight,
  Plus,
  AlertCircle,
  Save,
} from 'lucide-react';

export default function Profile() {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { formatPrice } = useShop();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'addresses', 'password'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Edit profile states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Add Address states
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPinCode, setNewPinCode] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }

    // Fetch user's orders
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data?.success) {
          setOrders(res.data.orders || []);
        }
      } catch (err) {
        console.warn('Could not load orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user, navigate]);

  if (!user) return null;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) =>
    ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT FOR DELIVERY'].includes(
      o.orderStatus
    )
  ).length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').length;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');

    try {
      await updateProfile({ name, phone });
      setProfileMessage('Profile details updated successfully!');
      setTimeout(() => setProfileMessage(''), 3000);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newState || !newPinCode) return;

    try {
      const currentAddresses = user.addresses || [];
      const updated = [
        ...currentAddresses,
        {
          fullName: user.name,
          phone: user.phone || '82708 82715',
          street: newStreet,
          city: newCity,
          state: newState,
          pinCode: newPinCode,
          isDefault: currentAddresses.length === 0,
        },
      ];
      await updateProfile({ addresses: updated });
      setShowAddAddress(false);
      setNewStreet('');
      setNewCity('');
      setNewState('');
      setNewPinCode('');
    } catch (err) {
      alert('Failed to save address.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      if (res.data?.success) {
        setPasswordMessage('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Account Overview Stats Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-black shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black">{user.name}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
              {user.phone && <p className="text-xs text-slate-400">{user.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-800 text-center">
            <div className="p-3 bg-slate-800/60 rounded-2xl">
              <span className="block text-xl sm:text-2xl font-black text-orange-400">
                {totalOrders}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Total Orders
              </span>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-2xl">
              <span className="block text-xl sm:text-2xl font-black text-amber-400">
                {pendingOrders}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                In Transit
              </span>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-2xl">
              <span className="block text-xl sm:text-2xl font-black text-emerald-400">
                {deliveredOrders}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Delivered
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar Tabs */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-orange-50 text-orange-600 shadow-sm'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package size={17} />
              <span>My Orders & Tracking</span>
            </div>
            <span className="bg-slate-100 px-2 py-0.5 rounded-full text-[10px]">
              {totalOrders}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-orange-50 text-orange-600 shadow-sm'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <User size={17} />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'addresses'
                ? 'bg-orange-50 text-orange-600 shadow-sm'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <MapPin size={17} />
            <span>Saved Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'password'
                ? 'bg-orange-50 text-orange-600 shadow-sm'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Lock size={17} />
            <span>Change Password</span>
          </button>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut size={17} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Content Column */}
        <div className="lg:col-span-8">
          
          {/* TAB 1: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-slate-900">Order History</h3>
                <span className="text-xs text-slate-500">{orders.length} orders placed</span>
              </div>

              {loadingOrders ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
                  <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                  <Package size={36} className="mx-auto text-slate-300" />
                  <h4 className="font-bold text-slate-800 text-sm">No Orders Placed Yet</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    When you order trending products, your order status and tracking will appear here.
                  </p>
                  <Link
                    to="/"
                    className="inline-block px-5 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-xs"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord._id || ord.orderId}
                      className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 hover:border-orange-500/30 transition-all"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                        <div>
                          <span className="text-slate-400">Order ID: </span>
                          <span className="font-mono font-bold text-slate-900">#{ord.orderId}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              ord.orderStatus === 'DELIVERED'
                                ? 'bg-emerald-100 text-emerald-700'
                                : ord.orderStatus === 'CANCELLED'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-2">
                        {ord.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div className="flex-1 min-w-0 text-xs">
                              <h5 className="font-bold text-slate-900 truncate">{item.title}</h5>
                              <p className="text-slate-500 text-[11px]">
                                Qty: {item.quantity} · {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                        <div>
                          <span className="text-slate-400">Total: </span>
                          <span className="font-black text-slate-900 text-sm">
                            {formatPrice(ord.totalAmount)}
                          </span>
                          <span className="text-[11px] text-slate-400 ml-1">
                            ({ord.paymentMethod})
                          </span>
                        </div>

                        <Link
                          to={`/orders/${ord.orderId}`}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <span>Track & View Details</span>
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EDIT PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-lg font-black text-slate-900">Personal Information</h3>

              {profileMessage && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{profileMessage}</span>
                </div>
              )}

              {profileError && (
                <div className="p-3 bg-rose-50 text-rose-600 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Read-only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 82708 82715"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md shadow-orange-500/20"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Saved Addresses</h3>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus size={14} /> Add New Address
                </button>
              </div>

              {showAddAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Add New Shipping Address
                  </h4>
                  <input
                    type="text"
                    required
                    placeholder="Street Address, House No."
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 outline-none bg-white"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 outline-none bg-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 outline-none bg-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="PIN Code"
                      value={newPinCode}
                      onChange={(e) => setNewPinCode(e.target.value)}
                      className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 outline-none bg-white"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {user.addresses?.length === 0 ? (
                  <p className="text-xs text-slate-500">No saved addresses yet.</p>
                ) : (
                  user.addresses?.map((addr, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{addr.fullName || user.name}</div>
                        <div className="text-slate-600 mt-1">
                          {addr.street}, {addr.city}, {addr.state} - {addr.pinCode}
                        </div>
                      </div>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CHANGE PASSWORD */}
          {activeTab === 'password' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-lg font-black text-slate-900">Change Account Password</h3>

              {passwordMessage && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{passwordMessage}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3 bg-rose-50 text-rose-600 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    New Password (min 6 chars)
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md shadow-orange-500/20"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
