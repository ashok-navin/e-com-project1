import express from 'express';
import {
  getActiveOffers,
  getAllOffersAdmin,
  createOffer,
  updateOffer,
  deleteOffer,
} from '../controllers/offerController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/active', getActiveOffers);
router.get('/admin', protect, requireAdmin, getAllOffersAdmin);
router.post('/admin', protect, requireAdmin, createOffer);
router.put('/admin/:id', protect, requireAdmin, updateOffer);
router.delete('/admin/:id', protect, requireAdmin, deleteOffer);

export default router;
