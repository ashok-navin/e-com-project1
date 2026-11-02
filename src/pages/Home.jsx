import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Filter,
  Zap,
  Star,
  Check,
} from 'lucide-react';
import Instagram from '../components/common/InstagramIcon';

export default function Home() {
  const {
    products = [],
    categories = [],
    searchQuery = '',
    formatPrice,
    settings,
    loadingProducts,
  } = useShop();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // Filter products by category and search
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const heroProduct =
    products.find((p) => p.title?.toLowerCase().includes('double soap holder')) ||
    products.find((p) => p.isFeatured) ||
    products[0] ||
    {
      _id: 'prod-td-01',
      title: 'Double Soap Holder with Flip Lids & Drainage Tray',
      description:
        'Wall-mounted dual soap box featuring hygienic dust-proof flip covers, bottom ventilation drainage tray, and an integrated loofah hook. Eliminates soggy counter mess.',
      price: 349,
      originalPrice: 599,
      image: '/hero-soap-holder.jpg',
      badge: 'VIRAL PICK #1',
    };

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. HERO SHOWCASE SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-2xl sm:rounded-3xl mx-3 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 px-4 py-8 sm:p-12 lg:p-14 border border-slate-900 shadow-2xl">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 left-5 sm:left-10 w-64 sm:w-80 h-64 sm:h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[11px] sm:text-xs font-black tracking-wide">
              <Sparkles size={13} className="shrink-0" />
              <span className="truncate">TRENDING SMART HOME & UTILITY 2026</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Keep Your Bathroom{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
                Neat, Dry & Organized
              </span>
              .
            </h1>

            <p className="text-xs sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Say goodbye to messy, soggy counters. Discover our viral wall-mounted double soap holders with dust-proof flip lids, ventilation drainage trays, and heavy-duty no-drill installation.
            </p>

            {/* Quick Benefits Bullet List - Stacks on narrow screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check size={12} />
                </div>
                <span>Dust-Proof Flip Lids</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check size={12} />
                </div>
                <span>Damage-Free Wall Mount</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check size={12} />
                </div>
                <span>Dual Ventilation Drain Tray</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check size={12} />
                </div>
                <span>Cash on Delivery Available</span>
              </div>
            </div>

            {/* Full-width responsive action buttons on mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <a
                href="#catalog"
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Shop All Trending Items</span>
                <ArrowRight size={16} />
              </a>

              <a
                href="https://www.instagram.com/trending_dart?xtok=MWFsZzJhbHhhcTdoNA=="
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-2xl text-xs font-bold transition-all border border-slate-800 flex items-center justify-center gap-2"
              >
                <Instagram size={16} className="text-pink-400 shrink-0" />
                <span>See Videos on Instagram</span>
              </a>
            </div>
          </div>

          {/* Featured Hero Product Card with Uploaded Hero Image */}
          <div className="lg:col-span-5 relative w-full max-w-full">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm w-full">
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow z-10">
                {heroProduct.badge || 'VIRAL PICK #1'}
              </div>

              <div className="aspect-square rounded-2xl overflow-hidden bg-white mb-5 border border-slate-700 shadow-inner">
                <img
                  src="/hero-soap-holder.jpg"
                  alt={heroProduct.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <h3 className="font-extrabold text-base text-white line-clamp-1">
                {heroProduct.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                {heroProduct.description}
              </p>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-800">
                <div>
                  <span className="text-2xl font-black text-orange-400">
                    {formatPrice(heroProduct.price)}
                  </span>
                  {heroProduct.originalPrice > heroProduct.price && (
                    <span className="text-xs text-slate-400 line-through ml-2">
                      {formatPrice(heroProduct.originalPrice)}
                    </span>
                  )}
                </div>

                <Link
                  to={`/product/${heroProduct._id || heroProduct.id || 'prod-td-01'}`}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-orange-500/25"
                >
                  View Product
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CATEGORY CHIPS BAR */}
      <section id="categories" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900">
              Browse Categories
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Explore by solution and room</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold tracking-wide shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. PRODUCT CATALOG GRID */}
      <section id="catalog" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">
              Trending Catalog
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
              Showing {sortedProducts.length} verified products with direct delivery
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-1.5">
              <Filter size={14} className="text-slate-400" />
              <span>Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold outline-none focus:border-orange-500"
            >
              <option value="featured">Featured / Trending</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-4"
              >
                <div className="aspect-square bg-slate-100 rounded-xl"></div>
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-6 sm:p-8">
            <p className="text-base font-bold text-slate-700">
              No products found matching your search.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
              }}
              className="mt-4 px-5 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. INSTAGRAM COMMUNITY PROMO */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-3 max-w-xl text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold">
              <Instagram size={14} />
              <span>OFFICIAL INSTAGRAM HANDLE</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black">
              Watch Real Product Demos & Unboxings
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Join thousands of satisfied shoppers. Check out customer reels, before-and-after transformations, and exclusive discount codes on our Instagram handle <strong>@trending_dart</strong>.
            </p>
          </div>

          <a
            href="https://www.instagram.com/trending_dart?xtok=MWFsZzJhbHhhcTdoNA=="
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-95 text-white font-black rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2.5 shrink-0"
          >
            <Instagram size={18} />
            <span>Follow @trending_dart</span>
          </a>
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-3xl font-black text-slate-900">
            Loved By 10,000+ Indian Homes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real feedback from verified buyers across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex text-amber-500 gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={15} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              "The double soap holder is a lifesaver! My counter used to get completely soaked and soap bars would melt. Now everything stays completely dry and neat."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">Pooja Sharma</span>
              <span className="text-emerald-600 font-semibold text-[10px]">Verified Buyer (Bangalore)</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex text-amber-500 gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={15} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              "Super fast delivery to Coimbatore. The adhesive sticker is shockingly strong - didn't have to drill my tiles at all. High quality ABS plastic finish."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">Karthik R.</span>
              <span className="text-emerald-600 font-semibold text-[10px]">Verified Buyer (Tamil Nadu)</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex text-amber-500 gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={15} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              "Ordered via Cash on Delivery and received it in 3 days. Exactly as shown on their Instagram reels! Will definitely buy more home organizers."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">Ananya Verma</span>
              <span className="text-emerald-600 font-semibold text-[10px]">Verified Buyer (Mumbai)</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
