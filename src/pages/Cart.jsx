import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    formatPrice,
    cartSubtotal,
    deliveryCharge,
    couponDiscount,
    cartTotal,
    cartSavings,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    settings,
  } = useShop();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  const freeThreshold = settings?.freeDeliveryThreshold || 499;
  const amountNeededForFree = Math.max(0, freeThreshold - cartSubtotal);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setCouponLoading(true);
    setCouponMessage('');

    const res = await applyCoupon(couponCodeInput.trim());
    setCouponMessage(res.message);
    setCouponLoading(false);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Explore our trending viral organizers and home essentials to fill your cart.
        </p>
        <div className="pt-2">
          <Link
            to="/#catalog"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/25"
          >
            <span>Start Shopping</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Shopping Cart</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {cart.reduce((s, i) => s + (i.qty || 1), 0)} items in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Free Shipping Progress Alert */}
          <div className="p-4 bg-orange-50 border border-orange-200/80 rounded-2xl text-xs">
            <div className="flex items-center justify-between font-bold text-slate-800 mb-2">
              <span className="flex items-center gap-1.5 text-orange-600">
                <Truck size={16} />
                {amountNeededForFree === 0
                  ? '🎉 Congratulations! You have unlocked FREE Delivery.'
                  : `Add ${formatPrice(amountNeededForFree)} more to get FREE Delivery!`}
              </span>
              <span>{Math.min(100, Math.round((cartSubtotal / freeThreshold) * 100))}%</span>
            </div>
            <div className="w-full h-2 bg-orange-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (cartSubtotal / freeThreshold) * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
            {cart.map((item, idx) => (
              <div key={idx} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Product Snippet */}
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-2xl border border-slate-200 shrink-0"
                  />
                  <div>
                    <Link
                      to={`/product/${item._id || item.id}`}
                      className="font-bold text-sm text-slate-900 hover:text-orange-600 line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    {item.variant && (
                      <span className="inline-block text-[11px] font-semibold text-slate-400 mt-0.5">
                        Variant: {item.variant}
                      </span>
                    )}
                    <div className="text-sm font-black text-slate-900 mt-1">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                </div>

                {/* Quantity & Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  
                  {/* Quantity Changer */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(item._id || item.id, (item.qty || 1) - 1, item.variant)
                      }
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 font-bold text-xs text-slate-900">{item.qty || 1}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id || item.id, (item.qty || 1) + 1, item.variant)
                      }
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-black text-slate-900">
                      {formatPrice((item.price || 0) * (item.qty || 1))}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id || item.id, item.variant)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Coupon Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Coupon Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <Tag size={16} className="text-orange-500" /> Apply Coupon Code
            </h3>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs">
                <div>
                  <span className="font-bold text-emerald-800 uppercase tracking-wider block">
                    {appliedCoupon.code} Applied!
                  </span>
                  <span className="text-emerald-600">Saved {formatPrice(couponDiscount)}</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. TRENDING10"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 uppercase font-mono tracking-wider outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  disabled={couponLoading}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {couponMessage && (
              <p className="text-xs font-semibold text-slate-600">{couponMessage}</p>
            )}

            <div className="pt-2 text-[11px] text-slate-400">
              Try code <span className="font-bold text-slate-600">TRENDING10</span> for 10% off!
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">Order Summary</h3>

            <div className="space-y-2.5 text-xs text-slate-600 divide-y divide-slate-100">
              <div className="flex justify-between pt-1">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(cartSubtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between pt-2.5 text-emerald-600">
                  <span>Coupon Discount</span>
                  <span className="font-bold">-{formatPrice(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between pt-2.5">
                <span>Delivery Charges</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <strong className="text-emerald-600">FREE</strong>
                  ) : (
                    formatPrice(deliveryCharge)
                  )}
                </span>
              </div>

              <div className="flex justify-between pt-3 text-slate-900 font-black text-base">
                <span>Total Amount:</span>
                <span className="text-orange-600">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {cartSavings > 0 && (
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700 text-xs font-bold text-center">
                ✨ You are saving {formatPrice(cartSavings)} on this order!
              </div>
            )}

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Safe & Secure Checkout via Trending Dart</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
