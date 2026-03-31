import axios from 'axios';

const getFallbackApiUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
  }

  return 'https://dcs-pathtotech-2.onrender.com/api';
};

const API_URL = process.env.REACT_APP_API_URL || getFallbackApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  logout: () => api.post('/auth/logout'),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
  getAllDatasets: (params) => api.get('/admin/datasets', { params }),
  getAnalytics: () => api.get('/admin/analytics'),
  getAllStudents: (params) => api.get('/admin/students', { params }),
  getStudentDetails: (studentId) => api.get(`/admin/students/${studentId}`),
  toggleStudentStatus: (studentId, status) => 
    api.patch(`/admin/students/${studentId}/status`, { status }),
};

// Student Profile API
export const studentProfileAPI = {
  getProfile: () => api.get('/student/profile/profile'),
  updateProfile: (data) => api.put('/student/profile/profile', data),
  addTechnicalSkill: (data) => api.post('/student/profile/skills/technical', data),
  addSoftSkill: (data) => api.post('/student/profile/skills/soft', data),
  deleteSkill: (skillId, skillType) => 
    api.delete(`/student/profile/skills/${skillId}/${skillType}`),
};

// Grade API
export const gradeAPI = {
  getAllGrades: (params) => api.get('/grades', { params }),
  uploadGrade: (formData) => api.post('/grades/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  approveGrade: (gradeId) => api.patch(`/grades/${gradeId}/approve`),
  rejectGrade: (gradeId, data) => api.patch(`/grades/${gradeId}/reject`, data),
  deleteGrade: (gradeId) => api.delete(`/grades/${gradeId}`),
};

// Certification API
export const certificationAPI = {
  getAllCertifications: (params) => api.get('/certifications', { params }),
  uploadCertification: (formData) => api.post('/certifications/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  approveCertification: (certId) => api.patch(`/certifications/${certId}/approve`),
  rejectCertification: (certId, data) => api.patch(`/certifications/${certId}/reject`, data),
  deleteCertification: (certId) => api.delete(`/certifications/${certId}`),
};

// Survey API
export const surveyAPI = {
  getAllSurveys: (params) => api.get('/surveys', { params }),
  getSurveyById: (surveyId) => api.get(`/surveys/${surveyId}`),
  createSurvey: (data) => api.post('/surveys', data),
  updateSurvey: (surveyId, data) => api.put(`/surveys/${surveyId}`, data),
  deleteSurvey: (surveyId) => api.delete(`/surveys/${surveyId}`),
  submitSurveyResponse: (surveyId, data) => api.post(`/surveys/${surveyId}/submit`, data),
  getSurveyResponses: (surveyId, params) => 
    api.get(`/surveys/${surveyId}/responses`, { params }),
};

// Prediction API
export const predictionAPI = {
  getAllPredictions: (params) => api.get('/predictions', { params }),
  getPredictionById: (predictionId) => api.get(`/predictions/details/${predictionId}`),
  getStudentPrediction: (studentId) => api.get(`/predictions/student/${studentId}`),
  generatePrediction: (studentId) => api.post(`/predictions/generate/${studentId}`),
};

export default api;
