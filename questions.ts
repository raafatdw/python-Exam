
import { Question, QuestionType } from './types';

export const RAW_QUESTIONS: Question[] = [
  {
    id: '1a',
    isDynamic: true,
    type: QuestionType.FILL_IN_BLANKS,
    title: 'تمرين 1 - أ',
    instruction: 'أدخل قيمة للمتغير name بحيث يحتوي على الاسم "Bob"',
    content: 'name = ______',
    placeholder: 'اكتب القيمة هنا',
    points: 5,
    correctAnswer: '"Bob"'
  },
  {
    id: '1b',
    isDynamic: true,
    type: QuestionType.FILL_IN_BLANKS,
    title: 'تمرين 1 - ב',
    instruction: 'أدخل قيمة للمتغير age بحيث يحتوي على الرقم 14',
    content: 'age = ______',
    placeholder: 'اكتب القيمة هنا',
    points: 5,
    correctAnswer: '14'
  },
  {
    id: '1c1',
    type: QuestionType.TRUE_FALSE,
    title: 'تمرين 1 - ج (1)',
    instruction: 'هل المتغير my_birth_year هو من نوع int؟',
    content: 'my_birth_year = 2006\nprint(type(my_birth_year))',
    options: ['صح', 'خطأ'],
    points: 5,
    correctAnswer: 'صح'
  },
  {
    id: '2d',
    type: QuestionType.MULTIPLE_CHOICE,
    title: 'تمرين 2 - د',
    instruction: 'اختر الكود الصحيح لتعريف متغير للصف الثامن (8):',
    options: ['class_num = 1', 'class_num = 2', 'class_num = 8', 'class_num = 3'],
    points: 10,
    correctAnswer: 'class_num = 8'
  },
  {
    id: '2-snip1',
    isDynamic: true,
    type: QuestionType.CODE_OUTPUT,
    title: 'تمرين 2 - حسابات',
    instruction: 'ما هي مخرجات الكود التالي؟',
    content: 'num1 = 4\nnum2 = 2\nnum1 = num1 + num2 - 1\nprint(num1)',
    options: ['8', '5', '6', '4'],
    points: 10,
    correctAnswer: '5'
  },
  {
    id: '3-vars',
    type: QuestionType.FILL_IN_BLANKS,
    title: 'تمرين 3 - إدخال',
    instruction: 'أكمل الكود لطباعة الطول:',
    content: 'height = 170\nprint("My height is ", ________)',
    placeholder: 'اسم المتغير',
    points: 10,
    correctAnswer: 'height'
  },
  {
    id: '8-mult',
    type: QuestionType.CODE_OUTPUT,
    title: 'تمرين 8 - ضرب النصوص',
    instruction: 'ما هي المخرجات؟',
    content: 'text = "Love"\nprint(text * 3)',
    options: ['LoveLoveLove', 'Love 3', 'Love*3', 'Error'],
    points: 10,
    correctAnswer: 'LoveLoveLove'
  }
];
