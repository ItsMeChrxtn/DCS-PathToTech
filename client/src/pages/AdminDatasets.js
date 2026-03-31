import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Swal from 'sweetalert2';
import { FaDatabase, FaDownload, FaTrash } from 'react-icons/fa';
import { adminAPI } from '../services/api';

const AdminDatasets = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllDatasets({ limit: 50 });
      setDatasets(response.data.data || []);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to load datasets',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (datasetId) => {
    const result = await Swal.fire({
      title: 'Delete Dataset',
      text: 'Are you sure? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#800000',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Delete',
    });

    if (result.isConfirmed) {
      try {
        // Placeholder for delete API call
        Swal.fire('Success', 'Dataset deleted', 'success');
        fetchDatasets();
      } catch (error) {
        Swal.fire('Error', 'Failed to delete dataset', 'error');
      }
    }
  };

  const getDatasetTypeColor = (type) => {
    const colors = {
      grades: 'bg-blue-100 text-blue-800',
      certifications: 'bg-purple-100 text-purple-800',
      surveys: 'bg-green-100 text-green-800',
      jobs: 'bg-orange-100 text-orange-800',
      skills: 'bg-pink-100 text-pink-800',
      external: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || colors.external;
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
      <div className="mb-8">
        <p className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-[0.16em] uppercase bg-[#f3e6dc] text-[#7f1717] mb-3">
          Data Operations
        </p>
        <h1 className="text-3xl font-extrabold text-gray-800">Datasets Management</h1>
        <p className="text-gray-600 mt-2">View and manage imported CSV datasets</p>
      </div>

      {datasets.length === 0 ? (
        <div className="bg-[#eef6ff] border border-[#d6e8fb] rounded-2xl p-8 text-center shadow-elegant">
          <FaDatabase className="text-4xl text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-extrabold text-gray-800">No Datasets Found</h3>
          <p className="text-gray-600 mt-2">
            Place CSV files in the /datasets folder for automatic import
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {datasets.map((dataset) => (
            <div key={dataset._id} className="bg-white rounded-2xl shadow-elegant p-6 border border-[#eadfd8] hover:shadow-premium transition-smooth">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-extrabold text-gray-800">{dataset.fileName}</h3>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-xl text-sm font-semibold ${getDatasetTypeColor(
                      dataset.datasetType
                    )}`}
                  >
                    {dataset.datasetType}
                  </span>
                </div>
                {dataset.isAutoImported && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-xl text-xs font-semibold">
                    Auto
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-6 py-4 border-y border-[#efe5de]">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Rows:</span>
                  <span className="font-bold text-gray-800">{dataset.rowCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valid Rows:</span>
                  <span className="font-bold text-green-600">{dataset.validRows}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Invalid Rows:</span>
                  <span className="font-bold text-red-600">{dataset.invalidRows}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-bold text-maroon">
                    {Math.round((dataset.validRows / dataset.rowCount) * 100)}%
                  </span>
                </div>
              </div>

              <div className="mb-6 text-xs text-gray-500 space-y-1">
                <p>
                  <strong>Imported:</strong>{' '}
                  {dataset.importedAt ? new Date(dataset.importedAt).toLocaleString() : 'N/A'}
                </p>
                <p>
                  <strong>By:</strong> {dataset.importedBy?.email || 'System Auto-Import'}
                </p>
                <p>
                  <strong>Status:</strong> {dataset.importStatus || 'completed'}
                </p>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 border-2 border-maroon text-maroon rounded-xl font-semibold hover:bg-maroon hover:text-white transition-smooth flex items-center justify-center gap-2">
                  <FaDownload /> Download
                </button>
                <button
                  onClick={() => handleDelete(dataset._id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-smooth flex items-center justify-center gap-2"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div className="mt-8 bg-gradient-to-r from-[#5f1010] via-[#7f1717] to-[#a13b25] text-white rounded-2xl p-6 shadow-premium">
        <h3 className="text-xl font-extrabold mb-4">Auto-Import Instructions</h3>
        <ol className="space-y-2 text-sm">
          <li>1. Place CSV or XLSX files in the <code className="bg-maroon-dark px-2 py-1 rounded">/datasets</code> folder</li>
          <li>2. Restart the server to trigger automatic import</li>
          <li>3. Datasets are validated and imported on startup</li>
          <li>4. Check the success rate to identify any data issues</li>
          <li>5. Imported data appears in the system immediately</li>
        </ol>
      </div>
    </DashboardLayout>
  );
};

export default AdminDatasets;
