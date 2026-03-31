import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';
import BrandLogo from './BrandLogo';

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
    <nav className="sticky top-0 z-[1000] border-b border-white/30 bg-gradient-to-r from-[#5a130f] via-[#7e2418] to-[#b04626] text-white shadow-premium backdrop-blur-sm">
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Logo and title */}
        <Link to="/" className="flex items-center">
          <BrandLogo size="md" />
        </Link>

        {/* Right side - User menu and toggle */}
        <div className="flex items-center space-x-4">
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right leading-tight">
              <p className="text-sm font-semibold text-white">{user?.firstName}</p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/70">{isAdmin ? 'Administrator' : 'Student'}</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2.5 rounded-xl bg-white/12 hover:bg-white/25 transition-smooth"
              >
                <FaUserCircle size={24} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white text-gray-800 rounded-xl shadow-premium border border-gray-100 overflow-hidden animated-entry">
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
            className="md:hidden p-2.5 rounded-xl bg-white/12 hover:bg-white/25 transition-smooth"
          >
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
