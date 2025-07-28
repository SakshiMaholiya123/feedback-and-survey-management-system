// server/controllers/adminController.js

import Survey from '../models/Survey.js';
import Submission from '../models/Submission.js';

// @desc    Get Admin Dashboard Info (basic user info)
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getAdminDashboard = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  res.status(200).json({
    message: '📊 Welcome to the Admin Dashboard!',
    admin: req.user.fullName,
    email: req.user.email,
  });
};

// @desc    Get Admin Stats (Survey & Submission Summary)
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req, res) => {
  try {
    const adminId = req.user._id;

    // Get all surveys by current admin
    const surveys = await Survey.find({ createdBy: adminId });

    const totalSurveys = surveys.length;
    const activeSurveys = surveys.filter((s) => s.isActive === true).length;
    const totalSubmissions = await Submission.countDocuments({
    surveyId: { $in: surveys.map(s => s._id) },
});


    // Responses per survey
    const responseStatsRaw = await Submission.aggregate([
      {
        $group: {
          _id: '$surveyId',
          responses: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'surveys',
          localField: '_id',
          foreignField: '_id',
          as: 'survey',
        },
      },
      { $unwind: '$survey' },
      {
        $project: {
          survey: '$survey.title',
          responses: 1,
        },
      },
    ]);

    // Survey types distribution
    const typeStatsRaw = await Survey.aggregate([
      {
        $match: { createdBy: adminId },
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // ✅ Send full survey array to frontend to enable filtering (for dashboard)
    res.status(200).json({
      totalSurveys,
      activeSurveys,
      totalSubmissions,
      responseStats: responseStatsRaw,
      typeStats: typeStatsRaw,
      surveys, // ✅ Key addition to fix frontend activeSurveys
    });

  } catch (error) {
    console.error('❌ Admin stats error:', error.message);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

// @desc    Get Admin Profile Info
// @route   GET /api/admin/profile
// @access  Private (Admin)
export const getAdminProfile = async (req, res) => {
  try {
    const admin = req.user;

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      _id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching admin profile' });
  }
};



export const markSubmissionReviewed = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.status = 'Reviewed';
    await submission.save();

    res.json({ message: 'Marked as Reviewed.' });
  } catch (err) {
    console.error('Error updating submission:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

