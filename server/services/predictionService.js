const Prediction = require('../models/Prediction');
const StudentProfile = require('../models/StudentProfile');
const Grade = require('../models/Grade');
const Certification = require('../models/Certification');
const SurveyResponse = require('../models/SurveyResponse');
const Job = require('../models/Job');
const { EMPLOYABILITY_LEVELS } = require('../config/constants');
const { assignCluster, invalidateCache: invalidateGMMCache } = require('./gmmService');
const { applyRulesToStudent } = require('./eclatService');

/**
 * Prediction and Analytics Service
 * Uses real GMM (EM algorithm) for clustering and real ECLAT for rule mining.
 */

/**
 * Generate employability prediction for a student
 * This is a modular function that can be extended with actual ML models
 */
const generatePrediction = async (studentId) => {
  try {
    const profile = await StudentProfile.findOne({ userId: studentId });
    if (!profile) {
      throw new Error('Student profile not found');
    }

    // Calculate component scores
    const academicScore = await calculateAcademicScore(studentId);
    const skillsScore = await calculateSkillsScore(profile);
    const certificationScore = await calculateCertificationScore(studentId);
    const softSkillsScore = await calculateSoftSkillsScore(studentId);

    // Calculate overall score
    const employabilityScore = Math.round(
      (academicScore * 0.3 +
        skillsScore * 0.25 +
        certificationScore * 0.2 +
        softSkillsScore * 0.25) *
        100
    ) / 100;

    // Determine employability level
    const employabilityLevel = getEmployabilityLevel(employabilityScore);

    // Generate insights
    const strengths = generateStrengths(
      academicScore,
      skillsScore,
      certificationScore,
      softSkillsScore
    );
    const weaknesses = generateWeaknesses(
      academicScore,
      skillsScore,
      certificationScore,
      softSkillsScore
    );
    const recommendations = generateRecommendations(
      weaknesses,
      profile
    );

    // GMM Clustering – real EM algorithm
    const clusterAssignment = await assignCluster(academicScore, skillsScore, certificationScore, softSkillsScore);

    // ECLAT Rule Mining – real association rule mining
    const appliedRules = await applyRulesToStudent(
      academicScore, skillsScore, certificationScore, softSkillsScore, employabilityScore
    );

    // Job Matching
    const suggestedJobRoles = await matchStudentWithJobs(profile, employabilityScore);

    // Skill Gap Analysis
    const skillGaps = generateSkillGaps(profile, suggestedJobRoles);

    // Create prediction record
    const prediction = new Prediction({
      studentId: profile._id,
      userId: studentId,
      employabilityScore,
      employabilityLevel,
      academicScore,
      skillsScore,
      certificationScore,
      softSkillsScore,
      strengths,
      weaknesses,
      recommendations,
      skillGaps,
      clusterAssignment,
      appliedRules,
      suggestedJobRoles,
      modelVersion: '1.0',
    });

    await prediction.save();

    // Invalidate GMM cache so the next cluster assignment retrains on updated data
    invalidateGMMCache();

    return prediction;
  } catch (error) {
    throw error;
  }
};

/**
 * Calculate academic score based on grades
 */
const calculateAcademicScore = async (userId) => {
  try {
    const grades = await Grade.find({ userId });

    if (grades.length === 0) return 0;

    // Philippine college grading scale:
    // 1.00 (highest) ... 3.00 (lowest passing), 4.00/INC/5.00 are non-passing.
    const normalizeAcademicGrade = (rawGrade, percentage) => {
      const value = String(rawGrade || '').trim().toUpperCase();

      if (value === 'INC') return 0;

      // Accept values like "1", "1.25", "3.0", "4.0 INC", "5 FAILED".
      const numericMatch = value.match(/\d+(\.\d+)?/);
      if (numericMatch) {
        const numericGrade = parseFloat(numericMatch[0]);

        if (numericGrade >= 1.0 && numericGrade <= 3.0) {
          return Math.max(0, Math.min(1, (3.0 - numericGrade) / 2.0));
        }

        if (numericGrade > 3.0) {
          return 0;
        }
      }

      // Backward compatibility for existing seeded letter-grade data.
      const legacyGradePoints = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D': 1.0, 'F': 0.0,
      };

      if (Object.prototype.hasOwnProperty.call(legacyGradePoints, value)) {
        return Math.max(0, Math.min(1, legacyGradePoints[value] / 4.0));
      }

      // Last fallback: use percentage when available.
      if (typeof percentage === 'number' && Number.isFinite(percentage)) {
        return Math.max(0, Math.min(1, percentage / 100));
      }

      return 0;
    };

    const totalNormalized = grades.reduce((sum, grade) => {
      return sum + normalizeAcademicGrade(grade.grade, grade.percentage);
    }, 0);

    return Math.max(0, Math.min(1, totalNormalized / grades.length));
  } catch (error) {
    return 0;
  }
};

