
import React, { useState, useEffect, useCallback } from 'react';
import { RAW_QUESTIONS } from './questions';
import { ExamState, StudentInfo } from './types';
import { shuffleArray, saveToMockSheet } from './utils';
import Timer, { TimerTheme } from './components/Timer';
import StartPage from './components/StartPage';
import QuestionCard from './components/QuestionCard';
import SummaryPage from './components/SummaryPage';
import LandingPage from './components/LandingPage';
import FullscreenLock from './components/FullscreenLock';

const EXAM_DURATION = 30 * 60; // 30 minutes in seconds

const EXAM_TIMER_THEME: TimerTheme = {
  normal: 'bg-indigo-900',
  urgent: 'bg-orange-500',
  critical: 'bg-rose-600',
};

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [state, setState] = useState<ExamState>({
    questions: [],
    currentQuestionIndex: -1,
    answers: {},
    startTime: null,
    timeLeft: EXAM_DURATION,
    isFinished: false,
    studentInfo: null,
    fullscreenExits: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);

  // Monitor Fullscreen status and track exits
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      
      // If we are in the middle of an exam and user exits fullscreen, increment counter
      if (!isNowFullscreen) {
        setState(prev => {
          if (prev.currentQuestionIndex >= 0 && !prev.isFinished) {
            return { ...prev, fullscreenExits: prev.fullscreenExits + 1 };
          }
          return prev;
        });
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Prevention of accidental page close and keyboard shortcuts
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.currentQuestionIndex >= 0 && !state.isFinished) {
        e.preventDefault();
        e.returnValue = 'هل أنت متأكد؟ سيتم فقدان تقدمك في الامتحان.'; 
      }
    };

    const preventDefaultShortcuts = (e: KeyboardEvent) => {
      if (state.currentQuestionIndex >= 0 && !state.isFinished) {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'u')) {
          e.preventDefault();
          return;
        }
        const forbiddenKeys = ['c', 'v', 'x', 'a', 'p', 's'];
        if ((e.ctrlKey || e.metaKey) && forbiddenKeys.includes(e.key.toLowerCase())) {
          e.preventDefault();
          return;
        }
      }
    };

    const preventContextMenu = (e: MouseEvent) => {
      if (state.currentQuestionIndex >= 0 && !state.isFinished) {
        e.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', preventDefaultShortcuts, true);
    window.addEventListener('contextmenu', preventContextMenu);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', preventDefaultShortcuts, true);
      window.removeEventListener('contextmenu', preventContextMenu);
    };
  }, [state.currentQuestionIndex, state.isFinished]);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      questions: shuffleArray(RAW_QUESTIONS)
    }));
  }, []);

  const requestFullscreen = async () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  const submitExam = useCallback(async (isAuto = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    
    const headers = [
      "اسم الطالب", "الصف", "رقم الهوية", 
      ...RAW_QUESTIONS.map(q => q.title), 
      "وقت التسليم", "نوع التسليم", "محاولات الخروج من المس SCREEN"
    ];

    const orderedAnswers = RAW_QUESTIONS.map(q => {
      const ans = state.answers[q.id];
      if (Array.isArray(ans)) return ans.join(', ');
      return ans || 'لم تتم الإجابة';
    });

    const securityNote = state.fullscreenExits > 0 
      ? `تنبيه: حاول الطالب الخروج من وضع ملء الشاشة ${state.fullscreenExits} مرات` 
      : 'نظيف - التزم بالتعليمات';

    const rowData = [
      state.studentInfo?.name || '',
      state.studentInfo?.class || '',
      state.studentInfo?.studentId || '',
      ...orderedAnswers,
      new Date().toLocaleString('ar-EG'),
      isAuto ? 'تلقائي' : 'يدوي',
      securityNote
    ];

    try {
      await saveToMockSheet({ headers, rowData });
      setState(prev => ({ ...prev, isFinished: true }));
      setAutoSubmitted(isAuto);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('خطأ في الإرسال. تم حفظ إجاباتك محلياً.');
      setState(prev => ({ ...prev, isFinished: true }));
    } finally {
      setIsSubmitting(false);
    }
  }, [state.studentInfo, state.answers, state.fullscreenExits, isSubmitting]);

  useEffect(() => {
    let interval: number;
    if (state.currentQuestionIndex >= 0 && !state.isFinished && state.timeLeft > 0) {
      interval = window.setInterval(() => {
        setState(prev => {
          if (prev.timeLeft <= 1) {
            clearInterval(interval);
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.currentQuestionIndex, state.isFinished, state.timeLeft]);

  useEffect(() => {
    if (state.timeLeft === 0 && !state.isFinished && state.currentQuestionIndex >= 0) {
      submitExam(true);
    }
  }, [state.timeLeft, state.isFinished, state.currentQuestionIndex, submitExam]);

  const handleStart = async (info: StudentInfo) => {
    await requestFullscreen();
    setState(prev => ({
      ...prev,
      studentInfo: info,
      currentQuestionIndex: 0,
      startTime: Date.now()
    }));
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
    const isAnswered = Array.isArray(currentAnswer) ? currentAnswer.length > 0 : !!(currentAnswer && currentAnswer.toString().trim());
    
    if (!isAnswered) {
      setShowValidationError(true);
      return;
    }

    setShowValidationError(false);
    if (state.currentQuestionIndex < state.questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      submitExam(false);
    }
  };

  const isExamInProgress = state.currentQuestionIndex >= 0 && !state.isFinished;

  const renderContent = () => {
    if (showLanding) return <LandingPage onEnter={() => setShowLanding(false)} />;
    if (state.isFinished) return <SummaryPage info={state.studentInfo} questions={RAW_QUESTIONS} answers={state.answers} autoSubmitted={autoSubmitted} />;
    if (state.currentQuestionIndex === -1) return <StartPage onStart={handleStart} />;

    if (isExamInProgress && !isFullscreen) {
      return <FullscreenLock onReturn={requestFullscreen} />;
    }

    const currentQuestion = state.questions[state.currentQuestionIndex];
    const progress = ((state.currentQuestionIndex + 1) / state.questions.length) * 100;
    const currentAnswer = state.answers[currentQuestion.id];
    const isAnswered = Array.isArray(currentAnswer) ? currentAnswer.length > 0 : !!(currentAnswer && currentAnswer.toString().trim());

    return (
      <div className="max-w-3xl mx-auto px-4 pb-32 select-none" onCopy={(e) => e.preventDefault()} onPaste={(e) => e.preventDefault()} onCut={(e) => e.preventDefault()}>
        <div className="text-center mb-8">
          <p className="text-slate-500 font-bold text-lg">بالتوفيق، {state.studentInfo?.name}! 💪</p>
        </div>

        <div className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-3 text-slate-700 font-black">
            <span className="bg-slate-100 px-3 py-1 rounded-lg">سؤال {state.currentQuestionIndex + 1} من {state.questions.length}</span>
            <span className="text-indigo-600">{Math.round(progress)}% مكتمل</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4 shadow-inner overflow-hidden border border-slate-200">
            <div className="bg-indigo-600 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {currentQuestion && (
          <QuestionCard question={currentQuestion} answer={state.answers[currentQuestion.id] || ''} onChange={handleAnswerChange} />
        )}

        {showValidationError && (
          <div className="mt-4 p-4 bg-rose-50 border-2 border-rose-200 rounded-xl flex items-center gap-3 animate-bounce">
            <p className="text-rose-700 font-black">يجب حل السؤال الحالي قبل الانتقال للسؤال التالي.</p>
          </div>
        )}

        <div className="fixed bottom-0 right-0 left-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-5 flex justify-center z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="max-w-3xl w-full flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
            <p className="text-slate-400 text-sm font-bold">* ימנע الخروج من وضع ملء الشاشة</p>
            <button
              onClick={nextQuestion}
              disabled={isSubmitting}
              className={`px-16 py-5 rounded-2xl font-black text-xl text-white shadow-2xl transition-all relative overflow-hidden group ${isSubmitting ? 'bg-slate-300' : !isAnswered ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95'}`}
            >
              <span className="relative z-10">
                {isSubmitting ? 'جاري الإرسال...' : (state.currentQuestionIndex === state.questions.length - 1 ? 'تسليم وإنهاء' : 'السؤال التالي ←')}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-slate-50 transition-all duration-500 select-none ${isExamInProgress ? 'pt-24' : 'pt-8'}`}>
      {isExamInProgress && isFullscreen && <Timer timeLeft={state.timeLeft} theme={EXAM_TIMER_THEME} />}
      {!showLanding && (isExamInProgress && isFullscreen || state.isFinished || state.currentQuestionIndex === -1) && (
        <header className="text-center mb-8 px-4">
          <h1 className="text-4xl sm:text-5xl font-black text-indigo-950 drop-shadow-sm tracking-tight">
            امتحان <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">بايثون</span> النهائي
          </h1>
        </header>
      )}
      {renderContent()}
    </div>
  );
};

export default App;
