
import React from 'react';

interface FullscreenLockProps {
  onReturn: () => void;
}

const FullscreenLock: React.FC<FullscreenLockProps> = ({ onReturn }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex items-center justify-center p-6 text-center overflow-hidden">
      <div className="max-w-xl w-full bg-white rounded-[2.5rem] p-12 shadow-[0_0_100px_rgba(244,63,94,0.3)] border-8 border-rose-500 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-8 text-rose-600 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m0 0v2m0-2h2m-2 0H10m12-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
          تم تجميد الامتحان! ⚠️
        </h2>
        <p className="text-slate-600 text-xl mb-10 font-bold leading-relaxed">
          لقد خرجت من وضع ملء الشاشة. <br/>
          <span className="text-rose-600">لا يمكن رؤية الأسئلة أو المتابعة</span> إلا بعد العودة للوضع المؤمن.
        </p>

        <button
          onClick={onReturn}
          className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-2xl rounded-3xl shadow-2xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          العودة لوضع ملء الشاشة الآن
        </button>
        
        <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-slate-400 text-sm font-black uppercase tracking-widest">
            تنبيه: محاولات الغش مسجلة في النظام
          </p>
        </div>
      </div>
    </div>
  );
};

export default FullscreenLock;
