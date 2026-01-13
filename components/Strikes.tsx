
import React from 'react';

interface StrikesProps {
  current: number;
  max: number;
}

const Strikes: React.FC<StrikesProps> = ({ current, max }) => {
  const livesLeft = Math.max(0, max - current);
  
  return (
    <div className="absolute -top-12 right-0 flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
      <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">الأمان:</span>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className={`transition-all duration-500 ${i < livesLeft ? 'scale-100 opacity-100' : 'scale-50 opacity-20 grayscale'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${i < livesLeft ? 'text-rose-500 fill-current' : 'text-slate-400'}`} viewBox="0 0 24 24" stroke="currentColor" fill="none">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default Strikes;
