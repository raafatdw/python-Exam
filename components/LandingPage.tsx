
import React from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 shadow-2xl border border-slate-100 dark:border-slate-700 relative overflow-hidden transition-colors duration-300">
        <div className="relative z-10">
          <div className="inline-block p-6 bg-indigo-600 rounded-3xl mb-8 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/30 rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h1 className="text-5xl font-black text-indigo-950 dark:text-white mb-4 leading-tight">امتحان بايثون</h1>
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">للصف الثامن</h2>
          <button onClick={onEnter} className="group relative inline-flex items-center justify-center px-12 py-5 font-black text-white transition-all duration-200 bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-xl active:scale-95">
            دخول الامتحان
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          <p className="mt-8 text-slate-400 dark:text-slate-500 text-sm">تنبيه: الامتحان مدته 30 دقيقة بالضبط.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
