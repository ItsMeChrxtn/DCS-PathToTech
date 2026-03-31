import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { predictionAPI } from '../services/api';
import Swal from 'sweetalert2';
import { FaCheckCircle, FaClock, FaChartLine } from 'react-icons/fa';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from 'recharts';

const StudentResults = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrediction();
  }, []);

  const fetchPrediction = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await predictionAPI.getStudentPrediction(user._id);
      setPrediction(response.data.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load results',
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

  if (!prediction) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Employability Results</h1>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
          <FaClock className="text-4xl text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800">No Prediction Yet</h3>
          <p className="text-gray-600 mt-2">
            Complete your profile and upload required documents to generate an employability prediction.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const levelColors = {
    excellent: 'text-green-600 bg-green-100',
    very_good: 'text-blue-600 bg-blue-100',
    good: 'text-yellow-600 bg-yellow-100',
    average: 'text-orange-600 bg-orange-100',
    needs_improvement: 'text-red-600 bg-red-100',
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Employability Results</h1>
        <p className="text-gray-600 mt-2">Your AI-predicted employability assessment</p>
      </div>

      {/* Main Score Card */}
      <div className="bg-gradient-to-r from-maroon to-maroon-light text-white rounded-xl shadow-premium p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-maroon-light text-sm font-semibold uppercase mb-2">Employability Score</p>
            <h2 className="text-5xl font-bold mb-4">{prediction.employabilityScore}%</h2>
            <p
              className={`inline-block px-4 py-2 rounded-lg font-bold ${levelColors[prediction.employabilityLevel]}`}
            >
              {prediction.employabilityLevel}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            {[
              { label: 'Academic', value: Math.round(prediction.academicScore * 100) },
              { label: 'Skills', value: Math.round(prediction.skillsScore * 100) },
              { label: 'Certifications', value: Math.round(prediction.certificationScore * 100) },
              { label: 'Soft Skills', value: Math.round(prediction.softSkillsScore * 100) },
            ].map((item, index) => (
              <div key={index} className="bg-white bg-opacity-10 rounded-lg p-4">
                <p className="text-sm text-maroon-light">{item.label}</p>
                <p className="text-2xl font-bold mt-2">{item.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Score Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Radar Chart */}
        <div className="bg-white rounded-xl shadow-elegant p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-1">Score Radar</h3>
          <p className="text-xs text-gray-400 mb-4">Your performance across all 4 scoring components</p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={[
              { subject: 'Academic', score: Math.round(prediction.academicScore * 100), fullMark: 100 },
              { subject: 'Skills', score: Math.round(prediction.skillsScore * 100), fullMark: 100 },
              { subject: 'Certs', score: Math.round(prediction.certificationScore * 100), fullMark: 100 },
              { subject: 'Soft Skills', score: Math.round(prediction.softSkillsScore * 100), fullMark: 100 },
            ]}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} />
              <Radar name="Your Score" dataKey="score" stroke="#800000" fill="#800000" fillOpacity={0.4} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Weighted Contribution Bar Chart */}
        <div className="bg-white rounded-xl shadow-elegant p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-1">Weighted Contribution</h3>
          <p className="text-xs text-gray-400 mb-4">How much each component actually contributes to your final score</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              layout="vertical"
              data={[
                { name: 'Academic ×30%', raw: Math.round(prediction.academicScore * 100), contribution: Math.round(prediction.academicScore * 30) },
                { name: 'Skills ×25%', raw: Math.round(prediction.skillsScore * 100), contribution: Math.round(prediction.skillsScore * 25) },
                { name: 'Certs ×20%', raw: Math.round(prediction.certificationScore * 100), contribution: Math.round(prediction.certificationScore * 20) },
                { name: 'Soft Skills ×25%', raw: Math.round(prediction.softSkillsScore * 100), contribution: Math.round(prediction.softSkillsScore * 25) },
              ]}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 30]} tickFormatter={(v) => `${v}pts`} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v, name) => [`${v}pts`, name === 'contribution' ? 'Points contributed' : 'Raw score']} />
              <Legend />
              <Bar dataKey="contribution" name="Points Contributed" fill="#800000" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Strengths */}
        <div className="bg-white rounded-xl shadow-elegant p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-green-600" />
            Strengths
          </h3>
          <ul className="space-y-3">
            {prediction.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-xl shadow-elegant p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartLine className="text-orange-600" />
            Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {prediction.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-1">!</span>
                <span className="text-gray-700">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-elegant p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recommendations</h3>
        <div className="space-y-3">
          {prediction.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-maroon font-bold text-lg flex-shrink-0">{index + 1}</span>
              <p className="text-gray-700">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Jobs */}
      {prediction.suggestedJobRoles && prediction.suggestedJobRoles.length > 0 && (
        <div className="bg-white rounded-xl shadow-elegant p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Suggested Career Paths</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prediction.suggestedJobRoles.map((job, index) => (
              <div key={index} className="border-2 border-maroon rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">{job.jobTitle}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Match Score:</span>
                  <span className="bg-maroon text-white px-3 py-1 rounded-lg text-sm font-bold">
                    {job.matchScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentResults;
