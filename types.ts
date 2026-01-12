
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
  content?: string; // e.g., code snippet
  options?: string[];
  placeholder?: string;
  points: number;
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
  startTime: number | null;
  timeLeft: number;
  isFinished: boolean;
  studentInfo: StudentInfo | null;
  fullscreenExits: number; // New field to track cheating attempts
}
