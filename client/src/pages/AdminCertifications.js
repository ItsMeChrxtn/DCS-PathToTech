import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { certificationAPI } from '../services/api';
import Swal from 'sweetalert2';
import { FaCheckCircle, FaClock, FaTimesCircle, FaCertificate } from 'react-icons/fa';

const AdminCertifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    fetchCertifications();
  }, [filterStatus, pagination.page]);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const status = filterStatus === 'all' ? undefined : filterStatus;
      const response = await certificationAPI.getAllCertifications({
        status,
        page: pagination.page,
        limit: pagination.limit,
      });
      setCertifications(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load certifications',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (certId) => {
    const result = await Swal.fire({
      title: 'Approve Certification',
      text: 'Are you sure you want to approve this certification?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#800000',
      confirmButtonText: 'Yes, Approve',
    });

    if (result.isConfirmed) {
      try {
        await certificationAPI.approveCertification(certId);
        Swal.fire('Success', 'Certification approved', 'success');
        fetchCertifications();
      } catch (error) {
        Swal.fire('Error', 'Failed to approve certification', 'error');
      }
    }
  };

  const handleReject = async (certId) => {
    const { value: reason } = await Swal.fire({
      title: 'Reject Certification',
      input: 'textarea',
      inputPlaceholder: 'Reason for rejection...',
      showCancelButton: true,
      confirmButtonColor: '#800000',
      confirmButtonText: 'Reject',
    });

    if (reason) {
      try {
        await certificationAPI.rejectCertification(certId, { rejectionReason: reason });
        Swal.fire('Success', 'Certification rejected', 'success');
        fetchCertifications();
      } catch (error) {
        Swal.fire('Error', 'Failed to reject certification', 'error');
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
        <h1 className="text-3xl font-extrabold text-gray-800">Certifications Management</h1>
        <p className="text-gray-600 mt-2">Review and approve/reject student certification submissions</p>
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

      {/* Certifications Table */}
      <div className="bg-white rounded-2xl shadow-elegant overflow-hidden border border-[#eadfd8]">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead className="bg-maroon text-white">
            <tr>
              <th className="px-6 py-4 text-left">Student</th>
              <th className="px-6 py-4 text-left">Certification</th>
              <th className="px-6 py-4 text-left">Issuer</th>
              <th className="px-6 py-4 text-center">Date Earned</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {certifications.length > 0 ? (
              certifications.map((cert) => (
                <tr key={cert._id} className="hover:bg-[#fdf8f4] transition-smooth">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {cert.userId?.firstName} {cert.userId?.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                    <FaCertificate className="text-maroon" />
                    {cert.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{cert.issuer}</td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    {new Date(cert.dateEarned).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {cert.status === 'pending' && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
                        <FaClock size={14} /> Pending
                      </span>
                    )}
                    {cert.status === 'approved' && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                        <FaCheckCircle size={14} /> Approved
                      </span>
                    )}
                    {cert.status === 'rejected' && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-medium">
                        <FaTimesCircle size={14} /> Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {cert.status === 'pending' && (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleApprove(cert._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-smooth"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(cert._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-smooth"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {cert.status !== 'pending' && (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No certifications found
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

export default AdminCertifications;
