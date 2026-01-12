
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

const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzyJxZhhdebVEYwHxYFwJ61bkOoQ8a-e1XmXYVUOBXZE7e6ZMJ9p-g4zga9AnssSnuB/exec'; 

export const saveToMockSheet = async (data: { headers: string[], rowData: any[] }) => {
  console.log('🚀 Sending data to Google Sheets:', data);
  
  if (GOOGLE_SHEETS_WEBHOOK_URL) {
    try {
      await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      console.log('✅ Data sent successfully!');
    } catch (e) {
      console.error('❌ Error sending data:', e);
      throw e;
    }
  }
};

export const downloadAsCSV = (studentInfo: any, allQuestions: any[], answers: any) => {
  let csvContent = "\uFEFF"; 
  const headers = ["اسم الطالب", "الصف", "رقم الهوية", ...allQuestions.map(q => q.title), "وقت التسليم"];
  csvContent += headers.join(",") + "\n";
  
  const row = [
    `"${studentInfo.name}"`,
    `"${studentInfo.class}"`,
    `"${studentInfo.studentId}"`,
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