const StudentProfile = require('../models/StudentProfile');
const Grade = require('../models/Grade');
const Certification = require('../models/Certification');
const { calculateProfileCompletion } = require('../utils/helpers');

/**
 * Student Profile Controller
 */

/**
 * Get student profile
 */
const getProfile = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update student profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const {
      dateOfBirth,
      gender,
      phone,
      address,
      city,
      country,
      enrollmentNumber,
      course,
      specialization,
      academicYear,
      semester,
      section,
      currentCGPA,
      careerInterests,
      preferredJobTitles,
      about,
    } = req.body;

    let profile = await StudentProfile.findOne({ userId: req.userId });

    if (!profile) {
      profile = new StudentProfile({ userId: req.userId });
    }

    // Update fields
    if (dateOfBirth) profile.dateOfBirth = dateOfBirth;
    if (gender) profile.gender = gender;
    if (phone) profile.phone = phone;
    if (address) profile.address = address;
    if (city) profile.city = city;
    if (country) profile.country = country;
    if (enrollmentNumber) profile.enrollmentNumber = enrollmentNumber;
    if (course) profile.course = course;
    if (specialization) profile.specialization = specialization;
    if (academicYear) profile.academicYear = academicYear;
    if (semester) profile.semester = semester;
    if (section) profile.section = section;
    if (currentCGPA) profile.currentCGPA = currentCGPA;
    if (careerInterests) profile.careerInterests = careerInterests;
    if (preferredJobTitles) profile.preferredJobTitles = preferredJobTitles;
    if (about) profile.about = about;

    // Update completion flags
    if (dateOfBirth && gender && phone && address && city) {
      profile.isBasicInfoComplete = true;
    }

    if (course && specialization && currentCGPA) {
      profile.isAcademicInfoComplete = true;
    }

    if (careerInterests && careerInterests.length > 0) {
      profile.isCareerInfoComplete = true;
    }

    // Recalculate completion percentage
    profile.profileCompletionPercentage = calculateProfileCompletion(profile);

    await profile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add technical skill
 */
const addTechnicalSkill = async (req, res, next) => {
  try {
    const { name, proficiencyLevel, yearsOfExperience } = req.body;

    const profile = await StudentProfile.findOne({ userId: req.userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const skill = {
      name,
      proficiencyLevel,
      yearsOfExperience: yearsOfExperience || 0,
    };

    profile.technicalSkills.push(skill);

    // Update completion
    if (profile.technicalSkills.length > 0) {
      profile.isSkillsComplete = true;
      profile.profileCompletionPercentage = calculateProfileCompletion(profile);
    }

    await profile.save();

    res.json({
      success: true,
      message: 'Technical skill added successfully',
      data: profile.technicalSkills,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add soft skill
 */
const addSoftSkill = async (req, res, next) => {
  try {
    const { name, proficiencyLevel } = req.body;

    const profile = await StudentProfile.findOne({ userId: req.userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const skill = {
      name,
      proficiencyLevel,
    };

    profile.softSkills.push(skill);

    // Update completion
    if (profile.softSkills.length > 0 && profile.technicalSkills.length > 0) {
      profile.isSkillsComplete = true;
      profile.profileCompletionPercentage = calculateProfileCompletion(profile);
    }

    await profile.save();

    res.json({
      success: true,
      message: 'Soft skill added successfully',
      data: profile.softSkills,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete skill
 */
const deleteSkill = async (req, res, next) => {
  try {
    const { skillId, skillType } = req.params;

    const profile = await StudentProfile.findOne({ userId: req.userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    if (skillType === 'technical') {
      profile.technicalSkills = profile.technicalSkills.filter(
        (s) => s._id.toString() !== skillId
      );
    } else if (skillType === 'soft') {
      profile.softSkills = profile.softSkills.filter(
        (s) => s._id.toString() !== skillId
      );
    }

    profile.profileCompletionPercentage = calculateProfileCompletion(profile);
    await profile.save();

    res.json({
      success: true,
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  addTechnicalSkill,
  addSoftSkill,
  deleteSkill,
};
