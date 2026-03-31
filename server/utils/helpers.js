const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

/**
 * Hash phone number for anonymity (placeholder)
 */
const hashPhone = (phone) => {
  if (!phone) return null;
  return phone.slice(-4).padStart(phone.length, '*');
};

/**
 * Calculate profile completion percentage
 */
const calculateProfileCompletion = (profile) => {
  let completed = 0;
  let total = 4; // basic, academic, skills, career

  if (profile.firstName && profile.lastName && profile.dateOfBirth) {
    completed++;
  }

  if (profile.course && profile.specialization && profile.currentCGPA) {
    completed++;
  }

  if (
    profile.technicalSkills &&
    profile.technicalSkills.length > 0 &&
    profile.softSkills &&
    profile.softSkills.length > 0
  ) {
    completed++;
  }

  if (profile.careerInterests && profile.careerInterests.length > 0) {
    completed++;
  }

  return Math.round((completed / total) * 100);
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Format response
 */
const formatResponse = (success, message, data = null) => {
  return {
    success,
    message,
    data,
  };
};

/**
 * Convert numeric survey responses
 */
const convertSurveyResponsesToNumeric = (responses, questionTypes) => {
  return responses.map((response) => {
    const questionType = questionTypes[response.questionId];

    if (questionType === 'rating' || questionType === 'likert') {
      return {
        questionId: response.questionId,
        numericValue: parseInt(response.response) || 0,
      };
    }

    if (questionType === 'multiple_choice') {
      // Convert user-friendly values
      const choiceMap = {
        'very_good': 4,
        'good': 3,
        'average': 2,
        'poor': 1,
        'excellent': 5,
        'very_poor': 0,
      };
      return {
        questionId: response.questionId,
        numericValue: choiceMap[response.response] || 0,
      };
    }

    return {
      questionId: response.questionId,
      numericValue: 0,
    };
  });
};

module.exports = {
  generateToken,
  hashPhone,
  calculateProfileCompletion,
  isValidEmail,
  formatResponse,
  convertSurveyResponsesToNumeric,
};
