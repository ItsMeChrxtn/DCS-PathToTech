import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { surveyAPI } from '../services/api';
import Swal from 'sweetalert2';
import { FaClipboardList, FaCheckCircle } from 'react-icons/fa';

const StudentSurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSurvey, setActiveSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await surveyAPI.getAllSurveys();
      setSurveys(response.data.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load surveys',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSurveyStart = (survey) => {
    setActiveSurvey(survey);
    setResponses({});
  };

  const handleResponseChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value,
    });
  };

  const handleSubmitSurvey = async () => {
    if (Object.keys(responses).length !== activeSurvey.questions.length) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Survey',
        text: 'Please answer all questions before submitting',
      });
      return;
    }

    setSubmitting(true);

    try {
      const surveyResponses = activeSurvey.questions.map((q) => ({
        questionId: q._id,
        questionText: q.text,
        response: responses[q._id],
        responseType: q.type,
      }));

      await surveyAPI.submitSurveyResponse(activeSurvey._id, {
        responses: surveyResponses,
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Survey submitted successfully',
      });

      setActiveSurvey(null);
      setResponses({});
      fetchSurveys();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit survey',
      });
    } finally {
      setSubmitting(false);
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

  if (activeSurvey) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <button
            onClick={() => setActiveSurvey(null)}
            className="px-4 py-2 text-maroon hover:text-maroon-dark font-semibold mb-4"
          >
            ← Back to Surveys
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{activeSurvey.title}</h1>
          <p className="text-gray-600 mt-2">{activeSurvey.description}</p>
        </div>

        <div className="bg-white rounded-xl shadow-elegant p-8">
          <div className="space-y-8">
            {activeSurvey.questions.map((question, index) => (
              <div key={question._id} className="pb-8 border-b border-gray-200 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {index + 1}. {question.text}
                </h3>

                {question.type === 'multiple_choice' && (
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name={question._id}
                          value={option}
                          checked={responses[question._id] === option}
                          onChange={() => handleResponseChange(question._id, option)}
                          className="w-4 h-4 accent-maroon"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'text' && (
                  <textarea
                    value={responses[question._id] || ''}
                    onChange={(e) => handleResponseChange(question._id, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                    placeholder="Your answer..."
                    rows="4"
                  />
                )}

                {question.type === 'likert' && (
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleResponseChange(question._id, value)}
                        className={`flex-1 py-2 rounded-lg font-semibold transition-smooth ${
                          responses[question._id] === value
                            ? 'bg-maroon text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                )}

                {question.type === 'rating' && (
                  <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handleResponseChange(question._id, i + 1)}
                        className={`text-3xl ${
                          (responses[question._id] || 0) >= i + 1 ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-12">
            <button
              onClick={() => setActiveSurvey(null)}
              className="flex-1 px-6 py-3 border-2 border-maroon text-maroon rounded-lg font-semibold hover:bg-gray-50 transition-smooth"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitSurvey}
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-maroon text-white rounded-lg font-semibold hover:bg-maroon-dark transition-smooth disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Survey'}
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Employability Surveys</h1>
        <p className="text-gray-600 mt-2">Complete surveys to improve your employability assessment</p>
      </div>

      {surveys.length === 0 ? (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
          <FaClipboardList className="text-4xl text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800">No Surveys Available</h3>
          <p className="text-gray-600 mt-2">Check back later for new surveys</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <div
              key={survey._id}
              className="bg-white rounded-xl shadow-elegant hover:shadow-premium transition-smooth p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">{survey.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{survey.description}</p>

              <div className="flex items-center justify-between mb-6 py-4 border-t border-b border-gray-200">
                <span className="text-sm text-gray-600">
                  <strong>{survey.questions.length}</strong> questions
                </span>
                <span className="text-sm text-gray-600">
                  <strong>{survey.totalResponses}</strong> responses
                </span>
              </div>

              <button
                onClick={() => handleSurveyStart(survey)}
                className="w-full px-4 py-3 bg-maroon text-white rounded-lg font-semibold hover:bg-maroon-dark transition-smooth flex items-center justify-center gap-2"
              >
                <FaClipboardList /> Start Survey
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentSurveys;
