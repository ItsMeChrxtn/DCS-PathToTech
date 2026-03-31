import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Swal from 'sweetalert2';
import { FaCloudUploadAlt, FaFileUpload, FaCertificate } from 'react-icons/fa';

const StudentCertifications = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    dateEarned: '',
    category: 'technical',
  });
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/'))) {
      setFile(selectedFile);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please upload a PDF or image file',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      Swal.fire({
        icon: 'warning',
        title: 'No File',
        text: 'Please select a file to upload',
      });
      return;
    }

    if (!formData.title || !formData.issuer || !formData.dateEarned) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill all required fields',
      });
      return;
    }

    setUploading(true);

    try {
      // Placeholder for actual API call
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Certification uploaded successfully (Demo)',
      });
      setFile(null);
      setFormData({
        title: '',
        issuer: '',
        dateEarned: '',
        category: 'technical',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Failed to upload certification',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Upload Certifications</h1>
        <p className="text-gray-600 mt-2">Share your professional certifications and credentials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-elegant p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Upload Certificate Document
              </label>
              <div
                className="border-2 border-dashed border-maroon rounded-lg p-12 text-center cursor-pointer hover:bg-maroon hover:bg-opacity-5 transition-smooth"
                onClick={() => document.getElementById('certFileInput').click()}
              >
                <FaCloudUploadAlt className="text-4xl text-maroon mx-auto mb-4" />
                <p className="text-gray-800 font-semibold mb-2">
                  Drag and drop or click to upload
                </p>
                <p className="text-gray-500 text-sm">PDF or image files (Max 10MB)</p>
              </div>
              <input
                id="certFileInput"
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {file && (
                <p className="mt-4 text-sm text-green-600">
                  ✓ Selected: {file.name}
                </p>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Certification Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                  placeholder="e.g., AWS Solutions Architect"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                >
                  <option value="technical">Technical</option>
                  <option value="professional">Professional</option>
                  <option value="language">Language</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Issuer *
                </label>
                <input
                  type="text"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                  placeholder="e.g., Amazon Web Services"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date Earned *
                </label>
                <input
                  type="date"
                  name="dateEarned"
                  value={formData.dateEarned}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full px-8 py-3 bg-maroon text-white rounded-lg font-semibold hover:bg-maroon-dark transition-smooth disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaFileUpload /> {uploading ? 'Uploading...' : 'Upload Certificate'}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-purple-50 rounded-xl p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaCertificate className="text-purple-600" />
            Certification Tips
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li>✓ Upload verified certificates</li>
            <li>✓ Include certificate details</li>
            <li>✓ Valid: PDF, PNG, JPG</li>
            <li>✓ Maximum size: 10MB</li>
            <li>✓ Admin will verify</li>
            <li>✓ Improves employability score</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentCertifications;
