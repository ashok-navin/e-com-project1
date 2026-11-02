import React from 'react';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Home,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

const STEPS = [
  { key: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle2 },
  { key: 'PROCESSING', label: 'Processing & Packed', icon: Package },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'OUT FOR DELIVERY', label: 'Out for Delivery', icon: Clock },
  { key: 'DELIVERED', label: 'Delivered', icon: Home },
];

export default function OrderTimeline({ currentStatus, timeline = [], tracking = {} }) {
  const isCancelled = currentStatus === 'CANCELLED';
  const isReturn = currentStatus === 'RETURN REQUESTED' || currentStatus === 'RETURNED';

  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return 0;
      case 'PROCESSING':
        return 1;
      case 'SHIPPED':
        return 2;
      case 'OUT FOR DELIVERY':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  if (isCancelled) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-4 text-rose-700">
        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h4 className="font-extrabold text-base">This Order Has Been Cancelled</h4>
          <p className="text-xs text-rose-600 mt-1">
            If payment was deducted online, your refund will be processed within 3-5 business days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Visual Step Progress Bar */}
      <div className="relative py-4">
        {/* Desktop Line Progress */}
        <div className="hidden sm:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-200 -z-0">
          <div
            className="h-full bg-orange-500 transition-all duration-700 ease-in-out"
            style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
          {STEPS.map((step, idx) => {
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            const Icon = step.icon;

            return (
              <div
                key={step.key}
                className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    isCurrent
                      ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30 scale-110'
                      : isCompleted
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-white text-slate-400 border-slate-300'
                  }`}
                >
                  <Icon size={18} />
                </div>

                <div>
                  <h5
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-orange-600 font-black'
                        : isCompleted
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </h5>
                  {isCurrent && (
                    <span className="inline-block text-[10px] font-bold text-orange-500 uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-full mt-0.5">
                      Current
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tracking Details Banner */}
      {tracking?.trackingNumber && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">Courier Partner:</span>
            <span className="font-bold text-slate-900">{tracking.carrier || 'Express Logistics'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Tracking AWB:</span>
            <span className="font-mono font-bold text-orange-600">{tracking.trackingNumber}</span>
          </div>
          {tracking.estimatedDelivery && (
            <div>
              <span className="text-slate-500 block">Estimated Arrival:</span>
              <span className="font-bold text-emerald-600">{tracking.estimatedDelivery}</span>
            </div>
          )}
        </div>
      )}

      {/* History Timeline Log */}
      {timeline.length > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <h5 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
            Status Activity Log
          </h5>
          <div className="space-y-3">
            {timeline
              .slice()
              .reverse()
              .map((event, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <span className="font-bold text-slate-900">{event.status}: </span>
                    <span className="text-slate-600">{event.note || 'Status updated'}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {new Date(event.updatedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

