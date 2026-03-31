/**
 * Application Constants and Enumerations
 */

// User Roles
const ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
};

// Survey Types
const SURVEY_TYPES = {
  EMPLOYABILITY: 'employability',
  TECHNICAL_SKILLS: 'technical_skills',
  SOFT_SKILLS: 'soft_skills',
  CAREER_READINESS: 'career_readiness',
};

// Account Status
const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

// Grade Status
const GRADE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Certification Status
const CERTIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Employability Levels
const EMPLOYABILITY_LEVELS = {
  EXCELLENT: 'excellent',
  VERY_GOOD: 'very_good',
  GOOD: 'good',
  AVERAGE: 'average',
  NEEDS_IMPROVEMENT: 'needs_improvement',
};

// Skill Proficiency Levels
const PROFICIENCY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
};

// Skill Categories
const SKILL_CATEGORIES = {
  TECHNICAL: 'technical',
  SOFT_SKILL: 'soft_skill',
};

// Job Specializations
const SPECIALIZATIONS = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Cloud Computing',
  'DevOps',
  'AI/Machine Learning',
  'Cybersecurity',
  'Full Stack Development',
  'Backend Development',
  'Frontend Development',
];

module.exports = {
  ROLES,
  SURVEY_TYPES,
  ACCOUNT_STATUS,
  GRADE_STATUS,
  CERTIFICATION_STATUS,
  EMPLOYABILITY_LEVELS,
  PROFICIENCY_LEVELS,
  SKILL_CATEGORIES,
  SPECIALIZATIONS,
};
