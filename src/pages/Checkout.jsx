import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import api from '../services/api';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { initiateRazorpayPayment } from '../services/razorpayService';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  MapPin,
  User,
  Zap,
} from 'lucide-react';

export default function Checkout() {
  const { user, isAuthenticated, refreshProfile, updateUserAddresses } = useAuth();
  const {
    cart,
    clearCart,
    formatPrice,
    cartSubtotal,
    deliveryCharge,
    couponDiscount,
    cartTotal,
    appliedCoupon,
  } = useShop();

  const navigate = useNavigate();

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
  const [hasSavedAddress, setHasSavedAddress] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');

      const def = user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];
      if (def) {
        setStreet(def.street || '');
        setCity(def.city || '');
        setState(def.state || '');
        setPinCode(def.pinCode || '');
        setHasSavedAddress(true);
      }
    }
  }, [user]);

  // Guard: Cart cannot be empty
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-800">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Add products before proceeding to checkout.</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-orange-500 text-white font-bold rounded-xl text-xs uppercase"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  // Guard: User must be logged in to order (Per requirement)
  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">
          Login Required to Place Your Order
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
          For order tracking, instant email confirmation, and dispatch notifications, please log in with your Trending Dart account.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() =>
              navigate('/login', {
                state: { returnUrl: '/checkout', message: 'Log in to complete your checkout.' },
              })
            }
            className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-500/25"
          >
            Log In to Checkout
          </button>
          <button
            onClick={() =>
              navigate('/register', {
                state: { returnUrl: '/checkout' },
              })
            }
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            Create New Account
          </button>
        </div>

        <p className="text-[11px] text-slate-400 pt-2">
          By continuing, you agree to Trending Dart's{' '}
          <Link to="/terms" target="_blank" className="text-orange-600 font-semibold hover:underline">
            Terms & Conditions
          </Link>{' '}
          and{' '}
          <Link to="/privacy" target="_blank" className="text-orange-600 font-semibold hover:underline">
            Privacy Policy
          </Link>.
        </p>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    const customerEmail = (user?.email || email || '').toLowerCase().trim();
    const customerName = fullName.trim() || user?.name || 'Customer';
    const customerPhone = phone.trim() || user?.phone || '';

    if (!customerName || !customerEmail || !customerPhone || !street || !city || !state || !pinCode) {
      setError('Please fill in all required shipping address fields.');
      return;
    }

    setLoading(true);

    await initiateRazorpayPayment({
      amount: cartTotal,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      notes: {
        itemCount: String(cart.length),
      },
      onSuccess: async (paymentData) => {
        try {
          const orderPayload = {
            customer: {
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
            },
            shippingAddress: {
              street: street.trim(),
              city: city.trim(),
              state: state.trim(),
              pinCode: pinCode.trim(),
              instructions: instructions.trim(),
            },
            items: cart.map((item) => ({
              productId: item._id || item.id,
              title: item.title,
              price: Number(item.price),
              quantity: item.qty || 1,
              variant: item.variant || '',
              image: item.image,
            })),
            couponCode: appliedCoupon?.code || '',
            paymentMethod: 'RAZORPAY',
            razorpayPaymentId: paymentData.razorpayPaymentId || '',
            razorpayOrderId: paymentData.razorpayOrderId || '',
            razorpaySignature: paymentData.razorpaySignature || '',
          };

          const res = await api.post('/orders', orderPayload);
          if (res.data?.success && res.data.order) {
            if (res.data.savedAddresses) {
              updateUserAddresses(res.data.savedAddresses);
            } else {
              refreshProfile();
            }
            clearCart();
            try {
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.5 },
              });
            } catch (e) {}
            toast.success(
              `🎉 Order #${res.data.order.orderId} placed successfully! Confirmation sent to ${res.data.order.customer?.email}`,
              { duration: 6000 }
            );
            navigate(`/orders/${res.data.order.orderId}`, {
              state: { isNewOrder: true },
            });
          } else {
            setError(res.data?.message || 'Failed to place order.');
            setLoading(false);
          }
        } catch (err) {
          setError(
            err.response?.data?.message ||
              'Server error while processing your order. Please check your network and try again.'
          );
          setLoading(false);
        }
      },
      onError: (errMsg) => {
        setLoading(false);
        setError(errMsg || 'Razorpay payment could not be completed.');
      },
      onDismiss: () => {
        setLoading(false);
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Secure Checkout</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete your delivery details to finalize your order with Trending Dart
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Shipping Form Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer & Address Details */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin size={18} className="text-orange-500" />
                <span>Delivery Information</span>
              </h3>
              {hasSavedAddress && (
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={12} /> Saved Address Loaded
                </span>
              )}
            </div>

            {hasSavedAddress && (
              <div className="p-3.5 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-200/90 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-900">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Pre-filled from your previous order.</strong> You can freely edit any field below. Changes will automatically be saved for your next order.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 82708 82715"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Email Address (Order Confirmation will be sent here) *</span>
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Registered Account Email
                  </span>
                </label>
                <input
                  type="email"
                  required
                  disabled
                  value={user?.email || email}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-600 cursor-not-allowed outline-none font-medium"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Order confirmation receipt, tax invoice, and tracking updates will be delivered to your registered email.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street Address / Flat / Building / Landmark *
                </label>
                <textarea
                  required
                  rows={2}
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. Flat 302, Green Avenue, Near Apollo Pharmacy"
                  className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Coimbatore"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Tamil Nadu"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Postal PIN Code *
                </label>
                <input
                  type="text"
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="e.g. 641001"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Please call before delivery / Leave at gate"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <CreditCard size={18} className="text-orange-500" />
              <span>Payment Method</span>
            </h3>

            <div className="p-4 sm:p-5 rounded-2xl border-2 border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/10 text-left flex items-start justify-between shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-600 flex items-center justify-center font-black mt-0.5 shrink-0">
                  <CreditCard size={22} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex flex-wrap items-center gap-2">
                    Razorpay Secure Payment
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wide">
                      Instant & Verified
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Pay securely using Google Pay, PhonePe, Paytm, BHIM UPI, Credit/Debit Cards, or Netbanking powered by Razorpay.
                  </p>
                </div>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center shrink-0 mt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
              </div>
            </div>
          </div>

        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-extrabold text-slate-900">Order Items</h3>

            {/* Item Previews */}
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1 space-y-3">
              {cart.map((item, i) => (
                <div key={i} className="pt-3 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-slate-900 line-clamp-1">
                      {item.title}
                    </h5>
                    <div className="flex justify-between items-center text-xs text-slate-500 mt-1">
                      <span>Qty: {item.qty || 1}</span>
                      <span className="font-black text-slate-900">
                        {formatPrice((item.price || 0) * (item.qty || 1))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(cartSubtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <strong className="text-emerald-600">FREE</strong>
                  ) : (
                    formatPrice(deliveryCharge)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-orange-600">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 text-rose-600 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Pay {formatPrice(cartTotal)} with Razorpay</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Orders are secured with 256-bit encryption</span>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
