import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Swal from 'sweetalert2';
import { FaCloudUploadAlt, FaFileUpload } from 'react-icons/fa';

const StudentGrades = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    subjectName: '',
    grade: '',
    marks: '',
    outOfMarks: '100',
    semester: '',
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

    setUploading(true);

    try {
      // Placeholder for actual API call
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Grade uploaded successfully (Demo)',
      });
      setFile(null);
      setFormData({
        subjectName: '',
        grade: '',
        marks: '',
        outOfMarks: '100',
        semester: '',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Failed to upload grade',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Upload Grades</h1>
        <p className="text-gray-600 mt-2">Submit your grade documents for verification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-elegant p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Upload Grade Document
              </label>
              <div
                className="border-2 border-dashed border-maroon rounded-lg p-12 text-center cursor-pointer hover:bg-maroon opacity-5 transition-smooth"
                onClick={() => document.getElementById('fileInput').click()}
              >
                <FaCloudUploadAlt className="text-4xl text-maroon mx-auto mb-4" />
                <p className="text-gray-800 font-semibold mb-2">
                  Drag and drop or click to upload
                </p>
                <p className="text-gray-500 text-sm">PDF or image files (Max 10MB)</p>
              </div>
              <input
                id="fileInput"
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
                  Subject Name
                </label>
                <input
                  type="text"
                  name="subjectName"
                  value={formData.subjectName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                  placeholder="e.g., Data Structures"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Grade (College Scale)
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                >
                  <option value="">Select Grade</option>
                  <option value="1.00">1.00</option>
                  <option value="1.25">1.25</option>
                  <option value="1.50">1.50</option>
                  <option value="1.75">1.75</option>
                  <option value="2.00">2.00</option>
                  <option value="2.25">2.25</option>
                  <option value="2.50">2.50</option>
                  <option value="2.75">2.75</option>
                  <option value="3.00">3.00</option>
                  <option value="4.00 INC">4.00 INC</option>
                  <option value="5.00 Failed">5.00 Failed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Marks
                </label>
                <input
                  type="number"
                  name="marks"
                  value={formData.marks}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                  placeholder="e.g., 85"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Semester
                </label>
                <input
                  type="text"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                  placeholder="e.g., Semester 4"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full px-8 py-3 bg-maroon text-white rounded-lg font-semibold hover:bg-maroon-dark transition-smooth disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaFileUpload /> {uploading ? 'Uploading...' : 'Upload Grade'}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-bold text-gray-800 mb-4">Upload Guidelines</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li>✓ Upload clear PDF or image of grade sheet</li>
            <li>✓ Ensure all details are visible</li>
            <li>✓ Maximum file size: 10MB</li>
            <li>✓ Supported: PDF, PNG, JPG</li>
            <li>✓ Admin will verify and approve</li>
            <li>✓ Once approved, used in predictions</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentGrades;
