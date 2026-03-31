# PathToTech - Project Structure Guide

Complete directory structure and file organization for the PathToTech application.

---

## 📁 Root Directory

```
PathTotech/
├── server/                 # Node.js/Express backend
├── client/                 # React frontend
├── datasets/               # CSV files for auto-import
├── README.md              # Main project documentation
├── SETUP.md               # Quick setup guide
├── .env.example           # Environment variables template
├── FEATURES.md            # Feature documentation
├── API_DOCS.md            # API endpoint documentation
└── PROJECT_STRUCTURE.md   # This file
```

---

## 🖥️ Backend Structure (`/server`)

```
server/
├── config/
│   ├── db.js              # MongoDB connection configuration
│   └── constants.js       # Enum constants (roles, statuses, etc.)
│
├── middleware/
│   ├── auth.js            # JWT authentication & authorization
│   └── errorHandler.js    # Centralized error handling
│
├── models/                # Mongoose schemas
│   ├── User.js            # User authentication model
│   ├── StudentProfile.js  # Student personal/academic info
│   ├── Grade.js           # Grade submissions with approval workflow
│   ├── Certification.js   # Certification submissions
│   ├── Survey.js          # Survey definitions
│   ├── SurveyResponse.js  # Student survey responses
│   ├── Prediction.js      # Employability predictions
│   ├── Job.js             # Job/role definitions
│   ├── Dataset.js         # Imported dataset metadata
│   ├── AuditLog.js        # Admin action logging
│   └── Notification.js    # User notifications
│
├── controllers/           # Route handlers (business logic)
│   ├── authController.js  # Auth operations (register, login, profile)
│   ├── adminController.js # Admin dashboard & student management
│   ├── studentProfileController.js # Profile CRUD & skill management
│   ├── gradeController.js # Grade upload & approval
│   ├── certificationController.js  # Certification upload & approval
│   ├── surveyController.js         # Survey CRUD & response handling
│   └── predictionController.js     # Prediction generation & retrieval
│
├── routes/                # Express route definitions
│   ├── authRoutes.js      # /api/auth endpoints
│   ├── adminRoutes.js     # /api/admin endpoints
│   ├── studentProfileRoutes.js # /api/student-profile endpoints
│   ├── gradeRoutes.js     # /api/grades endpoints
│   ├── certificationRoutes.js  # /api/certifications endpoints
│   ├── surveyRoutes.js    # /api/surveys endpoints
│   └── predictionRoutes.js     # /api/predictions endpoints
│
├── services/              # Business logic services
│   ├── datasetService.js  # CSV import & processing
│   └── predictionService.js # Employability prediction algorithms
│
├── utils/                 # Utility functions
│   └── helpers.js         # JWT generation, email validation, calculations
│
├── uploads/               # File upload directories
│   ├── grades/            # Grade document storage
│   ├── certifications/    # Certification document storage
│   └── profiles/          # Profile pictures
│
├── index.js               # Express app setup & server entry point
├── package.json           # Node dependencies & scripts
├── package-lock.json      # Dependency lock file
└── .env                   # Environment variables (git ignored)
```

---

## 💻 Frontend Structure (`/client`)

```
client/
├── public/
│   ├── index.html         # HTML template
│   └── favicon.ico
│
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.js      # Top navigation bar
│   │   └── Sidebar.js     # Left sidebar navigation
│   │
│   ├── context/           # React Context for state management
│   │   └── AuthContext.js # Global authentication context
│   │
│   ├── hooks/             # Custom React hooks
│   │   └── useAuth.js     # Hook for consuming AuthContext
│   │
│   ├── layouts/           # Layout wrapper components
│   │   └── DashboardLayout.js # Template for dashboard pages
│   │
│   ├── pages/             # Full page components
│   │
│   │   ├── Public Pages
│   │   ├── LandingPage.js     # Public landing page
│   │   ├── Login.js           # User login page
│   │   ├── Register.js        # User registration page
│   │   └── NotFound.js        # 404 error page
│   │
│   │   ├── Admin Pages
│   │   ├── AdminDashboard.js      # Admin dashboard with metrics
│   │   ├── AdminStudents.js       # Student management & list
│   │   ├── AdminGrades.js         # Grade approval workflow
│   │   ├── AdminCertifications.js # Certification approval
│   │   └── AdminDatasets.js       # Dataset management & import logs
│   │
│   │   └── Student Pages
│   │       ├── StudentDashboard.js      # Student home dashboard
│   │       ├── StudentProfile.js        # Profile management form
│   │       ├── StudentGrades.js         # Grade upload & tracking
│   │       ├── StudentCertifications.js # Certification upload
│   │       ├── StudentSurveys.js        # Survey listing & submission
│   │       ├── StudentResults.js        # Employability results view
│   │       └── StudentRecommendations.js # Career recommendations
│   │
│   ├── services/          # API communication layer
│   │   └── api.js         # Axios instance & endpoint functions
│   │
│   ├── utils/             # Utility functions
│   │   └── helpers.js     # Formatting, validation, color mapping
│   │
│   ├── App.js             # Root component with routing
│   ├── index.js           # React entry point
│   ├── index.css          # Global styles
│   │
│   ├── package.json       # React dependencies & scripts
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── postcss.config.js  # PostCSS plugins configuration
│   └── .env.example       # Frontend env variables template
│
└── README.md              # Frontend-specific documentation
```

