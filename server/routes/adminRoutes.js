import express from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import {
  getAllUsersAdmin,
  getUserDetailsAdmin,
  toggleUserStatusAdmin,
} from '../controllers/userController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, requireAdmin);

router.get('/dashboard-stats', getDashboardStats);
router.get('/customers', getAllUsersAdmin);
router.get('/customers/:id', getUserDetailsAdmin);
router.put('/customers/:id/toggle-status', toggleUserStatusAdmin);

export default router;
