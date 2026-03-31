# PathToTech - Student Employability Prediction System

A comprehensive MERN stack application designed to predict student employability and provide personalized career recommendations using advanced analytics and machine learning algorithms.

## 📚 Documentation

**Start here based on your role:**

- **🚀 [Quick Setup Guide](./SETUP.md)** - Get running in 5 minutes
- **💻 [All Features Explained](./FEATURES.md)** - Complete feature documentation with use cases
- **🏗️ [Project Structure](./PROJECT_STRUCTURE.md)** - Directory layout & file organization for developers
- **📡 [API Documentation](./API_DOCS.md)** - Every endpoint with examples and response formats
- **⚙️ [Environment Setup](./env.example)** - Configuration guide

## Project Overview

PathToTech is a full-stack web application that helps students understand their current employability level, identifies skill gaps, and provides intelligent recommendations for career development. The system uses Gaussian Mixture Models (GMM) for clustering and ECLAT algorithms for association rule mining.

## Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **SweetAlert2** - Notifications and alerts
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **CSV-Parse** - CSV parsing

## Features

### Admin Features
- 📊 Dashboard with analytics and KPIs
- 👥 Student management and filtering
- 📝 Grade approval/rejection workflow
- 🎓 Certification management
- 📋 Survey creation and management
- 🤖 Employability prediction triggering
- 📈 Advanced analytics and reports
- 📁 Automatic dataset import
- 🔍 Audit logs and activity tracking

### Student Features
- ✅ Complete profile management
- 📚 Upload grades (PDF/Image)
- 🏆 Upload certifications
- 💼 Skills management (technical & soft)
- 📊 Take surveys and assessments
- 🎯 View employability predictions
- 💡 Get job recommendations
- 📈 Track progress and improvements

## Project Structure

```
PathToTech/
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── constants.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── studentProfileController.js
│   │   ├── gradeController.js
│   │   ├── certificationController.js
│   │   ├── surveyController.js
│   │   └── predictionController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── StudentProfile.js
│   │   ├── Grade.js
│   │   ├── Certification.js
│   │   ├── Survey.js
│   │   ├── SurveyResponse.js
│   │   ├── Prediction.js
│   │   ├── Job.js
│   │   ├── Dataset.js
│   │   ├── AuditLog.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── studentProfileRoutes.js
│   │   ├── gradeRoutes.js
│   │   ├── certificationRoutes.js
│   │   ├── surveyRoutes.js
│   │   └── predictionRoutes.js
│   ├── services/
│   │   ├── datasetService.js
│   │   └── predictionService.js
│   ├── datasets/
│   ├── uploads/
│   ├── utils/
│   │   └── helpers.js
│   ├── index.js
│   ├── package.json
│   └── .env.example
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   └── Sidebar.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── hooks/
    │   │   └── useAuth.js
    │   ├── layouts/
    │   │   └── DashboardLayout.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── LandingPage.js
    │   │   ├── AdminDashboard.js
    │   │   ├── StudentDashboard.js
    │   │   ├── StudentProfile.js
    │   │   └── NotFound.js
    │   ├── services/
    │   │   └── api.js
    │   ├── utils/
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── public/
    │   └── index.html
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```
   MONGODB_URI=mongodb://localhost:27017/pathtotech
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

The server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Admin
- `GET /api/admin/dashboard-stats` - Dashboard statistics
- `GET /api/admin/students` - Get all students
- `GET /api/admin/students/:studentId` - Get student details
- `PATCH /api/admin/students/:studentId/status` - Toggle student status

### Student Profile
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update profile
- `POST /api/student/profile/skills/technical` - Add technical skill
- `POST /api/student/profile/skills/soft` - Add soft skill
- `DELETE /api/student/profile/skills/:skillId/:skillType` - Delete skill

### Grades
- `GET /api/grades` - Get all grades
- `POST /api/grades/upload` - Upload grade
- `PATCH /api/grades/:gradeId/approve` - Approve grade
- `PATCH /api/grades/:gradeId/reject` - Reject grade
- `DELETE /api/grades/:gradeId` - Delete grade

### Certifications
- `GET /api/certifications` - Get all certifications
- `POST /api/certifications/upload` - Upload certification
- `PATCH /api/certifications/:certId/approve` - Approve
- `PATCH /api/certifications/:certId/reject` - Reject
- `DELETE /api/certifications/:certId` - Delete

### Surveys
- `GET /api/surveys` - Get all surveys
- `GET /api/surveys/:surveyId` - Get survey details
- `POST /api/surveys` - Create survey (admin)
- `PUT /api/surveys/:surveyId` - Update survey (admin)
- `DELETE /api/surveys/:surveyId` - Delete survey (admin)
- `POST /api/surveys/:surveyId/submit` - Submit response (student)
- `GET /api/surveys/:surveyId/responses` - Get responses (admin)

### Predictions
- `GET /api/predictions` - Get all predictions (admin)
- `GET /api/predictions/details/:predictionId` - Get prediction details
- `GET /api/predictions/student/:studentId` - Get student prediction
- `POST /api/predictions/generate/:studentId` - Generate prediction (admin)

## Demo Credentials

**Admin Account:**
- Email: `admin@pathtotech.local`
- Password: `Admin@123`

**Student Account:**
- Email: `student@pathtotech.local`
- Password: `Pass@123`

## Key Features Implementation

### 1. Automatic Dataset Import
The system automatically scans the `/datasets` folder on startup and imports all CSV files:
- Validates data format
- Handles errors gracefully
- Logs import results

### 2. Employability Prediction
Uses multiple factors:
- **Academic Score** (30%): Based on grades
- **Skills Score** (25%): Based on technical skill proficiency
- **Certification Score** (20%): Based on approvedfications
- **Soft Skills Score** (25%): Based on survey responses

### 3. Algorithms
- **GMM Clustering**: Groups students into employability tiers
- **ECLAT Rules**: Discovers patterns in student data

### 4. Job Matching
Recommends suitable tech roles based on:
- Skill match
- Employability score
- Educational background

## Design Highlights

- **Modern Maroon & White Theme**: Professional university system aesthetic
- **Responsive Design**: Mobile, tablet, and desktop support
- **Interactive Charts**: Recharts visualizations
- **Smooth Animations**: Tailwind transitions and effects
- **User-Friendly Forms**: Validation and clear feedback
- **Accessibility**: Clean typography and high contrast

## Future Enhancements

- [ ] Real OCR integration for grade extraction
- [ ] Machine learning model optimization
- [ ] Email notifications
- [ ] Mobile app
- [ ] Advanced reporting and exports
- [ ] Integration with LinkedIn API
- [ ] Interview preparation module
- [ ] Mentorship matching

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env

### CORS Issues
- Verify CORS_ORIGIN in server .env
- Check frontend API URL configuration

### Port Already in Use
- Change PORT in .env (server)
- Change port in package.json (frontend)

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@pathtotech.local

## Authors

PathToTech Development Team

---

**Happy Learning! 🚀**

Built with ❤️ for student success
