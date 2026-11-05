import express from 'express';
import {
  getRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../controllers/paymentController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/razorpay-key', getRazorpayKey);
router.post('/razorpay-order', optionalAuth, createRazorpayOrder);
router.post('/razorpay-verify', optionalAuth, verifyRazorpayPayment);

export default router;

