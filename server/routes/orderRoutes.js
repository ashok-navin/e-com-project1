import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrder,
  getAllOrdersAdmin,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, optionalAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Order creation supports logged-in or guest with optional token
router.post('/', optionalAuth, createOrder);

// Customer specific orders
router.get('/my-orders', protect, getMyOrders);

// Public Order tracking by orderId
router.get('/track/:orderId', trackOrder);

// Order details (Customer or Admin)
router.get('/:id', optionalAuth, getOrderById);

// Admin-only order management
router.get('/admin/all', protect, requireAdmin, getAllOrdersAdmin);
router.put('/admin/:id/status', protect, requireAdmin, updateOrderStatus);

export default router;
