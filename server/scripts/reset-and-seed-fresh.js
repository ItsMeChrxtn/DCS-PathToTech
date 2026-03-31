require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Grade = require('../models/Grade');
const Certification = require('../models/Certification');
const Survey = require('../models/Survey');
const SurveyResponse = require('../models/SurveyResponse');
const Prediction = require('../models/Prediction');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const Job = require('../models/Job');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pathtotech';

async function resetAndSeedFresh() {
  await mongoose.connect(MONGODB_URI);

  try {
    await Promise.all([
      Prediction.deleteMany({}),
      SurveyResponse.deleteMany({}),
      Certification.deleteMany({}),
      Grade.deleteMany({}),
      StudentProfile.deleteMany({}),
      Survey.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({}),
      Job.deleteMany({}),
      User.deleteMany({}),
    ]);

    await User.create({
      email: 'admin@pathtotech.local',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      status: 'active',
      isEmailVerified: true,
    });

    await User.create({
      email: 'student@pathtotech.local',
      password: 'student123',
      firstName: 'Juan',
      lastName: 'dela Cruz',
      role: 'student',
      status: 'active',
      isEmailVerified: true,
    });

    console.log('Reset complete. Fresh admin/student created.');
  } finally {
    await mongoose.disconnect();
  }
}

resetAndSeedFresh().catch((error) => {
  console.error('Reset failed:', error);
  process.exit(1);
});
