import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { adminAPI } from '../services/api';
import Swal from 'sweetalert2';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [pagination.page, searchQuery]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllStudents({
        search: searchQuery,
        page: pagination.page,
        limit: pagination.limit,
      });
      setStudents(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load students',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPagination({ ...pagination, page: 1 });
  };

  const handleStatusToggle = async (studentId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    const result = await Swal.fire({
      title: 'Confirm Status Change',
      text: `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} this student?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#800000',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Change Status',
    });

    if (result.isConfirmed) {
      try {
        await adminAPI.toggleStudentStatus(studentId, newStatus);
        Swal.fire('Success', `Student account ${newStatus}`, 'success');
        fetchStudents();
      } catch (error) {
        Swal.fire('Error', 'Failed to update status', 'error');
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
        <h1 className="text-3xl font-extrabold text-gray-800">Students Management</h1>
        <p className="text-gray-600 mt-2">View and manage student accounts</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 bg-white rounded-2xl shadow-elegant p-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-5 py-3"
        />
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-elegant overflow-hidden border border-[#eadfd8]">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead className="bg-maroon text-white">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-center">Profile %</th>
              <th className="px-6 py-4 text-center">Grades</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student._id} className="hover:bg-[#fdf8f4] transition-smooth">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{student.email}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="w-12 h-12 rounded-full mx-auto bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {student.profile?.profileCompletionPercentage || 0}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium">
                      {student.gradesCount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        student.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleStatusToggle(student._id, student.status)}
                      className="px-4 py-2 bg-maroon text-white rounded-xl text-sm font-semibold hover:bg-maroon-dark transition-smooth"
                    >
                      {student.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No students found
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

export default AdminStudents;
