import asyncHandler from 'express-async-handler';
import Submission from '../models/Submission.js';
import Survey from '../models/Survey.js';

// @desc    Submit a survey response
// @route   POST /api/submissions
// @access  Private (User)

export const submitSurvey = async (req, res) => {
  try {
    const { surveyId, responses } = req.body;
    const userId = req.user._id;

    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    const cleanedResponses = {};
    for (const [questionId, answer] of Object.entries(responses)) {
      const questionObj = survey.questions.find(
        (q) => q._id.toString() === questionId
      );
      if (questionObj?.question) {
        cleanedResponses[questionObj.question] = answer; // ⬅️ Save question TEXT as key
      } else {
        cleanedResponses[questionId] = answer;
      }
    }

    const submission = new Submission({
      userId,
      surveyId,
      responses: cleanedResponses, // ✅ Store questionText: answer
    });

    await submission.save();

    res.status(201).json({
      message: 'Submission successful',
      submission,
    });
  } catch (error) {
    console.error('Error submitting survey:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Get all submissions by a user
// @route   GET /api/submissions/user/:userId
// @access  Private (User/Admin)
export const getUserSubmissions = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (req.user.role === 'user' && req.user._id.toString() !== userId) {
    res.status(403);
    throw new Error('Not authorized to access other users’ submissions');
  }

  const submissions = await Submission.find({ userId }).populate({
    path: 'surveyId',
    select: 'title questions',
  });

  res.json(submissions);
});

// @desc    Get all submissions (admin only)
// @route   GET /api/submissions/all
// @access  Private (Admin)
// ✅ Get all submissions for surveys created by the current admin
export const getAllSubmissions = asyncHandler(async (req, res) => {
  try {
    const adminId = req.user._id;

    // Step 1: Get all surveys created by this admin
    const adminSurveys = await Survey.find({ createdBy: adminId }).select('_id');
    const surveyIds = adminSurveys.map(s => s._id);

    // Step 2: Get submissions for those surveys only
    const submissions = await Submission.find({ surveyId: { $in: surveyIds } })
      .populate({
        path: 'surveyId',
        select: 'title questions',
      });

    res.json(submissions);
  } catch (error) {
    console.error('Failed to fetch admin submissions:', error);
    res.status(500).json({ message: 'Server error while fetching submissions' });
  }
});


// @desc    Get submissions by survey ID
// @route   GET /api/submissions/survey/:id
// @access  Private (Admin/User)
export const getSubmissionsBySurveyId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const submissions = await Submission.find({ surveyId: id }).populate({
    path: 'surveyId',
    select: 'title questions',
  });

  res.json(submissions);
});

// @desc    Delete a submission (admin)
// @route   DELETE /api/submissions/:id
// @access  Private (Admin)
export const deleteSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id);

  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }

  await submission.deleteOne();
  res.json({ message: 'Submission deleted successfully' });
});

// @desc    Update submission status (admin)
// @route   PUT /api/submissions/:id/status
// @access  Private (Admin)
export const updateSubmissionStatus = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id);

  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }

  submission.status = req.body.status || 'Pending';
  await submission.save();

  res.json({ message: 'Status updated', submission });
});
