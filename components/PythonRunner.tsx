
import React, { useState, useEffect } from 'react';

const PythonRunner: React.FC = () => {
  const [code, setCode] = useState('print("مرحباً بك في بايثون!")');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pyodide, setPyodide] = useState<any>(null);

  useEffect(() => {
    async function initPyodide() {
      if ((window as any).loadPyodide) {
        const instance = await (window as any).loadPyodide();
        setPyodide(instance);
        setIsLoading(false);
      }
    }
    initPyodide();
  }, []);

  const runCode = async () => {
    if (!pyodide) return;
    setOutput('جاري التشغيل...');
    try {
      // Clear output
      pyodide.runPython('import sys\nfrom io import StringIO\nsys.stdout = StringIO()');
      pyodide.runPython(code);
      const stdout = pyodide.runPython('sys.stdout.getvalue()');
      setOutput(stdout || 'لا يوجد مخرجات');
    } catch (err: any) {
      setOutput(`خطأ: ${err.message}`);
    }
  };

  // Prevent pasting into the code runner
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  return (
    <div className="mt-6 bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
      <div className="bg-slate-800 px-4 py-2 flex justify-between items-center">
        <span className="text-indigo-400 font-mono text-sm font-bold tracking-tight">مختبر الكود المباشر</span>
        {isLoading ? (
          <span className="text-slate-400 text-xs animate-pulse">جاري تحميل بايثون...</span>
        ) : (
          <button onClick={runCode} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1 rounded-md font-bold transition-colors">
            تشغيل الكود ▶
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <textarea
          value={code}
          onPaste={handlePaste}
          onChange={(e) => setCode(e.target.value)}
          dir="ltr"
          className="bg-slate-900 text-emerald-400 p-4 font-mono text-sm h-40 outline-none resize-none"
          spellCheck={false}
        />
        <div className="bg-slate-950 p-4 border-t md:border-t-0 md:border-r border-slate-800 h-40 overflow-auto">
          <span className="text-slate-500 text-[10px] block mb-1 uppercase tracking-widest font-bold">المخرجات (Console):</span>
          <pre dir="ltr" className="text-slate-300 font-mono text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default PythonRunner;
