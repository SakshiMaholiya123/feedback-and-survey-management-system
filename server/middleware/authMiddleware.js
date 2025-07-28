// server/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

// 🟡 Protect Admin Routes
export const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Admin.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Admin not found');
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized as admin');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// 🟢 Protect User Routes
export const protectUser = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized as user');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// ✅ Allow both Admin & User
export const protectAnyUser = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user = await Admin.findById(decoded.id).select('-password');
      if (!user) {
        user = await User.findById(decoded.id).select('-password');
      }

      if (!user) {
        res.status(401);
        throw new Error('Not authorized: token failed');
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized: token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// ✅ ADD THIS — Checks if the logged-in user is an admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role?.toLowerCase() === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied: Admins only');
  }
};
