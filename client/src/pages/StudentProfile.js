import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { studentProfileAPI } from '../services/api';
import Swal from 'sweetalert2';
import { FaPlus, FaTrash } from 'react-icons/fa';

const EMPTY_PROFILE_FORM = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  course: '',
  specialization: '',
  academicYear: '',
  semester: '',
  section: '',
  currentCGPA: '',
  careerInterests: [],
  preferredJobTitles: [],
  about: '',
};

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(EMPTY_PROFILE_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await studentProfileAPI.getProfile();
      setProfile(response.data.data);
      setFormData({ ...EMPTY_PROFILE_FORM, ...response.data.data });
    } catch (error) {
      // If profile does not exist yet, allow user to create one from empty form.
      if (error.response?.status === 404) {
        setProfile(null);
        setFormData(EMPTY_PROFILE_FORM);
        return;
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await studentProfileAPI.updateProfile(formData);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile updated successfully',
      });
      fetchProfile();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setSaving(false);
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

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-600 mt-2">Update your personal and academic information</p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-elegant p-8 space-y-8">
        {/* Basic Information */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
              />
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">Academic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                placeholder="e.g., B.Tech Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current CGPA</label>
              <input
                type="number"
                name="currentCGPA"
                value={formData.currentCGPA}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                min="0"
                max="4"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                placeholder="e.g., 2023-2024"
              />
            </div>
          </div>
        </div>

        {/* Career Information */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">Career Information</h2>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Career Interests</label>
            <input
              type="text"
              name="careerInterests"
              value={Array.isArray(formData.careerInterests) ? formData.careerInterests.join(', ') : formData.careerInterests}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  careerInterests: e.target.value.split(',').map((s) => s.trim()),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
              placeholder="e.g., Web Development, AI/ML, Cloud Computing"
            />
            <p className="text-xs text-gray-500 mt-1">Separate interests with commas</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-maroon text-white rounded-lg font-semibold hover:bg-maroon-dark transition-smooth disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default StudentProfile;
