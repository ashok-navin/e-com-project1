import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Eye,
  Server,
  Share2,
  FileCheck,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-orange-600 flex items-center gap-1 font-semibold">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">Privacy Policy</span>
        </div>

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Shield size={14} /> Your Privacy Matters
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              At Trending Dart, your personal data privacy is our utmost priority. This Privacy Policy details how we collect, store, safeguard, and use your information when shopping with us.
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              Last Updated: November 2026 · Compliant with IT Act & Data Protection Guidelines
            </div>
          </div>
          {/* Subtle decorative glow */}
          <div className="absolute right-0 top-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          
          {/* 1. Commitment to Privacy */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs font-black">1</span>
              Our Commitment
            </h2>
            <p>
              Trending Dart operates transparently. We only collect the minimal personal data necessary to process your orders, deliver products to your doorstep, and keep you informed about your shipment status. <strong>We do not sell, rent, or trade your personal data to any third-party advertisers.</strong>
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section className="space-y-4 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs font-black">2</span>
              Information We Collect
            </h2>
            <p>
              When you visit our store, create an account, or complete a checkout, we collect:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <strong className="block font-bold text-slate-900">Personal & Contact Info</strong>
                <p className="text-slate-600">
                  Full name, email address, mobile phone number, and delivery street address with postal PIN code.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <strong className="block font-bold text-slate-900">Order & Transaction History</strong>
                <p className="text-slate-600">
                  Items ordered, invoice amounts, Razorpay payment reference IDs, applied coupons, and delivery status timeline.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <strong className="block font-bold text-slate-900">Account Credentials</strong>
                <p className="text-slate-600">
                  Securely hashed passwords (via bcrypt). We never store raw, readable passwords.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <strong className="block font-bold text-slate-900">Device & Usage Information</strong>
                <p className="text-slate-600">
                  Browser type, general geographic location (city level), and pages viewed to optimize user experience.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Payment Data Security (Razorpay) */}
          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs font-black">3</span>
              Payment Security & Financial Information
            </h2>
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <Lock size={18} className="text-emerald-600" />
                PCI-DSS Level 1 Gateway Protection
              </div>
              <p>
                All online transactions are processed through <strong>Razorpay</strong>. Your Credit Card numbers, Debit Card details, Netbanking credentials, and UPI PINs are processed directly on Razorpay's encrypted servers.
              </p>
              <p className="text-[11px] text-slate-500">
                Trending Dart does NOT store or have access to your card credentials or payment secrets at any point.
              </p>
            </div>
          </section>

          {/* 4. How We Use Your Information */}
          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs font-black">4</span>
              How We Use Your Data
            </h2>
            <ul className="list-disc list-inside space-y-2 text-slate-600 text-xs sm:text-sm">
              <li><strong>Order Fulfillment:</strong> To pack, dispatch, and deliver your products to the specified address.</li>
              <li><strong>Transactional Notifications:</strong> To automatically send order confirmation receipts, invoice details, and dispatch notifications to your registered email.</li>
              <li><strong>Live Tracking:</strong> To allow you to track your parcel live on our portal.</li>
              <li><strong>Customer Support:</strong> To assist you with replacements, delivery queries, or product questions via phone, WhatsApp, or email.</li>
            </ul>
          </section>

          {/* 5. Third-Party Sharing */}
          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs font-black">5</span>
              Third-Party Data Sharing
            </h2>
            <p>
              We only share relevant information with strictly verified logistics and payment partners:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Courier & Shipping Partners</strong>
                Name, phone number, and delivery address are shared with delivery couriers solely to complete order transit.
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Payment Service Providers</strong>
                Transaction amounts and order IDs are shared with Razorpay for secure checkout settlement.
              </div>
            </div>
          </section>

          {/* 6. Cookies & Local Storage */}
          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs font-black">6</span>
              Cookies & Local Browser Storage
            </h2>
            <p>
              Trending Dart uses browser Local Storage to remember your active login session, cart contents, wishlist items, and saved delivery addresses so you don't have to re-enter them on every visit. You can clear this data at any time from your browser settings.
            </p>
          </section>

          {/* 7. Your Data Rights */}
          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs font-black">7</span>
              Your Rights & Account Controls
            </h2>
            <p>
              You maintain full control over your personal data:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs sm:text-sm">
              <li>You can view and update your addresses at any time in your <Link to="/profile" className="text-orange-600 font-bold hover:underline">Profile Page</Link>.</li>
              <li>You can change your password or reset it via OTP.</li>
              <li>You may request complete account deletion and data removal by emailing our support desk.</li>
            </ul>
          </section>

          {/* 8. Contact Desk */}
          <section className="space-y-4 pt-6 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-6 sm:p-10 rounded-b-3xl">
            <h2 className="text-base font-black text-slate-900">
              Privacy Officer & Inquiries
            </h2>
            <p className="text-xs text-slate-600">
              If you have any questions or concerns about our Privacy Policy or your personal information, reach out anytime:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2.5">
                <Mail size={16} className="text-emerald-500 shrink-0" />
                <span className="font-semibold text-slate-800 break-all">trendingdart@gmail.com</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2.5">
                <Phone size={16} className="text-emerald-500 shrink-0" />
                <span className="font-semibold text-slate-800">+91 82708 82715</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2.5">
                <MapPin size={16} className="text-emerald-500 shrink-0" />
                <span className="font-semibold text-slate-800 truncate">Coimbatore, Tamil Nadu</span>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}

