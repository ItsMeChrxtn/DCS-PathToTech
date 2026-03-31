const mongoose = require('mongoose');
const { PROFICIENCY_LEVELS, SKILL_CATEGORIES } = require('../config/constants');

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // Personal Information
    dateOfBirth: Date,
    gender: String,
    phone: String,
    address: String,
    city: String,
    country: String,

    // Academic Information
    enrollmentNumber: {
      type: String,
      unique: true,
    },
    course: String,
    specialization: String,
    academicYear: String,
    semester: String,
    section: String,
    currentCGPA: {
      type: Number,
      min: 0,
      max: 4.0,
    },

    // Career Information
    careerInterests: [String],
    preferredJobTitles: [String],
    about: String,

    // Skills
    technicalSkills: [
      {
        name: String,
        proficiencyLevel: {
          type: String,
          enum: Object.values(PROFICIENCY_LEVELS),
        },
        yearsOfExperience: Number,
        endorsements: {
          type: Number,
          default: 0,
        },
      },
    ],

    softSkills: [
      {
        name: String,
        proficiencyLevel: {
          type: String,
          enum: Object.values(PROFICIENCY_LEVELS),
        },
      },
    ],

    // Profile Status
    profileCompletionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Flags for completion
    isBasicInfoComplete: {
      type: Boolean,
      default: false,
    },
    isAcademicInfoComplete: {
      type: Boolean,
      default: false,
    },
    isSkillsComplete: {
      type: Boolean,
      default: false,
    },
    isCareerInfoComplete: {
      type: Boolean,
      default: false,
    },

    // Stats
    totalGradesUploaded: {
      type: Number,
      default: 0,
    },
    totalCertificationsUploaded: {
      type: Number,
      default: 0,
    },
    totalSurveysCompleted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
