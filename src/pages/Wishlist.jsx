import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export default function Wishlist() {
  const { wishlist = [] } = useShop();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <Heart size={36} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Wishlist is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Save items you love so you can easily find and order them later.
        </p>
        <div className="pt-2">
          <Link
            to="/#catalog"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/25"
          >
            <span>Explore Trending Products</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Wishlist</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {wishlist.length} saved products
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <ProductCard key={item._id || item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
