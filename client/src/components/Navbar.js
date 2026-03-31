import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#800000',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Logout',
    });

    if (result.isConfirmed) {
      logout();
      navigate('/login');
      Swal.fire('Success', 'You have logged out successfully', 'success');
    }
  };

  return (
    <nav className="sticky top-0 z-[1000] border-b border-white/20 bg-gradient-to-r from-[#4f0c0c] via-[#6f1414] to-[#8c2a1f] text-white shadow-premium">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo and title */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-white/90 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-[#6f1414] font-extrabold text-lg tracking-tight">PT</span>
          </div>
          <div className="hidden sm:block">
            <span className="block text-xl leading-tight font-extrabold tracking-tight">PathToTech</span>
            <span className="block text-[11px] text-white/70 uppercase tracking-[0.2em]">Employability Intelligence</span>
          </div>
        </Link>

        {/* Right side - User menu and toggle */}
        <div className="flex items-center space-x-4">
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{user?.firstName}</p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/70">{isAdmin ? 'Administrator' : 'Student'}</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-smooth"
              >
                <FaUserCircle size={24} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white text-gray-800 rounded-xl shadow-premium border border-gray-100 overflow-hidden">
                  <Link
                    to={isStudent ? '/student/profile' : isAdmin ? '/admin' : '/'}
                    className="block px-4 py-3 hover:bg-[#f8f3ee] font-medium"
                    onClick={() => setDropdownOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-[#f8f3ee] flex items-center space-x-2 text-[#7f1717] font-semibold"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-smooth"
          >
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
