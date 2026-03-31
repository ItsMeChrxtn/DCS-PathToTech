const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const XLSX = require('xlsx');
const Dataset = require('../models/Dataset');

/**
 * Dataset Import Service
 * Automatically scans and imports CSV/XLSX files from datasets folder
 */

/**
 * Scan datasets folder and import all CSV/XLSX files
 */
const autoImportDatasets = async () => {
  try {
    const datasetsDir = process.env.DATASETS_DIR || './datasets';

    // Check if datasets directory exists
    if (!fs.existsSync(datasetsDir)) {
      console.log('✓ Datasets directory does not exist. Skipping auto-import.');
      return { imported: 0, errors: [] };
    }

    const files = fs
      .readdirSync(datasetsDir)
      .filter((file) => file.toLowerCase().endsWith('.csv') || file.toLowerCase().endsWith('.xlsx'));
    let imported = 0;
    const errors = [];

    for (const file of files) {
      try {
        // Skip if already imported
        const existing = await Dataset.findOne({ fileName: file });
        if (existing) {
          console.log(`⟳ Skipped (already imported): ${file}`);
          continue;
        }

        const filePath = path.join(datasetsDir, file);
        const result = await importCSVFile(filePath, file);

        if (result.success) {
          imported++;
          console.log(`✓ Imported: ${file}`);
        } else {
          errors.push({ file, error: result.error });
          console.log(`✗ Failed: ${file} - ${result.error}`);
        }
      } catch (error) {
        errors.push({ file, error: error.message });
        console.log(`✗ Error importing ${file}:`, error.message);
      }
    }

    console.log(`\n✓ Auto-import complete: ${imported} datasets imported, ${errors.length} errors`);
    return { imported, errors };
  } catch (error) {
    console.error('Error in autoImportDatasets:', error.message);
    throw error;
  }
};

/**
 * Import a single CSV/XLSX file
 */
const importCSVFile = async (filePath, fileName) => {
  try {
    // Determine dataset type from filename
    const datasetType = determineDatasetType(fileName);

    // Read file by extension
    const extension = path.extname(fileName).toLowerCase();
    let records = [];

    if (extension === '.csv') {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    } else if (extension === '.xlsx') {
      const workbook = XLSX.readFile(filePath);
      const firstSheetName = workbook.SheetNames[0];
      const firstSheet = workbook.Sheets[firstSheetName];
      records = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
    } else {
      throw new Error(`Unsupported dataset format: ${extension}`);
    }

    // Validate records
    const { validRecords, invalidRecords } = validateRecords(records, datasetType);

    // Save dataset metadata to database
    const dataset = new Dataset({
      fileName,
      datasetType,
      filePath,
      fileSize: fs.statSync(filePath).size,
      rowCount: records.length,
      columnNames: records.length > 0 ? Object.keys(records[0]) : [],
      importStatus: 'completed',
      importedAt: new Date(),
      validRows: validRecords.length,
      invalidRows: invalidRecords.length,
      isAutoImported: true,
    });

    await dataset.save();

    // Store processed data (in production, integrate with actual models)
    const processedData = preprocessData(validRecords, datasetType);

    return {
      success: true,
      dataset,
      processedData,
      validRows: validRecords.length,
      invalidRows: invalidRecords.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Determine dataset type from filename
 */
const determineDatasetType = (fileName) => {
  const lowerName = fileName.toLowerCase();

  if (lowerName.includes('grade')) return 'grades';
  if (lowerName.includes('skill')) return 'skills';
  if (lowerName.includes('cert')) return 'certifications';
  if (lowerName.includes('survey')) return 'surveys';
  if (lowerName.includes('job')) return 'jobs';

  return 'external';
};

/**
 * Validate records based on dataset type
 */
const validateRecords = (records, datasetType) => {
  const validRecords = [];
  const invalidRecords = [];

  records.forEach((record, index) => {
    const validation = validateRecord(record, datasetType);

    if (validation.isValid) {
      validRecords.push(record);
    } else {
      invalidRecords.push({
        rowNumber: index + 1,
        error: validation.error,
      });
    }
  });

  return { validRecords, invalidRecords };
};

/**
 * Validate individual record
 */
const validateRecord = (record, datasetType) => {
  // Basic validation: check for empty required fields
  const requiredFields = {
    grades: ['studentId', 'subjectName', 'marks'],
    skills: ['skillName', 'category'],
    certifications: ['studentId', 'title', 'issuer'],
    surveys: ['studentId', 'responseData'],
    jobs: ['title', 'company'],
    external: [], // No specific requirements
  };

  const required = requiredFields[datasetType] || [];

  for (const field of required) {
    if (!record[field] || record[field].trim() === '') {
      return {
        isValid: false,
        error: `Missing required field: ${field}`,
      };
    }
  }

  return { isValid: true };
};

/**
 * Preprocess data (cleaning, normalization)
 */
const preprocessData = (records, datasetType) => {
  return records.map((record) => {
    const processed = { ...record };

    // Remove extra whitespace
    Object.keys(processed).forEach((key) => {
      if (typeof processed[key] === 'string') {
        processed[key] = processed[key].trim();
      }
    });

    // Type conversion based on dataset type
    if (datasetType === 'grades') {
      processed.marks = parseFloat(processed.marks) || 0;
      processed.outOfMarks = parseFloat(processed.outOfMarks) || 100;
      processed.percentage = (processed.marks / processed.outOfMarks) * 100;
    }

    if (datasetType === 'surveys' || datasetType === 'jobs') {
      // Handle numeric conversions
      Object.keys(processed).forEach((key) => {
        if (!isNaN(processed[key]) && processed[key] !== '') {
          processed[key] = parseFloat(processed[key]);
        }
      });
    }

    return processed;
  });
};

/**
 * Get all imported datasets
 */
const getAllDatasets = async () => {
  try {
    return await Dataset.find({}).sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

/**
 * Get dataset by ID
 */
const getDatasetById = async (datasetId) => {
  try {
    return await Dataset.findById(datasetId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  autoImportDatasets,
  importCSVFile,
  determineDatasetType,
  validateRecords,
  validateRecord,
  preprocessData,
  getAllDatasets,
  getDatasetById,
};
