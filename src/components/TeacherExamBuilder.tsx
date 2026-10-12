import React, { useState } from 'react';
import { Book, Question } from '../types';
import { generateExamQuestions } from '../services/geminiService';
import { FileText, Printer, Download, Sparkles, Loader2, CheckSquare } from 'lucide-react';

interface TeacherExamBuilderProps {
  book: Book;
  grade: number;
}

export const TeacherExamBuilder: React.FC<TeacherExamBuilderProps> = ({ book, grade }) => {
  const [examKind, setExamKind] = useState<'الأول' | 'الثاني' | 'النهائي'>('الأول');
  const [schoolName, setSchoolName] = useState('مدرسة الملك عبد الله الثاني للتميز');
  const [directorate, setDirectorate] = useState('مديرية التربية والتعليم لقصبة عمان');
  const [duration, setDuration] = useState('ساعة واحدة');
  const [totalMarks, setTotalMarks] = useState(20);

  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [mcqCount, setMcqCount] = useState(3);
  const [tfCount, setTfCount] = useState(2);
  const [fillCount, setFillCount] = useState(1);
  const [shortCount, setShortCount] = useState(1);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  // Flatten all available lessons
  const allLessons = book.units.flatMap(u => u.lessons.map(l => l.title));

  const toggleLesson = (title: string) => {
    setSelectedLessons(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const handleGenerateExam = async () => {
    const lessonsToUse = selectedLessons.length > 0 ? selectedLessons : [allLessons[0] || 'الدرس الأول'];
    setLoading(true);
    try {
      const qs = await generateExamQuestions(
        book.subject,
        grade,
        lessonsToUse,
        { mcq: mcqCount, tf: tfCount, fill: fillCount, short: shortCount }
      );
      setQuestions(qs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 no-print">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-100 text-indigo-800 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-850">🧾 منشئ الاختبارات المدرسية الرسمية</h2>
            <p className="text-xs text-slate-500">إعداد وتصدير نماذج امتحانات متوافقة مع معايير وزارة التربية والتعليم الأردنية</p>
          </div>
        </div>

        {questions.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة ورقة الامتحان</span>
            </button>
          </div>
        )}
      </div>

      {/* Control Panel (Hidden during printing) */}
      <div className="no-print space-y-5 mb-6">
        {/* Exam Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">نوع الاختبار:</label>
            <select
              value={examKind}
              onChange={(e) => setExamKind(e.target.value as any)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="الأول">امتحان الشهر الأول</option>
              <option value="الثاني">امتحان الشهر الثاني</option>
              <option value="النهائي">امتحان نهاية الفصل الدراسي</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">اسم المدرسة:</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">مديرية التربية:</label>
            <input
              type="text"
              value={directorate}
              onChange={(e) => setDirectorate(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">مدة الامتحان والعلامة:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="زمن الامتحان"
                className="w-1/2 bg-white border border-slate-300 rounded-lg p-2 font-medium"
              />
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                className="w-1/2 bg-white border border-slate-300 rounded-lg p-2 font-medium"
                title="العلامة الكلية"
              />
            </div>
          </div>
        </div>

        {/* Lessons to include */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            اختر الدروس الداخلة في الامتحان (أو اترك فارغاً لاختيار كل الوحدات):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            {allLessons.map((l, i) => {
              const isChecked = selectedLessons.includes(l);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleLesson(l)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-right transition-all ${
                    isChecked ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <CheckSquare className={`w-3.5 h-3.5 ${isChecked ? 'text-indigo-600' : 'text-slate-300'}`} />
                  <span className="truncate">{l}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question distribution */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">اختيار من متعدد:</label>
            <input
              type="number"
              min={0}
              max={15}
              value={mcqCount}
              onChange={(e) => setMcqCount(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">صح أو خطأ:</label>
            <input
              type="number"
              min={0}
              max={10}
              value={tfCount}
              onChange={(e) => setTfCount(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">أكمل الفراغ:</label>
            <input
              type="number"
              min={0}
              max={10}
              value={fillCount}
              onChange={(e) => setFillCount(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">أسئلة مقالية قصيرة:</label>
            <input
              type="number"
              min={0}
              max={5}
              value={shortCount}
              onChange={(e) => setShortCount(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
            />
          </div>
        </div>

        <button
          onClick={handleGenerateExam}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جارٍ صياغة وتنسيق أسئلة الاختبار...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>توليد نموذج الامتحان الآن</span>
            </>
          )}
        </button>
      </div>

      {/* Official Jordanian Exam Printable Paper */}
      {questions.length > 0 && (
        <div className="bg-white border-2 border-slate-800 p-8 rounded-xl shadow-sm text-slate-900 printable-exam">
          {/* Official Ministry Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex justify-between items-start text-xs font-bold leading-relaxed mb-3">
              <div className="text-right">
                <p>المملكة الأردنية الهاشمية</p>
                <p>وزارة التربية والتعليم</p>
                <p>{directorate}</p>
                <p>{schoolName}</p>
              </div>
              <div className="text-center font-extrabold text-sm border-2 border-slate-900 px-4 py-2 rounded-md">
                <p>امتحان {examKind} لمبحث {book.subject}</p>
                <p>الصف: {grade} | الفصل الدراسي: {book.semester === 1 ? 'الأول' : 'الثاني'}</p>
              </div>
              <div className="text-left">
                <p>العام الدراسي: 2026 / 2027</p>
                <p>زمن الامتحان: {duration}</p>
                <p>العلامة الكلية: ({totalMarks}) علامة</p>
                <p>اليوم والتاريخ: ___ / ___ / _____</p>
              </div>
            </div>

            {/* Student Info Bar */}
            <div className="flex justify-between items-center text-xs border-t border-slate-400 pt-2 font-semibold">
              <div>اسم الطالب/ـة: ....................................................</div>
              <div>الشعبة: ( ..... )</div>
              <div>رقم الجلوس: ....................</div>
              <div>العلامة المستحقة: ( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / {totalMarks} )</div>
            </div>
          </div>

          {/* Exam Questions Sections */}
          <div className="space-y-6 text-sm">
            {/* Section 1: MCQ */}
            {questions.filter(q => q.type === 'mcq').length > 0 && (
              <div>
                <h4 className="font-bold border-b border-slate-300 pb-1 mb-3 text-slate-900 flex justify-between">
                  <span>السؤال الأول: ضع دائرة حول رمز الإجابة الصحيحة في كل مما يلي:</span>
                  <span className="text-xs">({questions.filter(q => q.type === 'mcq').length * 2} علامات)</span>
                </h4>
                <div className="space-y-4 pr-2">
                  {questions.filter(q => q.type === 'mcq').map((q, idx) => (
                    <div key={q.id}>
                      <p className="font-medium mb-1.5">
                        {idx + 1}- {q.question}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pr-4 text-xs font-normal">
                        {q.options?.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-1.5">
                            <span className="font-bold border border-slate-400 w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                              {['أ', 'ب', 'ج', 'د'][oIdx]}
                            </span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: True/False */}
            {questions.filter(q => q.type === 'tf').length > 0 && (
              <div>
                <h4 className="font-bold border-b border-slate-300 pb-1 mb-3 text-slate-900 flex justify-between">
                  <span>السؤال الثاني: ضع إشارة (✓) أمام العبارة الصحيحة، وإشارة (✗) أمام العبارة الخاطئة:</span>
                  <span className="text-xs">({questions.filter(q => q.type === 'tf').length * 2} علامات)</span>
                </h4>
                <div className="space-y-2.5 pr-2">
                  {questions.filter(q => q.type === 'tf').map((q, idx) => (
                    <div key={q.id} className="flex justify-between items-center text-xs sm:text-sm">
                      <p className="font-medium">
                        {idx + 1}- {q.question.replace(/^ضع إشارة.*?:/, '')}
                      </p>
                      <span className="border border-slate-400 px-3 py-0.5 rounded text-xs font-mono">
                        ( &nbsp;&nbsp;&nbsp;&nbsp; )
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: Fill Blanks */}
            {questions.filter(q => q.type === 'fill').length > 0 && (
              <div>
                <h4 className="font-bold border-b border-slate-300 pb-1 mb-3 text-slate-900 flex justify-between">
                  <span>السؤال الثالث: أكمل الفراغات التالية بما يناسبها من معلومات صحيحة:</span>
                  <span className="text-xs">({questions.filter(q => q.type === 'fill').length * 2} علامات)</span>
                </h4>
                <div className="space-y-3 pr-2">
                  {questions.filter(q => q.type === 'fill').map((q, idx) => (
                    <div key={q.id}>
                      <p className="font-medium text-xs sm:text-sm">
                        {idx + 1}- {q.question.replace(/^أكمل الفراغ بالعبارة المناسبة:/, '')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Short Answer */}
            {questions.filter(q => q.type === 'short').length > 0 && (
              <div>
                <h4 className="font-bold border-b border-slate-300 pb-1 mb-3 text-slate-900 flex justify-between">
                  <span>السؤال الرابع: أجب عن الأسئلة الآتية إجابة وافية:</span>
                  <span className="text-xs">({questions.filter(q => q.type === 'short').length * 3} علامات)</span>
                </h4>
                <div className="space-y-4 pr-2">
                  {questions.filter(q => q.type === 'short').map((q, idx) => (
                    <div key={q.id}>
                      <p className="font-medium mb-2 text-xs sm:text-sm">
                        {idx + 1}- {q.question}
                      </p>
                      <div className="border-b border-dotted border-slate-400 h-6"></div>
                      <div className="border-b border-dotted border-slate-400 h-6"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="mt-10 pt-4 border-t-2 border-slate-900 text-center text-xs font-bold text-slate-700">
            *** مع تمنياتنا لجميع الطلبة بالتوفيق والنجاح الباهر ***
          </div>
        </div>
      )}
    </div>
  );
};
