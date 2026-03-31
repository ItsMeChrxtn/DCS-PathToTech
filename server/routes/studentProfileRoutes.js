const express = require('express');
const studentProfileController = require('../controllers/studentProfileController');
const { protect, isStudent } = require('../middleware/auth');

const router = express.Router();

// All student routes require authentication
router.use(protect, isStudent);

// Profile
router.get('/profile', studentProfileController.getProfile);
router.put('/profile', studentProfileController.updateProfile);

// Skills
router.post('/skills/technical', studentProfileController.addTechnicalSkill);
router.post('/skills/soft', studentProfileController.addSoftSkill);
router.delete('/skills/:skillId/:skillType', studentProfileController.deleteSkill);

module.exports = router;
