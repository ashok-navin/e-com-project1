import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  CreditCard,
  Truck,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-orange-600 flex items-center gap-1 font-semibold">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">Terms and Conditions</span>
        </div>

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <FileText size={14} /> Legal Agreement
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Welcome to Trending Dart. These terms and conditions outline the rules, obligations, and guidelines for using our website and purchasing our curated home & utility products.
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              Last Updated: November 2026 · Effective Immediately
            </div>
          </div>
          {/* Subtle decorative glow */}
          <div className="absolute right-0 top-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          
          {/* 1. Introduction */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center text-xs font-black">1</span>
              Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or shopping on <strong>Trending Dart</strong> (accessible at <span className="text-orange-600 font-semibold">trendingdart.shop</span> and affiliated domains), you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions, along with our Privacy Policy. If you do not agree to these terms, please refrain from using our services.
            </p>
          </section>

          {/* 2. Account Registration */}
          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center text-xs font-black">2</span>
              User Accounts & Eligibility
            </h2>
            <p>
              To place orders and access order tracking on Trending Dart, you are required to register an account with valid contact details (Full Name, Active Email, Phone Number, and Delivery Address).
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs sm:text-sm">
              <li>You must be at least 18 years old or under legal guardian supervision to place orders.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree to provide true, accurate, and up-to-date delivery information to avoid shipping failures.</li>
            </ul>
          </section>

          {/* 3. Product Catalog & Pricing */}
          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center text-xs font-black">3</span>
              Product Pricing, Availability & Accuracy
            </h2>
            <p>
              We strive to display accurate product photos, specifications, dimensions, and prices. However:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Pricing in INR</strong>
                All listed prices are displayed in Indian Rupees (₹) inclusive of applicable goods taxes.
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Inventory & Stock</strong>
                Items are subject to availability. If an item runs out of stock after order confirmation, you will be notified immediately and refunded in full.
              </div>
            </div>
          </section>

          {/* 4. Payments via Razorpay */}
          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center text-xs font-black">4</span>
              Payments & Gateway Security
            </h2>
            <p>
              Trending Dart accepts secure 100% online payments through <strong>Razorpay</strong>, India's leading PCI-DSS Level 1 compliant payment gateway.
            </p>
            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200/80 text-xs sm:text-sm text-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-orange-900">
                <CreditCard size={18} className="text-orange-600" />
                Accepted Payment Methods:
              </div>
              <p>
                UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, MasterCard, RuPay), and Netbanking from major Indian banks.
              </p>
              <p className="text-[11px] text-slate-500">
                Trending Dart never stores your card numbers, CVVs, or UPI PINs. All financial transactions are encrypted through 256-bit bank-grade SSL security by Razorpay.
              </p>
            </div>
          </section>

          {/* 5. Shipping & Delivery */}
          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center text-xs font-black">5</span>
              Shipping, Dispatch & Order Tracking
            </h2>
            <p>
              Orders are dispatched via trusted courier partners within 24 to 48 business hours of order placement.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs sm:text-sm">
              <li><strong>Delivery Timeline:</strong> Typically delivered within 3 to 5 business days across India.</li>
              <li><strong>Free Delivery:</strong> Orders exceeding ₹499 qualify for Free Express Shipping. Standard delivery fee of ₹49 applies on orders under ₹499.</li>
              <li><strong>Tracking:</strong> You can track live dispatch status at any time via our <Link to="/track" className="text-orange-600 font-bold hover:underline">Track Order</Link> page using your Order ID.</li>
            </ul>
          </section>

          {/* 6. Returns & Replacements */}
          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center text-xs font-black">6</span>
              Cancellations, Returns & Replacements
            </h2>
            <p>
              We stand behind the quality of every product shipped from our hub:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                <strong className="block text-emerald-900 mb-1">Damaged / Defective Items</strong>
                If your package arrives damaged or malfunctioning, contact our support team within 48 hours of delivery with an unboxing photo/video for an immediate free replacement.
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Order Cancellation</strong>
                Orders can be cancelled before they are dispatched from our warehouse by reaching out directly to our WhatsApp or email helpline.
              </div>
            </div>
          </section>

          {/* 7. Limitation of Liability */}
          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center text-xs font-black">7</span>
              Limitation of Liability & Governing Law
            </h2>
            <p>
              Trending Dart shall not be held liable for indirect, incidental, or consequential damages resulting from product misuse, improper wall mounting, or delayed deliveries caused by courier disruptions or extreme weather events.
            </p>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of <strong>India</strong>. Any disputes shall be subject to the exclusive jurisdiction of the competent courts in <strong>Coimbatore, Tamil Nadu</strong>.
            </p>
          </section>

          {/* 8. Contact & Grievance */}
          <section className="space-y-4 pt-6 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-6 sm:p-10 rounded-b-3xl">
            <h2 className="text-base font-black text-slate-900">
              Customer Support & Grievance Contact
            </h2>
            <p className="text-xs text-slate-600">
              For questions regarding these terms, product assistance, or orders, reach out to our dedicated support desk:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2.5">
                <Mail size={16} className="text-orange-500 shrink-0" />
                <span className="font-semibold text-slate-800 break-all">trendingdart@gmail.com</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2.5">
                <Phone size={16} className="text-orange-500 shrink-0" />
                <span className="font-semibold text-slate-800">+91 82708 82715</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2.5">
                <MapPin size={16} className="text-orange-500 shrink-0" />
                <span className="font-semibold text-slate-800 truncate">Coimbatore, Tamil Nadu</span>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}

