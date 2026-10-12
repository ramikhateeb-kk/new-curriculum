import React, { useState } from 'react';
import { Book, Question } from '../types';
import { generateQuizQuestions } from '../services/geminiService';
import { CheckCircle2, XCircle, RotateCcw, Award, Check, Sparkles, Loader2 } from 'lucide-react';

interface StudentQuizProps {
  book: Book;
  grade: number;
}

export const StudentQuiz: React.FC<StudentQuizProps> = ({ book, grade }) => {
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: string | number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const units = book.units || [];
  const currentUnit = units[selectedUnitIndex];
  const lessons = currentUnit ? currentUnit.lessons : [];
  const currentLesson = lessons[selectedLessonIndex] || lessons[0];

  const handleGenerateQuiz = async () => {
    if (!currentLesson) return;
    setLoading(true);
    setSubmitted(false);
    setUserAnswers({});
    try {
      const qList = await generateQuizQuestions(book.subject, grade, currentLesson.title, 4);
      setQuestions(qList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId: string, option: string) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      const ans = userAnswers[q.id];
      if (ans !== undefined && String(ans).trim() === String(q.answer).trim()) {
        score += 1;
      }
    });
    return score;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6">
      <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
        <div className="p-2 bg-blue-100 text-blue-800 rounded-xl">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-850">📝 ميزة "قيّمني" - اختبار تفاعلي سريع</h2>
          <p className="text-xs text-slate-500">قيّم استيعابك للمفاهيم واكتشف نقاط القوة وفرص التحسين مباشرة</p>
        </div>
      </div>

      {/* Select Unit & Lesson */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">الوحدة:</label>
          <select
            value={selectedUnitIndex}
            onChange={(e) => {
              setSelectedUnitIndex(Number(e.target.value));
              setSelectedLessonIndex(0);
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500"
          >
            {units.map((u, i) => (
              <option key={i} value={i}>{u.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">الدرس:</label>
          <select
            value={selectedLessonIndex}
            onChange={(e) => setSelectedLessonIndex(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500"
          >
            {lessons.map((l, i) => (
              <option key={i} value={i}>{l.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={handleGenerateQuiz}
          disabled={loading || !currentLesson}
          className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جارٍ إنشاء أسئلة التقييم الذاتي...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>بدء اختبار التقييم للدرس</span>
            </>
          )}
        </button>
      </div>

      {/* Questions list */}
      {questions.length > 0 && (
        <div className="space-y-6">
          {submitted && (
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-800">النتيجة النهائية للاختبار:</span>
                <div className="text-2xl font-black text-blue-700">
                  {calculateScore()} من {questions.length}
                </div>
              </div>
              <div className="text-xs text-slate-600 max-w-xs text-left">
                {calculateScore() === questions.length ? (
                  <span className="text-emerald-700 font-bold">🎉 ممتاز جداً! أتقنت كامل مفاهيم الدرس وفق المنهاج!</span>
                ) : (
                  <span>راجع التفسيرات التوضيحية أسفل كل سؤال لتثبيت المعرفة.</span>
                )}
              </div>
            </div>
          )}

          {questions.map((q, idx) => {
            const chosen = userAnswers[q.id];
            const isCorrect = chosen !== undefined && String(chosen).trim() === String(q.answer).trim();

            return (
              <div
                key={q.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-5 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    {q.question}
                  </span>
                  {submitted && (
                    isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> صحيحة (+1)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3.5 h-3.5" /> غير صحيحة
                      </span>
                    )
                  )}
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {q.options?.map((opt, oIdx) => {
                    const isSelected = chosen === opt;
                    let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                    if (isSelected) {
                      btnStyle = 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-400';
                    }

                    if (submitted) {
                      if (String(opt).trim() === String(q.answer).trim()) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={submitted}
                        onClick={() => handleSelectOption(q.id, opt)}
                        className={`text-right p-3 rounded-xl border text-sm transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback on submit */}
                {submitted && q.explanation && (
                  <div className="mt-3 p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-600">
                    <strong className="text-slate-800">💡 توضيح المنهاج: </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex gap-3 pt-3">
            {!submitted ? (
              <button
                onClick={() => setSubmitted(true)}
                disabled={Object.keys(userAnswers).length === 0}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                تسليم الإجابات وإظهار النتيجة
              </button>
            ) : (
              <button
                onClick={handleGenerateQuiz}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة الاختبار بأسئلة جديدة</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
