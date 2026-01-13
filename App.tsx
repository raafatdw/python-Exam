
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { RAW_QUESTIONS } from './questions';
import { ExamState, StudentInfo, Question } from './types';
import { shuffleArray, saveToMockSheet, materializeQuestion, generateExamSignature } from './utils';
import Timer, { TimerTheme } from './components/Timer';
import StartPage from './components/StartPage';
import QuestionCard from './components/QuestionCard';
import SummaryPage from './components/SummaryPage';
import LandingPage from './components/LandingPage';
import FullscreenLock from './components/FullscreenLock';
import Scratchpad from './components/Scratchpad';
import Strikes from './components/Strikes';

const EXAM_DURATION = 30 * 60; 
const MAX_STRIKES = 3;

const EXAM_TIMER_THEME: TimerTheme = {
  normal: 'bg-indigo-900 dark:bg-indigo-950',
  urgent: 'bg-orange-500',
  critical: 'bg-rose-600',
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('exam-theme') as 'light' | 'dark') || 'light';
  });

  const [showLanding, setShowLanding] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);

  const [state, setState] = useState<ExamState>({
    questions: [],
    currentQuestionIndex: -1,
    answers: {},
    hintsUsed: {},
    startTime: null,
    endTime: null,
    timeLeft: EXAM_DURATION,
    isFinished: false,
    studentInfo: null,
    fullscreenExits: 0,
    focusLosses: 0,
    aiFeedback: '',
    isLocked: false,
    examSignature: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);

  useEffect(() => {
    if (state.currentQuestionIndex === -1 || state.isFinished) return;

    const triggerSecurityAlert = () => {
      setShowSecurityAlert(true);
      setTimeout(() => setShowSecurityAlert(false), 3000);
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerSecurityAlert();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      const forbiddenKeys = ['c', 'v', 'x', 'a', 's', 'p'];
      
      if (isCmdOrCtrl && forbiddenKeys.includes(e.key.toLowerCase())) {
        e.preventDefault();
        triggerSecurityAlert();
      }
      
      if (e.key === 'F12' || (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'i')) {
        e.preventDefault();
        triggerSecurityAlert();
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerSecurityAlert();
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerSecurityAlert();
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('paste', handlePaste);
    window.addEventListener('copy', handleCopy);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('copy', handleCopy);
    };
  }, [state.currentQuestionIndex, state.isFinished]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('exam-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const fetchHint = async () => {
    if (hintLoading) return;
    const currentQ = state.questions[state.currentQuestionIndex];
    if (state.hintsUsed[currentQ.id]) return;

    setHintLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `أنت معلم لغة بايثون للصف السابع. قدم تلميحاً بسيطاً جداً ومشجعاً للسؤال التالي دون كشف الإجابة. 
        السؤال: ${currentQ.title}
        التعليمות: ${currentQ.instruction}
        الكود/المحتوى: ${currentQ.content || 'لا يوجد كود'}
        أجب باللغة العربية فقط وبشكل مختصر جداً (جملة أو جملتين فقط).`,
      });
      
      const hintText = response.text || "فكر في نوع المتغير أو في العمليات الحسابية الأساسية.";
      setState(prev => ({
        ...prev,
        hintsUsed: { ...prev.hintsUsed, [currentQ.id]: hintText }
      }));
    } catch (error) {
      console.error("Hint error:", error);
    } finally {
      setHintLoading(false);
    }
  };

  const generateAIFeedback = async (answers: any, questions: Question[]) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `بصفتك معلم بايثون خبير، قم بتحليل نتائج الطالب التالية وقدم مراجعة شخصية مشجعة باللغة العربية.
      الأسئلة والإجابات:
      ${questions.map(q => `سؤال: ${q.title}, إجابة الطالب: ${answers[q.id] || 'لم يجب'}, الإجابة الصحيحة: ${q.correctAnswer}`).join('\n')}
      قم بتحديد نقاط القوة ونقاط الضعف، واستخدم نبرة إيجابية ملهمة. (بحد أقصى 150 كلمة).`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      return response.text || "أحسنت في محاولتك! استمر في التدرب على بايثون.";
    } catch (e) {
      return "تم إكمال الامتحان بنجاح. فخورون بجهودك!";
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      if (!isNowFullscreen && state.currentQuestionIndex >= 0 && !state.isFinished) {
        setState(prev => {
          const newExits = prev.fullscreenExits + 1;
          const isLocked = newExits >= MAX_STRIKES;
          return { ...prev, fullscreenExits: newExits, isLocked };
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && state.currentQuestionIndex >= 0 && !state.isFinished) {
        setState(prev => ({ ...prev, focusLosses: prev.focusLosses + 1 }));
        setIsWindowFocused(false);
      } else {
        setIsWindowFocused(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.currentQuestionIndex, state.isFinished]);

  useEffect(() => {
    if (state.isLocked && !state.isFinished) {
      submitExam(true);
    }
  }, [state.isLocked]);

  const submitExam = useCallback(async (isAuto = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    const aiReview = await generateAIFeedback(state.answers, state.questions);
    
    const headers = ["الاسم", "الصف", "رقم الهوية", "חתימת אבטחה", ...state.questions.map(q => q.title), "וقت التسليم", "AI Feedback"];
    const orderedAnswers = state.questions.map(q => state.answers[q.id] || 'لم تتم الإجابة');
    const rowData = [state.studentInfo?.name, state.studentInfo?.class, state.studentInfo?.studentId, state.examSignature, ...orderedAnswers, new Date().toLocaleString('ar-EG'), aiReview];

    try {
      await saveToMockSheet({ headers, rowData });
      setState(prev => ({ ...prev, isFinished: true, endTime: Date.now(), aiFeedback: aiReview }));
      setAutoSubmitted(isAuto);
    } catch (error) {
      setState(prev => ({ ...prev, isFinished: true, endTime: Date.now(), aiFeedback: aiReview }));
    } finally {
      setIsSubmitting(false);
    }
  }, [state.studentInfo, state.answers, state.questions, state.examSignature, isSubmitting]);

  useEffect(() => {
    let interval: number;
    if (state.currentQuestionIndex >= 0 && !state.isFinished && state.timeLeft > 0 && !state.isLocked) {
      interval = window.setInterval(() => {
        setState(prev => ({ ...prev, timeLeft: Math.max(0, prev.timeLeft - 1) }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.currentQuestionIndex, state.isFinished, state.isLocked]);

  useEffect(() => {
    if (state.timeLeft === 0 && !state.isFinished && state.currentQuestionIndex >= 0) {
      submitExam(true);
    }
  }, [state.timeLeft, submitExam]);

  const handleStart = async (info: StudentInfo) => {
    await requestFullscreen();
    // Shuffling + Dynamic Randomization
    const shuffledRaw = shuffleArray(RAW_QUESTIONS);
    const materialized = shuffledRaw.map(q => {
      const mat = materializeQuestion(q);
      if (mat.options) {
        mat.options = shuffleArray(mat.options);
      }
      return mat;
    });

    const signature = generateExamSignature(info.studentId, materialized);

    setState(prev => ({
      ...prev,
      studentInfo: info,
      questions: materialized,
      currentQuestionIndex: 0,
      startTime: Date.now(),
      examSignature: signature
    }));
  };

  const requestFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {}
  };

  const handleAnswerChange = (val: string | string[]) => {
    const qId = state.questions[state.currentQuestionIndex].id;
    setShowValidationError(false);
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [qId]: val }
    }));
  };

  const nextQuestion = () => {
    const currentQuestion = state.questions[state.currentQuestionIndex];
    const currentAnswer = state.answers[currentQuestion.id];
    const isAnswered = !!(Array.isArray(currentAnswer) ? currentAnswer.length : (currentAnswer && currentAnswer.toString().trim()));
    
    if (!isAnswered) {
      setShowValidationError(true);
      return;
    }

    if (state.currentQuestionIndex < state.questions.length - 1) {
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
    } else {
      submitExam(false);
    }
  };

  const isExamInProgress = state.currentQuestionIndex >= 0 && !state.isFinished;

  const renderContent = () => {
    if (showLanding) return <LandingPage onEnter={() => setShowLanding(false)} />;
    if (state.isFinished) return <SummaryPage state={state} questions={state.questions} autoSubmitted={autoSubmitted} />;
    if (state.currentQuestionIndex === -1) return <StartPage onStart={handleStart} />;
    if (isExamInProgress && !isFullscreen && !state.isLocked) return <FullscreenLock onReturn={requestFullscreen} />;

    if (state.isLocked) return (
      <div className="max-w-xl mx-auto mt-20 p-12 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border-4 border-rose-500 text-center animate-fadeIn">
        <h2 className="text-3xl font-black text-rose-600 mb-4">تم قفل الامتحان!</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 font-bold">بسبب محاولات الخروج المتكررة من وضع الأمان، تم إنهاء الامتحان وحفظ النتائج الحالية.</p>
      </div>
    );

    const currentQuestion = state.questions[state.currentQuestionIndex];
    const progress = ((state.currentQuestionIndex + 1) / state.questions.length) * 100;

    return (
      <div className={`max-w-3xl mx-auto px-4 pb-32 select-none relative transition-all duration-300 ${!isWindowFocused ? 'blur-xl grayscale' : ''}`}>
        <Strikes current={state.fullscreenExits} max={MAX_STRIKES} />
        
        <div className="relative z-10">
          <div className="mb-10 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-3 text-slate-700 dark:text-slate-300 font-black">
              <span>السؤال {state.currentQuestionIndex + 1} من {state.questions.length}</span>
              <span className="text-indigo-600 dark:text-indigo-400">{Math.round(progress)}% مكتمل</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
              <div className="bg-indigo-600 h-4 transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <QuestionCard 
            question={currentQuestion} 
            answer={state.answers[currentQuestion.id] || ''} 
            onChange={handleAnswerChange}
            hint={state.hintsUsed[currentQuestion.id]}
            onGetHint={fetchHint}
            hintLoading={hintLoading}
          />

          {showValidationError && (
            <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-950/30 border-2 border-rose-200 rounded-xl text-rose-700 font-black text-center animate-bounce">
              يجب الإجابة على السؤال قبل المتابعة.
            </div>
          )}
        </div>

        <div className="fixed bottom-0 right-0 left-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 p-5 flex justify-center z-[110]">
          <div className="max-w-3xl w-full flex justify-between items-center gap-4 px-4">
             <button onClick={nextQuestion} disabled={isSubmitting} className="w-full sm:w-auto px-16 py-5 rounded-2xl font-black text-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl transition-all active:scale-95">
              {isSubmitting ? 'جاري الإرسال...' : (state.currentQuestionIndex === state.questions.length - 1 ? 'تسليم نهائي' : 'السؤال التالي ←')}
            </button>
            <button onClick={() => setIsScratchpadOpen(prev => !prev)} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold border">
              {isScratchpadOpen ? 'إغلاق المسودة' : 'مسودة الملاحظات 📝'}
            </button>
          </div>
        </div>
        
        {isScratchpadOpen && <Scratchpad />}
        
        {showSecurityAlert && (
          <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-rose-600 text-white px-8 py-4 rounded-2xl shadow-2xl z-[200] font-black text-lg animate-slideUp flex items-center gap-3 border-2 border-rose-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            تنبيه: النسخ واللصق والنقر الأيمن ممنوع تماماً!
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 ${isExamInProgress ? 'pt-24' : 'pt-8'}`}>
      {!isExamInProgress && !state.isFinished && (
        <button onClick={toggleTheme} className="fixed top-6 left-6 z-[120] p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg border">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      )}

      {isExamInProgress && isFullscreen && <Timer timeLeft={state.timeLeft} theme={EXAM_TIMER_THEME} />}
      {!showLanding && (
        <header className="text-center mb-8 px-4 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-black text-indigo-950 dark:text-white">امتحان بايثون</h1>
        </header>
      )}
      {renderContent()}
    </div>
  );
};

export default App;
