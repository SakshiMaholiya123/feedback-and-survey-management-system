// File: server/routes/settingsRoutes.js

import express from 'express';
import { updateProfile, changePassword } from '../controllers/settingsController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Update admin profile
// PUT /api/settings/:adminId/profile
router.put('/:adminId/profile', protectAdmin, updateProfile);

// ✅ Change admin password
// PUT /api/settings/:adminId/password
router.put('/:adminId/password', protectAdmin, changePassword);

export default router;
