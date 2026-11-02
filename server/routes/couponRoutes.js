import express from 'express';
import {
  validateCoupon,
  getCouponsAdmin,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/validate', validateCoupon);
router.get('/admin', protect, requireAdmin, getCouponsAdmin);
router.post('/admin', protect, requireAdmin, createCoupon);
router.put('/admin/:id', protect, requireAdmin, updateCoupon);
router.delete('/admin/:id', protect, requireAdmin, deleteCoupon);

export default router;
