import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { predictionAPI } from '../services/api';
import Swal from 'sweetalert2';
import { FaBriefcase, FaTimes } from 'react-icons/fa';

const StudentRecommendations = () => {
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
          text: 'Failed to load recommendations',
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
          <h1 className="text-3xl font-bold text-gray-800">Career Recommendations</h1>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
          <FaBriefcase className="text-4xl text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800">No Recommendations Yet</h3>
          <p className="text-gray-600 mt-2">
            Generate an employability prediction to see career recommendations.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Career Recommendations</h1>
        <p className="text-gray-600 mt-2">Personalized job roles and skill development paths</p>
      </div>

      {/* Skill Gaps Section */}
      {prediction.skillGaps && prediction.skillGaps.length > 0 && (
        <div className="mb-8 bg-white rounded-xl shadow-elegant p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Skills to Develop</h2>
          <div className="space-y-4">
            {prediction.skillGaps.map((gap, index) => (
              <div key={index} className="border-l-4 border-orange-500 pl-6 py-4 bg-orange-50 rounded-r-lg">
                <h3 className="font-bold text-gray-800 mb-2">{gap.skillName}</h3>
                <p className="text-sm text-gray-700 mb-3">{gap.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      gap.importance === 'high'
                        ? 'bg-red-100 text-red-800'
                        : gap.importance === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {gap.importance} importance
                  </span>
                </div>
                {gap.suggestedCertifications && gap.suggestedCertifications.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-orange-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Recommended Certifications:</p>
                    <ul className="space-y-1">
                      {gap.suggestedCertifications.map((cert, idx) => (
                        <li key={idx} className="text-sm text-gray-600">
                          • {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Jobs Section */}
      {prediction.suggestedJobRoles && prediction.suggestedJobRoles.length > 0 && (
        <div className="bg-white rounded-xl shadow-elegant p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended Job Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prediction.suggestedJobRoles.map((job, index) => (
              <div
                key={index}
                className="border-2 border-maroon rounded-lg p-6 hover:shadow-premium transition-smooth"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{job.jobTitle}</h3>
                    {job.company && (
                      <p className="text-sm text-gray-600 mt-1">{job.company}</p>
                    )}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg font-bold text-lg ${
                      job.matchScore >= 80
                        ? 'bg-green-100 text-green-800'
                        : job.matchScore >= 60
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {job.matchScore}%
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  <strong>Match Score:</strong> Based on your profile and skills
                </p>

                {/* Missing Skills */}
                {job.skillGaps && job.skillGaps.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Skills to Acquire:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skillGaps.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-lg flex items-center gap-1"
                        >
                          {skill} <FaTimes size={10} />
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Skills */}
                {job.matchedSkills && job.matchedSkills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Your Matching Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.matchedSkills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg"
                        >
                          ✓ {skill}
                        </span>
                      ))}
                      {job.matchedSkills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                          +{job.matchedSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <button className="w-full px-4 py-2 border-2 border-maroon text-maroon rounded-lg font-semibold hover:bg-maroon hover:text-white transition-smooth">
                  <FaBriefcase className="inline mr-2" />
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Recommendations */}
      {(!prediction.suggestedJobRoles || prediction.suggestedJobRoles.length === 0) && (
        <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-8 text-center">
          <FaBriefcase className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800">No Job Matches Yet</h3>
          <p className="text-gray-600 mt-2">
            Complete your profile and acquire more skills to unlock job recommendations.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentRecommendations;
