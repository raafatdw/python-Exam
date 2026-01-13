
export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  FILL_IN_BLANKS = 'FILL_IN_BLANKS',
  CODE_OUTPUT = 'CODE_OUTPUT'
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  instruction: string;
  content?: string;
  options?: string[];
  placeholder?: string;
  points: number;
  correctAnswer?: string;
  // Dynamic features
  isDynamic?: boolean;
  dynamicParams?: Record<string, any>;
  signature?: string; // Unique hash for this specific instance
}

export interface StudentAnswers {
  [questionId: string]: string | string[];
}

export interface StudentInfo {
  name: string;
  class: string;
  studentId: string;
}

export interface ExamState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: StudentAnswers;
  hintsUsed: { [questionId: string]: string };
  startTime: number | null;
  endTime: number | null;
  timeLeft: number;
  isFinished: boolean;
  studentInfo: StudentInfo | null;
  fullscreenExits: number;
  focusLosses: number;
  aiFeedback: string;
  isLocked: boolean;
  examSignature?: string;
}
