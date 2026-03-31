# PathToTech API Documentation

Complete reference for all RESTful API endpoints available in the PathToTech backend.

---

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

## Response Format
All endpoints return JSON responses in the following format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

---

## 🔐 Authentication Endpoints

### Register User
Create a new user account for a student.

**Endpoint:** `POST /auth/register`
**Access:** Public

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "student",
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

**Error Responses:**
- `400` - Email already exists or validation failed
- `500` - Server error

---

### Login User
Authenticate and receive JWT token.

**Endpoint:** `POST /auth/login`
**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "student",
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Error Responses:**
- `400` - Invalid email or password
- `401` - Account suspended or inactive

---

### Get Current User
Fetch authenticated user's information.

**Endpoint:** `GET /auth/me`
**Access:** Protected (any role)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "profile": { ... } // StudentProfile if student
  }
}
```

---

### Update Profile
Update user's first name and last name.

**Endpoint:** `PUT /auth/profile`
**Access:** Protected (any role)

**Request Body:**
```json
{
  "firstName": "Jonathan",
  "lastName": "Smith",
  "profilePicture": "base64_image_string" // optional
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

---

### Change Password
Update user's password.

**Endpoint:** `POST /auth/change-password`
**Access:** Protected (any role)

**Request Body:**
```json
{
  "oldPassword": "currentPassword123",
  "newPassword": "newPassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 👨‍💼 Admin Endpoints

### Get Dashboard Statistics
Comprehensive statistics for admin dashboard.

**Endpoint:** `GET /admin/dashboard-stats`
**Access:** Protected (admin only)

**Query Parameters:** None

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalStudents": 150,
    "totalGrades": 245,
    "totalCertifications": 128,
    "totalSurveys": 5,
    "totalDatasets": 3,
    "gradeStatus": {
      "pending": 12,
      "approved": 200,
      "rejected": 33
    },
    "employabilityLevels": {
      "excellent": 25,
      "very_good": 45,
      "good": 55,
      "average": 20,
      "needs_improvement": 5
    },
    "profileCompletion": {
      "avgCompletion": 75,
      "completeProfiles": 120,
      "incompleteProfiles": 30
    },
    "recentActivity": [
      {
        "_id": "...",
        "adminId": { "firstName": "Admin", "email": "..." },
        "action": "grade_approved",
        "description": "Approved grade for John Doe",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

### Get All Students
Paginated list of all students with filters.

**Endpoint:** `GET /admin/students`
**Access:** Protected (admin only)

**Query Parameters:**
- `page` (number, default: 1) - Page number for pagination
- `limit` (number, default: 10) - Items per page
- `search` (string, optional) - Search by name or email
- `course` (string, optional) - Filter by course
- `section` (string, optional) - Filter by section
- `status` (string, optional) - Filter by account status

**Example:**
```
GET /admin/students?page=1&limit=10&course=BCS&status=active
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "status": "active",
        "profile": {
          "profileCompletionPercentage": 75,
          "totalGradesUploaded": 5,
          "totalCertificationsUploaded": 2,
          "totalSurveysCompleted": 1
        },
        "gradesCount": 5,
        "certificationsCount": 2
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "pages": 15
    }
  }
}
```

---

### Get Student Details
Detailed information about a specific student.

**Endpoint:** `GET /admin/students/:studentId`
**Access:** Protected (admin only)

**URL Parameters:**
- `studentId` (string) - Student's MongoDB ObjectId

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "profile": { ... },
    "grades": [ ... ],
    "certifications": [ ... ],
    "surveys": [ ... ],
    "latestPrediction": { ... }
  }
}
```

---

### Toggle Student Status
Activate or deactivate a student account.

**Endpoint:** `PATCH /admin/students/:studentId/status`
**Access:** Protected (admin only)

**Request Body:**
```json
{
  "status": "inactive"
}
```

**Valid Status Values:** `active`, `inactive`, `suspended`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "status": "inactive"
    }
  }
}
```

---

## 👤 Student Profile Endpoints

### Get Student Profile
Retrieve authenticated student's profile.

**Endpoint:** `GET /student-profile/profile`
**Access:** Protected (student only)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "2000-01-15",
    "gender": "M",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "country": "USA",
    "enrollmentNumber": "2020-BCS-001",
    "course": "Bachelor of Computer Science",
    "specialization": "Artificial Intelligence",
    "academicYear": 3,
    "semester": 5,
    "section": "A",
    "currentCGPA": 3.7,
    "careerInterests": ["Software Engineer", "Data Scientist"],
    "preferredJobTitles": ["ML Engineer", "Backend Developer"],
    "about": "Passionate about AI and ML...",
    "technicalSkills": [
      {
        "_id": "60d5ec49c1234567890ab123",
        "skillName": "Python",
        "proficiencyLevel": "expert",
        "yearsOfExperience": 3,
        "endorsements": 15
      }
    ],
    "softSkills": ["Communication", "Leadership", "Problem Solving"],
    "profileCompletionPercentage": 85,
    "totalGradesUploaded": 5,
    "totalCertificationsUploaded": 2,
    "totalSurveysCompleted": 1
  }
}
```

