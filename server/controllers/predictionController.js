const { generatePrediction, getPredictionByStudentId } = require('../services/predictionService');
const Prediction = require('../models/Prediction');
const AuditLog = require('../models/AuditLog');

/**
 * Prediction Controller
 */

/**
 * Generate prediction for a student
 */
const generateEmployabilityPrediction = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Generate prediction using service
    const prediction = await generatePrediction(studentId);

    // Log action
    await AuditLog.create({
      adminId: req.userId,
      action: 'GENERATE_PREDICTION',
      targetType: 'Prediction',
      targetId: prediction._id,
      targetName: `Prediction for student ${studentId}`,
      description: 'Generated employability prediction',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({
      success: true,
      message: 'Prediction generated successfully',
      data: prediction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get prediction for student
 */
const getStudentPrediction = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const prediction = await getPredictionByStudentId(studentId);

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found. Please generate prediction first.',
      });
    }

    res.json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all predictions
 */
const getAllPredictions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, employabilityLevel } = req.query;

    let query = {};
    if (employabilityLevel) {
      query.employabilityLevel = employabilityLevel;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const predictions = await Prediction.find(query)
      .populate('userId', 'firstName lastName email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Prediction.countDocuments(query);

    res.json({
      success: true,
      data: predictions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get prediction by ID
 */
const getPredictionById = async (req, res, next) => {
  try {
    const { predictionId } = req.params;

    const prediction = await Prediction.findById(predictionId).populate(
      'userId',
      'firstName lastName email'
    );

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found',
      });
    }

    res.json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateEmployabilityPrediction,
  getStudentPrediction,
  getAllPredictions,
  getPredictionById,
};
