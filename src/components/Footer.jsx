import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Heart,
} from 'lucide-react';
import Instagram from './common/InstagramIcon';

export default function Footer() {
  const { settings } = useShop();

  const phone = settings?.contactPhone || '82708 82715';
  const email = settings?.contactEmail || 'trendingdart@gmail.com';
  const instagram =
    settings?.socialLinks?.instagram ||
    'https://www.instagram.com/trending_dart?xtok=MWFsZzJhbHhhcTdoNA==';

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      
      {/* 3 Core Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">Free Express Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">On all prepaid & COD orders above ₹499</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">100% Verified Quality</h4>
              <p className="text-xs text-slate-400 mt-0.5">Curated high-grade home & bathroom utility</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <RotateCcw size={24} />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">Easy Returns & Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dedicated phone & WhatsApp support</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Trending Dart"
                className="w-10 h-10 object-contain rounded-xl p-0.5 bg-white shadow"
              />
              <div>
                <span className="text-xl font-black text-white tracking-wider block">
                  TRENDING <span className="text-orange-500">DART</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block">
                  Discover What's Trending
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your premier destination for viral home organizers, smart bathroom utilities, and trending lifestyle essentials. Built for modern, comfortable living.
            </p>

            {/* Social Media */}
            <div className="pt-2">
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold hover:opacity-95 transition-all shadow-md"
              >
                <Instagram size={15} />
                <span>Follow @trending_dart on Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Explore
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#catalog" className="hover:text-orange-400 transition-colors">
                  Trending Products
                </a>
              </li>
              <li>
                <Link to="/track" className="hover:text-orange-400 transition-colors">
                  Live Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-orange-400 transition-colors">
                  My Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Categories
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="/#catalog" className="hover:text-orange-400 transition-colors">
                  Bathroom Essentials
                </a>
              </li>
              <li>
                <a href="/#catalog" className="hover:text-orange-400 transition-colors">
                  Home Organizers
                </a>
              </li>
              <li>
                <a href="/#catalog" className="hover:text-orange-400 transition-colors">
                  Smart Utility
                </a>
              </li>
              <li>
                <a href="/#catalog" className="hover:text-orange-400 transition-colors">
                  Kitchen Gadgets
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h5 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Contact & Support
            </h5>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 text-[10px]">Call / WhatsApp</span>
                  <a
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="text-white font-bold hover:text-orange-400"
                  >
                    {phone}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Mail size={15} className="text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 text-[10px]">Email Us</span>
                  <a
                    href={`mailto:${email}`}
                    className="text-white font-bold hover:text-orange-400 break-all"
                  >
                    {email}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-orange-400 shrink-0 mt-0.5" />
                <span className="text-slate-400">Trending Dart HQ, Coimbatore, Tamil Nadu, India</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} Trending Dart. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="/admin" className="hover:text-slate-300 transition-colors">
            Admin Portal
          </Link>
          <span>·</span>
          <span>Cash on Delivery & Secure Online UPI</span>
        </div>
      </div>
    </footer>
  );
}
