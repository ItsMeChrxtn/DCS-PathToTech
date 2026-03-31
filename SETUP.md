# PathToTech - Student Employability Prediction System

## Quick Start Guide

### 1. Installation

#### Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB connection
npm start
```

#### Frontend
```bash
cd client
npm install
npm start
```

### 2. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Landing Page**: http://localhost:3000

### 3. Default Credentials

**Admin Login:**
- Email: admin@pathtotech.local
- Password: Admin@123

**Student Login:**
- Email: student@pathtotech.local
- Password: Pass@123

### 4. Database Setup

MongoDB must be running before starting the server:

```bash
# Local MongoDB
mongod

# Or using Docker
docker run -d -p 27017:27017 mongo
```

### 5. Features to Explore

**As Admin:**
1. View Dashboard - See student statistics
2. Manage Students - View and filter student list
3. Approve Grades - Review and approve student grades
4. Create Surveys - Create new employability surveys
5. Generate Predictions - Run prediction for students
6. View Analytics - Check charts and reports

**As Student:**
1. Complete Profile - Fill in personal/academic info
2. Upload Grades - Add grade documents
3. Add Certifications - Upload certificates
4. Take Surveys - Complete assessments
5. View Results - See employability predictions
6. Check Recommendations - Get career suggestions

### 6. Datasets Auto-Import

Place CSV files in `server/datasets/` folder. The system will automatically import them on startup with:
- Data validation
- Error handling
- Logging

### 7. API Testing

Use Postman or similar tool:
- Import API endpoints from README.md
- Use Bearer token authentication
- Test with provided demo credentials

### 8. File Upload

Supported formats:
- Grades: PDF, PNG, JPG (Max 10MB)
- Certifications: PDF, PNG, JPG (Max 10MB)

### 9. Troubleshooting

**Port Conflict:**
```bash
# Change in server/.env:
PORT=5001

# For frontend, it will prompt automatically
```

**Database Connection Error:**
Check MongoDB is running and MONGODB_URI is correct

**CORS Error:**
Verify CORS_ORIGIN in .env matches frontend URL

---

**For detailed setup, see README.md**
