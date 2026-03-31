# PathToTech Features Overview

## 🎯 System Architecture

PathToTech is a comprehensive Student Employability Prediction System built with the MERN stack (MongoDB, Express, React, Node.js) featuring dual-role authentication, predictive analytics, and career pathway recommendations.

---

## 👨‍💼 Admin Features

### 1. **Dashboard Analytics**
- **5 Key Metrics**: View total students, grades uploaded, certifications, surveys completed, and datasets loaded
- **Real-time Statistics**: Grade status distribution, employability level breakdown, profile completion tracking
- **Activity Timeline**: Last 10 admin actions with audit logs showing who changed what and when
- **Data Visualization**: Interactive bar charts (grade status) and pie charts (employability levels)

### 2. **Students Management**
- **Student List**: Paginated view with search filters (name, email, course, section, status)
- **Profile View**: See individual student details including personal, academic, and career information
- **Status Control**: Activate/deactivate student accounts with confirmation dialogs
- **Progress Tracking**: View profile completion percentage and submission counts for each student

### 3. **Grades Approval Workflow**
- **Pending Reviews**: Filter and view all grades awaiting approval
- **Document Verification**: Review submitted grade documents before approval
- **Batch Processing**: Approve or reject multiple grades with audit trail
- **Rejection Handling**: Provide feedback with custom rejection reasons

### 4. **Certifications Approval Workflow**
- **Certification Management**: Review professional certifications submitted by students
- **Expiry Tracking**: Track certification expiration dates automatically
- **Category Organization**: Filter by technical, professional, language, or other categories
- **Verification Trail**: Complete audit history of all certification approvals

### 5. **Dataset Management**
- **Auto-Import Monitoring**: View statistics of datasets imported from /datasets folder
- **Data Quality Metrics**: Success rates, valid/invalid row counts, error logs
- **Import History**: Track when datasets were imported and by whom
- **Download & Archive**: Download imported datasets for backup or analysis

### 6. **Prediction Insights**
- **Aggregate Analytics**: View employability predictions across all students
- **Performance Benchmarks**: Compare student clusters (high, good, developing, needs enhancement)
- **Skill Gap Analysis**: Identify common skill gaps across the student cohort
- **Recommendations Export**: Generate recommendations reports for intervention

---

## 🎓 Student Features

### 1. **Dashboard**
- **Progress Ring**: Visual circular gauge showing profile completion percentage (0-100%)
- **4 Status Cards**: Grades uploaded, certifications, surveys completed, profile completion
- **Quick Actions**: Fast links to grades, certs, surveys, results, and recommendations pages

### 2. **Profile Management**
- **Basic Information**: First name, last name, date of birth, phone, address, city, country
- **Academic Details**: Enrollment number, course, specialization, academic year, semester, current CGPA
- **Career Information**: Career interests, preferred job titles, personal bio
- **Skills Section**: Add technical skills (with proficiency levels and years of experience) and soft skills
- **Progress Tracking**: Real-time completion percentage calculation

### 3. **Grade Upload & Tracking**
- **File Upload**: Submit grade documents as PDF or images (max 10MB)
- **Document Details**: Subject name, grade letter, marks, semester information
- **Status Tracking**: See approval status (pending, approved, rejected)
- **History View**: All submitted grades with verification status
- **Rejection Feedback**: Understand why grades were rejected and resubmit

### 4. **Certification Management**
- **Certificate Upload**: Submit professional certifications (AWS, Google Cloud, Microsoft, etc.)
- **Credential Details**: Title, issuing organization, date earned, category, expiry date
- **Verification Status**: Track approval and validity periods
- **Impact Analysis**: See how certifications boost employability score

### 5. **Survey Participation**
- **Available Surveys**: Browse all active surveys tailored to employability assessment
- **Multiple Question Types**: Multiple choice, text response, Likert scale (1-5), and star ratings
- **Form Validation**: Ensure all required fields are completed before submission
- **Response History**: View which surveys have been completed

### 6. **Employability Results**
- **Overall Score**: Comprehensive employability score (0-100%)
- **Component Breakdown**: Academic (30%), Skills (25%), Certifications (20%), Soft Skills (25%)
- **Employability Level**: Classification (Excellent, Very Good, Good, Average, Needs Improvement)
- **Strengths Analysis**: AI-generated list of key strengths
- **Areas for Improvement**: Specific weaknesses and development areas
- **Actionable Recommendations**: Personalized guidance based on profile gaps

