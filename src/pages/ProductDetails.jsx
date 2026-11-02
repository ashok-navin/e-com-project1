import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import {
  Heart,
  ShoppingBag,
  Zap,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Share2,
} from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    setQuickOrderProduct,
  } = useShop();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [activeTab, setActiveTab] = useState('specs');
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchSingleProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data?.success && res.data.product) {
          const prod = res.data.product;
          setProduct(prod);
          setSelectedImage(prod.image);
          if (prod.variants?.[0]?.options?.[0]) {
            setSelectedVariant(prod.variants[0].options[0]);
          }
        } else {
          // Fallback to local products array
          const found = products.find((p) => (p._id || p.id) === id);
          if (found) {
            setProduct(found);
            setSelectedImage(found.image);
          }
        }
      } catch (err) {
        const found = products.find((p) => (p._id || p.id) === id);
        if (found) {
          setProduct(found);
          setSelectedImage(found.image);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSingleProduct();
  }, [id, products]);

  // Fetch reviews
  useEffect(() => {
    if (product?._id) {
      api
        .get(`/reviews/product/${product._id}`)
        .then((res) => {
          if (res.data?.success) setReviews(res.data.reviews || []);
        })
        .catch(() => {});
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <Link
          to="/"
          className="mt-4 inline-block px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-xs"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id || product.id);
  const gallery = [product.image, ...(product.images || [])].filter(
    (v, i, a) => a.indexOf(v) === i
  );

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await api.post('/reviews', {
        productId: product._id || product.id,
        rating: newRating,
        comment: newComment,
      });
      if (res.data?.success) {
        setReviews([res.data.review, ...reviews]);
        setNewComment('');
        setReviewSuccess(true);
        setTimeout(() => setReviewSuccess(false), 4000);
      }
    } catch (err) {
      console.warn('Review submission error:', err);
    }
  };

  const relatedProducts = products
    .filter(
      (p) =>
        p.category === product.category && (p._id || p.id) !== (product._id || product.id)
    )
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link to="/" className="hover:text-orange-500">
          Home
        </Link>
        <ChevronRight size={14} />
        <span>{product.category}</span>
        <ChevronRight size={14} />
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Gallery Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 relative group">
            <img
              src={selectedImage || product.image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-slate-900 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg shadow-md">
                {product.badge}
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md transition-all shadow-md ${
                inWishlist
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
              }`}
            >
              <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-orange-500 shadow-md ring-2 ring-orange-500/20'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
              <span>{product.brand || 'Trending Dart'}</span>
              <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                <Star size={15} fill="currentColor" />
                <span>{product.rating || '4.9'}</span>
                <span className="text-slate-400">({product.reviewCount || 120} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.title}
            </h1>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black text-slate-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-slate-400 line-through ml-3 font-semibold">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="px-3 py-1 bg-orange-500 text-white font-black text-xs rounded-full shadow-sm">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Variants Selector */}
          {product.variants?.[0]?.options && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select {product.variants[0].name || 'Option'}:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants[0].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedVariant(opt)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedVariant === opt
                        ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Quantity:
            </label>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center border border-slate-300 rounded-2xl bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  -
                </button>
                <span className="px-3 font-bold text-sm text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock || 50, q + 1))}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-emerald-600 font-bold">
                ✓ In Stock ({product.stock || 50} units ready for immediate dispatch)
              </span>
            </div>
          </div>

          {/* Dual Action Buttons: Add to Cart & Straight Order Now */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            
            {/* Standard Add to Cart */}
            <button
              onClick={() => addToCart(product, quantity, selectedVariant)}
              className="py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <ShoppingBag size={18} />
              <span>Add to Cart</span>
            </button>

            {/* Direct Instant Order Button with Required Login flow */}
            <button
              onClick={() => setQuickOrderProduct(product)}
              className="py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/30"
            >
              <Zap size={18} />
              <span>⚡ Order Now</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl">
              <Truck size={18} className="mx-auto text-orange-500 mb-1" />
              <span>Cash on Delivery</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <ShieldCheck size={18} className="mx-auto text-orange-500 mb-1" />
              <span>100% Genuine</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <RotateCcw size={18} className="mx-auto text-orange-500 mb-1" />
              <span>Easy Support</span>
            </div>
          </div>
        </div>

      </div>

      {/* Product Specifications & Customer Reviews Tabs */}
      <div className="pt-10 border-t border-slate-200">
        <div className="flex items-center gap-6 border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveTab('specs')}
            className={`text-sm font-black uppercase tracking-wider transition-all ${
              activeTab === 'specs'
                ? 'text-orange-600 border-b-2 border-orange-600 pb-4 -mb-4'
                : 'text-slate-400 hover:text-slate-800'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`text-sm font-black uppercase tracking-wider transition-all ${
              activeTab === 'reviews'
                ? 'text-orange-600 border-b-2 border-orange-600 pb-4 -mb-4'
                : 'text-slate-400 hover:text-slate-800'
            }`}
          >
            Customer Reviews ({reviews.length})
          </button>
        </div>

        <div className="py-6">
          {activeTab === 'specs' ? (
            <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 overflow-hidden text-xs">
              <div className="divide-y divide-slate-100">
                <div className="grid grid-cols-3 p-3.5 bg-slate-50 font-bold text-slate-500">
                  <span>Specification</span>
                  <span className="col-span-2">Details</span>
                </div>
                {(product.specifications?.length > 0
                  ? product.specifications
                  : [
                      { key: 'Material', value: 'High Density ABS Polymer' },
                      { key: 'Mounting Style', value: 'No Drill Heavy Duty Adhesive Pad' },
                      { key: 'Drainage Feature', value: 'Double Bottom Ventilation Slots' },
                      { key: 'Applicable Area', value: 'Bathroom, Kitchen Tiles, Glass, Metal' },
                    ]
                ).map((spec, i) => (
                  <div key={i} className="grid grid-cols-3 p-3.5">
                    <span className="font-bold text-slate-700">{spec.key}</span>
                    <span className="col-span-2 text-slate-600">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8 max-w-2xl">
              {/* Write Review Form */}
              <form onSubmit={handleReviewSubmit} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  Write a Customer Review
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">Your Rating:</span>
                  <div className="flex gap-1 text-amber-500 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={18}
                        fill={s <= newRating ? 'currentColor' : 'none'}
                        onClick={() => setNewRating(s)}
                      />
                    ))}
                  </div>
                </div>
                <textarea
                  required
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 outline-none focus:border-orange-500 bg-white"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Submit Review
                </button>
                {reviewSuccess && (
                  <p className="text-xs text-emerald-600 font-bold">
                    Thank you! Your review has been added.
                  </p>
                )}
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-slate-500">No customer reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((r, i) => (
                    <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{r.userName}</span>
                        <div className="flex text-amber-500 gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              fill={s <= r.rating ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-slate-200 space-y-6">
          <h3 className="text-2xl font-black text-slate-900">
            More Trending Picks in {product.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
