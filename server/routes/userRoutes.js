// routes/userRoutes.js

import express from 'express';
import { registerUser, loginUser } from '../controllers/userAuthController.js';
import { getUserProfile } from '../controllers/userController.js';
import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Profile Route
router.get('/profile', protectUser, getUserProfile);

export default router;