### 7. **Career Recommendations**
- **Job Role Matching**: AI-matched job positions based on skills and employability level
- **Match Scores**: Percentage match showing how well profile fits each role
- **Skill Gap Identification**: List of missing skills required for each position
- **Certification Guidance**: Recommended certifications to bridge skill gaps
- **Career Pathways**: See progression from current level to advanced roles

### 8. **Skill Gap Analysis**
- **Missing Skills**: List of skills needed for target positions ranked by importance
- **Learning Resources**: Suggested certifications to fill identified gaps
- **Priority Ranking**: High/medium/low importance indicators
- **Time Estimates**: Suggested timeframes for skill acquisition
- **Success Metrics**: Track skill acquisition progress

---

## 🔐 Authentication & Authorization

### User Roles
- **Admin**: Full system access, user management, verification workflows, report generation
- **Student**: Personal profile management, submission of documents, view predictions, career guidance

### Security Features
- **JWT Authentication**: 7-day token expiration with secure refresh mechanism
- **Role-Based Access Control**: Protected routes enforcing admin/student separation
- **Password Hashing**: bcryptjs with 10 salt rounds for cryptographic security
- **Session Management**: Token stored in localStorage with automatic logout on expiration
- **Email Verification**: Field available for future email-based two-factor authentication

---

## 📊 Data Analytics & Predictions

### Employability Prediction Algorithm
The system calculates employability through a weighted multi-component model:

**Component Scoring:**
- **Academic Score** (Max 100): Converts grades to GPA scale (A+ = 4.0, A = 3.9, down to F = 0)
- **Skills Score** (Max 100): Averages technical skill proficiency levels (Expert=100, Advanced=75, Intermediate=50, Beginner=25)
- **Certification Score** (Max 100): Awards 15% per approved certification (capped at 100%)
- **Soft Skills Score** (Max 100): Aggregates survey responses measuring communication, teamwork, leadership

**Final Calculation:**
```
Employability Score = (Academic × 0.30) + (Skills × 0.25) + (Certifications × 0.20) + (Soft Skills × 0.25)
```

**Level Classification:**
- 90-100: **Excellent** - Ready for senior roles or specialized positions
- 75-89: **Very Good** - Well-qualified for most positions
- 60-74: **Good** - Suitable for entry-level positions
- 45-59: **Average** - Needs skill development
- 0-44: **Needs Improvement** - Requires significant skill acquisition

### Clustering Analysis (GMM)
- **4-Tier Clustering**: Automatically groups students into clusters based on scores
- **Comparative Insights**: See how you compare to peers in similar specializations
- **Peer Benchmarking**: Identify high performers and learning strategies

### Association Rule Mining (ECLAT)
- **Pattern Discovery**: Identifies skill-certification-job combinations that lead to employment
- **Confidence Scoring**: Shows likelihood that acquiring certain skills leads to specific roles
- **Support Metrics**: Indicates how common each pattern is in successful profiles

---

## 📁 Data Management

### Automatic CSV Import System
The backend automatically scans and imports CSV files on server startup:

**Supported Dataset Types:**
- **Grades**: Subject code, subject name, grade, marks, student email
- **Certifications**: Title, issuer, date earned, student email
- **Surveys**: Survey definitions with questions and response options
- **Jobs**: Job titles, required skills, required certifications, salary ranges
- **Skills**: Technical skills, proficiency levels, industry categories

**Import Features:**
- **Validation**: Checks for required fields and data type correctness
- **Error Logging**: Records invalid rows with specific error messages
- **Preprocessing**: Trims whitespace, converts numeric types, normalizes dates
- **Success Tracking**: Maintains count of valid/invalid imports

**File Location:** `/datasets` folder in project root
**Supported Format:** CSV with headers in first row
**Scheduling:** Automatic on server startup; can be triggered via API

---

## 🎨 UI/UX Highlights

