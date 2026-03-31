const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ROLES } = require('../config/constants');

/**
 * Verify JWT token
 */
const protect = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed.',
      error: error.message,
    });
  }
};

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (req.userRole !== ROLES.ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.',
    });
  }
  next();
};

/**
 * Check if user is student
 */
const isStudent = (req, res, next) => {
  if (req.userRole !== ROLES.STUDENT) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Student role required.',
    });
  }
  next();
};

/**
 * Check if user is admin or the student accessing their own profile
 */
const isAdminOrOwn = (req, res, next) => {
  const studentId = req.params.id || req.query.studentId;
  
  if (
    req.userRole === ROLES.ADMIN ||
    (req.userRole === ROLES.STUDENT && req.userId.toString() === studentId)
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied.',
  });
};

module.exports = {
  protect,
  isAdmin,
  isStudent,
  isAdminOrOwn,
};
