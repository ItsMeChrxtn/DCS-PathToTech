import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaChartLine,
  FaRobot,
  FaLaptopCode,
  FaCertificate,
  FaLayerGroup,
  FaRoute,
  FaShieldAlt,
} from 'react-icons/fa';
import BrandLogo from '../components/BrandLogo';

const featureCards = [
  {
    icon: <FaChartLine className="text-[#1b5ea8] text-2xl" />,
    title: 'Signal Dashboard',
    copy: 'See your readiness score, strengths, and growth gaps with instant feedback loops.',
  },
  {
    icon: <FaRobot className="text-[#126f41] text-2xl" />,
    title: 'Prediction Engine',
    copy: 'Forecast employability outcomes using your grades, certifications, and profile progression.',
  },
  {
    icon: <FaLaptopCode className="text-[#a24f17] text-2xl" />,
    title: 'Skill Intelligence',
    copy: 'Map technical and soft-skill signals into practical interventions and career actions.',
  },
  {
    icon: <FaCertificate className="text-[#8f1f16] text-2xl" />,
    title: 'Portfolio Proof',
    copy: 'Track verified credentials and milestone achievements in one evidence-ready workspace.',
  },
];

const systemPillars = [
  {
    icon: <FaLayerGroup />,
    title: 'Data-Rich Profile',
    copy: 'Centralized student records, survey outcomes, and skill trajectories.',
  },
  {
    icon: <FaRoute />,
    title: 'Pathway Guidance',
    copy: 'Recommendations aligned to real-world technology roles and requirements.',
  },
  {
    icon: <FaShieldAlt />,
    title: 'Role-Secured Platform',
    copy: 'Dedicated experiences for administrators and students with protected workflows.',
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <header className="relative overflow-hidden bg-gradient-to-br from-[#44120d] via-[#6f2015] to-[#a74324] text-white">
        <div className="absolute inset-0 opacity-35" style={{ backgroundImage: 'radial-gradient(circle at 20% 18%, #ffffff 0, transparent 30%), radial-gradient(circle at 85% 5%, #ffd2b3 0, transparent 35%)' }} />
        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="animated-entry">
            <BrandLogo size="md" />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-smooth font-semibold">
              Login
            </Link>
            <Link to="/register" className="px-5 py-2.5 rounded-xl bg-white text-[#7b2516] hover:bg-[#fff3ea] transition-smooth font-bold pulse-glow">
              Register
            </Link>
          </div>
        </nav>

        <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-8 md:pt-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="animated-entry">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs uppercase tracking-[0.18em] font-bold bg-white/15 text-white mb-6">
                Student Employability Intelligence System
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.02] mb-6">
                Build Career
                <br />
                Momentum with
                <span className="text-[#ffd4b7]"> PathToTech</span>
              </h1>
              <p className="text-white/85 text-lg md:text-xl leading-relaxed max-w-xl mb-8">
                A high-clarity platform that transforms student academic data into employability signals, predictions, and guided career actions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="inline-flex items-center px-7 py-3.5 rounded-xl bg-white text-[#7e2818] font-bold hover:bg-[#fff2e7] transition-smooth shadow-elegant">
                  Launch Your Account <FaArrowRight className="ml-2" />
                </Link>
                <Link to="/login" className="inline-flex items-center px-7 py-3.5 rounded-xl border border-white/55 text-white font-semibold hover:bg-white/12 transition-smooth">
                  Access Dashboard
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 animated-entry">
              {featureCards.map((item, idx) => (
                <article
                  key={item.title}
                  className={`hero-card rounded-2xl p-5 md:p-6 ${idx % 2 === 0 ? 'floating' : ''}`}
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-lg font-extrabold text-[#22201f] mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#665e58]">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {systemPillars.map((pillar) => (
            <article key={pillar.title} className="bg-white rounded-2xl p-7 border border-[#e7ddd6] shadow-elegant animated-entry">
              <div className="w-11 h-11 rounded-xl bg-[#f7ebe3] text-[#8f1f16] flex items-center justify-center text-lg mb-4">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-extrabold text-[#22201f] mb-2">{pillar.title}</h3>
              <p className="text-[#6a625c]">{pillar.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#4d1711] via-[#6b2317] to-[#8f351f] text-white py-16 mt-6">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-4">Design Better Career Outcomes</h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto mb-8">
            Use one intelligent system for profile building, analytics, predictions, and evidence-driven interventions.
          </p>
          <Link to="/register" className="inline-block px-9 py-3.5 rounded-xl bg-white text-[#7e2818] font-bold hover:bg-[#fff2e7] transition-smooth">
            Start with PathToTech
          </Link>
        </div>
      </section>

      <footer className="bg-[#1f1c1c] text-white py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <BrandLogo size="sm" showSubtitle={false} />
          <p className="text-sm text-white/60 text-center md:text-right">
            2026 PathToTech. Intelligent student employability and pathway analytics.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