### Design System
- **Color Theme**: Maroon (#800000) primary with light (#991a1a) and dark (#660000) variants
- **Typography**: Bold sans-serif headers for hierarchy, readable body text
- **Responsive Design**: Mobile-first Tailwind CSS with breakpoints:
  - Mobile: < 640px (single column)
  - Tablet: 640-1024px (2 columns)
  - Desktop: > 1024px (3+ columns)

### Interactive Components
- **SweetAlert2 Notifications**: Elegant alerts for success, error, warning, info
- **Form Validation**: Real-time feedback on input errors before submission
- **Loading States**: Spinners and disabled buttons during API calls
- **Progress Indicators**: Visual feedback for file uploads and form completion
- **Charts & Graphs**: Recharts for data visualization (bar, pie, line charts)

### Accessibility Features
- **Semantic HTML**: Proper heading hierarchy and form labels
- **Color Contrast**: WCAG AA compliant text-to-background ratios
- **Icon + Text Labels**: Every icon has accompanying text
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Focus States**: Clear visual indicators for focused elements

---

## 🔧 Backend Services

### Authentication Service (authController)
- User registration with email uniqueness validation
- Secure login with password comparison and status checking
- Token generation with role claims
- Profile updates with picture support
- Password change with old password verification

### Student Profile Service (studentProfileController)
- Multi-section profile management (basic, academic, career)
- Dynamic skill addition and removal
- Automatic completion percentage calculation
- Nested data handling (skills arrays, preferences)

### Grade Processing Service (gradeController)
- Multer file upload with MIME type validation
- Grade metadata collection and storage
- Approval workflow with audit trailing
- Rejection with detailed feedback
- Student submission tracking

### Certification Service (certificationController)
- Similar to grades with certificate-specific fields
- Expiration date tracking and validation
- Category organization
- Credential URL storage for online verification

### Survey Service (surveyController)
- CRUD operations for survey definitions
- Flexible question types (multiple choice, text, rating, Likert)
- Response collection with type conversion
- Pagination and filtering

### Prediction Service (predictionService)
- **Score Calculation**: All 4 component scoring algorithms
- **Level Determination**: Score-to-level mapping
- **Text Generation**: AI-like rules for strengths, weaknesses, recommendations
- **Job Matching**: Algorithm comparing student skills to job requirements
- **Skill Gap Analysis**: Identifies missing skills and suggests certifications

### Dataset Service (datasetService)
- CSV file discovery and reading
- Type detection and record validation
- Bulk data preprocessing and import
- Error aggregation and reporting

---

## 📈 Admin Reporting

### Available Reports
- **Student Summary**: Total students, active accounts, profile completion stats
- **Submission Status**: Pending/approved/rejected counts for documents
- **Employability Distribution**: Number of students in each level bracket
- **Skill Gaps**: Most common missing skills across cohort
- **Certification Trends**: Most acquired certifications and their impact

### Export Capabilities
- **Data Export**: Download datasets in CSV format for external analysis
- **Audit Logs**: Export admin actions with timestamps and user info
- **Predictions**: Export all student predictions with scores and recommendations

---

## 🚀 Performance & Scalability

### Optimization Features
- **Database Indexing**: Indexed fields on userId, studentId, email for fast queries
- **Pagination**: All list endpoints support pagination (default: 10 items/page)
- **Aggregation Pipelines**: MongoDB aggregations for dashboard statistics
- **Caching**: LocalStorage for auth tokens and user preferences
- **Lazy Loading**: Components load data on demand, not on mount

### Scalability Considerations
- **Stateless Architecture**: JWT allows horizontal scaling
- **NoSQL Benefits**: MongoDB handles flexible data structures as system grows
- **Service Separation**: Independent services for auth, predictions, datasets
- **API Design**: RESTful endpoints support future microservices migration

---

## 🔒 Security Features

### Data Protection
- **Password Hashing**: bcryptjs prevents plaintext storage
- **Input Validation**: Joi schemas validate all request bodies
- **SQL Injection Prevention**: MongoDB prevents injection attacks
- **CORS Configuration**: Restricts cross-origin requests to trusted domains
- **File Upload Security**: Whitelist MIME types, size limits, virus scanning ready

### Audit Trail
- **Action Logging**: Every admin action recorded in AuditLog
- **Change Tracking**: Before/after values stored for modifications
- **User Attribution**: IP address and user agent captured
- **Timestamp Precision**: All logs timestamped in UTC

### Session Management
- **Token Expiration**: 7-day validity prevents indefinite access
- **Automatic Logout**: Expired token triggers redirect to login
- **Secure Headers**: Authorization header format "Bearer {token}"

---

## 📱 Responsive Breakpoints

### Mobile (< 640px)
- Single column layouts
- Hamburger menu for navigation
- Touch-friendly button sizes (min 44x44px)

### Tablet (640-1024px)
- Two column grids
- Sidebar visible but collapsed
- Readable font sizes (16px+)

### Desktop (> 1024px)
- Multi-column grids
- Full sidebar navigation
- Advanced filtering and sorting

---

## ⚡ API Endpoints Summary

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user info
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Admin
- `GET /api/admin/dashboard-stats` - Dashboard metrics
- `GET /api/admin/students` - Paginated student list
- `GET /api/admin/students/:id` - Student details
- `PATCH /api/admin/students/:id/status` - Toggle student status

### Student Profile
- `GET /api/student-profile/profile` - Get profile
- `PUT /api/student-profile/profile` - Update profile
- `POST /api/student-profile/skills/technical` - Add technical skill
- `POST /api/student-profile/skills/soft` - Add soft skill
- `DELETE /api/student-profile/skills/:id/:type` - Delete skill

### Grades
- `POST /api/grades/upload` - Upload grade
- `GET /api/grades` - List grades (admin)
- `PATCH /api/grades/:id/approve` - Approve grade
- `PATCH /api/grades/:id/reject` - Reject grade
- `DELETE /api/grades/:id` - Delete grade

### Certifications
- `POST /api/certifications/upload` - Upload certification
- `GET /api/certifications` - List certifications (admin)
- `PATCH /api/certifications/:id/approve` - Approve certification
- `PATCH /api/certifications/:id/reject` - Reject certification
- `DELETE /api/certifications/:id` - Delete certification

### Surveys
- `GET /api/surveys` - List surveys (public)
- `GET /api/surveys/:id` - Get survey details (public)
- `POST /api/surveys` - Create survey (admin)
- `PUT /api/surveys/:id` - Update survey (admin)
- `DELETE /api/surveys/:id` - Delete survey (admin)
- `POST /api/surveys/:id/submit` - Submit response (student)
- `GET /api/surveys/:id/responses` - Get responses (admin)

### Predictions
- `GET /api/predictions` - List all (admin)
- `GET /api/predictions/details/:id` - Get prediction (admin)
- `GET /api/predictions/student/:id` - Get student's latest (student)
- `POST /api/predictions/generate/:id` - Generate prediction (admin)

---

## 🛠️ Technology Stack

### Frontend
- React 18.2 with Hooks
- React Router 6 for SPA navigation
- Tailwind CSS 3.2 for styling
- Axios for HTTP requests
- Recharts for visualizations
- SweetAlert2 for notifications
- React Icons for iconography

### Backend
- Node.js with Express 4.18
- MongoDB with Mongoose 7.0 ODM
- JWT for stateless authentication
- bcryptjs for password hashing
- Multer for file uploads
- csv-parse for CSV processing
- Joi for input validation
- CORS for cross-origin requests

### Infrastructure
- MongoDB Atlas or local MongoDB instance
- Node.js 16+ runtime
- npm or yarn package manager
- Postman for API testing (optional)

---

## 📚 Documentation Files

- **README.md** - Project overview and quick start
- **SETUP.md** - Detailed setup instructions
- **.env.example** - Environment configuration guide
- **FEATURES.md** - This file, detailed feature documentation
- **API_DOCS.md** - Complete API endpoint documentation

---

## 🚀 Future Enhancements

### Planned Features
- Real machine learning models (TensorFlow.js for GMM/ECLAT)
- Email notifications integration with SMTP
- LinkedIn API integration for social data
- Interview preparation module
- Mobile native app with React Native
- Video interview analysis with emotion detection
- Real-time chat with mentors
- Peer comparison and benchmarking

### Roadmap
- **Q1**: Email notifications, real ML models
- **Q2**: LinkedIn integration, interview prep module
- **Q3**: Mobile app beta, video analysis
- **Q4**: Chat feature, advanced analytics

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue**: "Cannot find module" errors
**Solution**: Run `npm install` in both `/server` and `/client` directories

**Issue**: MongoDB connection refused
**Solution**: Ensure MongoDB is running locally or update MONGODB_URI in .env file

**Issue**: CORS errors
**Solution**: Check REACT_APP_API_URL in frontend .env matches backend URL

**Issue**: File upload not working
**Solution**: Ensure /uploads directory exists and has write permissions

### Debug Mode
Set `DEBUG=*` environment variable to see detailed logs:
```bash
DEBUG=* npm run dev
```

---

**Last Updated**: 2024
**Version**: 1.0.0
**Author**: PathToTech Development Team
