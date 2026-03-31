import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import StudentGrades from './pages/StudentGrades';
import StudentCertifications from './pages/StudentCertifications';
import StudentSurveys from './pages/StudentSurveys';
import StudentResults from './pages/StudentResults';
import StudentRecommendations from './pages/StudentRecommendations';
import AdminStudents from './pages/AdminStudents';
import AdminGrades from './pages/AdminGrades';
import AdminCertifications from './pages/AdminCertifications';
import AdminDatasets from './pages/AdminDatasets';
import AdminSurveys from './pages/AdminSurveys';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const auth = useContext(AuthContext);

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !auth[requiredRole]) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="isAdmin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute requiredRole="isAdmin">
                <AdminStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/grades"
            element={
              <ProtectedRoute requiredRole="isAdmin">
                <AdminGrades />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/certifications"
            element={
              <ProtectedRoute requiredRole="isAdmin">
                <AdminCertifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/datasets"
            element={
              <ProtectedRoute requiredRole="isAdmin">
                <AdminDatasets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/surveys"
            element={
              <ProtectedRoute requiredRole="isAdmin">
                <AdminSurveys />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute requiredRole="isStudent">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute requiredRole="isStudent">
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/grades"
            element={
              <ProtectedRoute requiredRole="isStudent">
                <StudentGrades />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/certifications"
            element={
              <ProtectedRoute requiredRole="isStudent">
                <StudentCertifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/surveys"
            element={
              <ProtectedRoute requiredRole="isStudent">
                <StudentSurveys />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/results"
            element={
              <ProtectedRoute requiredRole="isStudent">
                <StudentResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/recommendations"
            element={
              <ProtectedRoute requiredRole="isStudent">
                <StudentRecommendations />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
