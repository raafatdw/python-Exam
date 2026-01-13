
import { Question, QuestionType } from './types';

export const RAW_QUESTIONS: Question[] = [
  {
    id: 'q1',
    isDynamic: true,
    type: QuestionType.CODE_OUTPUT,
    title: 'تمرين 1: المتغيرات',
    instruction: 'ما هي نتيجة طباعة المتغير x؟',
    content: 'a = 15\nb = 3\nx = a // b\nprint(x)',
    options: ['5', '5.0', '18', '45'],
    points: 10,
    correctAnswer: '5'
  },
  {
    id: 'q2',
    isDynamic: true,
    type: QuestionType.CODE_OUTPUT,
    title: 'تمرين 2: الشروط',
    instruction: 'ماذا سيطبع الكود التالي؟',
    content: 'x = 10\nif x % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")',
    options: ['Even', 'Odd', 'None', 'Error'],
    points: 15,
    correctAnswer: 'Even'
  },
  {
    id: 'q3',
    isDynamic: true,
    type: QuestionType.FILL_IN_BLANKS,
    title: 'تمرين 3: الحلقات',
    instruction: 'أكمل الكود لطباعة الأرقام من 0 إلى 2:',
    content: 'for i in range(______):\n    print(i)',
    placeholder: 'أدخل الرقم هنا',
    points: 15,
    correctAnswer: '3'
  },
  {
    id: 'q4',
    type: QuestionType.TRUE_FALSE,
    title: 'تمرين 4: القوائم',
    instruction: 'هل القائمة التالية تحتوي على 3 عناصر؟',
    content: 'my_list = [1, [2, 3], 4]',
    options: ['صح', 'خطأ'],
    points: 10,
    correctAnswer: 'صح'
  },
  {
    id: 'q5',
    isDynamic: true,
    type: QuestionType.CODE_OUTPUT,
    title: 'تمرين 5: النصوص',
    instruction: 'ما هي نتيجة الكود التالي؟',
    content: 's = "Python"\nprint(s[1:4])',
    options: ['Pyth', 'yth', 'ytho', 'Pyt'],
    points: 20,
    correctAnswer: 'yth'
  },
  {
    id: 'q6',
    type: QuestionType.FILL_IN_BLANKS,
    title: 'تمرين 6: الدوال',
    instruction: 'أكمل الكلمة الناقصة لتعريف الدالة:',
    content: '______ my_function():\n    return True',
    placeholder: 'الكلمة المفتاحية',
    points: 15,
    correctAnswer: 'def'
  }
];
