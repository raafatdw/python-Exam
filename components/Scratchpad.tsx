
import React, { useState } from 'react';

const Scratchpad: React.FC = () => {
  const [notes, setNotes] = useState('');

  return (
    <div className="fixed top-24 left-4 z-[105] w-72 h-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden animate-in slide-in-from-left duration-300">
      <div className="bg-indigo-600 p-3 text-white font-bold flex justify-between items-center">
        <span>مسودة ملاحظات 📝</span>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="اكتب هنا ملاحظاتك أو كود التجربة..."
        className="flex-1 p-4 bg-amber-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 resize-none outline-none font-mono text-sm"
      />
      <div className="p-2 bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-400 text-center uppercase tracking-widest">
        المسودة لا تُرسل للمعلم
      </div>
    </div>
  );
};

export default Scratchpad;
