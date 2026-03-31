const mongoose = require('mongoose');
const { GRADE_STATUS } = require('../config/constants');

const gradeSchema = new mongoose.Schema(
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
    subjectCode: String,
    subjectName: String,
    grade: String, // 1.00 (highest) to 5.00 failed, supports INC
    marks: Number,
    outOfMarks: Number,
    percentage: Number,
    semester: String,
    academicYear: String,

    // File Information
    filePath: String,
    fileName: String,
    fileType: String, // pdf, image
    uploadedAt: {
      type: Date,
      default: Date.now,
    },

    // Approval Workflow
    status: {
      type: String,
      enum: Object.values(GRADE_STATUS),
      default: GRADE_STATUS.PENDING,
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

    // OCR Extraction (placeholder)
    ocrExtractedData: {
      subjects: [String],
      marks: [Number],
      confidence: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Grade', gradeSchema);