/**
 * Calculate skills score based on technical skills
 */
const calculateSkillsScore = async (profile) => {
  try {
    if (!profile.technicalSkills || profile.technicalSkills.length === 0) {
      return 0;
    }

    const proficiencyMap = {
      'beginner': 0.4,
      'intermediate': 0.65,
      'advanced': 0.85,
      'expert': 1.0,
    };

    const totalScore = profile.technicalSkills.reduce((sum, skill) => {
      return sum + (proficiencyMap[skill.proficiencyLevel] || 0);
    }, 0);

    return Math.min(totalScore / profile.technicalSkills.length, 1.0);
  } catch (error) {
    return 0;
  }
};

/**
 * Calculate certification score
 */
const calculateCertificationScore = async (userId) => {
  try {
    const certs = await Certification.find({ userId, status: 'approved' });

    if (certs.length === 0) return 0;

    // Score increases with number of certifications (capped at 1.0)
    return Math.min(certs.length * 0.15, 1.0);
  } catch (error) {
    return 0;
  }
};

/**
 * Calculate soft skills score from survey responses
 */
const calculateSoftSkillsScore = async (userId) => {
  try {
    const responses = await SurveyResponse.find({ userId });

    if (responses.length === 0) return 0;

    let totalScore = 0;
    let responseCount = 0;

    responses.forEach((response) => {
      response.numericResponses.forEach((nr) => {
        totalScore += nr.numericValue;
        responseCount++;
      });
    });

    return Math.min(responseCount > 0 ? totalScore / responseCount / 5 : 0, 1.0);
  } catch (error) {
    return 0;
  }
};

/**
 * Get employability level based on score
 */
const getEmployabilityLevel = (score) => {
  if (score >= 0.85) return EMPLOYABILITY_LEVELS.EXCELLENT;
  if (score >= 0.70) return EMPLOYABILITY_LEVELS.VERY_GOOD;
  if (score >= 0.55) return EMPLOYABILITY_LEVELS.GOOD;
  if (score >= 0.40) return EMPLOYABILITY_LEVELS.AVERAGE;
  return EMPLOYABILITY_LEVELS.NEEDS_IMPROVEMENT;
};

/**
 * Generate strengths based on component scores
 */
const generateStrengths = (academic, skills, cert, softSkills) => {
  const strengths = [];

  if (academic >= 0.75) strengths.push('Strong academic performance');
  if (skills >= 0.75) strengths.push('Good technical skill proficiency');
  if (cert >= 0.6) strengths.push('Relevant certifications completed');
  if (softSkills >= 0.7) strengths.push('Excellent soft skills');
  if (academic >= 0.6 && skills >= 0.6) strengths.push('Well-rounded profile');

  return strengths.length > 0 ? strengths : ['Working on building strong profile'];
};

/**
 * Generate weaknesses based on component scores
 */
const generateWeaknesses = (academic, skills, cert, softSkills) => {
  const weaknesses = [];

  if (academic < 0.6) weaknesses.push('Need to improve academic grades');
  if (skills < 0.6) weaknesses.push('Technical skills need development');
  if (cert < 0.4) weaknesses.push('Consider earning relevant certifications');
  if (softSkills < 0.6) weaknesses.push('Work on improving soft skills');

  return weaknesses.length > 0 ? weaknesses : [];
};

