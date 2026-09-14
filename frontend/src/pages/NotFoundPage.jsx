import React from 'react';
import { Link } from 'react-router-dom';
import GaneshIcon from '../components/GaneshIcon';

export const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-600 text-white flex items-center justify-center font-extrabold mx-auto p-3 shadow-md">
        <GaneshIcon className="w-10 h-10 text-white" />
      </div>
      <h2 className="font-heading font-extrabold text-2xl text-slate-900">404 - Page Not Found</h2>
      <p className="text-xs text-slate-600">The page you requested could not be found.</p>
      <Link to="/" className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs inline-block shadow-md">
        Back to Home Page
      </Link>
    </div>
  );
};

export default NotFoundPage;
