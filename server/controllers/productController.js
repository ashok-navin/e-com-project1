import Product from '../models/Product.js';

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

    const [products, totalCount] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Product.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: products.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    console.error('getProducts error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Single Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

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
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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
