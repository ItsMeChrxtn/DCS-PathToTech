/**
 * seed-bulk-students.js
 *
 * Seeds 15 additional test students with deliberately varied score profiles
 * so that the GMM (EM algorithm) can form distinct clusters and ECLAT can
 * mine meaningful association rules.
 *
 * Profile distribution:
 *   – 3 excellent  (score ≥ 85)
 *   – 4 very_good  (70–84)
 *   – 4 good       (55–69)
 *   – 2 average    (40–54)
 *   – 2 needs_improvement (<40)
 *
 * Run from: server/
 *   node seed-bulk-students.js
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const User           = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const Grade          = require('./models/Grade');
const Certification  = require('./models/Certification');
const Prediction     = require('./models/Prediction');
const { generatePrediction } = require('./services/predictionService');

const DB_URI = 'mongodb://localhost:27017/pathtotech';

// ─── Student blueprints ───────────────────────────────────────────────────────

const STUDENTS = [
  // ── EXCELLENT (score ≥ 0.85) ────────────────────────────────────────────────
  {
    email: 'bulk1@pathtotech.local', firstName: 'Carlos', lastName: 'Reyes',
    course: 'BS Computer Science', year: 4, section: 'A',
    skills: [
      { name: 'Python',      proficiencyLevel: 'expert' },
      { name: 'Machine Learning', proficiencyLevel: 'expert' },
      { name: 'TensorFlow',  proficiencyLevel: 'advanced' },
      { name: 'SQL',         proficiencyLevel: 'expert' },
      { name: 'Docker',      proficiencyLevel: 'advanced' },
      { name: 'AWS',         proficiencyLevel: 'intermediate' },
    ],
    grades: ['1.00','1.00','1.00','1.00','1.00','1.00'],
    numCerts: 5,
    surveyAvg: 4.8,
  },
  {
    email: 'bulk2@pathtotech.local', firstName: 'Maria', lastName: 'Cruz',
    course: 'BS Information Technology', year: 4, section: 'A',
    skills: [
      { name: 'JavaScript', proficiencyLevel: 'expert' },
      { name: 'React',      proficiencyLevel: 'expert' },
      { name: 'Node.js',    proficiencyLevel: 'advanced' },
      { name: 'TypeScript', proficiencyLevel: 'advanced' },
      { name: 'MongoDB',    proficiencyLevel: 'advanced' },
    ],
    grades: ['1.00','1.00','1.00','1.00','1.25','1.00'],
    numCerts: 4,
    surveyAvg: 4.6,
  },
  {
    email: 'bulk3@pathtotech.local', firstName: 'Jose', lastName: 'Santos',
    course: 'BS Computer Engineering', year: 4, section: 'B',
    skills: [
      { name: 'C++',         proficiencyLevel: 'expert' },
      { name: 'Embedded Systems', proficiencyLevel: 'expert' },
      { name: 'FPGA',        proficiencyLevel: 'advanced' },
      { name: 'Python',      proficiencyLevel: 'advanced' },
      { name: 'Networking',  proficiencyLevel: 'advanced' },
    ],
    grades: ['1.00','1.00','1.25','1.00','1.00','1.00'],
    numCerts: 4,
    surveyAvg: 4.5,
  },

  // ── VERY_GOOD (0.70–0.84) ────────────────────────────────────────────────────
  {
    email: 'bulk4@pathtotech.local', firstName: 'Anna', lastName: 'Lim',
    course: 'BS Computer Science', year: 3, section: 'A',
    skills: [
      { name: 'Java',    proficiencyLevel: 'advanced' },
      { name: 'Spring',  proficiencyLevel: 'intermediate' },
      { name: 'SQL',     proficiencyLevel: 'advanced' },
      { name: 'Git',     proficiencyLevel: 'advanced' },
    ],
    grades: ['1.00','1.25','1.75','1.00','1.25'],
    numCerts: 3,
    surveyAvg: 4.2,
  },
  {
    email: 'bulk5@pathtotech.local', firstName: 'Ramon', lastName: 'Dela Cruz',
    course: 'BS Information Technology', year: 4, section: 'C',
    skills: [
      { name: 'PHP',        proficiencyLevel: 'advanced' },
      { name: 'Laravel',    proficiencyLevel: 'advanced' },
      { name: 'Vue.js',     proficiencyLevel: 'intermediate' },
      { name: 'MySQL',      proficiencyLevel: 'advanced' },
    ],
    grades: ['1.25','1.75','1.00','1.75','1.25'],
    numCerts: 2,
    surveyAvg: 4.3,
  },
  {
    email: 'bulk6@pathtotech.local', firstName: 'Liza', lastName: 'Aguilar',
    course: 'BS Computer Science', year: 3, section: 'B',
    skills: [
      { name: 'Data Analysis', proficiencyLevel: 'advanced' },
      { name: 'Python',        proficiencyLevel: 'advanced' },
      { name: 'R',             proficiencyLevel: 'intermediate' },
      { name: 'Tableau',       proficiencyLevel: 'intermediate' },
    ],
    grades: ['1.00','1.75','1.25','1.00','1.75'],
    numCerts: 3,
    surveyAvg: 4.0,
  },
  {
    email: 'bulk7@pathtotech.local', firstName: 'Kevin', lastName: 'Flores',
    course: 'BS Information Technology', year: 3, section: 'A',
    skills: [
      { name: 'Android Dev', proficiencyLevel: 'advanced' },
      { name: 'Kotlin',      proficiencyLevel: 'advanced' },
      { name: 'Firebase',    proficiencyLevel: 'intermediate' },
    ],
    grades: ['1.75','1.00','1.25','1.75','1.00'],
    numCerts: 2,
    surveyAvg: 4.1,
  },

  // ── GOOD (0.55–0.69) ─────────────────────────────────────────────────────────
  {
    email: 'bulk8@pathtotech.local', firstName: 'Grace', lastName: 'Tan',
    course: 'BS Computer Science', year: 2, section: 'A',
    skills: [
      { name: 'Python',     proficiencyLevel: 'intermediate' },
      { name: 'JavaScript', proficiencyLevel: 'intermediate' },
      { name: 'HTML/CSS',   proficiencyLevel: 'advanced' },
    ],
    grades: ['1.75','2.00','1.75','1.25','2.00'],
    numCerts: 1,
    surveyAvg: 3.6,
  },
  {
    email: 'bulk9@pathtotech.local', firstName: 'Marco', lastName: 'Villanueva',
    course: 'BS Information Systems', year: 3, section: 'B',
    skills: [
      { name: 'SQL',      proficiencyLevel: 'intermediate' },
      { name: 'Excel',    proficiencyLevel: 'advanced' },
      { name: 'Power BI', proficiencyLevel: 'intermediate' },
    ],
    grades: ['2.00','1.75','2.00','2.25','1.75'],
    numCerts: 1,
    surveyAvg: 3.5,
  },
  {
    email: 'bulk10@pathtotech.local', firstName: 'Jessie', lastName: 'Navarro',
    course: 'BS Computer Engineering', year: 2, section: 'C',
    skills: [
      { name: 'C',           proficiencyLevel: 'intermediate' },
      { name: 'Arduino',     proficiencyLevel: 'intermediate' },
      { name: 'Networking',  proficiencyLevel: 'beginner' },
    ],
    grades: ['2.00','2.25','1.75','2.00','2.00'],
    numCerts: 1,
    surveyAvg: 3.4,
  },
  {
    email: 'bulk11@pathtotech.local', firstName: 'Trisha', lastName: 'Mendez',
    course: 'BS Computer Science', year: 3, section: 'A',
    skills: [
      { name: 'Java',       proficiencyLevel: 'intermediate' },
      { name: 'OOP Design', proficiencyLevel: 'intermediate' },
    ],
    grades: ['2.25','2.00','1.75','2.00','2.25'],
    numCerts: 2,
    surveyAvg: 3.8,
  },

  // ── AVERAGE (0.40–0.54) ───────────────────────────────────────────────────────
  {
    email: 'bulk12@pathtotech.local', firstName: 'Ronnie', lastName: 'Garcia',
    course: 'BS Information Technology', year: 2, section: 'B',
    skills: [
      { name: 'HTML/CSS',   proficiencyLevel: 'beginner' },
      { name: 'JavaScript', proficiencyLevel: 'beginner' },
    ],
    grades: ['2.50','2.25','2.50','2.75','2.25'],
    numCerts: 0,
    surveyAvg: 2.8,
  },
  {
    email: 'bulk13@pathtotech.local', firstName: 'Dianne', lastName: 'Pascual',
    course: 'BS Computer Science', year: 1, section: 'C',
    skills: [
      { name: 'Scratch',  proficiencyLevel: 'beginner' },
      { name: 'Python',   proficiencyLevel: 'beginner' },
    ],
    grades: ['2.50','2.75','2.25','2.50','2.75'],
    numCerts: 0,
    surveyAvg: 2.6,
  },

  // ── NEEDS IMPROVEMENT (<0.40) ────────────────────────────────────────────────
  {
    email: 'bulk14@pathtotech.local', firstName: 'Luigi', lastName: 'Bautista',
    course: 'BS Information Technology', year: 1, section: 'A',
    skills: [
      { name: 'HTML', proficiencyLevel: 'beginner' },
    ],
    grades: ['2.75','3.00','2.50','2.75','4.00 INC'],
    numCerts: 0,
    surveyAvg: 2.0,
  },
  {
    email: 'bulk15@pathtotech.local', firstName: 'Abby', lastName: 'Ramos',
    course: 'BS Computer Science', year: 1, section: 'B',
    skills: [],
    grades: ['3.00','4.00 INC','2.75','3.00','3.00'],
    numCerts: 0,
    surveyAvg: 1.8,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const GRADE_POINTS = {
  '1.00': 1.0,
  '1.25': 0.875,
  '1.50': 0.75,
  '1.75': 0.625,
  '2.00': 0.5,
  '2.25': 0.375,
  '2.50': 0.25,
  '2.75': 0.125,
  '3.00': 0,
  '4.00 INC': 0,
  '5.00 Failed': 0,
};

const SUBJECTS = [
  'Data Structures', 'Algorithms', 'Database Systems',
  'Operating Systems', 'Software Engineering', 'Networks',
];

async function seedStudent(blueprint, hashedPassword, existingSurvey) {
  // 1. User account
  let user = await User.findOne({ email: blueprint.email });
  if (!user) {
    user = await User.create({
      email:       blueprint.email,
      password:    hashedPassword,
      firstName:   blueprint.firstName,
      lastName:    blueprint.lastName,
      role:        'student',
      accountStatus: 'active',
    });
  }

  const uid = user._id;
  const bulkNumberMatch = blueprint.email.match(/bulk(\d+)/i);
  const enrollmentNumber = bulkNumberMatch
    ? `2025-BULK-${String(parseInt(bulkNumberMatch[1], 10)).padStart(3, '0')}`
    : `2025-BULK-${Date.now()}`;

  // 2. Student profile
  const profile = await StudentProfile.findOneAndUpdate(
    { userId: uid },
    {
      userId:       uid,
      enrollmentNumber,
      course:       blueprint.course,
      yearLevel:    blueprint.year,
      section:      blueprint.section,
      technicalSkills: blueprint.skills,
      careerInterests: ['Software Development', 'Data Science'],
      profileCompletionPercentage: blueprint.skills.length > 0 ? 80 : 40,
    },
    { upsert: true, new: true }
  );

  // 3. Grades
  await Grade.deleteMany({ userId: uid });
  for (let i = 0; i < blueprint.grades.length; i++) {
    await Grade.create({
      userId:      uid,
      studentId:   profile._id,
      subject:     SUBJECTS[i % SUBJECTS.length],
      subjectName: SUBJECTS[i % SUBJECTS.length],
      grade:       blueprint.grades[i],
      gradePoints: GRADE_POINTS[blueprint.grades[i]] || 0,
      semester:    i < 3 ? '1st Semester' : '2nd Semester',
      academicYear: '2025-2026',
      status:      'approved',
    });
  }

  // 4. Certifications
  await Certification.deleteMany({ userId: uid });
  const certNames = ['AWS Cloud Practitioner', 'Azure Fundamentals', 'Oracle Java SE', 'Google Data Analytics', 'CompTIA Security+'];
  for (let c = 0; c < blueprint.numCerts; c++) {
    await Certification.create({
      userId:     uid,
      studentId:  profile._id,
      title:      certNames[c % certNames.length],
      name:       certNames[c % certNames.length],
      issuer:     'Professional Certification Body',
      dateEarned: new Date(2024, c, 15),
      dateIssued: new Date(2024, c, 15),
      status:     'approved',
    });
  }

  // 5. Survey response
  if (existingSurvey) {
    const SurveyResponse = require('./models/SurveyResponse');
    await SurveyResponse.findOneAndUpdate(
      { userId: uid, surveyId: existingSurvey._id },
      {
        userId:    uid,
        studentId: profile._id,
        surveyId:  existingSurvey._id,
        responses: (existingSurvey.questions || []).slice(0, 3).map((q, i) => ({
          questionId:   q._id || new mongoose.Types.ObjectId(),
          questionText: q.questionText || `Question ${i + 1}`,
          response:     String(Math.round(blueprint.surveyAvg)),
          responseType: 'numeric',
        })),
        numericResponses: [1, 2, 3].map(i => ({
          questionNumber: i,
          numericValue: parseFloat(
            (blueprint.surveyAvg + (Math.random() * 0.4 - 0.2)).toFixed(1)
          ),
        })),
        completedAt: new Date(),
        isSubmitted: true,
      },
      { upsert: true, new: true }
    );
  }

  // 6. Prediction
  await Prediction.deleteMany({ userId: uid });
  const prediction = await generatePrediction(uid);

  return { email: blueprint.email, employabilityScore: prediction.employabilityScore, employabilityLevel: prediction.employabilityLevel };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await mongoose.connect(DB_URI);
  console.log('Connected to MongoDB\n');

  const hashedPassword = await bcrypt.hash('student123', 10);

  // Find an existing survey to attach responses to
  const Survey = require('./models/Survey');
  const survey = await Survey.findOne();
  if (!survey) {
    console.warn('⚠  No survey found in DB – survey responses will be skipped.');
    console.warn('   Create a survey via Admin → Surveys first.\n');
  }

  const results = [];
  for (const blueprint of STUDENTS) {
    try {
      const result = await seedStudent(blueprint, hashedPassword, survey);
      console.log(`✓ ${result.email}  score=${result.employabilityScore}  level=${result.employabilityLevel}`);
      results.push(result);
    } catch (err) {
      console.error(`✗ ${blueprint.email}:`, err.message);
    }
  }

  console.log('\n── Summary ───────────────────────────────────────');
  console.log(`Seeded:  ${results.length} / ${STUDENTS.length} students`);

  const byClusters = {};
  results.forEach(r => {
    byClusters[r.employabilityLevel] = (byClusters[r.employabilityLevel] || 0) + 1;
  });
  Object.entries(byClusters).forEach(([lvl, cnt]) => console.log(`  ${lvl}: ${cnt}`));

  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
