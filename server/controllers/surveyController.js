import asyncHandler from 'express-async-handler';
import Survey from '../models/Survey.js';

// @desc    Create a new survey
// @route   POST /api/surveys
// @access  Private/Admin
const createSurvey = asyncHandler(async (req, res) => {
  const { title, questions, category, expiresAt, description, type } = req.body;

  const survey = await Survey.create({
    title,
    questions,
    category,
    expiresAt,
    description,
    type,
    createdBy: req.user._id,
  });

  res.status(201).json(survey);
});

// @desc    Get all surveys
// @route   GET /api/surveys
// @access  Private (user/admin)
const getSurveys = asyncHandler(async (req, res) => {
  const role = req.user?.role;

  const surveys =
    role === 'admin'
      ? await Survey.find({ createdBy: req.user._id })
      : await Survey.find({});

  res.json(surveys);
});

// @desc    Get a survey by ID
// @route   GET /api/surveys/:id
// @access  Private (user/admin)
const getSurveyById = asyncHandler(async (req, res) => {
  const survey = await Survey.findById(req.params.id);
  if (!survey) {
    res.status(404);
    throw new Error('Survey not found');
  }
  res.json(survey);
});

// @desc    Update a survey
// @route   PUT /api/surveys/:id
// @access  Private/Admin
const updateSurvey = asyncHandler(async (req, res) => {
  const survey = await Survey.findById(req.params.id);
  if (!survey) {
    res.status(404);
    throw new Error('Survey not found');
  }

  survey.title = req.body.title || survey.title;
  survey.questions = req.body.questions || survey.questions;
  survey.category = req.body.category || survey.category;
  survey.expiresAt = req.body.expiresAt || survey.expiresAt;
  survey.description = req.body.description || survey.description;
  survey.type = req.body.type || survey.type;

  const updated = await survey.save();
  res.status(200).json(updated);
});

// @desc    Delete a survey
// @route   DELETE /api/surveys/:id
// @access  Private/Admin
const deleteSurvey = asyncHandler(async (req, res) => {
  const survey = await Survey.findById(req.params.id);
  if (!survey) {
    res.status(404);
    throw new Error('Survey not found');
  }

  await survey.deleteOne();
  res.status(200).json({ message: '✅ Survey deleted successfully' });
});

// @desc    Toggle survey status (active/inactive)
// @route   PATCH /api/surveys/:id/toggle
// @access  Private/Admin
const toggleSurveyStatus = asyncHandler(async (req, res) => {
  const survey = await Survey.findById(req.params.id);
  if (!survey) {
    res.status(404);
    throw new Error('Survey not found');
  }

  survey.isActive = !survey.isActive;
  await survey.save();

  res.status(200).json({ message: 'Survey status updated', isActive: survey.isActive });
});

export {
  createSurvey,
  getSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
  toggleSurveyStatus,
};
