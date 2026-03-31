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

const runDatasetAutoImport = async () => {
  console.log('Starting dataset auto-import...');

  try {
    await autoImportDatasets();
    console.log('Dataset import completed');
  } catch (error) {
    console.error('Dataset import failed: ' + error.message);
  }
};

const startServer = async () => {
  console.log('Server starting...');

  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected');

    app.listen(PORT, "0.0.0.0", () => {
      console.log('Server running on port ' + PORT);
      console.log('Environment: ' + (process.env.NODE_ENV || 'development'));

      // Run import after server is already listening so startup is not blocked.
      void runDatasetAutoImport();
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
