
import React from 'react';
import { Question, QuestionType } from '../types';

interface QuestionCardProps {
  question: Question;
  answer: string | string[];
  onChange: (val: string | string[]) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, answer, onChange }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-fadeIn">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-indigo-700">{question.title}</h2>
        <span className="bg-indigo-100 text-indigo-700 text-sm px-2 py-1 rounded-md">
          {question.points} نقاط
        </span>
      </div>
      
      <p className="text-lg text-slate-700 mb-6 font-medium">
        {question.instruction}
      </p>

      {question.content && (
        <pre 
          dir="ltr"
          className="bg-slate-900 text-indigo-300 p-4 rounded-lg mb-6 font-mono text-left overflow-x-auto border-l-4 border-indigo-500 shadow-inner"
        >
          <code>{question.content}</code>
        </pre>
      )}

      <div className="space-y-3">
        {(question.type === QuestionType.MULTIPLE_CHOICE || question.type === QuestionType.TRUE_FALSE || question.type === QuestionType.CODE_OUTPUT) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onChange(option)}
                className={`p-4 text-right rounded-lg border-2 transition-all duration-200 active:scale-95 ${
                  answer === option
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm font-bold'
                    : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {question.type === QuestionType.FILL_IN_BLANKS && (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              الإجابة:
            </label>
            <input
              type="text"
              value={answer as string || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={question.placeholder}
              className="w-full p-4 rounded-lg border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none text-lg transition-all text-left font-mono"
              dir="ltr"
            />
            <p className="text-xs text-slate-400">
              * يرجى كتابة الكود البرمجي كما هو مطلوب في التعليمات أعلاه.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
