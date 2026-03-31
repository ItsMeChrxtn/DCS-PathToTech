const Grade = require('../models/Grade');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Certification = require('../models/Certification');
const SurveyResponse = require('../models/SurveyResponse');
const Prediction = require('../models/Prediction');
const Dataset = require('../models/Dataset');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

/**
 * Admin Dashboard Controller
 */

/**
 * Get dashboard statistics
 */
const getDashboardStats = async (req, res, next) => {
  try {
    // Get total counts
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalGrades = await Grade.countDocuments();
    const totalCertifications = await Certification.countDocuments();
    const totalSurveysCompleted = await SurveyResponse.countDocuments();
    const totalDatasets = await Dataset.countDocuments();

    // Get grade status distribution
    const gradesByStatus = await Grade.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get employability distribution
    const employabilityDistribution = await Prediction.aggregate([
      {
        $group: {
          _id: '$employabilityLevel',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent activity
    const recentActivity = await AuditLog.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('adminId', 'firstName lastName email');

    // Calculate profile completion stats
    const profileStats = await StudentProfile.aggregate([
      {
        $group: {
          _id: null,
          avgCompletion: { $avg: '$profileCompletionPercentage' },
          completeProfiles: {
            $sum: {
              $cond: [{ $gte: ['$profileCompletionPercentage', 80] }, 1, 0],
            },
          },
          incompleteProfiles: {
            $sum: {
              $cond: [{ $lt: ['$profileCompletionPercentage', 80] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Average component scores across all predictions (for algorithm verification)
    const componentAveragesRaw = await Prediction.aggregate([
      {
        $group: {
          _id: null,
          avgAcademic: { $avg: '$academicScore' },
          avgSkills: { $avg: '$skillsScore' },
          avgCertification: { $avg: '$certificationScore' },
          avgSoftSkills: { $avg: '$softSkillsScore' },
          avgFinal: { $avg: '$employabilityScore' },
        },
      },
    ]);

    const componentAverages = componentAveragesRaw.length > 0
      ? {
          academic: Math.round((componentAveragesRaw[0].avgAcademic || 0) * 100),
          skills: Math.round((componentAveragesRaw[0].avgSkills || 0) * 100),
          certification: Math.round((componentAveragesRaw[0].avgCertification || 0) * 100),
          softSkills: Math.round((componentAveragesRaw[0].avgSoftSkills || 0) * 100),
          finalScore: Math.round(componentAveragesRaw[0].avgFinal || 0),
        }
      : { academic: 0, skills: 0, certification: 0, softSkills: 0, finalScore: 0 };

    // Score distribution histogram (0-20, 21-40, 41-60, 61-80, 81-100)
    const allPredictions = await Prediction.find({}, { employabilityScore: 1 });
    const scoreDistribution = [
      { range: '0–20', count: 0 },
      { range: '21–40', count: 0 },
      { range: '41–60', count: 0 },
      { range: '61–80', count: 0 },
      { range: '81–100', count: 0 },
    ];
    allPredictions.forEach(({ employabilityScore }) => {
      const s = employabilityScore || 0;
      if (s <= 20) scoreDistribution[0].count++;
      else if (s <= 40) scoreDistribution[1].count++;
      else if (s <= 60) scoreDistribution[2].count++;
      else if (s <= 80) scoreDistribution[3].count++;
      else scoreDistribution[4].count++;
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalStudents,
          totalGrades,
          totalCertifications,
          totalSurveysCompleted,
          totalDatasets,
        },
        gradesByStatus: Object.fromEntries(
          gradesByStatus.map((g) => [g._id, g.count])
        ),
        employabilityDistribution: Object.fromEntries(
          employabilityDistribution.map((e) => [e._id, e.count])
        ),
        profileCompletion:
          profileStats.length > 0 ? profileStats[0] : { avgCompletion: 0 },
        componentAverages,
        scoreDistribution,
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all students with filters
 */
const getAllStudents = async (req, res, next) => {
  try {
    const {
      search,
      course,
      year,
      section,
      status,
      profileCompletion,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    // Build filter query
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (course) query['profile.course'] = course;
    if (section) query['profile.section'] = section;
    if (status) query['profile.status'] = status;

    // Get students with profiles
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const students = await User.find({
      role: 'student',
      ...query,
    })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password');

    // Get additional profile data
    const enrichedStudents = await Promise.all(
      students.map(async (student) => {
        const profile = await StudentProfile.findOne({ userId: student._id });
        const grades = await Grade.countDocuments({ userId: student._id });
        const certs = await Certification.countDocuments({ userId: student._id });

        return {
          ...student.toObject(),
          profile,
          gradesCount: grades,
          certificationsCount: certs,
        };
      })
    );

    const total = await User.countDocuments({ role: 'student', ...query });

    res.json({
      success: true,
      data: enrichedStudents,
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
 * Get student details
 */
const getStudentDetails = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const user = await User.findById(studentId).select('-password');
    const profile = await StudentProfile.findOne({ userId: studentId });
    const grades = await Grade.find({ userId: studentId });
    const certifications = await Certification.find({ userId: studentId });
    const surveys = await SurveyResponse.find({ userId: studentId });
    const predictions = await Prediction.find({ userId: studentId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: {
        user,
        profile,
        grades,
        certifications,
        surveys,
        latestPrediction: predictions[0] || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deactivate/Activate student account
 */
const toggleStudentStatus = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      studentId,
      { status },
      { new: true }
    );

    // Log action
    await AuditLog.create({
      adminId: req.userId,
      action: status === 'active' ? 'ACTIVATE_STUDENT' : 'DEACTIVATE_STUDENT',
      targetType: 'User',
      targetId: studentId,
      targetName: `${user.firstName} ${user.lastName}`,
      description: `${status === 'active' ? 'Activated' : 'Deactivated'} student account`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({
      success: true,
      message: `Student account ${status}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get imported datasets
 */
const getAllDatasets = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;

    const query = {};
    if (type) query.datasetType = type;
    if (status) query.importStatus = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const datasets = await Dataset.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Dataset.countDocuments(query);

    res.json({
      success: true,
      data: datasets,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get GMM cluster distribution + ECLAT mined rules (algorithm analytics)
 */
const getAnalytics = async (req, res, next) => {
  try {
    const { getClusterDistribution } = require('../services/gmmService');
    const { mineEmployabilityRules } = require('../services/eclatService');

    const [clusterDistribution, eclatResult] = await Promise.all([
      getClusterDistribution(),
      mineEmployabilityRules(0.20, 0.60),
    ]);

    res.json({
      success: true,
      data: {
        gmm: {
          clusters: clusterDistribution,
          description: 'EM-trained Gaussian Mixture Model (4 components, diagonal covariance)',
        },
        eclat: {
          totalTransactions:     eclatResult.totalTransactions,
          totalFrequentItemsets: eclatResult.totalFrequentItemsets,
          rules:                 eclatResult.rules,
          description:           'ECLAT vertical-format association rule mining (minSupport=0.20, minConfidence=0.60)',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllStudents,
  getStudentDetails,
  toggleStudentStatus,
  getAllDatasets,
  getAnalytics,
};
