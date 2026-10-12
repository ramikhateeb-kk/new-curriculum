import React, { useState } from 'react';
import { Book, Question, QuestionType } from '../types';
import { Database, Plus, Search, Trash2, Filter } from 'lucide-react';

interface QuestionBankProps {
  book: Book;
  grade: number;
}

const INITIAL_BANK_QUESTIONS: Question[] = [
  {
    id: 'qb-1',
    type: 'mcq',
    question: 'ما هي عاصمة مملكة الأنباط الشهيرة المنحوتة في الصخر الوردي جنوب الأردن؟',
    options: ['البترا', 'جرش', 'أم قيس', 'مادبا'],
    answer: 'البترا',
    explanation: 'تعتبر البترا عاصمة الأنباط وأحد عجائب الدنيا السبع.',
    difficulty: 'easy',
    bloomLevel: 'تذكر'
  },
  {
    id: 'qb-2',
    type: 'tf',
    question: 'تأسست إمارة شرق الأردن عام 1921 على يد الأمير عبد الله الأول بن الحسين.',
    options: ['صح', 'خطأ'],
    answer: 'صح',
    explanation: 'تأسست إمارة شرق الأردن في 11 نيسان 1921.',
    difficulty: 'easy',
    bloomLevel: 'تذكر'
  },
  {
    id: 'qb-3',
    type: 'fill',
    question: 'وقعت معركة اليرموك الخالدة في عهد الخليفة الراشدي ...',
    answer: 'عمر بن الخطاب',
    explanation: 'وقعت معركة اليرموك عام 15 هـ / 636 م.',
    difficulty: 'medium',
    bloomLevel: 'فهم'
  },
  {
    id: 'qb-4',
    type: 'short',
    question: 'بيّن العوامل الجغرافية والاقتصادية التي ساهمت في ازدهار تجارة الأنباط في الأردن القديم.',
    answer: 'الموقع المتوسط بين القوافل التجارية واحتكار تجارة البخور واللبان والسيطرة على مصادر المياه.',
    difficulty: 'hard',
    bloomLevel: 'تحليل'
  }
];

export const QuestionBank: React.FC<QuestionBankProps> = ({ book, grade }) => {
  const [questions, setQuestions] = useState<Question[]>(INITIAL_BANK_QUESTIONS);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // New question form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState<QuestionType>('mcq');
  const [newText, setNewText] = useState('');
  const [newOptions, setNewOptions] = useState('خيار 1, خيار 2, خيار 3, خيار 4');
  const [newAnswer, setNewAnswer] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const filtered = questions.filter(q => {
    const matchesType = filterType === 'all' || q.type === filterType;
    const matchesSearch = !searchTerm || q.question.includes(searchTerm) || (q.explanation && q.explanation.includes(searchTerm));
    return matchesType && matchesSearch;
  });

  const handleAddQuestion = () => {
    if (!newText.trim() || !newAnswer.trim()) return;
    const q: Question = {
      id: `qb-custom-${Date.now()}`,
      type: newType,
      question: newText.trim(),
      options: newType === 'mcq' ? newOptions.split(',').map(s => s.trim()) : newType === 'tf' ? ['صح', 'خطأ'] : undefined,
      answer: newAnswer.trim(),
      difficulty: newDifficulty,
      bloomLevel: 'فهم'
    };
    setQuestions([q, ...questions]);
    setShowAddModal(false);
    setNewText('');
    setNewAnswer('');
  };

  const handleDelete = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-100 text-purple-800 rounded-xl">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-850">🏦 بنك الأسئلة المعتمد (خاص بالمشرفين والإدارة)</h2>
            <p className="text-xs text-slate-500">مستودع مركزي للأسئلة المنهجية المصنفة حسب مستويات بلوم ومؤشرات الأداء</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة سؤال جديد للبنك</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث في نصوص الأسئلة والإجابات..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pr-9 pl-3 py-2 text-sm"
          />
        </div>

        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium"
          >
            <option value="all">جميع أنواع الأسئلة</option>
            <option value="mcq">اختيار من متعدد</option>
            <option value="tf">صح أو خطأ</option>
            <option value="fill">أكمل الفراغ</option>
            <option value="short">سؤال قصير</option>
          </select>
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-3">
        {filtered.map((q) => (
          <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  {q.type === 'mcq' ? 'اختيار من متعدد' : q.type === 'tf' ? 'صح/خطأ' : q.type === 'fill' ? 'أكمل فراغ' : 'سؤال قصير'}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  مستوى: {q.difficulty === 'easy' ? 'سهل' : q.difficulty === 'hard' ? 'صعب' : 'متوسط'}
                </span>
              </div>

              <p className="text-sm font-bold text-slate-850">{q.question}</p>

              {q.options && (
                <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                  {q.options.map((opt, oIdx) => (
                    <span key={oIdx} className="bg-white border border-slate-200 px-2 py-0.5 rounded">
                      {opt}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg inline-block">
                الإجابة النموذجية: {q.answer}
              </div>
            </div>

            <button
              onClick={() => handleDelete(q.id)}
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
              title="حذف من البنك"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-xs">
            لا توجد أسئلة تطابق معايير البحث.
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-right">
            <h3 className="text-base font-bold text-slate-800 mb-4">إضافة سؤال جديد لبنك الأسئلة</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">نوع السؤال:</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as QuestionType)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                >
                  <option value="mcq">اختيار من متعدد</option>
                  <option value="tf">صح أو خطأ</option>
                  <option value="fill">أكمل الفراغ</option>
                  <option value="short">سؤال قصير</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">نص السؤال:</label>
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 h-20"
                  placeholder="اكتب نص السؤال هنا..."
                />
              </div>

              {newType === 'mcq' && (
                <div>
                  <label className="font-semibold block mb-1">الخيارات (افصل بينها بفاصلة ,):</label>
                  <input
                    type="text"
                    value={newOptions}
                    onChange={(e) => setNewOptions(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold block mb-1">الإجابة النموذجية:</label>
                <input
                  type="text"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                  placeholder="الإجابة الصحيحة..."
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={handleAddQuestion}
                className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 rounded-xl text-xs"
              >
                حفظ في البنك
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 rounded-xl text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
