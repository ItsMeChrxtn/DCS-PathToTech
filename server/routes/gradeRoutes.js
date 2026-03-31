const express = require('express');
const gradeController = require('../controllers/gradeController');
const { protect, isAdmin, isStudent } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/grades');
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

// All grade routes require authentication
router.use(protect);

// Get all grades (admin only)
router.get('/', isAdmin, gradeController.getAllGrades);

// Upload grade (student only)
router.post('/upload', isStudent, upload.single('file'), gradeController.uploadGrade);

// Approve/Reject grades (admin only)
router.patch('/:gradeId/approve', isAdmin, gradeController.approveGrade);
router.patch('/:gradeId/reject', isAdmin, gradeController.rejectGrade);

// Delete grade
router.delete('/:gradeId', gradeController.deleteGrade);

module.exports = router;
