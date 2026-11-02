import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import api from '../services/api';
import OrderTimeline from '../components/layout/OrderTimeline';
import {
  Package,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  Truck,
  CheckCircle2,
  Printer,
} from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams();
  const { formatPrice, settings } = useShop();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const location = useLocation();
  const isNewOrder = location.state?.isNewOrder;

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/orders/${id}`);
        if (res.data?.success && res.data.order) {
          setOrder(res.data.order);
        } else {
          setError('Order details could not be found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading order.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-800">Order Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'Please check your order ID and try again.'}</p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-xs"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const phone = settings?.contactPhone || '82708 82715';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Breadcrumb & Print */}
      <div className="flex items-center justify-between">
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Back to My Account</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
        >
          <Printer size={14} />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* New Order Celebration Banner */}
      {isNewOrder && (
        <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <h3 className="font-black text-lg">Thank You! Your Order Has Been Confirmed.</h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              An immediate confirmation email has been dispatched to <strong>{order.customer?.email}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Order Main Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Order #{order.orderId}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  order.orderStatus === 'DELIVERED'
                    ? 'bg-emerald-100 text-emerald-700'
                    : order.orderStatus === 'CANCELLED'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {order.orderStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Calendar size={13} />
              <span>
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Amount</span>
            <span className="text-2xl font-black text-orange-600">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Live Tracking Visual Timeline */}
        <div className="pt-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
            Live Order Status Timeline
          </h4>
          <OrderTimeline
            currentStatus={order.orderStatus}
            timeline={order.statusTimeline}
            tracking={order.tracking}
          />
        </div>
      </div>

      {/* 2 Column Details: Items & Delivery */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Ordered Items */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Ordered Items</h3>

          <div className="divide-y divide-slate-100">
            {order.items?.map((item, i) => (
              <div key={i} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 object-cover rounded-2xl border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs text-slate-900 truncate">{item.title}</h5>
                    {item.variant && (
                      <span className="text-[11px] text-slate-400 block">
                        Variant: {item.variant}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </span>
                  </div>
                </div>

                <span className="font-black text-xs text-slate-900 shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">{formatPrice(order.subtotal)}</span>
            </div>
            {order.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Coupon Discount ({order.couponCode})</span>
                <span>-{formatPrice(order.couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>
                {order.deliveryCharge === 0 ? (
                  <strong className="text-emerald-600">FREE</strong>
                ) : (
                  formatPrice(order.deliveryCharge)
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>Total Paid:</span>
              <span className="text-orange-600">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Shipping Address */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin size={14} className="text-orange-500" /> Delivery Address
            </h4>
            <div className="text-xs text-slate-700 space-y-1">
              <p className="font-bold text-slate-900">{order.customer?.name}</p>
              <p className="text-slate-600">{order.shippingAddress?.street}</p>
              <p className="text-slate-600">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} -{' '}
                {order.shippingAddress?.pinCode}
              </p>
              <p className="text-slate-500 pt-1">
                Phone: <strong>{order.customer?.phone}</strong>
              </p>
              <p className="text-slate-500">
                Email: <strong>{order.customer?.email}</strong>
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2 text-xs">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CreditCard size={14} className="text-orange-500" /> Payment Information
            </h4>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-600">Payment Mode:</span>
              <span className="font-bold text-slate-900">{order.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Payment Status:</span>
              <span className="font-bold text-emerald-600">{order.paymentStatus}</span>
            </div>
          </div>

          {/* Support Helpline Box */}
          <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-2xl text-xs space-y-2">
            <h5 className="font-bold text-slate-900">Need Help with this Order?</h5>
            <p className="text-slate-600 text-[11px]">
              Contact Trending Dart customer care directly via phone or WhatsApp:
            </p>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 font-bold text-orange-600 hover:underline"
            >
              <Phone size={13} />
              <span>Call Helpline: {phone}</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}