---

### Update Student Profile
Partial or complete update of student profile.

**Endpoint:** `PUT /student-profile/profile`
**Access:** Protected (student only)

**Request Body:** (All fields optional)
```json
{
  "firstName": "Jonathan",
  "lastName": "Smith",
  "dateOfBirth": "2000-01-15",
  "phone": "+1234567890",
  "address": "456 Oak Ave",
  "city": "Los Angeles",
  "country": "USA",
  "course": "Bachelor of Computer Science",
  "specialization": "Artificial Intelligence",
  "currentCGPA": 3.8,
  "careerInterests": ["ML Engineer", "Data Scientist", "AI Researcher"],
  "preferredJobTitles": ["Senior ML Engineer"],
  "about": "Updated bio..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "profile": { ... }
  }
}
```

---

### Add Technical Skill
Add a new technical skill to student profile.

**Endpoint:** `POST /student-profile/skills/technical`
**Access:** Protected (student only)

**Request Body:**
```json
{
  "skillName": "Machine Learning",
  "proficiencyLevel": "advanced",
  "yearsOfExperience": 2
}
```

**Proficiency Levels:** `beginner`, `intermediate`, `advanced`, `expert`

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49c1234567890ab124",
    "skillName": "Machine Learning",
    "proficiencyLevel": "advanced",
    "yearsOfExperience": 2,
    "endorsements": 0
  }
}
```

---

### Add Soft Skill
Add a soft skill to student profile.

**Endpoint:** `POST /student-profile/skills/soft`
**Access:** Protected (student only)

**Request Body:**
```json
{
  "skillName": "Team Leadership"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49c1234567890ab125",
    "skillName": "Team Leadership"
  }
}
```

---

### Delete Skill
Remove a skill from student profile.

**Endpoint:** `DELETE /student-profile/skills/:skillId/:skillType`
**Access:** Protected (student only)

**URL Parameters:**
- `skillId` (string) - Skill's ObjectId
- `skillType` (string) - Either `technical` or `soft`

**Response (200):**
```json
{
  "success": true,
  "message": "Skill deleted successfully"
}
```

---

## 📄 Grade Endpoints

### Upload Grade
Submit a new grade document.

**Endpoint:** `POST /grades/upload`
**Access:** Protected (student)

**Request Body (Multipart/Form-Data):**
- `file` (file, required) - PDF or image file (max 10MB)
- `subjectName` (string, required) - Subject name
- `grade` (string, required) - Letter grade (A+, A, B+, etc.)
- `marks` (number, required) - Numeric marks
- `outOfMarks` (number, required) - Total marks (default: 100)
- `semester` (string, optional) - Semester information

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "studentId": "507f1f77bcf86cd799439012",
    "subjectName": "Data Structures",
    "grade": "A",
    "marks": 92,
    "outOfMarks": 100,
    "percentage": 92,
    "status": "pending",
    "filePath": "/uploads/grades/1234567890.pdf",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

---

### Get All Grades (Admin)
List all submitted grades with filtering.

**Endpoint:** `GET /grades`
**Access:** Protected (admin only)

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `status` (string) - Filter by status (pending, approved, rejected)
- `studentId` (string) - Filter by student

**Response (200):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "_id": "507f1f77bcf86cd799439020",
        "userId": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "subjectName": "Data Structures",
        "grade": "A",
        "marks": 92,
        "percentage": 92,
        "status": "pending",
        "filePath": "/uploads/grades/1234567890.pdf",
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### Approve Grade
Approve a pending grade submission.

**Endpoint:** `PATCH /grades/:gradeId/approve`
**Access:** Protected (admin only)

**URL Parameters:**
- `gradeId` (string) - Grade's ObjectId

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "status": "approved",
    "approvedBy": "admin@pathtotech.local",
    "approvalDate": "2024-01-15T11:00:00Z"
  }
}
```

---

### Reject Grade
Reject a grade with a reason.

**Endpoint:** `PATCH /grades/:gradeId/reject`
**Access:** Protected (admin only)

