const mongoose = require('mongoose');
const { CERTIFICATION_STATUS } = require('../config/constants');

const certificationSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
    },
    issuer: {
      type: String,
      required: true,
    },
    dateEarned: {
      type: Date,
      required: true,
    },
    dateExpires: Date,
    category: String, // Cloud, AI/ML, Web Dev, etc.
    credentialUrl: String,
    credentialId: String,

    // File Information
    filePath: String,
    fileName: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },

    // Approval Workflow
    status: {
      type: String,
      enum: Object.values(CERTIFICATION_STATUS),
      default: CERTIFICATION_STATUS.PENDING,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvalDate: {
      type: Date,
      default: null,
    },
    rejectionReason: String,

    // Metadata
    isExpired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Certification', certificationSchema);
