import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaFileAlt,
  FaClipboardList,
  FaCertificate,
  FaBriefcase,
  FaDatabase,
  FaGraduationCap,
  FaTasks,
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ isOpen }) => {
  const { isAdmin, isStudent } = useAuth();
  const location = useLocation();

  const adminMenuItems = [
    { icon: FaHome, label: 'Dashboard', path: '/admin' },
    { icon: FaUsers, label: 'Students', path: '/admin/students' },
    { icon: FaFileAlt, label: 'Grades', path: '/admin/grades' },
    { icon: FaCertificate, label: 'Certifications', path: '/admin/certifications' },
    { icon: FaClipboardList, label: 'Surveys', path: '/admin/surveys' },
    { icon: FaDatabase, label: 'Datasets', path: '/admin/datasets' },
  ];

  const studentMenuItems = [
    { icon: FaHome, label: 'Dashboard', path: '/student' },
    { icon: FaGraduationCap, label: 'Profile', path: '/student/profile' },
    { icon: FaFileAlt, label: 'Grades', path: '/student/grades' },
    { icon: FaCertificate, label: 'Certifications', path: '/student/certifications' },
    { icon: FaClipboardList, label: 'Surveys', path: '/student/surveys' },
    { icon: FaTasks, label: 'Results', path: '/student/results' },
    { icon: FaBriefcase, label: 'Recommendations', path: '/student/recommendations' },
  ];

  const menuItems = isAdmin ? adminMenuItems : isStudent ? studentMenuItems : [];

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`fixed md:static top-[72px] md:top-0 left-0 h-[calc(100vh-72px)] md:h-screen bg-gradient-to-b from-[#2f0f0b] via-[#521811] to-[#702414] text-white transition-all duration-300 z-50 md:z-auto border-r border-white/10
        ${isOpen ? 'w-64' : 'w-0 md:w-64'} overflow-hidden`}
    >
      <div className="p-6 space-y-8 h-full">
        {/* Sidebar Title */}
        <div className="hidden md:block">
          <h2 className="text-xs uppercase tracking-[0.22em] font-bold text-white/70">Control Center</h2>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-smooth border group ${
                isActive(item.path)
                  ? 'bg-white text-[#5f1010] border-white shadow-elegant'
                  : 'text-white/90 border-transparent hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <item.icon size={18} className={`${isActive(item.path) ? '' : 'group-hover:scale-110'} transition-smooth`} />
              <span className="font-semibold tracking-tight">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:block mt-auto rounded-2xl border border-white/15 bg-white/10 p-4 floating">
          <p className="text-xs uppercase tracking-[0.18em] text-white/70 mb-1">System</p>
          <p className="text-sm font-semibold">PathToTech Prime</p>
          <p className="text-xs text-white/70 mt-1">AI employability analytics with guided interventions</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
