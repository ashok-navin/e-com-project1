import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import api from '../../services/api';
import confetti from 'canvas-confetti';
import {
  X,
  Zap,
  Lock,
  UserCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
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
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);

  // Pre-fill user data when opened
  useEffect(() => {
    if (quickOrderProduct) {
      setQuantity(1);
      setError('');
      setSuccessOrder(null);
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
    setSuccessOrder(null);
    setError('');
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
    try {
      const customerEmail = (user?.email || '').toLowerCase().trim();
      const customerName = user?.name || 'Customer';
      const customerPhone = phone.trim() || user?.phone || '82708 82715';

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
        paymentMethod,
      };

      const res = await api.post('/orders', orderPayload);
      if (res.data?.success && res.data.order) {
        if (res.data.savedAddresses) {
          updateUserAddresses(res.data.savedAddresses);
        } else {
          refreshProfile();
        }
        setSuccessOrder(res.data.order);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore confetti if blocked
        }
      } else {
        setError(res.data?.message || 'Failed to place order.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing your order.');
    } finally {
      setLoading(false);
    }
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
              <p className="text-[11px] text-slate-400">Direct order without adding to cart</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          
          {/* Case 1: Order Completed Success Screen */}
          {successOrder ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="text-2xl font-black text-slate-900">Order Confirmed!</h4>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">
                Thank you! Your order <strong>#{successOrder.orderId}</strong> has been placed successfully. A confirmation email has been dispatched to <strong>{successOrder.customer?.email}</strong>.
              </p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left space-y-1">
                <div><strong>Amount:</strong> {formatPrice(successOrder.totalAmount)} ({successOrder.paymentMethod})</div>
                <div><strong>Delivery to:</strong> {successOrder.shippingAddress?.city}, {successOrder.shippingAddress?.state} - {successOrder.shippingAddress?.pinCode}</div>
                <div><strong>Estimated Time:</strong> 3-5 Business Days</div>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    closeModal();
                    navigate(`/orders/${successOrder.orderId}`);
                  }}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-orange-500/25"
                >
                  Track Live Order Status
                </button>
                <button
                  onClick={closeModal}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : !isAuthenticated ? (
            
            /* Case 2: Not Logged In Requirement Prompt */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Lock size={32} />
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900">
                  Login Required to Place Order
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto">
                  For secure order processing, delivery tracking, and automated email/SMS updates, Trending Dart requires customers to log in before completing direct orders.
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
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-500" /> 100% Genuine
                </span>
                <span className="flex items-center gap-1">
                  <Truck size={14} className="text-blue-500" /> Cash on Delivery Available
                </span>
              </div>
            </div>
          ) : (
            
            /* Case 3: Logged In Customer - Direct Quick Checkout Form */
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
                  <span className="px-2 font-bold text-xs">{quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(quickOrderProduct.stock || 50, q + 1))
                    }
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Variant selection if available */}
              {quickOrderProduct.variants?.[0]?.options && (
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
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          selectedVariant === opt
                            ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Delivery Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Delivery Address
                  </span>
                  <span className="text-[11px] text-slate-500">Ordering as: {user.name}</span>
                </div>

                {user.addresses && user.addresses.length > 0 && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-[11px] text-emerald-800 font-medium">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>Saved delivery address loaded. You can edit any field below.</span>
                  </div>
                )}

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[11px] text-slate-600">
                  <span>Confirmation will be sent to:</span>
                  <span className="font-bold text-slate-900">{user.email}</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="col-span-2">
                    <input
                      type="tel"
                      required
                      placeholder="Contact Mobile Number (e.g. 82708 82715)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Street Address, Flat / House No."
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Postal PIN Code"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Payment Method:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'COD' ? 'border-orange-500' : 'border-slate-400'
                    }`}>
                      {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-orange-500"></div>}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Cash on Delivery</div>
                      <div className="text-[10px] text-slate-500">Pay when delivered</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      paymentMethod === 'ONLINE'
                        ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'ONLINE' ? 'border-orange-500' : 'border-slate-400'
                    }`}>
                      {paymentMethod === 'ONLINE' && <div className="w-2 h-2 rounded-full bg-orange-500"></div>}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Online / UPI</div>
                      <div className="text-[10px] text-slate-500">Instant digital payment</div>
                    </div>
                  </button>
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
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Zap size={18} />
                    <span>Confirm & Place Order Now</span>
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

