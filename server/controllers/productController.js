import Product from '../models/Product.js';
import mongoose from 'mongoose';

const FALLBACK_PRODUCTS = [
  {
    _id: 'prod-td-01',
    id: 'prod-td-01',
    title: 'Double Soap Holder with Flip Lids & Drainage Tray',
    description:
      'Wall-mounted dual soap box featuring hygienic dust-proof flip covers, bottom ventilation drainage tray, and an integrated loofah hook. Eliminates soggy counter mess and protects soaps from shower splashes.',
    price: 349,
    originalPrice: 599,
    category: 'Bathroom Essentials',
    brand: 'Trending Dart',
    stock: 85,
    badge: 'TRENDING #1',
    rating: 4.9,
    reviewCount: 164,
    image: '/hero-soap-holder.jpg',
    images: ['/hero-soap-holder.jpg'],
    isFeatured: true,
    isActive: true,
    specifications: [
      { key: 'Material', value: 'High Grade ABS Plastic' },
      { key: 'Mounting', value: 'Heavy Duty Self Adhesive (No Drilling)' },
      { key: 'Drainage', value: 'Removable Drip Tray' },
    ],
  },
  {
    _id: 'prod-td-02',
    id: 'prod-td-02',
    title: 'Self-Adhesive Stainless Steel Bathroom Corner Shelf',
    description:
      'Heavy-duty rustproof triangular shower caddy rack with ultra-strong adhesive stickers. Holds up to 10kg without drilling tiles.',
    price: 399,
    originalPrice: 699,
    category: 'Home Organizers',
    brand: 'Trending Dart',
    stock: 60,
    badge: 'BEST SELLER',
    rating: 4.8,
    reviewCount: 118,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80'],
    isFeatured: true,
    isActive: true,
  },
  {
    _id: 'prod-td-03',
    id: 'prod-td-03',
    title: '360° Rotating Faucet Extender & Kitchen Aerator',
    description:
      'Universal swivel splash filter faucet with dual outlet modes: gentle bubble stream and high pressure spray. Fits 99% standard faucets effortlessly.',
    price: 449,
    originalPrice: 799,
    category: 'Kitchen Gadgets',
    brand: 'Trending Dart',
    stock: 45,
    badge: 'VIRAL PRODUCT',
    rating: 5.0,
    reviewCount: 210,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80'],
    isFeatured: true,
    isActive: true,
  },
  {
    _id: 'prod-td-04',
    id: 'prod-td-04',
    title: 'Automatic Toothpaste Dispenser & Toothbrush Holder Set',
    description:
      'Hands-free squeeze pump gives the perfect amount of toothpaste every time. Dust-proof hanging slots keep toothbrushes dry and sanitary.',
    price: 499,
    originalPrice: 899,
    category: 'Bathroom Essentials',
    brand: 'Trending Dart',
    stock: 38,
    badge: 'MUST HAVE',
    rating: 4.8,
    reviewCount: 92,
    image: 'https://images.unsplash.com/photo-1559591937-e62fb330bc1f?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1559591937-e62fb330bc1f?w=800&q=80'],
    isFeatured: true,
    isActive: true,
  },
];

// 1. Get All Products with Filters, Sorting & Pagination
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      brand,
      minPrice,
      maxPrice,
      rating,
      sort,
      page = 1,
      limit = 24,
      isFeatured,
      includeInactive,
    } = req.query;

    const query = {};

    // Filter active products unless requested by admin
    if (!includeInactive) {
      query.isActive = true;
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    // Brand filter
    if (brand && brand !== 'All') {
      query.brand = brand;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Featured filter
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };
    else if (sort === 'popularity') sortOptions = { reviewCount: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 24;
    const skip = (pageNum - 1) * limitNum;

    if (mongoose.connection.readyState === 1) {
      const [products, totalCount] = await Promise.all([
        Product.find(query).sort(sortOptions).skip(skip).limit(limitNum),
        Product.countDocuments(query),
      ]);

      if (products && products.length > 0) {
        return res.status(200).json({
          success: true,
          count: products.length,
          totalCount,
          totalPages: Math.ceil(totalCount / limitNum),
          currentPage: pageNum,
          products,
        });
      }
    }

    // Fallback if database is still connecting or empty
    let filtered = FALLBACK_PRODUCTS.filter((p) => {
      if (category && category !== 'All' && p.category !== category) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

    return res.status(200).json({
      success: true,
      count: filtered.length,
      totalCount: filtered.length,
      totalPages: 1,
      currentPage: 1,
      products: filtered,
    });
  } catch (error) {
    console.warn('getProducts fallback activated:', error.message);
    return res.status(200).json({
      success: true,
      count: FALLBACK_PRODUCTS.length,
      totalCount: FALLBACK_PRODUCTS.length,
      totalPages: 1,
      currentPage: 1,
      products: FALLBACK_PRODUCTS,
    });
  }
};

// 2. Get Single Product by ID
export const getProductById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(req.params.id);
      if (product) {
        // Fetch related products in same category
        const relatedProducts = await Product.find({
          category: product.category,
          _id: { $ne: product._id },
          isActive: true,
        })
          .limit(4)
          .select('title price originalPrice image rating badge reviewCount');

        return res.status(200).json({
          success: true,
          product,
          relatedProducts,
        });
      }
    }

    const fallback =
      FALLBACK_PRODUCTS.find((p) => p._id === req.params.id || p.id === req.params.id) ||
      FALLBACK_PRODUCTS[0];
    return res.status(200).json({
      success: true,
      product: fallback,
      relatedProducts: FALLBACK_PRODUCTS.filter((p) => p._id !== fallback._id),
    });
  } catch (error) {
    const fallback = FALLBACK_PRODUCTS[0];
    return res.status(200).json({
      success: true,
      product: fallback,
      relatedProducts: FALLBACK_PRODUCTS.slice(1),
    });
  }
};

// 3. Create Product (Admin Only)
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      originalPrice,
      category,
      brand,
      stock,
      image,
      images,
      badge,
      isFeatured,
      isActive,
      specifications,
      variants,
    } = req.body;

    if (!title || !description || price === undefined || !category || !image) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, price, category, and main image are required.',
      });
    }

    const product = await Product.create({
      title: title.trim(),
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      category: category.trim(),
      brand: brand ? brand.trim() : 'Trending Dart',
      stock: stock !== undefined ? Number(stock) : 10,
      image,
      images: Array.isArray(images) ? images : [image],
      badge: badge || 'TRENDING',
      isFeatured: Boolean(isFeatured),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      specifications: specifications || [],
      variants: variants || [],
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product,
    });
  } catch (error) {
    console.error('createProduct error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update Product (Admin Only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Delete Product (Admin Only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Get Featured Products
export const getFeaturedProducts = async (req, res) => {
  try {
    const featured = await Product.find({ isActive: true, isFeatured: true }).limit(8);
    return res.status(200).json({ success: true, products: featured });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