**Request Body:**
```json
{
  "rejectionReason": "Grade document is illegible"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "status": "rejected",
    "rejectionReason": "Grade document is illegible"
  }
}
```

---

### Delete Grade
Remove a grade record.

**Endpoint:** `DELETE /grades/:gradeId`
**Access:** Protected (student owns record or admin)

**Response (200):**
```json
{
  "success": true,
  "message": "Grade deleted successfully"
}
```

---

## 🎓 Certification Endpoints

### Upload Certification
Submit a new certification.

**Endpoint:** `POST /certifications/upload`
**Access:** Protected (student)

**Request Body (Multipart/Form-Data):**
- `file` (file, required) - PDF or image file (max 10MB)
- `title` (string, required) - Certification title (e.g., AWS Solutions Architect)
- `issuer` (string, required) - Issuing organization
- `dateEarned` (date, required) - Date the certification was earned (YYYY-MM-DD)
- `category` (string, optional) - One of: technical, professional, language, other

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439030",
    "studentId": "507f1f77bcf86cd799439012",
    "title": "AWS Solutions Architect Associate",
    "issuer": "Amazon Web Services",
    "dateEarned": "2023-06-15",
    "category": "technical",
    "status": "pending",
    "filePath": "/uploads/certifications/1234567890.pdf",
    "isExpired": false,
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

---

### Get All Certifications (Admin)
List all certifications with filtering.

**Endpoint:** `GET /certifications`
**Access:** Protected (admin only)

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `status` (string) - Filter by status
- `category` (string) - Filter by category
- `studentId` (string) - Filter by student

**Response (200):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "_id": "507f1f77bcf86cd799439030",
        "userId": { ... },
        "title": "AWS Solutions Architect Associate",
        "issuer": "Amazon Web Services",
        "dateEarned": "2023-06-15",
        "category": "technical",
        "status": "pending",
        "isExpired": false
      }
    ],
    "pagination": { ... }
  }
}
```

---

### Approve Certification
Approve a certification.

**Endpoint:** `PATCH /certifications/:certId/approve`
**Access:** Protected (admin only)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "approved",
    "approvedBy": "admin@pathtotech.local"
  }
}
```

---

### Reject Certification
Reject a certification with reason.

**Endpoint:** `PATCH /certifications/:certId/reject`
**Access:** Protected (admin only)

**Request Body:**
```json
{
  "rejectionReason": "Certificate appears to be expired"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "rejected",
    "rejectionReason": "Certificate appears to be expired"
  }
}
```

---

## 📋 Survey Endpoints

### Get All Surveys
List all public surveys.

**Endpoint:** `GET /surveys`
**Access:** Public

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `isActive` (boolean) - Filter by active status

**Response (200):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "_id": "507f1f77bcf86cd799439040",
        "title": "Soft Skills Assessment",
        "description": "Evaluate your soft skills",
        "questions": [
          {
            "_id": "...",
            "questionNumber": 1,
            "text": "How would you rate your communication?",
            "type": "likert",
            "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
            "isRequired": true
          }
        ],
        "totalResponses": 85,
        "isActive": true
      }
    ]
  }
}
```

---

### Get Survey by ID
Retrieve a specific survey.

**Endpoint:** `GET /surveys/:surveyId`
**Access:** Public

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439040",
    "title": "Soft Skills Assessment",
    "description": "...",
    "questions": [ ... ],
    "createdBy": {
      "firstName": "Admin",
      "email": "admin@pathtotech.local"
    },
    "totalResponses": 85
  }
}
```

---

### Create Survey (Admin)
Create a new survey.

**Endpoint:** `POST /surveys`
**Access:** Protected (admin only)

**Request Body:**
```json
{
  "title": "Technical Skills Survey",
  "description": "Rate your technical proficiency",
  "surveyType": "employability_assessment",
  "questions": [
    {
      "questionNumber": 1,
      "text": "Rate your Python knowledge",
      "type": "likert",
      "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      "isRequired": true
    },
    {
      "questionNumber": 2,
      "text": "Years of programming experience?",
      "type": "multiple_choice",
      "options": ["0-1", "1-3", "3-5", "5+"],
      "isRequired": true
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439050",
    "title": "Technical Skills Survey",
    "questions": [ ... ],
    "isActive": true,
    "createdBy": "507f1f77bcf86cd799439001"
  }
}
```

---

### Submit Survey Response
Submit answers to a survey.

**Endpoint:** `POST /surveys/:surveyId/submit`
**Access:** Protected (student only)

