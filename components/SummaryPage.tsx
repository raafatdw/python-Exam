
import React from 'react';
import { ExamState, Question } from '../types';
import { downloadAsCSV } from '../utils';

interface SummaryPageProps {
  state: ExamState;
  questions: Question[];
  autoSubmitted: boolean;
}

const SummaryPage: React.FC<SummaryPageProps> = ({ state, questions, autoSubmitted }) => {
  const { studentInfo, answers, aiFeedback, startTime, endTime, examSignature } = state;
  
  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id]?.toString().trim() === q.correctAnswer?.trim()) {
        score += q.points;
      }
    });
    return score;
  };

  const totalPossible = questions.reduce((acc, q) => acc + q.points, 0);
  const finalScore = calculateScore();
  const timeTakenMinutes = endTime && startTime ? Math.floor((endTime - startTime) / 60000) : 0;

  const badges = [];
  if (finalScore === totalPossible) badges.push({ name: 'بطل المنطق', icon: '🏆', color: 'bg-amber-100 text-amber-700 border-amber-200' });
  if (timeTakenMinutes < 10 && finalScore > 50) badges.push({ name: 'الأسرع', icon: '⚡', color: 'bg-blue-100 text-blue-700 border-blue-200' });
  if (Object.keys(state.hintsUsed).length === 0 && finalScore > 70) badges.push({ name: 'المعتمد على ذاته', icon: '🧠', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' });

  return (
    <div className="max-w-3xl mx-auto mt-10 mb-20 px-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">تم تسليم الامتحان!</h1>
          <p className="text-slate-500 font-bold">أحسنت يا {studentInfo?.name}</p>
        </div>

        <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">حساب أمان المבחן (Unique Integrity Hash)</span>
           <code className="text-indigo-600 dark:text-indigo-400 font-mono font-bold text-lg">{examSignature}</code>
           <p className="text-[10px] text-slate-400 mt-2">هذا الكود يثبت أنك قمت بحل نسخة فريدة من الأسئلة مخصصة لك فقط.</p>
        </div>

        {badges.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest text-center mb-4">الأوسمة المستحقة</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {badges.map((badge, i) => (
                <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-black animate-bounce shadow-sm ${badge.color}`} style={{ animationDelay: `${i * 200}ms` }}>
                  <span>{badge.icon}</span>
                  <span>{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-center">
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border">
            <span className="text-xs font-black text-slate-400 uppercase block mb-1">الدرجة النهائية</span>
            <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{finalScore} / {totalPossible}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border">
            <span className="text-xs font-black text-slate-400 uppercase block mb-1">الوقت المستغرق</span>
            <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{timeTakenMinutes} دقيقة</span>
          </div>
        </div>

        {aiFeedback && (
          <div className="mb-8 p-6 bg-indigo-50 dark:bg-indigo-950/40 border-r-4 border-indigo-500 rounded-l-2xl shadow-inner">
            <h3 className="text-lg font-black text-indigo-800 dark:text-indigo-300 mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              تحليل المعلم الذكي (AI)
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {aiFeedback}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button onClick={() => downloadAsCSV(state, questions)} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">تحميل ملخص الإجابات (CSV)</button>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl">خروج</button>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
