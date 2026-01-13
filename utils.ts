
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

// Generates a unique signature for the exam session to prevent plagiarism
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

// Randomizes a single question based on dynamic rules
export const materializeQuestion = (q: Question): Question => {
  if (!q.isDynamic) return q;

  const newQ = { ...q, dynamicParams: {} as Record<string, any> };
  
  if (q.id === '1a' || q.id === '1b') {
    const names = ['Alice', 'Bob', 'Charlie', 'Dana', 'Elias', 'Fadi'];
    const selectedName = names[Math.floor(Math.random() * names.length)];
    const selectedAge = Math.floor(Math.random() * (18 - 12 + 1)) + 12;

    if (q.id === '1a') {
      newQ.instruction = `أدخل قيمة للمتغير name بحيث يحتوي على الاسم "${selectedName}"`;
      newQ.correctAnswer = `"${selectedName}"`;
      newQ.dynamicParams = { name: selectedName };
    } else {
      newQ.instruction = `أدخل قيمة للمتغير age بحيث يحتوي على الرقم ${selectedAge}`;
      newQ.correctAnswer = selectedAge.toString();
      newQ.dynamicParams = { age: selectedAge };
    }
  }

  if (q.id === '2-snip1') {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 5) + 1;
    const offset = Math.floor(Math.random() * 3) + 1;
    const result = n1 + n2 - offset;

    newQ.content = `num1 = ${n1}\nnum2 = ${n2}\nnum1 = num1 + num2 - ${offset}\nprint(num1)`;
    newQ.correctAnswer = result.toString();
    
    // Generate new options based on the dynamic result
    const options = new Set([result.toString()]);
    while(options.size < 4) {
      options.add((result + Math.floor(Math.random() * 5) - 2).toString());
    }
    newQ.options = shuffleArray(Array.from(options));
    newQ.dynamicParams = { n1, n2, offset };
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
  const headers = ["الاسم", "الصف", "رقم الهوية", "حساب الأمان", ...allQuestions.map(q => `${q.title} (Params)`), ...allQuestions.map(q => q.title), "وقت التسليم"];
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
