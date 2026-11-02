import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Eye, Zap, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ProductCard({ product }) {
  const {
    isInWishlist,
    toggleWishlist,
    addToCart,
    formatPrice,
    setQuickOrderProduct,
  } = useShop();

  const inWishlist = isInWishlist(product._id || product.id);
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-orange-500/30 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      
      {/* Product Image Stage */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Link to={`/product/${product._id || product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          {product.badge && (
            <span className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-orange-500 text-white text-[10px] font-black tracking-wider px-2 py-0.5 rounded-md shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          aria-label="Toggle Wishlist"
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-sm ${
            inWishlist
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
          }`}
        >
          <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>

        {/* Quick View Button */}
        <Link
          to={`/product/${product._id || product.id}`}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-950/85 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg hover:bg-slate-900"
        >
          <Eye size={14} /> Quick View
        </Link>
      </div>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
            <span className="truncate max-w-[120px]">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star size={12} fill="currentColor" />
              <span>{product.rating || '4.8'}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount || 12})</span>
            </div>
          </div>

          <Link to={`/product/${product._id || product.id}`}>
            <h3 className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-orange-600 transition-colors">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Double Action Buttons */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              In Stock
            </span>
          </div>

          {/* Dual Action: Add to Cart & Straight Order Now */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addToCart(product, 1)}
              className="py-2 px-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <ShoppingBag size={14} /> Add
            </button>

            {/* Direct Order Button with Login Verification Flow */}
            <button
              onClick={() => setQuickOrderProduct(product)}
              className="py-2 px-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
            >
              <Zap size={14} /> Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
