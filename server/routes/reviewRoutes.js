import express from 'express';
import {
  getProductReviews,
  createReview,
  getAllReviewsAdmin,
  updateReviewStatusAdmin,
  deleteReviewAdmin,
} from '../controllers/reviewController.js';
import { protect, optionalAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/', optionalAuth, createReview);

router.get('/admin', protect, requireAdmin, getAllReviewsAdmin);
router.put('/admin/:id/status', protect, requireAdmin, updateReviewStatusAdmin);
router.delete('/admin/:id', protect, requireAdmin, deleteReviewAdmin);

export default router;