**Request Body:**
```json
{
  "responses": [
    {
      "questionId": "60d5ec49c1234567890ab100",
      "questionText": "Rate your Python knowledge",
      "response": "Strongly Agree",
      "responseType": "likert"
    },
    {
      "questionId": "60d5ec49c1234567890ab101",
      "questionText": "Years of experience?",
      "response": "3-5",
      "responseType": "multiple_choice"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439060",
    "surveyId": "507f1f77bcf86cd799439050",
    "studentId": "507f1f77bcf86cd799439012",
    "responses": [ ... ],
    "completedAt": "2024-01-15T12:00:00Z"
  }
}
```

---

### Get Survey Responses (Admin)
Retrieve all responses for a survey.

**Endpoint:** `GET /surveys/:surveyId/responses`
**Access:** Protected (admin only)

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "_id": "507f1f77bcf86cd799439060",
        "studentId": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "responses": [ ... ],
        "completedAt": "2024-01-15T12:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

## 🎯 Prediction Endpoints

### Generate Employability Prediction
Calculate employability prediction for a student.

**Endpoint:** `POST /predictions/generate/:studentId`
**Access:** Protected (admin only)

**URL Parameters:**
- `studentId` (string) - Student's ObjectId

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439070",
    "studentId": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "employabilityScore": 78,
    "employabilityLevel": "very_good",
    "academicScore": 0.85,
    "skillsScore": 0.72,
    "certificationScore": 0.60,
    "softSkillsScore": 0.81,
    "strengths": [
      "Strong academic performance",
      "Good communication skills",
      "Technical foundation"
    ],
    "weaknesses": [
      "Limited industry experience",
      "Few certifications",
      "Needs advanced technical skills"
    ],
    "recommendations": [
      "Pursue cloud certifications (AWS, Azure, GCP)",
      "Develop specialization in AI/ML",
      "Gain real-world project experience"
    ],
    "skillGaps": [
      {
        "skillName": "Cloud Computing",
        "description": "Understanding of cloud platforms",
        "importance": "high",
        "suggestedCertifications": ["AWS Solutions Architect", "Azure Fundamentals"]
      }
    ],
    "suggestedJobRoles": [
      {
        "jobTitle": "Junior Software Developer",
        "company": "Tech Corp",
        "matchScore": 85,
        "skillGaps": ["Microservices", "Docker"],
        "matchedSkills": ["Python", "JavaScript", "REST APIs"]
      }
    ],
    "generatedAt": "2024-01-15T13:00:00Z"
  }
}
```

---

### Get Student Prediction
Retrieve latest prediction for authenticated student.

**Endpoint:** `GET /predictions/student/:studentId`
**Access:** Protected (student viewing self or admin)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "prediction": { ... }
  }
}
```

---

### Get All Predictions (Admin)
List all student predictions with filtering.

**Endpoint:** `GET /predictions`
**Access:** Protected (admin only)

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `employabilityLevel` (string) - Filter by level (excellent, very_good, good, average, needs_improvement)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "_id": "507f1f77bcf86cd799439070",
        "studentId": "507f1f77bcf86cd799439012",
        "userId": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "employabilityScore": 78,
        "employabilityLevel": "very_good",
        "generatedAt": "2024-01-15T13:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Server Error - Internal error |

### Error Response Examples

**400 - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

**401 - Unauthorized:**
```json
{
  "success": false,
  "message": "No authentication token. Access denied."
}
```

**403 - Forbidden:**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user
- File upload limits (10MB per file, 100MB per day per user)

---

## Best Practices

### 1. Authentication
Always include the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### 2. Pagination
Use pagination for large datasets:
```
GET /admin/students?page=1&limit=25
```

### 3. Error Handling
Always check `success` field and handle errors:
```javascript
if (response.data.success) {
  // Use response.data.data
} else {
  // Handle error with response.data.message
}
```

### 4. File Uploads
For file uploads, use FormData:
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('subjectName', 'Data Structures');
axios.post('/grades/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

---

## Testing with Postman

1. Import the base URL: `http://localhost:5000/api`
2. Create a collection for each endpoint group
3. Use environment variables for token and studentId
4. Test authentication first, save token
5. Use saved token in subsequent requests

### Sample Postman Variables
```
{{BASE_URL}} = http://localhost:5000/api
{{TOKEN}} = <JWT token from login>
{{STUDENT_ID}} = <ObjectId from user>
{{ADMIN_ID}} = <ObjectId from admin>
```

---

**Last Updated**: 2024
**Version**: 1.0.0
**API Status**: Stable
