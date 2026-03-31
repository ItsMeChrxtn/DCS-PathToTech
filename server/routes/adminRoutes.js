const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, isAdmin);

// Dashboard
router.get('/dashboard-stats', adminController.getDashboardStats);
router.get('/datasets', adminController.getAllDatasets);
router.get('/analytics', adminController.getAnalytics);

// Student Management
router.get('/students', adminController.getAllStudents);
router.get('/students/:studentId', adminController.getStudentDetails);
router.patch('/students/:studentId/status', adminController.toggleStudentStatus);

module.exports = router;
