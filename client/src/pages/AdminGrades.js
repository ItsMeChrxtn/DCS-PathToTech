import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { gradeAPI } from '../services/api';
import Swal from 'sweetalert2';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

const AdminGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    fetchGrades();
  }, [filterStatus, pagination.page]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const status = filterStatus === 'all' ? undefined : filterStatus;
      const response = await gradeAPI.getAllGrades({
        status,
        page: pagination.page,
        limit: pagination.limit,
      });
      setGrades(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load grades',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (gradeId) => {
    const result = await Swal.fire({
      title: 'Approve Grade',
      text: 'Are you sure you want to approve this grade?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#800000',
      confirmButtonText: 'Yes, Approve',
    });

    if (result.isConfirmed) {
      try {
        await gradeAPI.approveGrade(gradeId);
        Swal.fire('Success', 'Grade approved', 'success');
        fetchGrades();
      } catch (error) {
        Swal.fire('Error', 'Failed to approve grade', 'error');
      }
    }
  };

  const handleReject = async (gradeId) => {
    const { value: reason } = await Swal.fire({
      title: 'Reject Grade',
      input: 'textarea',
      inputPlaceholder: 'Reason for rejection...',
      showCancelButton: true,
      confirmButtonColor: '#800000',
      confirmButtonText: 'Reject',
    });

    if (reason) {
      try {
        await gradeAPI.rejectGrade(gradeId, { rejectionReason: reason });
        Swal.fire('Success', 'Grade rejected', 'success');
        fetchGrades();
      } catch (error) {
        Swal.fire('Error', 'Failed to reject grade', 'error');
      }
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
      <div className="mb-8">
        <p className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-[0.16em] uppercase bg-[#f3e6dc] text-[#7f1717] mb-3">
          Admin Control
        </p>
        <h1 className="text-3xl font-extrabold text-gray-800">Grades Management</h1>
        <p className="text-gray-600 mt-2">Review and approve/reject student grade submissions</p>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-2xl shadow-elegant p-4 flex flex-wrap gap-3">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilterStatus(status);
              setPagination({ ...pagination, page: 1 });
            }}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-smooth ${
              filterStatus === status
                ? 'bg-maroon text-white'
                : 'bg-[#f1e9e4] text-gray-700 hover:bg-[#eadfd8]'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-2xl shadow-elegant overflow-hidden border border-[#eadfd8]">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-maroon text-white">
            <tr>
              <th className="px-6 py-4 text-left">Student</th>
              <th className="px-6 py-4 text-left">Subject</th>
              <th className="px-6 py-4 text-center">Grade</th>
              <th className="px-6 py-4 text-center">Marks</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {grades.length > 0 ? (
              grades.map((grade) => (
                <tr key={grade._id} className="hover:bg-[#fdf8f4] transition-smooth">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {grade.userId?.firstName} {grade.userId?.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{grade.subjectName}</td>
                  <td className="px-6 py-4 text-center font-bold text-lg text-maroon">
                    {grade.grade}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    {grade.marks}/{grade.outOfMarks}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {grade.status === 'pending' && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
                        <FaClock size={14} /> Pending
                      </span>
                    )}
                    {grade.status === 'approved' && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                        <FaCheckCircle size={14} /> Approved
                      </span>
                    )}
                    {grade.status === 'rejected' && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-medium">
                        <FaTimesCircle size={14} /> Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {grade.status === 'pending' && (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleApprove(grade._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-smooth"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(grade._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-smooth"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {grade.status !== 'pending' && (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No grades found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-4">
          <button
            onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-maroon text-white rounded-xl font-semibold disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() =>
              setPagination({
                ...pagination,
                page: Math.min(pagination.pages, pagination.page + 1),
              })
            }
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 bg-maroon text-white rounded-xl font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminGrades;
