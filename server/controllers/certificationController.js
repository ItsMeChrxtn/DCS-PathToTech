const Certification = require('../models/Certification');
const StudentProfile = require('../models/StudentProfile');
const AuditLog = require('../models/AuditLog');

/**
 * Certification Controller
 */

/**
 * Get all certifications
 */
const getAllCertifications = async (req, res, next) => {
  try {
    const { studentId, status, page = 1, limit = 10 } = req.query;

    let query = {};
    if (studentId) query.studentId = studentId;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const certifications = await Certification.find(query)
      .populate('userId', 'firstName lastName email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Certification.countDocuments(query);

    res.json({
      success: true,
      data: certifications,
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
 * Upload certification
 */
const uploadCertification = async (req, res, next) => {
  try {
    const { title, issuer, dateEarned, dateExpires, category, credentialUrl, credentialId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a certificate file',
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

    const certification = new Certification({
      studentId: studentProfile._id,
      userId: req.userId,
      title,
      issuer,
      dateEarned: new Date(dateEarned),
      dateExpires: dateExpires ? new Date(dateExpires) : null,
      category,
      credentialUrl,
      credentialId,
      filePath: req.file.path,
      fileName: req.file.originalname,
      status: 'pending',
      isExpired: dateExpires ? new Date(dateExpires) < new Date() : false,
    });

    await certification.save();

    // Update student profile stats
    studentProfile.totalCertificationsUploaded += 1;
    await studentProfile.save();

    res.status(201).json({
      success: true,
      message: 'Certification uploaded successfully',
      data: certification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approve certification
 */
const approveCertification = async (req, res, next) => {
  try {
    const { certId } = req.params;

    const cert = await Certification.findByIdAndUpdate(
      certId,
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
      action: 'APPROVE_CERTIFICATION',
      targetType: 'Certification',
      targetId: certId,
      targetName: cert.title,
      description: `Approved certification: ${cert.title}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({
      success: true,
      message: 'Certification approved successfully',
      data: cert,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reject certification
 */
const rejectCertification = async (req, res, next) => {
  try {
    const { certId } = req.params;
    const { reason } = req.body;

    const cert = await Certification.findByIdAndUpdate(
      certId,
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
      action: 'REJECT_CERTIFICATION',
      targetType: 'Certification',
      targetId: certId,
      targetName: cert.title,
      description: `Rejected certification: ${reason}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({
      success: true,
      message: 'Certification rejected',
      data: cert,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete certification
 */
const deleteCertification = async (req, res, next) => {
  try {
    const { certId } = req.params;

    const cert = await Certification.findByIdAndDelete(certId);

    if (cert) {
      // Update student profile
      const profile = await StudentProfile.findById(cert.studentId);
      if (profile && profile.totalCertificationsUploaded > 0) {
        profile.totalCertificationsUploaded -= 1;
        await profile.save();
      }
    }

    res.json({
      success: true,
      message: 'Certification deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCertifications,
  uploadCertification,
  approveCertification,
  rejectCertification,
  deleteCertification,
};
