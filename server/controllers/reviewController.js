import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, userName } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Product, rating, and review comment are required.',
      });
    }

    const review = await Review.create({
      product: productId,
      user: req.user ? req.user._id : null,
      userName: req.user ? req.user.name : userName || 'Verified Buyer',
      rating: Number(rating),
      comment: comment.trim(),
      isApproved: true,
    });

    // Update product rating and review count
    const allReviews = await Review.find({ product: productId, isApproved: true });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1);

    await Product.findByIdAndUpdate(productId, {
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: allReviews.length,
    });

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'title image')
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReviewStatusAdmin = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    return res.status(200).json({ success: true, review });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReviewAdmin = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    return res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
