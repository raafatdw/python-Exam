
import React from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center animate-fadeIn">
      <div className="bg-white rounded-3xl p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-50 rounded-tr-full -ml-12 -mb-12 opacity-50"></div>

        <div className="relative z-10">
          <div className="inline-block p-6 bg-indigo-600 rounded-3xl mb-8 shadow-xl shadow-indigo-200 rotate-3 hover:rotate-0 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>

          <h1 className="text-5xl font-black text-indigo-950 mb-4 leading-tight">
            امتحان بايثون النهائي
          </h1>
          <h2 className="text-2xl font-bold text-indigo-600 mb-8">
            الصف الثامن
          </h2>

          <div className="h-px w-24 bg-slate-200 mx-auto mb-8"></div>

          <div className="mb-12">
            <p className="text-slate-500 text-lg mb-1">بإرشاد المعلم:</p>
            <p className="text-3xl font-black text-slate-800">رأفت دواهدي</p>
          </div>

          <button
            onClick={onEnter}
            className="group relative inline-flex items-center justify-center px-12 py-5 font-black text-white transition-all duration-200 bg-indigo-600 font-pj rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-700 shadow-xl hover:shadow-indigo-300 hover:-translate-y-1 active:scale-95"
          >
            دخول الامتحان
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          
          <p className="mt-8 text-slate-400 text-sm">
            يرجى الملاحظة: مدة الامتحان هي 30 دقيقة بالضبط.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;