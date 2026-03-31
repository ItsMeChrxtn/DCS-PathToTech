require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const { autoImportDatasets } = require('./services/datasetService');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentProfileRoutes = require('./routes/studentProfileRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const certificationRoutes = require('./routes/certificationRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'PathToTech server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student/profile', studentProfileRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/predictions', predictionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use(errorHandler);

// Database connection and server startup
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Auto-import datasets on startup
    console.log('\n🔄 Scanning for datasets...');
    const importResult = await autoImportDatasets();
    console.log(`📊 Datasets: ${importResult.imported} imported, ${importResult.errors.length} errors\n`);

    // Start server
    app.listen(PORT, () => {
      console.log(`\n✓ PathToTech server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Database: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/pathtotech'}\n`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
