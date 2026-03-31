import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaChartLine, FaRobot, FaLaptop, FaCertificate } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-[#4f0c0c] via-[#6f1414] to-[#8c2a1f] text-white shadow-premium border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/90 rounded-lg flex items-center justify-center">
              <span className="text-maroon font-extrabold text-lg">PT</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold block leading-tight">PathToTech</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">Employability Intelligence</span>
            </div>
          </Link>

          <div className="space-x-4">
            <Link
              to="/login"
              className="px-6 py-2 hover:bg-white/15 rounded-lg transition-smooth"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-white text-maroon rounded-lg font-semibold hover:bg-[#fff3ea] transition-smooth"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-[0.16em] uppercase bg-[#f3e6dc] text-[#7f1717] mb-5">
              AI-Powered Career Signal
            </p>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
              Your Path to{' '}
              <span className="text-maroon">Tech Success</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              PathToTech is an intelligent student employability prediction system that helps you understand your readiness for the tech industry and provides personalized career recommendations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-maroon text-white rounded-xl font-bold hover:bg-maroon-dark transition-smooth shadow-elegant"
              >
                Get Started <FaArrowRight className="ml-2" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 border-2 border-maroon text-maroon rounded-xl font-bold hover:bg-maroon hover:text-white transition-smooth"
              >
                Already a Member?
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#e9f3ff] to-[#f6fbff] rounded-2xl p-8 text-center border border-[#d6e7f7] shadow-elegant">
              <div className="text-4xl mb-4"><FaChartLine className="inline text-[#1763a6]" /></div>
              <h3 className="font-bold text-lg mb-2">Analytics</h3>
              <p className="text-gray-600">Track your progress</p>
            </div>
            <div className="bg-gradient-to-br from-[#e9f6ea] to-[#f6fff6] rounded-2xl p-8 text-center border border-[#d6ebd8] shadow-elegant">
              <div className="text-4xl mb-4"><FaRobot className="inline text-[#1e7d3e]" /></div>
              <h3 className="font-bold text-lg mb-2">Predictions</h3>
              <p className="text-gray-600">AI-powered insights</p>
            </div>
            <div className="bg-gradient-to-br from-[#fff0e6] to-[#fff8f1] rounded-2xl p-8 text-center border border-[#f3dcc8] shadow-elegant">
              <div className="text-4xl mb-4"><FaLaptop className="inline text-[#9a4b14]" /></div>
              <h3 className="font-bold text-lg mb-2">Career Paths</h3>
              <p className="text-gray-600">Guided recommendations</p>
            </div>
            <div className="bg-gradient-to-br from-[#fff7dd] to-[#fffdf1] rounded-2xl p-8 text-center border border-[#f2e8be] shadow-elegant">
              <div className="text-4xl mb-4"><FaCertificate className="inline text-[#a37b05]" /></div>
              <h3 className="font-bold text-lg mb-2">Certifications</h3>
              <p className="text-gray-600">Track achievements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-16 text-gray-800">Key Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaChartLine className="text-4xl text-maroon" />,
                title: 'Dashboard Analytics',
                description: 'Visualize your employability metrics with interactive charts',
              },
              {
                icon: <FaRobot className="text-4xl text-maroon" />,
                title: 'AI Predictions',
                description: 'Get accurate employability predictions using advanced algorithms',
              },
              {
                icon: <FaLaptop className="text-4xl text-maroon" />,
                title: 'Skill Tracking',
                description: 'Monitor and improve your technical and soft skills',
              },
              {
                icon: <FaCertificate className="text-4xl text-maroon" />,
                title: 'Certifications',
                description: 'Upload and track your professional certifications',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-elegant hover:shadow-premium transition-smooth">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#5f1010] via-[#7f1717] to-[#a13b25] text-white py-20 shadow-premium">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-6">Ready to Map Your Success?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students using PathToTech to accelerate their career growth.
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-white text-maroon rounded-xl font-bold hover:bg-[#fff3ea] transition-smooth"
          >
            Create Your Free Account Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#221f1f] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">PathToTech</h4>
              <p className="text-gray-400">Transforming student employability through intelligent prediction and guidance.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition">Predictions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Sign Up</a></li>
                <li><a href="#" className="hover:text-white transition">Login</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PathToTech. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
