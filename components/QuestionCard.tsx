
import React, { useState, useEffect } from 'react';
import { Question, QuestionType } from '../types';
import PythonRunner from './PythonRunner';

interface QuestionCardProps {
  question: Question;
  answer: string | string[];
  onChange: (val: string | string[]) => void;
  hint?: string;
  onGetHint: () => void;
  hintLoading: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, answer, onChange, hint, onGetHint, hintLoading }) => {
  const [localInputValue, setLocalInputValue] = useState(answer as string || '');
  const [showRunner, setShowRunner] = useState(false);

  useEffect(() => {
    setLocalInputValue(answer as string || '');
    setShowRunner(false);
  }, [question.id]);

  useEffect(() => {
    if (question.type !== QuestionType.FILL_IN_BLANKS) return;
    const timer = setTimeout(() => {
      if (localInputValue !== answer) onChange(localInputValue);
    }, 400);
    return () => clearTimeout(timer);
  }, [localInputValue]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 animate-fadeIn relative">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-400">{question.title}</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowRunner(!showRunner)}
            className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${showRunner ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            {showRunner ? 'إغلاق المختبر' : 'فتح المختبر 🧪'}
          </button>
          {!hint && (
            <button 
              onClick={onGetHint}
              disabled={hintLoading}
              className="text-xs font-bold px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-full hover:bg-amber-200 disabled:opacity-50"
            >
              {hintLoading ? 'جاري...' : 'رغبة في تلميح؟ 💡'}
            </button>
          )}
          <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm px-2 py-1 rounded-md">
            {question.points} نقطة
          </span>
        </div>
      </div>
      
      <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 font-medium">
        {question.instruction}
      </p>

      {hint && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border-r-4 border-amber-400 rounded-l-lg text-amber-800 dark:text-amber-300 text-sm animate-in slide-in-from-right duration-500">
          <strong>تلميح من المعلم:</strong> {hint}
        </div>
      )}

      {question.content && (
        <pre dir="ltr" className="bg-slate-900 dark:bg-slate-950 text-indigo-300 dark:text-indigo-400 p-4 rounded-lg mb-6 font-mono text-left overflow-x-auto border-l-4 border-indigo-500 shadow-inner">
          <code>{question.content}</code>
        </pre>
      )}

      {showRunner && <PythonRunner />}

      <div className="space-y-3 mt-6">
        {(question.type === QuestionType.MULTIPLE_CHOICE || question.type === QuestionType.TRUE_FALSE || question.type === QuestionType.CODE_OUTPUT) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onChange(option)}
                className={`p-4 text-right rounded-lg border-2 transition-all duration-200 active:scale-95 ${
                  answer === option
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm font-bold'
                    : 'border-slate-100 dark:border-slate-700 hover:border-indigo-200 hover:bg-slate-50 text-slate-600 dark:text-slate-400'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {question.type === QuestionType.FILL_IN_BLANKS && (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-slate-500 dark:text-slate-400">الإجابة:</label>
            <div className="relative">
              <input
                type="text"
                value={localInputValue}
                onChange={(e) => setLocalInputValue(e.target.value)}
                placeholder={question.placeholder}
                className="w-full p-4 rounded-lg border-2 bg-white dark:bg-slate-900 focus:ring-4 focus:outline-none text-lg transition-all text-left font-mono dark:text-white border-slate-100 dark:border-slate-700 focus:border-indigo-500"
                dir="ltr"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
