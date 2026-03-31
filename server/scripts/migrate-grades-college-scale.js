require('dotenv').config();
const mongoose = require('mongoose');
const Grade = require('../models/Grade');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pathtotech';

const LETTER_TO_COLLEGE_GRADE = {
  'A+': '1.00',
  A: '1.00',
  'A-': '1.25',
  'B+': '1.75',
  B: '2.00',
  'B-': '2.25',
  'C+': '2.50',
  C: '2.75',
  'C-': '3.00',
  D: '4.00 INC',
  F: '5.00 Failed',
};

async function migrateGrades() {
  await mongoose.connect(MONGODB_URI);

  try {
    const letterGrades = Object.keys(LETTER_TO_COLLEGE_GRADE);
    const grades = await Grade.find({ grade: { $in: letterGrades } });

    for (const gradeDoc of grades) {
      gradeDoc.grade = LETTER_TO_COLLEGE_GRADE[gradeDoc.grade] || gradeDoc.grade;
      await gradeDoc.save();
    }

    console.log(`Updated ${grades.length} grade record(s) to college scale.`);
  } finally {
    await mongoose.disconnect();
  }
}

migrateGrades().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
