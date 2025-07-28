// server/routes/surveyRoutes.js

import express from 'express';
import {
  createSurvey,
  getSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
  toggleSurveyStatus
} from '../controllers/surveyController.js';



import {protectAdmin,isAdmin,protectAnyUser
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protectAdmin, isAdmin, createSurvey);       // Only Admins
router.get('/', protectAnyUser, getSurveys);                 // Admin + Users
router.get('/:id', protectAnyUser, getSurveyById);        // Admin + Users
router.put('/:id', protectAdmin, isAdmin, updateSurvey);     // Only Admins
router.delete('/:id', protectAdmin, isAdmin, deleteSurvey);  // Only Admins
router.patch('/:id/toggle', protectAdmin, toggleSurveyStatus);


export default router;