/**
 * Generate recommendations
 */
const generateRecommendations = (weaknesses, profile) => {
  const recommendations = [];

  if (weaknesses.includes('Need to improve academic grades')) {
    recommendations.push('Focus on coursework and attend tutoring sessions');
  }

  if (weaknesses.includes('Technical skills need development')) {
    recommendations.push('Complete online courses (Coursera, Udemy, etc.)');
  }

  if (weaknesses.includes('Consider earning relevant certifications')) {
    recommendations.push(
      `Pursue certifications in: ${profile.careerInterests.slice(0, 2).join(', ')}`
    );
  }

  if (weaknesses.includes('Work on improving soft skills')) {
    recommendations.push(
      'Participate in workshops, seminars, and team projects'
    );
  }

  recommendations.push('Build your portfolio with real projects');
  recommendations.push('Network with professionals on LinkedIn');

  return recommendations;
};

/**
 * Generate skill gaps
 */
const generateSkillGaps = (profile, jobRoles) => {
  const skillGaps = [];

  if (jobRoles.length > 0) {
    const studentSkills = profile.technicalSkills.map((s) => s.name);
    const requiredSkills = new Set();

    jobRoles.forEach((job) => {
      job.skillGaps.forEach((skill) => requiredSkills.add(skill));
    });

    const gaps = Array.from(requiredSkills).filter(
      (skill) => !studentSkills.includes(skill)
    );

    gaps.forEach((gap) => {
      skillGaps.push({
        skill: gap,
        importance: 'high',
        recommendedCertifications: getCertificationsForSkill(gap),
      });
    });
  }

  return skillGaps;
};

/**
 * Get certifications for a specific skill
 */
const getCertificationsForSkill = (skill) => {
  const skillToCerts = {
    'AWS': ['AWS Solutions Architect', 'AWS Developer Associate'],
    'Azure': ['Azure Administrator', 'Azure Solutions Architect'],
    'Docker': ['Docker Certified Associate'],
    'Kubernetes': ['Kubernetes Administrator (CKA)'],
    'Python': ['Python Data Science', 'Python for DevOps'],
    'JavaScript': ['JavaScript Advanced', 'React Advanced'],
  };

  return skillToCerts[skill] || ['Professional certification in ' + skill];
};

// performGMMClustering and performECLATRuleMining replaced by real services:
// → gmmService.js  (EM-based Gaussian Mixture Model)
// → eclatService.js (vertical-format ECLAT Association Rule Mining)

/**
 * Match student with job opportunities
 */
const matchStudentWithJobs = async (profile, employabilityScore) => {
  try {
    const jobs = await Job.find({ isActive: true });
    const matches = [];

    jobs.forEach((job) => {
      let matchScore = 0;
      const skillGaps = [];

      // Check skills match
      job.requiredSkills.forEach((reqSkill) => {
        const studentHasSkill = profile.technicalSkills.some(
          (s) => s.name.toLowerCase().includes(reqSkill.skill.toLowerCase())
        );

        if (studentHasSkill) {
          matchScore += 30;
        } else {
          skillGaps.push(reqSkill.skill);
        }
      });

      // Factor in overall employability
      matchScore += employabilityScore * 40;

      // Check education requirements
      if (profile.course && profile.course.toLowerCase().includes('computer')) {
        matchScore += 20;
      }

      if (matchScore >= 50) {
        matches.push({
          jobTitle: job.title,
          matchScore: Math.min(matchScore, 100),
          skillGaps,
        });
      }
    });

    return matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
  } catch (error) {
    return [];
  }
};

/**
 * Get prediction for student
 */
const getPredictionByStudentId = async (studentId) => {
  try {
    return await Prediction.findOne({ userId: studentId }).sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generatePrediction,
  calculateAcademicScore,
  calculateSkillsScore,
  calculateCertificationScore,
  calculateSoftSkillsScore,
  getEmployabilityLevel,
  generateStrengths,
  generateWeaknesses,
  generateRecommendations,
  generateSkillGaps,
  matchStudentWithJobs,
  getPredictionByStudentId,
};
