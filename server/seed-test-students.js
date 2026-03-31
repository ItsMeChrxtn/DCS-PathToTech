require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const Grade = require('./models/Grade');
const Certification = require('./models/Certification');
const Survey = require('./models/Survey');
const SurveyResponse = require('./models/SurveyResponse');
const Prediction = require('./models/Prediction');
const { generatePrediction } = require('./services/predictionService');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pathtotech';

const studentsSeed = [
  {
    email: 'student1@pathtotech.local',
    firstName: 'Ana',
    lastName: 'Reyes',
    course: 'BS Information Technology',
    specialization: 'Data Science',
    skills: [
      { name: 'Python', proficiencyLevel: 'expert', yearsOfExperience: 3 },
      { name: 'SQL', proficiencyLevel: 'advanced', yearsOfExperience: 2 },
      { name: 'Pandas', proficiencyLevel: 'advanced', yearsOfExperience: 2 },
    ],
    softSkills: [
      { name: 'Communication', proficiencyLevel: 'advanced' },
      { name: 'Leadership', proficiencyLevel: 'advanced' },
    ],
    grades: ['1.00', '1.25', '1.00', '1.75'],
    certifications: [
      { title: 'Google Data Analytics', issuer: 'Google' },
      { title: 'Microsoft Azure Fundamentals', issuer: 'Microsoft' },
      { title: 'Python for Data Science', issuer: 'IBM' },
    ],
    surveyValues: [5, 4, 5, 4, 5],
  },
  {
    email: 'student2@pathtotech.local',
    firstName: 'Mark',
    lastName: 'Santos',
    course: 'BS Computer Science',
    specialization: 'Full Stack Development',
    skills: [
      { name: 'JavaScript', proficiencyLevel: 'advanced', yearsOfExperience: 3 },
      { name: 'React', proficiencyLevel: 'advanced', yearsOfExperience: 2 },
      { name: 'Node.js', proficiencyLevel: 'intermediate', yearsOfExperience: 2 },
    ],
    softSkills: [
      { name: 'Teamwork', proficiencyLevel: 'advanced' },
      { name: 'Problem Solving', proficiencyLevel: 'advanced' },
    ],
    grades: ['1.75', '2.00', '1.25', '1.75'],
    certifications: [
      { title: 'Meta Front-End Developer', issuer: 'Meta' },
      { title: 'AWS Cloud Practitioner', issuer: 'Amazon' },
    ],
    surveyValues: [4, 4, 4, 3, 4],
  },
  {
    email: 'student3@pathtotech.local',
    firstName: 'Lea',
    lastName: 'Torres',
    course: 'BS Information Systems',
    specialization: 'Business Analytics',
    skills: [
      { name: 'Excel', proficiencyLevel: 'advanced', yearsOfExperience: 3 },
      { name: 'Power BI', proficiencyLevel: 'intermediate', yearsOfExperience: 1 },
      { name: 'SQL', proficiencyLevel: 'intermediate', yearsOfExperience: 1 },
    ],
    softSkills: [
      { name: 'Communication', proficiencyLevel: 'intermediate' },
      { name: 'Adaptability', proficiencyLevel: 'intermediate' },
    ],
    grades: ['2.00', '2.25', '1.75', '2.50'],
    certifications: [{ title: 'Power BI Data Analyst', issuer: 'Microsoft' }],
    surveyValues: [3, 3, 3, 4, 3],
  },
  {
    email: 'student4@pathtotech.local',
    firstName: 'Nico',
    lastName: 'Villanueva',
    course: 'BS Computer Engineering',
    specialization: 'Cybersecurity',
    skills: [
      { name: 'Linux', proficiencyLevel: 'intermediate', yearsOfExperience: 2 },
      { name: 'Networking', proficiencyLevel: 'intermediate', yearsOfExperience: 2 },
      { name: 'Python', proficiencyLevel: 'beginner', yearsOfExperience: 1 },
    ],
    softSkills: [
      { name: 'Discipline', proficiencyLevel: 'intermediate' },
      { name: 'Communication', proficiencyLevel: 'beginner' },
    ],
    grades: ['2.50', '2.25', '2.75', '2.50'],
    certifications: [],
    surveyValues: [2, 3, 2, 3, 2],
  },
  {
    email: 'student5@pathtotech.local',
    firstName: 'Ivy',
    lastName: 'Mendoza',
    course: 'BS Information Technology',
    specialization: 'Cloud Computing',
    skills: [
      { name: 'AWS', proficiencyLevel: 'intermediate', yearsOfExperience: 2 },
      { name: 'Docker', proficiencyLevel: 'intermediate', yearsOfExperience: 1 },
      { name: 'Git', proficiencyLevel: 'advanced', yearsOfExperience: 2 },
    ],
    softSkills: [
      { name: 'Teamwork', proficiencyLevel: 'advanced' },
      { name: 'Initiative', proficiencyLevel: 'intermediate' },
    ],
    grades: ['1.25', '1.75', '1.75', '1.25'],
    certifications: [
      { title: 'AWS Solutions Architect Associate', issuer: 'Amazon' },
      { title: 'Docker Certified Associate', issuer: 'Docker' },
    ],
    surveyValues: [4, 4, 5, 4, 4],
  },
];

