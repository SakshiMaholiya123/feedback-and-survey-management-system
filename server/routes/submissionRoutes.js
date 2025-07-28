// server/routes/submissionRoutes.js
import express from 'express';
import {submitSurvey,getUserSubmissions,getAllSubmissions,getSubmissionsBySurveyId,deleteSubmission,updateSubmissionStatus} from '../controllers/submissionController.js';

import { protectUser, protectAdmin, protectAnyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔘 User submits a survey
router.post('/', protectUser, submitSurvey);

// 🔘 Get all submissions by a user
router.get('/user/:userId', protectUser, getUserSubmissions);

// 🔘 Get all submissions (Admin)
router.get('/all', protectAdmin, getAllSubmissions);

// 🔘 Get submissions by Survey ID (admin or user)
router.get('/survey/:id', protectAnyUser, getSubmissionsBySurveyId);

// 🔘 Delete a submission (admin only)
router.delete('/:id', protectAdmin, deleteSubmission);

// 🔘 Update submission status (admin only)
router.put('/:id/status', protectAdmin, updateSubmissionStatus);

export default router;
