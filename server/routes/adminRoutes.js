import express from 'express';
import {getAdminDashboard,getAdminStats,getAdminProfile,markSubmissionReviewed} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

import {updateProfile,changePassword} from '../controllers/settingsController.js'; 

const router = express.Router();

// ✅ Admin dashboard welcome
router.get('/dashboard', protectAdmin, getAdminDashboard);

// ✅ Admin analytics (total surveys, submissions)
router.get('/stats', protectAdmin, getAdminStats);

// ✅ Admin can update their profile info
router.put('/profile', protectAdmin, updateProfile);

// ✅ Admin can change their password
router.put('/change-password', protectAdmin, changePassword);

router.get('/profile', protectAdmin, getAdminProfile);

router.patch('/submissions/:id/review', protectAdmin, markSubmissionReviewed);



export default router;
