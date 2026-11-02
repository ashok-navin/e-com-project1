import express from 'express';
import { getSettings, updateSettingsAdmin } from '../controllers/settingsController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/admin', protect, requireAdmin, updateSettingsAdmin);

export default router;
