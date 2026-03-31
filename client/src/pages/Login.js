import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';
import Swal from 'sweetalert2';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import BrandLogo from '../components/BrandLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });
      const { user, token } = response.data.data;

      login(user, token);

      Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: `Login successful. Welcome back, ${user.firstName}!`,
        showConfirmButton: false,
        timer: 1500,
      });

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || 'Invalid email or password',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ptt-shell p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-premium border border-[#e6dbd3] bg-white animated-entry">
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-[#45140f] via-[#6b2015] to-[#9b3d21] text-white relative">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 25%, #ffffff 0, transparent 42%)' }} />
          <div className="relative">
            <BrandLogo size="lg" />
            <h1 className="text-4xl font-extrabold leading-tight mb-3 mt-8">Welcome Back</h1>
            <p className="text-white/85 text-base leading-relaxed">Continue building your career momentum with intelligent employability analytics and progress insights.</p>
          </div>
          <div className="relative rounded-2xl bg-white/10 border border-white/20 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-2">Secure Access</p>
            <p className="text-sm text-white/85">Role-based sessions are protected with token authentication and managed access controls.</p>
          </div>
        </div>

        <div className="p-6 sm:p-10 lg:p-12 bg-[#fffdfa]">
          <div className="text-center lg:text-left mb-8">
            <div className="inline-flex lg:hidden mb-4"><BrandLogo size="sm" dark /></div>
            <h2 className="text-3xl font-extrabold text-gray-800">Sign in to PathToTech</h2>
            <p className="mt-2 text-gray-500">Student Employability Intelligence Platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-maroon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-maroon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-maroon"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-maroon text-white py-3 rounded-xl font-semibold hover:bg-maroon-dark transition-smooth disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center lg:text-left">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-maroon font-semibold hover:text-maroon-dark transition-smooth">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
