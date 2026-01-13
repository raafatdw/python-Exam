
import React, { useState } from 'react';
import { StudentInfo } from '../types';

interface StartPageProps {
  onStart: (info: StudentInfo) => void;
}

const StartPage: React.FC<StartPageProps> = ({ onStart }) => {
  const [info, setInfo] = useState<StudentInfo>({ name: '', class: '', studentId: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (info.name && info.class && info.studentId) onStart(info);
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl text-center border border-transparent dark:border-slate-700">
      <div className="mb-8">
        <div className="inline-block p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
          </svg>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">أهلاً بكم في الامتحان. لديكم 30 دقيقة.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-right text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">الاسم الكامل</label>
          <input required type="text" className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-right text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">الصف</label>
          <input required type="text" placeholder="مثلاً: الثامن 2" className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" value={info.class} onChange={(e) => setInfo({ ...info, class: e.target.value })} />
        </div>
        <div>
          <label className="block text-right text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">رقم الهوية</label>
          <input required type="text" className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" value={info.studentId} onChange={(e) => setInfo({ ...info, studentId: e.target.value })} />
        </div>
        <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95">ابدأ الامتحان</button>
      </form>
    </div>
  );
};

export default StartPage;