---

## 📊 Database Models Diagram

```
User (1) ──── (1) StudentProfile
User (1) ──── (M) Grade
User (1) ──── (M) Certification
User (1) ──── (M) SurveyResponse
User (1) ──── (M) Prediction
Survey (1) ──── (M) SurveyResponse
Admin (1) ──── (M) AuditLog
User (1) ──── (M) Notification
StudentProfile (1) ──── (M) Grade
StudentProfile (1) ──── (M) Certification
StudentProfile (1) ──── (M) Prediction
Job (1) ──── (M) Prediction (suggestedJobRoles)
Dataset (1) ──── (M) ImportedRecords
```

---

## 🔄 API Route Structure

```
/api
├── /auth (Public + Protected)
│   ├── POST   /register
│   ├── POST   /login
│   ├── GET    /me
│   ├── PUT    /profile
│   ├── POST   /change-password
│   └── POST   /logout
│
├── /admin (Protected - Admin only)
│   ├── GET    /dashboard-stats
│   ├── GET    /students
│   ├── GET    /students/:studentId
│   ├── PATCH  /students/:studentId/status
│   └── GET    /predictions
│
├── /student-profile (Protected - Student only)
│   ├── GET    /profile
│   ├── PUT    /profile
│   ├── POST   /skills/technical
│   ├── POST   /skills/soft
│   └── DELETE /skills/:skillId/:skillType
│
├── /grades (Protected)
│   ├── POST   /upload (Student)
│   ├── GET    / (Admin)
│   ├── PATCH  /:id/approve (Admin)
│   ├── PATCH  /:id/reject (Admin)
│   └── DELETE /:id (Owner/Admin)
│
├── /certifications (Protected)
│   ├── POST   /upload (Student)
│   ├── GET    / (Admin)
│   ├── PATCH  /:id/approve (Admin)
│   ├── PATCH  /:id/reject (Admin)
│   └── DELETE /:id (Owner/Admin)
│
├── /surveys
│   ├── GET    / (Public)
│   ├── GET    /:id (Public)
│   ├── POST   / (Admin)
│   ├── PUT    /:id (Admin)
│   ├── DELETE /:id (Admin)
│   ├── POST   /:id/submit (Student)
│   └── GET    /:id/responses (Admin)
│
└── /predictions (Protected - Admin)
    ├── GET    /
    ├── GET    /details/:id
    ├── GET    /student/:id (Student)
    └── POST   /generate/:id
```

---

## 🗂️ Data Flow Diagrams

### Authentication Flow
```
User Login
    ↓
POST /api/auth/login
    ↓
Validate credentials
    ↓
Generate JWT token
    ↓
Return token + user data
    ↓
Client stores token in localStorage
    ↓
Axios interceptor adds Authorization header to all requests
```

### File Upload Flow
```
Student selects file + fills form
    ↓
Frontend validates (type, size)
    ↓
Multer middleware handles file
    ↓
Store file in /uploads/{type}/
    ↓
Save metadata to MongoDB
    ↓
Update student submission count
    ↓
Admin reviews and approves/rejects
    ↓
Update grade count in StudentProfile
```

### Prediction Generation Flow
```
Admin triggers prediction generation
    ↓
Fetch student profile data
    ↓
Calculate 4 component scores:
  - Academic (from grades)
  - Skills (from technicalSkills)
  - Certifications (from approved certs)
  - Soft Skills (from survey responses)
    ↓
Calculate weighted employability score
    ↓
Determine employability level
    ↓
Generate strengths/weaknesses/recommendations
    ↓
Perform GMM clustering
    ↓
Perform ECLAT rule mining
    ↓
Match with jobs
    ↓
Save Prediction document
    ↓
Student views on Results page
```

### Auto-Import Flow
```
Server starts
    ↓
Scan /datasets folder
    ↓
For each CSV file:
  - Parse CSV
  - Determine type (grades, certs, jobs, etc.)
  - Validate each record
  - Preprocess data
  - Save to MongoDB
  - Log results
    ↓
Log import summary
    ↓
Make available to system
```

---

## 🎨 Component Hierarchy

