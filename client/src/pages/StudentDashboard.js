import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Link } from 'react-router-dom';
import { studentProfileAPI } from '../services/api';
import Swal from 'sweetalert2';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await studentProfileAPI.getProfile();
      setProfile(response.data.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load profile',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-500">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  const completionPercentage = profile?.profileCompletionPercentage || 0;

  return (
    <DashboardLayout>
      {/* Page Title */}
      <div className="mb-8">
        <p className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-[0.16em] uppercase bg-[#f3e6dc] text-[#7f1717] mb-3">
          Student Workspace
        </p>
        <h1 className="text-3xl font-extrabold text-gray-800">Welcome to PathToTech</h1>
        <p className="text-gray-600 mt-2">Your Student Employability Hub</p>
      </div>

      {/* Profile Completion Card */}
      <div className="bg-gradient-to-r from-[#5f1010] via-[#7f1717] to-[#a13b25] rounded-2xl shadow-premium p-8 text-white mb-8 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-extrabold mb-4">Profile Completion</h2>
            <p className="text-white/80 text-sm">
              Complete your profile to unlock full system features and get personalized recommendations.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeDasharray={`${377 * (completionPercentage / 100)} 377`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold">{completionPercentage}%</p>
                  <p className="text-sm">Complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Grades',
            count: profile?.totalGradesUploaded || 0,
            icon: FaCheckCircle,
            color: 'bg-blue-100 text-blue-600',
            status: profile?.totalGradesUploaded > 0 ? 'Uploaded' : 'Pending',
          },
          {
            title: 'Certifications',
            count: profile?.totalCertificationsUploaded || 0,
            icon: FaCheckCircle,
            color: 'bg-green-100 text-green-600',
            status: profile?.totalCertificationsUploaded > 0 ? 'Uploaded' : 'Pending',
          },
          {
            title: 'Surveys',
            count: profile?.totalSurveysCompleted || 0,
            icon: FaSpinner,
            color: 'bg-yellow-100 text-yellow-600',
            status: profile?.totalSurveysCompleted > 0 ? 'Completed' : 'Pending',
          },
          {
            title: 'Profile',
            count: completionPercentage,
            icon: FaCheckCircle,
            color: 'bg-maroon opacity-20 text-maroon',
            status: completionPercentage >= 80 ? 'Complete' : 'Incomplete',
          },
        ].map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-elegant p-6 hover:shadow-premium transition-smooth"
          >
            <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center mb-4`}>
              <card.icon size={24} />
            </div>
            <p className="text-gray-600 text-sm font-medium">{card.title}</p>
            <p className="text-3xl font-extrabold text-gray-800 mt-2">{card.count}</p>
            <p className="text-xs text-gray-500 mt-2">{card.status}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-elegant p-6">
        <h3 className="text-lg font-extrabold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Complete Profile', link: '/student/profile' },
            { label: 'Upload Grades', link: '/student/grades' },
            { label: 'Add Certifications', link: '/student/certifications' },
            { label: 'Take Surveys', link: '/student/surveys' },
            { label: 'View Results', link: '/student/results' },
            { label: 'Get Recommendations', link: '/student/recommendations' },
          ].map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="px-6 py-3 bg-maroon text-white rounded-xl font-semibold hover:bg-maroon-dark transition-smooth text-center shadow-elegant"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
