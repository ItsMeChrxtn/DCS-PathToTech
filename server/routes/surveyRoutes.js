const express = require('express');
const surveyController = require('../controllers/surveyController');
const { protect, isAdmin, isStudent } = require('../middleware/auth');

const router = express.Router();

// Public - get surveys (students need to see available surveys)
router.get('/', surveyController.getAllSurveys);
router.get('/:surveyId', surveyController.getSurveyById);

// Admin routes
router.post('/', protect, isAdmin, surveyController.createSurvey);
router.put('/:surveyId', protect, isAdmin, surveyController.updateSurvey);
router.delete('/:surveyId', protect, isAdmin, surveyController.deleteSurvey);
router.get('/:surveyId/responses', protect, isAdmin, surveyController.getSurveyResponses);

// Student route - submit response
router.post('/:surveyId/submit', protect, isStudent, surveyController.submitSurveyResponse);

module.exports = router;
