const mongoose = require('mongoose');
const { SURVEY_TYPES } = require('../config/constants');

const surveySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    surveyType: {
      type: String,
      enum: Object.values(SURVEY_TYPES),
      required: true,
    },
    questions: [
      {
        questionNumber: Number,
        text: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ['multiple_choice', 'rating', 'text', 'likert'],
          required: true,
        },
        options: [String], // For multiple choice
        minValue: Number, // For rating scales
        maxValue: Number,
        isRequired: {
          type: Boolean,
          default: true,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalResponses: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Survey', surveySchema);
