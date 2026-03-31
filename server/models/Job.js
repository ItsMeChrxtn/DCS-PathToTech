const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    company: String,
    location: String,
    specialization: String,

    // Required Qualifications
    requiredSkills: [
      {
        skill: String,
        proficiencyLevel: String,
        yearsExperience: Number,
      },
    ],
    requiredCertifications: [String],
    requiredEducation: String, // Bachelor's, Master's, etc.
    minGPA: Number,

    // Job Details
    jobType: String, // Full-time, Internship, etc.
    salaryRange: {
      min: Number,
      max: Number,
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: Date,
    source: String, // Internal, LinkedIn, etc.

    // Internal Use
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
