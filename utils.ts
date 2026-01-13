
import { Question } from './types';

export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const generateExamSignature = (studentId: string, questions: Question[]): string => {
  const base = `${studentId}-${questions.map(q => q.correctAnswer).join('|')}`;
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    const char = base.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).toUpperCase();
};

export const materializeQuestion = (q: Question): Question => {
  if (!q.isDynamic) return q;

  const newQ = { ...q, dynamicParams: {} as Record<string, any> };
  
  // Basic Randomization Logic for General Python
  if (q.id === 'q1') {
    const a = Math.floor(Math.random() * 20) + 10;
    const b = [2, 3, 5][Math.floor(Math.random() * 3)];
    const result = Math.floor(a / b);
    newQ.content = `a = ${a}\nb = ${b}\nx = a // b\nprint(x)`;
    newQ.correctAnswer = result.toString();
    const options = new Set([result.toString()]);
    while(options.size < 4) {
      options.add((result + Math.floor(Math.random() * 10) - 5).toString());
    }
    newQ.options = shuffleArray(Array.from(options));
    newQ.dynamicParams = { a, b };
  }

  if (q.id === 'q3') {
    const limit = Math.floor(Math.random() * 5) + 3; // 3-7
    newQ.content = `for i in range(______):\n    print(i)`;
    newQ.correctAnswer = limit.toString();
    newQ.dynamicParams = { limit };
  }

  return newQ;
};

const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzyJxZhhdebVEYwHxYFwJ61bkOoQ8a-e1XmXYVUOBXZE7e6ZMJ9p-g4zga9AnssSnuB/exec'; 

export const saveToMockSheet = async (data: { headers: string[], rowData: any[] }) => {
  if (GOOGLE_SHEETS_WEBHOOK_URL) {
    try {
      await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.error('Error sending data:', e);
      throw e;
    }
  }
};

export const downloadAsCSV = (state: any, allQuestions: Question[]) => {
  const { studentInfo, answers, examSignature } = state;
  let csvContent = "\uFEFF"; 
  const headers = ["الاسم", "الصف", "رقم الهوية", "חתימת אבטחה", ...allQuestions.map(q => `${q.title} (Params)`), ...allQuestions.map(q => q.title), "وقت التسليم"];
  csvContent += headers.join(",") + "\n";
  
  const row = [
    `"${studentInfo.name}"`,
    `"${studentInfo.class}"`,
    `"${studentInfo.studentId}"`,
    `"${examSignature}"`,
    ...allQuestions.map(q => `"${JSON.stringify(q.dynamicParams || {}).replace(/"/g, '""')}"`),
    ...allQuestions.map(q => {
      const ans = answers[q.id];
      const formattedAns = Array.isArray(ans) ? ans.join("; ") : (ans || "لم تتم الإجابة");
      return `"${formattedAns.toString().replace(/"/g, '""')}"`;
    }),
    `"${new Date().toLocaleString('ar-EG')}"`
  ];
  
  csvContent += row.join(",") + "\n";

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `امتحان_بايثون_${studentInfo.name}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
