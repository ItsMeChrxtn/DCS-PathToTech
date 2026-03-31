const express = require('express');
const certificationController = require('../controllers/certificationController');
const { protect, isAdmin, isStudent } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/certifications');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// All certification routes require authentication
router.use(protect);

// Get all certifications (admin only)
router.get('/', isAdmin, certificationController.getAllCertifications);

// Upload certification (student only)
router.post('/upload', isStudent, upload.single('file'), certificationController.uploadCertification);

// Approve/Reject certifications (admin only)
router.patch('/:certId/approve', isAdmin, certificationController.approveCertification);
router.patch('/:certId/reject', isAdmin, certificationController.rejectCertification);

// Delete certification
router.delete('/:certId', certificationController.deleteCertification);

module.exports = router;
