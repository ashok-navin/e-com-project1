import React, { useState } from 'react';
import api from '../services/api';
import OrderTimeline from '../components/layout/OrderTimeline';
import { Search, Package, AlertCircle } from 'lucide-react';

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const cleanId = orderId.trim().toUpperCase().replace('#', '');
      const res = await api.get(`/orders/track/${cleanId}`);
      if (res.data?.success && res.data.order) {
        setOrder(res.data.order);
      } else {
        setError('No active order found with this Order ID.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found. Please verify your Order ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      
      {/* Search Stage */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl font-black text-slate-900">Live Order Tracking</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your Trending Dart Order ID (sent in your confirmation email/SMS) to check current dispatch & delivery status.
        </p>

        <form onSubmit={handleTrack} className="flex gap-2 pt-4">
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder="e.g. TD-839201-4921"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm uppercase font-mono tracking-wider rounded-2xl border border-slate-200 outline-none focus:border-orange-500 bg-white shadow-sm"
            />
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-500/25"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
      </div>

      {error && (
        <div className="max-w-md mx-auto p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-600 flex items-center gap-2">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Card */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs text-slate-400">Order Reference:</span>
              <h3 className="text-xl font-mono font-black text-slate-900">#{order.orderId}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Customer:</span>
              <p className="text-xs font-bold text-slate-900">{order.customer?.name}</p>
            </div>
          </div>

          <OrderTimeline
            currentStatus={order.orderStatus}
            timeline={order.statusTimeline}
            tracking={order.tracking}
          />
        </div>
      )}

    </div>
  );
}