```
App (Router + AuthProvider)
├── Public Routes
│   ├── LandingPage
│   ├── Login (with form components)
│   ├── Register (with form components)
│   └── NotFound
│
└── Protected Routes
    └── DashboardLayout (Navbar + Sidebar + content)
        ├── Admin Routes
        │   ├── AdminDashboard
        │   │   ├── MetricCard (×5)
        │   │   ├── BarChart (Recharts)
        │   │   ├── PieChart (Recharts)
        │   │   └── ActivityLog
        │   ├── AdminStudents (Table + Pagination)
        │   ├── AdminGrades (Table + Filter)
        │   ├── AdminCertifications (Table + Filter)
        │   └── AdminDatasets (Cards)
        │
        └── Student Routes
            ├── StudentDashboard
            │   ├── ProgressRing
            │   ├── StatusCard (×4)
            │   └── QuickActionButtons
            ├── StudentProfile
            │   ├── PersonalInfoSection
            │   ├── AcademicInfoSection
            │   └── CareerInfoSection
            ├── StudentGrades (Form + Upload)
            ├── StudentCertifications (Form + Upload)
            ├── StudentSurveys
            │   ├── SurveyCard (×N)
            │   └── SurveyForm
            ├── StudentResults
            │   ├── ScoreCard
            │   ├── StrengthsList
            │   ├── WeaknessesList
            │   ├── RecommendationsList
            │   └── JobMatchingCards
            └── StudentRecommendations
                ├── SkillGapSection
                └── JobRoleCards
```

---

## 🔐 Authentication & Authorization

### Role-Based Access Pattern
```
frontend/components/App.js:
  ProtectedRoute component checks:
    1. Is user authenticated? (isAuthenticated)
    2. Does user have required role? (isAdmin/isStudent)
    3. If both true, render component
    4. If not, redirect to login or 404

backend/middleware/auth.js:
  protect middleware:
    1. Extract JWT from Authorization header
    2. Verify JWT signature
    3. Attach user to req.user
    4. Call next() or throw 401

  isAdmin/isStudent middleware:
    1. Check req.user.role
    2. If match, call next()
    3. If not, throw 403
```

---

## 📦 Key Dependencies

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT generation & verification
- **bcryptjs**: Password hashing
- **multer**: File upload handling
- **csv-parse**: CSV parsing
- **joi**: Input validation
- **cors**: Cross-origin requests

### Frontend
- **react**: UI library
- **react-router-dom**: Client-side routing
- **axios**: HTTP client
- **tailwindcss**: Utility-first CSS
- **recharts**: React charts
- **sweetalert2**: Elegant alerts
- **react-icons**: Icon library

---

## 🧲 Key File Relationships

### Adding a New Feature

1. **Create MongoDB Model** (`models/NewModel.js`)
2. **Create Controller** (`controllers/newController.js`)
3. **Create Routes** (`routes/newRoutes.js`)
4. **Register Route** (in `index.js`)
5. **Create API Service** (add function to `services/api.js`)
6. **Create Frontend Page** (`pages/NewFeaturePage.js`)
7. **Add Route** (in `App.js`)
8. **Update Sidebar** (add menu item in `Sidebar.js`)

### File Dependency Chain
```
Database Request
    ↓
API Route (routes/*.js)
    ↓
Middleware (middleware/auth.js)
    ↓
Controller (controllers/*.js)
    ↓
Model (models/*.js)
    ↓
Service (services/*.js)
    ↓
Database Query (Mongoose)
```

---

## 🧪 Environment Configuration

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pathtotech
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### Create/Update .env Files
1. Copy `.env.example` to `.env`
2. Fill in configuration values
3. Never commit `.env` to git
4. Use `.env.example` as template for team

---

## 🚀 Build & Deployment Structure

### Development
```
npm run dev          # Start backend dev server
npm start            # Start frontend dev server (CRA)
```

### Production
```
npm run build        # Build React frontend (creates /build)
npm start            # Start Node server
```

### Environment-Specific Configuration
```
Development:  REACT_APP_API_URL=http://localhost:5000
Staging:      REACT_APP_API_URL=https://api.staging.pathtotech.com
Production:   REACT_APP_API_URL=https://api.pathtotech.com
```

---

## 📋 Checklist for New Developers

- [ ] Read README.md for overview
- [ ] Follow SETUP.md to install dependencies
- [ ] Review this PROJECT_STRUCTURE.md for organization
- [ ] Check FEATURES.md to understand functionality
- [ ] Study API_DOCS.md for endpoint details
- [ ] Clone existing feature implementation as reference
- [ ] Set up IDE extensions (REST Client, MongoDB Compass)
- [ ] Configure Git and pre-commit hooks
- [ ] Ask team about coding standards
- [ ] Start with small feature or bug fix

---

## 🔗 Quick Links

**Documentation**
- [Main README](./README.md) - Project overview
- [Setup Guide](./SETUP.md) - Installation & first run
- [Features](./FEATURES.md) - All features documented
- [API Documentation](./API_DOCS.md) - All endpoints explained

**Code Locations**
- Auth Logic: `server/middleware/auth.js`
- Database Models: `server/models/`
- API Handlers: `server/controllers/`
- Frontend State: `client/src/context/AuthContext.js`
- API Calls: `client/src/services/api.js`

**Key Files**
- Server Entry: `server/index.js`
- Frontend Entry: `client/src/App.js`
- Database Config: `server/config/db.js`
- Env Template: `.env.example`

---

**Last Updated**: 2024
**Version**: 1.0.0
**Maintained By**: PathToTech Development Team