async function upsertStudentUser(seed) {
  let user = await User.findOne({ email: seed.email });

  if (!user) {
    user = new User({
      email: seed.email,
      password: 'student123',
      firstName: seed.firstName,
      lastName: seed.lastName,
      role: 'student',
      status: 'active',
      isEmailVerified: true,
    });
    await user.save();
    return user;
  }

  user.firstName = seed.firstName;
  user.lastName = seed.lastName;
  user.role = 'student';
  user.status = 'active';
  user.isEmailVerified = true;
  await user.save();
  return user;
}

function buildGrades(seed, userId, studentProfileId) {
  const subjects = ['Programming', 'Database', 'Data Structures', 'Software Engineering'];
  return seed.grades.map((grade, idx) => ({
    studentId: studentProfileId,
    userId,
    subjectCode: `SUBJ-${idx + 1}`,
    subjectName: subjects[idx],
    grade,
    marks: null,
    outOfMarks: 100,
    percentage: null,
    semester: '2nd',
    academicYear: '2025-2026',
    status: 'approved',
  }));
}

function buildCertifications(seed, userId, studentProfileId) {
  return seed.certifications.map((cert, idx) => ({
    studentId: studentProfileId,
    userId,
    title: cert.title,
    issuer: cert.issuer,
    dateEarned: new Date(2025, idx, 15),
    category: 'Technology',
    status: 'approved',
  }));
}

function buildSurveyResponse(userId, studentProfileId, surveyId, values) {
  return {
    surveyId,
    studentId: studentProfileId,
    userId,
    responses: values.map((value, idx) => ({
      questionText: `Q${idx + 1}`,
      response: value,
      responseType: 'rating',
    })),
    numericResponses: values.map((value, idx) => ({
      questionNumber: idx + 1,
      numericValue: value,
    })),
    isSubmitted: true,
  };
}

async function ensureSurvey(adminId) {
  let survey = await Survey.findOne({ title: 'Algorithm Validation Survey' });
  if (survey) return survey;

  survey = new Survey({
    title: 'Algorithm Validation Survey',
    description: 'Survey used for testing employability prediction scoring.',
    surveyType: 'employability',
    createdBy: adminId,
    isActive: true,
    questions: [
      { questionNumber: 1, text: 'Rate communication', type: 'rating', minValue: 1, maxValue: 5 },
      { questionNumber: 2, text: 'Rate teamwork', type: 'rating', minValue: 1, maxValue: 5 },
      { questionNumber: 3, text: 'Rate adaptability', type: 'rating', minValue: 1, maxValue: 5 },
      { questionNumber: 4, text: 'Rate confidence', type: 'rating', minValue: 1, maxValue: 5 },
      { questionNumber: 5, text: 'Rate professionalism', type: 'rating', minValue: 1, maxValue: 5 },
    ],
  });

  await survey.save();
  return survey;
}

async function seedTestStudents() {
  await mongoose.connect(MONGODB_URI);

  try {
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      throw new Error('Admin account not found. Run node seed.js first.');
    }

    const survey = await ensureSurvey(admin._id);
    const summary = [];

    for (let i = 0; i < studentsSeed.length; i += 1) {
      const seed = studentsSeed[i];
      const user = await upsertStudentUser(seed);

      const profile = await StudentProfile.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          enrollmentNumber: `2025-TEST-${String(i + 1).padStart(3, '0')}`,
          course: seed.course,
          specialization: seed.specialization,
          academicYear: '3rd Year',
          semester: '2nd',
          section: 'A',
          currentCGPA: 3.0,
          careerInterests: [seed.specialization, 'Software Development'],
          preferredJobTitles: ['Junior Developer', 'Analyst'],
          about: 'Seeded test profile for algorithm validation.',
          technicalSkills: seed.skills,
          softSkills: seed.softSkills,
          profileCompletionPercentage: 95,
          isBasicInfoComplete: true,
          isAcademicInfoComplete: true,
          isSkillsComplete: true,
          isCareerInfoComplete: true,
          totalSurveysCompleted: 1,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      await Grade.deleteMany({ userId: user._id });
      await Certification.deleteMany({ userId: user._id });
      await SurveyResponse.deleteMany({ userId: user._id });
      await Prediction.deleteMany({ userId: user._id });

      const grades = buildGrades(seed, user._id, profile._id);
      if (grades.length) await Grade.insertMany(grades);

      const certs = buildCertifications(seed, user._id, profile._id);
      if (certs.length) await Certification.insertMany(certs);

      const surveyResponse = buildSurveyResponse(user._id, profile._id, survey._id, seed.surveyValues);
      await SurveyResponse.create(surveyResponse);

      const prediction = await generatePrediction(user._id);

      summary.push({
        email: seed.email,
        profileId: String(profile._id),
        employabilityScore: prediction.employabilityScore,
        employabilityLevel: prediction.employabilityLevel,
      });
    }

    console.log('Seed complete for test students.');
    console.log(JSON.stringify(summary, null, 2));
  } finally {
    await mongoose.disconnect();
  }
}

seedTestStudents().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
