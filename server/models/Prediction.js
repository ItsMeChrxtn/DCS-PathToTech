const mongoose = require('mongoose');
const { EMPLOYABILITY_LEVELS } = require('../config/constants');

const predictionSchema = new mongoose.Schema(
  {
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

    // Overall Employability Score
    employabilityScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    employabilityLevel: {
      type: String,
      enum: Object.values(EMPLOYABILITY_LEVELS),
    },

    // Component Scores
    academicScore: Number, // Based on grades
    skillsScore: Number, // Based on technical skills
    certificationScore: Number, // Based on certifications
    softSkillsScore: Number, // Based on soft skills survey

    // Prediction Details
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    skillGaps: [
      {
        skill: String,
        importance: String, // high, medium, low
        recommendedCertifications: [String],
      },
    ],

    // GMM Clustering Result
    clusterAssignment: {
      clusterId: Number,
      clusterLabel: String,
      confidence: Number,
    },

    // ECLAT Rules Applied
    appliedRules: [
      {
        antecedent: [String],
        consequent: [String],
        confidence: Number,
        support: Number,
      },
    ],

    // Job Matching Data
    suggestedJobRoles: [
      {
        jobTitle: String,
        matchScore: Number,
        skillGaps: [String],
      },
    ],

    // Metadata
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    modelVersion: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Prediction', predictionSchema);
