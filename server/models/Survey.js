import mongoose from 'mongoose';

// 🔹 Schema for individual questions inside a survey
const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'mcq', 'checkbox', 'rating'],
    default: 'text'
  },
  options: {
    type: [String], // Used if type is 'mcq' or 'checkbox'
    default: []
  }
});

// 🔹 Main survey schema
const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'General'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  questions: {
    type: [questionSchema],
    required: true
  },
  expiresAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 🔹 Export default
const Survey = mongoose.model('Survey', surveySchema);
export default Survey;
