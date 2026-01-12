
import { Question, QuestionType } from './types';

export const RAW_QUESTIONS: Question[] = [
  {
    id: '1a',
    type: QuestionType.FILL_IN_BLANKS,
    title: 'تمرين 1 - أ',
    instruction: 'أدخل قيمة للمتغير name بحيث يحتوي على الاسم "Bob"',
    content: 'name = ______',
    placeholder: 'اكتب القيمة هنا',
    points: 5
  },
  {
    id: '1b',
    type: QuestionType.FILL_IN_BLANKS,
    title: 'تمرين 1 - ب',
    instruction: 'أدخل قيمة للمتغير age بحيث يحتوي على الرقم 14',
    content: 'age = ______',
    placeholder: 'اكتب القيمة هنا',
    points: 5
  },
  {
    id: '1c1',
    type: QuestionType.TRUE_FALSE,
    title: 'تمرين 1 - ج (1)',
    instruction: 'هل المتغير my_birth_year هو من نوع int؟',
    content: 'my_birth_year = 2006\nprint(type(my_birth_year))',
    options: ['صح', 'خطأ'],
    points: 5
  },
  {
    id: '1c2',
    type: QuestionType.TRUE_FALSE,
    title: 'تمرين 1 - ج (2)',
    instruction: 'هل ستكون مخرجات الكود <class \'int\'>؟',
    content: 'my_birth_year = 2006\nprint(type(my_birth_year))',
    options: ['صح', 'خطأ'],
    points: 5
  },
  {
    id: '2d',
    type: QuestionType.MULTIPLE_CHOICE,
    title: 'تمرين 2 - د',
    instruction: 'اختر الكود الصحيح لتعريف متغير للصف د (4):',
    options: ['class_num = 1', 'class_num = 2', 'class_num = 4', 'class_num = 3'],
    points: 10
  },
  {
    id: '2-snip1',
    type: QuestionType.CODE_OUTPUT,
    title: 'تمرين 2 - حسابات',
    instruction: 'ما هي مخرجات الكود التالي؟',
    content: 'num1 = 4\nnum2 = 2\nnum1 = num1 + num2 - 1\nprint(num1)',
    options: ['8', '5', '6', '4'],
    points: 10
  },
  {
    id: '2-snip2',
    type: QuestionType.CODE_OUTPUT,
    title: 'تمرين 2 - ضرب',
    instruction: 'ما هي مخرجات الكود التالي؟',
    content: 'num1 = 4\nnum2 = 2\nprint(num1 * num2)',
    options: ['8', '4', '16', '6'],
    points: 10
  },
  {
    id: '2-snip3',
    type: QuestionType.CODE_OUTPUT,
    title: 'تمرين 2 - أس',
    instruction: 'ما هي مخرجات الكود التالي؟',
    content: 'num1 = 4\nnum2 = 2\nprint(num1 ** num2)',
    options: ['8', '16', '6', '4'],
    points: 10
  },
  {
    id: '3-vars',
    type: QuestionType.FILL_IN_BLANKS,
    title: 'تمرين 3 - إدخال',
    instruction: 'أكمل الكود لطباعة الطول:',
    content: 'height = 170\nprint("My height is ", ________)',
    placeholder: 'اسم المتغير',
    points: 10
  },
  {
    id: '4-sum',
    type: QuestionType.FILL_IN_BLANKS,
    title: 'تمرين 4 - مجموع',
    instruction: 'أكمل السطر لحساب مجموع المتغيرات num1 و num2:',
    content: 'sum = ______ + ______',
    placeholder: 'أكمل التعبير',
    points: 10
  },
  {
    id: '7-str',
    type: QuestionType.CODE_OUTPUT,
    title: 'تمرين 7',
    instruction: 'ما هي مخرجات الكود؟',
    content: 'text = "I love python"\nprint(text)',
    options: ['I love python', 'text', 'Error', 'Nothing'],
    points: 5
  },
  {
    id: '8-mult',
    type: QuestionType.CODE_OUTPUT,
    title: 'تمرين 8 - ضرب النصوص',
    instruction: 'ما هي المخرجات؟',
    content: 'text = "Love"\nprint(text * 3)',
    options: ['LoveLoveLove', 'Love 3', 'Love*3', 'Error'],
    points: 10
  },
  {
    id: '8-math',
    type: QuestionType.CODE_OUTPUT,
    title: 'تمرين 8 - حساب',
    instruction: 'ما هي المخرجات؟',
    content: 'number = 10\nprint(number * 10)',
    options: ['100', '1010', 'number*10', '10'],
    points: 10
  }
];