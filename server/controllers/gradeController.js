const Grade = require('../models/Grade');
const StudentProfile = require('../models/StudentProfile');
const AuditLog = require('../models/AuditLog');

/**
 * Grade Controller
 */

/**
 * Get all grades
 */
const getAllGrades = async (req, res, next) => {
  try {
    const { studentId, status, page = 1, limit = 10 } = req.query;

    let query = {};
    if (studentId) query.studentId = studentId;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let grades = await Grade.find(query)
      .populate('userId', 'firstName lastName email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Grade.countDocuments(query);

    res.json({
      success: true,
      data: grades,
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
 * Upload grade
 */
const uploadGrade = async (req, res, next) => {
  try {
    const {
      subjectCode,
      subjectName,
      grade,
      marks,
      outOfMarks,
      semester,
      academicYear,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
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

    // Calculate percentage
    const percentage = outOfMarks ? (marks / outOfMarks) * 100 : 0;

    const gradeRecord = new Grade({
      studentId: studentProfile._id,
      userId: req.userId,
      subjectCode,
      subjectName,
      grade,
      marks: parseFloat(marks),
      outOfMarks: parseFloat(outOfMarks),
      percentage,
      semester,
      academicYear,
      filePath: req.file.path,
      fileName: req.file.originalname,
      fileType: req.file.mimetype.includes('pdf') ? 'pdf' : 'image',
      status: 'pending',
    });

    await gradeRecord.save();

    // Update student profile stats
    studentProfile.totalGradesUploaded += 1;
    await studentProfile.save();

    res.status(201).json({
      success: true,
      message: 'Grade uploaded successfully',
      data: gradeRecord,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approve grade
 */
const approveGrade = async (req, res, next) => {
  try {
    const { gradeId } = req.params;

    const grade = await Grade.findByIdAndUpdate(
      gradeId,
      {
        status: 'approved',
        approvedBy: req.userId,
        approvalDate: new Date(),
      },
      { new: true }
    );

    // Log action
    await AuditLog.create({
      adminId: req.userId,
      action: 'APPROVE_GRADE',
      targetType: 'Grade',
      targetId: gradeId,
      targetName: `${grade.subjectName} - ${grade.grade}`,
      description: `Approved grade for subject ${grade.subjectName}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({
      success: true,
      message: 'Grade approved successfully',
      data: grade,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reject grade
 */
const rejectGrade = async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const { reason } = req.body;

    const grade = await Grade.findByIdAndUpdate(
      gradeId,
      {
        status: 'rejected',
        rejectionReason: reason,
        approvedBy: req.userId,
        approvalDate: new Date(),
      },
      { new: true }
    );

    // Log action
    await AuditLog.create({
      adminId: req.userId,
      action: 'REJECT_GRADE',
      targetType: 'Grade',
      targetId: gradeId,
      targetName: `${grade.subjectName} - ${grade.grade}`,
      description: `Rejected grade: ${reason}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({
      success: true,
      message: 'Grade rejected',
      data: grade,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete grade
 */
const deleteGrade = async (req, res, next) => {
  try {
    const { gradeId } = req.params;

    const grade = await Grade.findByIdAndDelete(gradeId);

    if (grade) {
      // Update student profile
      const profile = await StudentProfile.findById(grade.studentId);
      if (profile && profile.totalGradesUploaded > 0) {
        profile.totalGradesUploaded -= 1;
        await profile.save();
      }
    }

    res.json({
      success: true,
      message: 'Grade deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllGrades,
  uploadGrade,
  approveGrade,
  rejectGrade,
  deleteGrade,
};
