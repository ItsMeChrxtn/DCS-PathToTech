const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      unique: true,
    },
    datasetType: {
      type: String,
      enum: ['grades', 'skills', 'certifications', 'surveys', 'jobs', 'external'],
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: Number,
    rowCount: Number,
    columnNames: [String],
    
    // Import Status
    importStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    importedAt: Date,
    importedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    
    // Error Handling
    errorLog: [
      {
        rowNumber: Number,
        error: String,
        timestamp: Date,
      },
    ],
    validRows: Number,
    invalidRows: Number,
    
    // Metadata
    description: String,
    isAutoImported: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Dataset', datasetSchema);
