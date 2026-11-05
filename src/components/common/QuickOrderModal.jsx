import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import api from '../../services/api';
import { initiateRazorpayPayment } from '../../services/razorpayService';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import {
  X,
  Zap,
  Lock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

export default function QuickOrderModal() {
  const { user, isAuthenticated, refreshProfile, updateUserAddresses } = useAuth();
  const {
    quickOrderProduct,
    setQuickOrderProduct,
    formatPrice,
    settings,
  } = useShop();

  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill user data when opened
  useEffect(() => {
    if (quickOrderProduct) {
      setQuantity(1);
      setError('');
      setPaymentMethod('RAZORPAY');
      if (quickOrderProduct.variants?.[0]?.options?.[0]) {
        setSelectedVariant(quickOrderProduct.variants[0].options[0]);
      } else {
        setSelectedVariant('');
      }

      if (user) {
        setPhone(user.phone || '');
        const defAddr = user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];
        if (defAddr) {
          setStreet(defAddr.street || '');
          setCity(defAddr.city || '');
          setState(defAddr.state || '');
          setPinCode(defAddr.pinCode || '');
        }
      }
    }
  }, [quickOrderProduct, user]);

  if (!quickOrderProduct) return null;

  const closeModal = () => {
    setQuickOrderProduct(null);
    setError('');
    setLoading(false);
  };

  const handleGoToLogin = () => {
    closeModal();
    navigate('/login', {
      state: {
        returnUrl: `/product/${quickOrderProduct._id || quickOrderProduct.id}`,
        message: 'Please log in to place your direct order with Trending Dart.',
      },
    });
  };

  const unitPrice = Number(quickOrderProduct.price) || 0;
  const subtotal = unitPrice * quantity;
  const deliveryCharge =
    subtotal >= (settings?.freeDeliveryThreshold || 499) ? 0 : settings?.deliveryFee || 49;
  const totalAmount = subtotal + deliveryCharge;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!street || !city || !state || !pinCode || !phone) {
      setError('Please fill in complete delivery address details.');
      return;
    }

    setLoading(true);

    const customerEmail = (user?.email || '').toLowerCase().trim();
    const customerName = user?.name || 'Customer';
    const customerPhone = phone.trim() || user?.phone || '82708 82715';

    // Initiate Razorpay Payment Flow
    await initiateRazorpayPayment({
      amount: totalAmount,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      notes: {
        productId: quickOrderProduct._id || quickOrderProduct.id || '',
        productTitle: quickOrderProduct.title || '',
        quantity: String(quantity),
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
            },
            items: [
              {
                productId: quickOrderProduct._id || quickOrderProduct.id || 'item-td-01',
                title: quickOrderProduct.title,
                price: unitPrice,
                quantity,
                variant: selectedVariant,
                image: quickOrderProduct.image,
              },
            ],
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

            const createdOrder = res.data.order;

            // CLOSE MODAL IMMEDIATELY -> User is back to normal page!
            closeModal();

            // Confetti explosion on normal page
            try {
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.5 },
              });
            } catch (err) {}

            // Prominent Success Toast Notification
            toast.success(
              `🎉 Order #${createdOrder.orderId} placed successfully! Confirmation email sent to ${createdOrder.customer?.email}`,
              { duration: 6000 }
            );
          } else {
            setError(res.data?.message || 'Failed to place order.');
            setLoading(false);
          }
        } catch (postErr) {
          setError(postErr.response?.data?.message || 'Error processing your order.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center text-orange-400">
              <Zap size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-wide flex items-center gap-1.5">
                Instant Order <span className="text-orange-400">Checkout</span>
              </h3>
              <p className="text-[11px] text-slate-400">Direct Razorpay checkout</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close"
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {!isAuthenticated ? (
            /* Not Logged In Requirement Prompt */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Lock size={32} />
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900">
                  Login Required to Place Order
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto">
                  For secure order processing, delivery tracking, and automated email updates, Trending Dart requires customers to log in before completing direct orders.
                </p>
              </div>

              {/* Product Preview Snippet */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left">
                <img
                  src={quickOrderProduct.image}
                  alt={quickOrderProduct.title}
                  className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-xs text-slate-900 truncate">
                    {quickOrderProduct.title}
                  </h5>
                  <div className="text-orange-600 font-black text-sm mt-0.5">
                    {formatPrice(quickOrderProduct.price)}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleGoToLogin}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-xl text-sm transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                >
                  <UserCheck size={18} />
                  <span>Log In to Complete Order</span>
                  <ArrowRight size={16} />
                </button>

                <p className="text-xs text-slate-500">
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      closeModal();
                      navigate('/register');
                    }}
                    className="text-orange-600 font-bold hover:underline"
                  >
                    Register in 30 seconds
                  </button>
                </p>

                <p className="text-[10px] text-center text-slate-400">
                  By logging in, you agree to our{' '}
                  <Link
                    to="/terms"
                    onClick={closeModal}
                    className="text-orange-600 font-semibold hover:underline"
                  >
                    Terms
                  </Link>{' '}
                  &{' '}
                  <Link
                    to="/privacy"
                    onClick={closeModal}
                    className="text-orange-600 font-semibold hover:underline"
                  >
                    Privacy Policy
                  </Link>.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-500" /> 100% Genuine
                </span>
                <span className="flex items-center gap-1">
                  <CreditCard size={14} className="text-orange-500" /> 100% Secure Razorpay & UPI
                </span>
              </div>
            </div>
          ) : (
            /* Logged In Customer - Direct Quick Checkout Form */
            <form onSubmit={handlePlaceOrder} className="space-y-5">
              
              {/* Product Details Bar */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <img
                  src={quickOrderProduct.image}
                  alt={quickOrderProduct.title}
                  className="w-16 h-16 object-cover rounded-xl border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                    {quickOrderProduct.title}
                  </h5>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-orange-600 font-black text-sm sm:text-base">
                      {formatPrice(unitPrice)}
                    </span>
                    {quickOrderProduct.originalPrice > unitPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(quickOrderProduct.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-black text-slate-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(quickOrderProduct.stock || 50, q + 1))}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Variant Selector (if applicable) */}
              {quickOrderProduct.variants?.[0]?.options?.length > 1 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select {quickOrderProduct.variants[0].name || 'Option'}:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickOrderProduct.variants[0].options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedVariant(opt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          selectedVariant === opt
                            ? 'border-orange-500 bg-orange-50 text-orange-600'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Address Fields */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    Delivery Address
                  </label>
                  <span className="text-[11px] text-slate-400">Ordering as: {user?.name}</span>
                </div>

                {user?.addresses?.length > 0 && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-xl text-[11px] flex items-center gap-2">
                    <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
                    <span>Saved delivery address loaded. You can edit any field below.</span>
                  </div>
                )}

                {/* Registered Email confirmation notification */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Confirmation will be sent to:</span>
                  <span className="font-bold text-slate-900">{user?.email}</span>
                </div>

                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Contact Phone Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="House / Flat / Building / Street Address *"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="City / Town *"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="State *"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Postal PIN Code *"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector - 100% Razorpay Online Payments */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Payment Method:
                </label>
                <div className="p-3.5 rounded-2xl border border-orange-500 bg-orange-50/40 text-left flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 flex items-center justify-center font-black">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        Razorpay Secure Payment
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-extrabold uppercase">
                          Instant UPI & Cards
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Google Pay, PhonePe, Paytm, Debit/Credit Card, Netbanking
                      </div>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                  </div>
                </div>
              </div>

              {/* Price Summary Breakdown */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Item Subtotal ({quantity}x)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge</span>
                  <span>{deliveryCharge === 0 ? <strong className="text-emerald-600">FREE</strong> : formatPrice(deliveryCharge)}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                  <span>Total Payable:</span>
                  <span className="text-orange-600">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 text-rose-600 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Zap size={18} />
                    <span>Pay {formatPrice(totalAmount)} & Place Order</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
