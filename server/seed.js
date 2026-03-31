const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pathtotech';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create admin
    await User.create({
      email: 'admin@pathtotech.local',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      status: 'active',
      isEmailVerified: true,
    });
    console.log('Admin created: admin@pathtotech.local / admin123');

    // Create student
    await User.create({
      email: 'student@pathtotech.local',
      password: 'student123',
      firstName: 'Juan',
      lastName: 'dela Cruz',
      role: 'student',
      status: 'active',
      isEmailVerified: true,
    });
    console.log('Student created: student@pathtotech.local / student123');

    console.log('\nSeeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
