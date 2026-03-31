import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaClipboardList, FaPlus, FaTrash } from 'react-icons/fa';
import DashboardLayout from '../layouts/DashboardLayout';
import { surveyAPI } from '../services/api';

const surveyTypeOptions = [
  { value: 'employability', label: 'Employability' },
  { value: 'technical_skills', label: 'Technical Skills' },
  { value: 'soft_skills', label: 'Soft Skills' },
  { value: 'career_readiness', label: 'Career Readiness' },
];

const AdminSurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    surveyType: 'employability',
    firstQuestion: '',
  });

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await surveyAPI.getAllSurveys({ page: 1, limit: 50 });
      setSurveys(response.data.data || []);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to load surveys',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSurvey = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.firstQuestion.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing fields',
        text: 'Title and first question are required.',
      });
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        surveyType: formData.surveyType,
        questions: [
          {
            questionNumber: 1,
            text: formData.firstQuestion.trim(),
            type: 'text',
            isRequired: true,
          },
        ],
      };

      await surveyAPI.createSurvey(payload);

      Swal.fire({
        icon: 'success',
        title: 'Survey Created',
        text: 'Your survey was created successfully.',
      });

      setFormData({
        title: '',
        description: '',
        surveyType: 'employability',
        firstQuestion: '',
      });

      fetchSurveys();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Create Failed',
        text: error.response?.data?.message || 'Failed to create survey',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSurvey = async (surveyId) => {
    const result = await Swal.fire({
      title: 'Delete Survey?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#800000',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete',
    });

    if (!result.isConfirmed) return;

    try {
      await surveyAPI.deleteSurvey(surveyId);
      Swal.fire('Deleted', 'Survey deleted successfully.', 'success');
      fetchSurveys();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to delete survey', 'error');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-[0.16em] uppercase bg-[#f3e6dc] text-[#7f1717] mb-3">
          Research Operations
        </p>
        <h1 className="text-3xl font-extrabold text-gray-800">Survey Management</h1>
        <p className="text-gray-600 mt-2">Create surveys for students and manage existing surveys.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-elegant p-6 mb-8 border border-[#eadfd8]">
        <h2 className="text-xl font-extrabold text-gray-800 mb-4 flex items-center gap-2">
          <FaPlus className="text-maroon" /> Create Survey
        </h2>

        <form onSubmit={handleCreateSurvey} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2"
              placeholder="e.g. Career Readiness Survey"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2"
              placeholder="Briefly describe this survey"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Survey Type</label>
            <select
              name="surveyType"
              value={formData.surveyType}
              onChange={handleInputChange}
              className="w-full px-4 py-2"
            >
              {surveyTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">First Question</label>
            <input
              type="text"
              name="firstQuestion"
              value={formData.firstQuestion}
              onChange={handleInputChange}
              className="w-full px-4 py-2"
              placeholder="e.g. What skills do you want to improve this semester?"
              required
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-maroon text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-maroon-dark transition-smooth disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Survey'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-elegant p-6 border border-[#eadfd8]">
        <h2 className="text-xl font-extrabold text-gray-800 mb-4 flex items-center gap-2">
          <FaClipboardList className="text-maroon" /> Existing Surveys
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading surveys...</p>
        ) : surveys.length === 0 ? (
          <p className="text-gray-500">No surveys yet.</p>
        ) : (
          <div className="space-y-4">
            {surveys.map((survey) => (
              <div
                key={survey._id}
                className="border border-[#eadfd8] rounded-xl p-4 bg-[#fffdfa] flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <p className="font-bold text-gray-800">{survey.title}</p>
                  <p className="text-sm text-gray-500">{survey.description || 'No description'}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Type: {survey.surveyType} | Questions: {survey.questions?.length || 0} | Responses: {survey.totalResponses || 0}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteSurvey(survey._id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-smooth"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminSurveys;
