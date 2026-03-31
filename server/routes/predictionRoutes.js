const express = require('express');
const predictionController = require('../controllers/predictionController');
const { protect, isAdmin, isStudent } = require('../middleware/auth');

const router = express.Router();

// All prediction routes require authentication
router.use(protect);

// Get all predictions (admin only)
router.get('/', isAdmin, predictionController.getAllPredictions);

// Get prediction by ID (admin only)
router.get('/details/:predictionId', isAdmin, predictionController.getPredictionById);

// Get student's own prediction
router.get('/student/:studentId', isStudent, predictionController.getStudentPrediction);

// Generate prediction (admin only)
router.post('/generate/:studentId', isAdmin, predictionController.generateEmployabilityPrediction);

module.exports = router;
