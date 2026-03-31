const mongoose = require('mongoose');

const surveyResponseSchema = new mongoose.Schema(
  {
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Survey',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    responses: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        questionText: String,
        response: mongoose.Schema.Types.Mixed, // Can be string, number, or array
        responseType: String,
      },
    ],
    numericResponses: [
      {
        questionNumber: Number,
        numericValue: Number,
      },
    ],
    completedAt: {
      type: Date,
      default: Date.now,
    },
    isSubmitted: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SurveyResponse', surveyResponseSchema);
