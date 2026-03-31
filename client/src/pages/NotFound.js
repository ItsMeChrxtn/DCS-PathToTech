import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-xl w-full text-center bg-white rounded-3xl shadow-premium border border-[#e6dbd3] p-10">
        <p className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-[0.16em] uppercase bg-[#f3e6dc] text-[#7f1717] mb-4">
          Error
        </p>
        <h1 className="text-8xl font-extrabold text-maroon mb-3">404</h1>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-base text-gray-500 mb-8">
          The page you are looking for does not exist, or the link may be outdated.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-maroon text-white rounded-xl font-semibold hover:bg-maroon-dark transition-smooth"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
