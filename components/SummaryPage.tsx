
import React from 'react';
import { StudentInfo, Question } from '../types';
import { downloadAsCSV } from '../utils';

interface SummaryPageProps {
  info: StudentInfo | null;
  questions: Question[];
  answers: any;
  autoSubmitted: boolean;
}

const SummaryPage: React.FC<SummaryPageProps> = ({ info, questions, answers, autoSubmitted }) => {
  return (
    <div className="max-w-2xl mx-auto mt-20 text-center px-4">
      <div className="bg-white rounded-3xl p-12 shadow-2xl border border-slate-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">تم تسليم الامتحان بنجاح!</h1>
        
        {autoSubmitted && (
          <div className="mb-6 p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
            انتهى الوقت وتم تسليم الامتحان تلقائياً.
          </div>
        )}

        <div className="space-y-4 text-lg text-slate-600 mb-8">
          <p>أحسنت، <strong>{info?.name}</strong>!</p>
          <p>تم حفظ إجاباتك في النظام وإرسالها للمعلم.</p>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => downloadAsCSV(info, questions, answers)}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            تحميل ملخص الامتحان (CSV)
          </button>

          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
        
        <p className="mt-8 text-slate-400 text-sm italic">يمكنك إغلاق الصفحة الآن.</p>
      </div>
    </div>
  );
};

export default SummaryPage;