
import React from 'react';
import { formatTime } from '../utils';

export interface TimerTheme {
  normal?: string;
  urgent?: string;
  critical?: string;
}

interface TimerProps {
  timeLeft: number;
  theme?: TimerTheme;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, theme }) => {
  const isUrgent = timeLeft < 300; // Less than 5 mins
  const isCritical = timeLeft < 60; // Less than 1 min

  // Default color classes
  const defaultTheme: Required<TimerTheme> = {
    normal: 'bg-indigo-900',
    urgent: 'bg-amber-500',
    critical: 'bg-red-600',
  };

  const currentTheme = { ...defaultTheme, ...theme };

  const bgColorClass = isCritical 
    ? currentTheme.critical 
    : isUrgent 
      ? currentTheme.urgent 
      : currentTheme.normal;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      <div className={`
        pointer-events-auto
        flex items-center gap-3 px-8 py-3 rounded-b-3xl shadow-2xl transition-all duration-500 transform
        ${bgColorClass} text-white
        ${isCritical ? 'scale-110 animate-pulse' : ''}
        border-x border-b border-white/20
      `}>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest opacity-80 mb-0.5">الوقت المتبقي</span>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isUrgent ? 'animate-spin-slow' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-black text-3xl tabular-nums tracking-tighter">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Timer;
