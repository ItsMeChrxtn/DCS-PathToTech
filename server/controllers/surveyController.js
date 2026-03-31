const Survey = require('../models/Survey');
const SurveyResponse = require('../models/SurveyResponse');
const StudentProfile = require('../models/StudentProfile');
const AuditLog = require('../models/AuditLog');
const { convertSurveyResponsesToNumeric } = require('../utils/helpers');

/**
 * Survey Controller
 */

/**
 * Get all surveys
 */
const getAllSurveys = async (req, res, next) => {
  try {
    const { isActive, page = 1, limit = 10 } = req.query;

    let query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const surveys = await Survey.find(query)
      .populate('createdBy', 'firstName lastName email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Survey.countDocuments(query);

    res.json({
      success: true,
      data: surveys,
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
 * Get survey by ID
 */
const getSurveyById = async (req, res, next) => {
  try {
    const { surveyId } = req.params;

    const survey = await Survey.findById(surveyId).populate(
      'createdBy',
      'firstName lastName email'
    );

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found',
      });
    }

    res.json({
      success: true,
      data: survey,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create survey
 */
const createSurvey = async (req, res, next) => {
  try {
    const { title, description, surveyType, questions } = req.body;

    const survey = new Survey({
      title,
      description,
      surveyType,
      questions,
      createdBy: req.userId,
      isActive: true,
    });

    await survey.save();

    // Log action
    await AuditLog.create({
      adminId: req.userId,
      action: 'CREATE_SURVEY',
      targetType: 'Survey',
      targetId: survey._id,
      targetName: title,
      description: `Created survey: ${title}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(201).json({
      success: true,
      message: 'Survey created successfully',
      data: survey,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update survey
 */
const updateSurvey = async (req, res, next) => {
  try {
    const { surveyId } = req.params;
    const { title, description, isActive, questions } = req.body;

    const survey = await Survey.findByIdAndUpdate(
      surveyId,
      {
        title: title || undefined,
        description: description || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        questions: questions || undefined,
      },
      { new: true, runValidators: true }
    );

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found',
      });
    }

    res.json({
      success: true,
      message: 'Survey updated successfully',
      data: survey,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete survey
 */
const deleteSurvey = async (req, res, next) => {
  try {
    const { surveyId } = req.params;

    const survey = await Survey.findByIdAndDelete(surveyId);

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found',
      });
    }

    res.json({
      success: true,
      message: 'Survey deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit survey response
 */
const submitSurveyResponse = async (req, res, next) => {
  try {
    const { surveyId } = req.params;
    const { responses } = req.body;

    // Get survey
    const survey = await Survey.findById(surveyId);

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found',
      });
    }

    // Get student profile
    const studentProfile = await StudentProfile.findOne({ userId: req.userId });

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    // Check if already responded
    const existingResponse = await SurveyResponse.findOne({
      surveyId,
      userId: req.userId,
    });

    if (existingResponse) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this survey',
      });
    }

    // Create question type map
    const questionTypeMap = {};
    survey.questions.forEach((q) => {
      questionTypeMap[q._id.toString()] = q.type;
    });

    // Convert responses to numeric values
    const numericResponses = convertSurveyResponsesToNumeric(
      responses,
      questionTypeMap
    );

    // Save response
    const surveyResponse = new SurveyResponse({
      surveyId,
      studentId: studentProfile._id,
      userId: req.userId,
      responses,
      numericResponses,
    });

    await surveyResponse.save();

    // Update survey total responses
    survey.totalResponses += 1;
    await survey.save();

    // Update student profile stats
    studentProfile.totalSurveysCompleted += 1;
    await studentProfile.save();

    res.status(201).json({
      success: true,
      message: 'Survey submitted successfully',
      data: surveyResponse,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get survey responses
 */
const getSurveyResponses = async (req, res, next) => {
  try {
    const { surveyId, page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const responses = await SurveyResponse.find({ surveyId })
      .populate('userId', 'firstName lastName email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await SurveyResponse.countDocuments({ surveyId });

    res.json({
      success: true,
      data: responses,
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

module.exports = {
  getAllSurveys,
  getSurveyById,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  submitSurveyResponse,
  getSurveyResponses,
};
