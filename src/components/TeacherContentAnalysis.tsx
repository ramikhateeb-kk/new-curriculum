import React, { useState } from 'react';
import { Book, ContentAnalysisData } from '../types';
import { generateContentAnalysis } from '../services/geminiService';
import { BarChart3, Printer, Sparkles, Loader2 } from 'lucide-react';

interface TeacherContentAnalysisProps {
  book: Book;
  grade: number;
}

export const TeacherContentAnalysis: React.FC<TeacherContentAnalysisProps> = ({ book, grade }) => {
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [analysis, setAnalysis] = useState<ContentAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);

  const isEnglishSubject = book.language === 'en' || book.subject.toLowerCase().includes('english') || book.subject.includes('إنجليزية');
  const units = book.units || [];
  const currentUnit = units[selectedUnitIndex];
  const lessons = currentUnit ? currentUnit.lessons : [];
  const currentLesson = lessons[selectedLessonIndex] || lessons[0];

  const handleGenerate = async () => {
    if (!currentLesson) return;
    setLoading(true);
    try {
      const data = await generateContentAnalysis(
        currentUnit?.title || 'الوحدة',
        currentLesson.title,
        isEnglishSubject ? 'en' : 'ar'
      );
      setAnalysis(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 no-print">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-100 text-purple-800 rounded-xl">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-850">
              {isEnglishSubject ? '📊 Curriculum Content Analysis (English LTR)' : '📊 جدول تحليل المحتوى التعليمي'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEnglishSubject
                ? 'Classification of Concepts, Facts, Generalizations, Values, and Communicative Skills'
                : 'استخراج وتصنيف المفاهيم، الحقائق، التعميمات، القيم، والمهارات'}
            </p>
          </div>
        </div>

        {analysis && (
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>{isEnglishSubject ? 'Print Analysis' : 'طباعة تحليل المحتوى'}</span>
          </button>
        )}
      </div>

      <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {isEnglishSubject ? 'Unit / Module:' : 'الوحدة:'}
          </label>
          <select
            value={selectedUnitIndex}
            onChange={(e) => {
              setSelectedUnitIndex(Number(e.target.value));
              setSelectedLessonIndex(0);
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-purple-500"
          >
            {units.map((u, i) => (
              <option key={i} value={i}>{u.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {isEnglishSubject ? 'Lesson / Section:' : 'الدرس:'}
          </label>
          <select
            value={selectedLessonIndex}
            onChange={(e) => setSelectedLessonIndex(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-purple-500"
          >
            {lessons.map((l, i) => (
              <option key={i} value={i}>{l.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="no-print mb-6">
        <button
          onClick={handleGenerate}
          disabled={loading || !currentLesson}
          className="w-full inline-flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isEnglishSubject ? 'Analyzing English Curriculum Content...' : 'جارٍ تحليل المحتوى وتصنيف العناصر المعرفية...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{isEnglishSubject ? 'Generate Content Analysis (English LTR)' : 'إنشاء جدول تحليل المحتوى'}</span>
            </>
          )}
        </button>
      </div>

      {analysis && (
        <div
          dir={isEnglishSubject ? 'ltr' : 'rtl'}
          className={`bg-white border-2 border-slate-800 p-6 rounded-xl text-slate-900 printable-analysis ${
            isEnglishSubject ? 'text-left font-sans' : 'text-right'
          }`}
        >
          <div className="text-center font-bold text-sm border-b-2 border-slate-800 pb-3 mb-4">
            {isEnglishSubject ? (
              <>
                Ministry of Education - The Hashemite Kingdom of Jordan - Content Analysis Card
                <div className="text-xs font-normal mt-1 text-slate-600">
                  Subject: {book.subject} | Grade: {grade} | Unit: {analysis.unit} | Lesson: {analysis.lesson}
                </div>
              </>
            ) : (
              <>
                وزارة التربية والتعليم - بطاقة تحليل المحتوى للمنهاج الأردني
                <div className="text-xs font-normal mt-1 text-slate-600">
                  المبحث: {book.subject} | الصف: {grade} | الوحدة: {analysis.unit} | الدرس: {analysis.lesson}
                </div>
              </>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-slate-400">
              <thead>
                <tr className="bg-slate-200 text-slate-800">
                  <th className={`border border-slate-400 p-2 w-1/5 ${isEnglishSubject ? 'text-left' : 'text-right'}`}>
                    {isEnglishSubject ? 'Concepts & Vocabulary' : 'المفاهيم والمصطلحات'}
                  </th>
                  <th className={`border border-slate-400 p-2 w-1/5 ${isEnglishSubject ? 'text-left' : 'text-right'}`}>
                    {isEnglishSubject ? 'Facts & Principles' : 'الحقائق العلمية/التاريخية'}
                  </th>
                  <th className={`border border-slate-400 p-2 w-1/5 ${isEnglishSubject ? 'text-left' : 'text-right'}`}>
                    {isEnglishSubject ? 'Generalizations' : 'التعميمات والقوانين'}
                  </th>
                  <th className={`border border-slate-400 p-2 w-1/5 ${isEnglishSubject ? 'text-left' : 'text-right'}`}>
                    {isEnglishSubject ? 'Values & Dispositions' : 'القيم والاتجاهات'}
                  </th>
                  <th className={`border border-slate-400 p-2 w-1/5 ${isEnglishSubject ? 'text-left' : 'text-right'}`}>
                    {isEnglishSubject ? 'Skills & Competencies' : 'المهارات والأنشطة'}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white align-top">
                  <td className="border border-slate-400 p-3">
                    <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                      {analysis.concepts.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </td>
                  <td className="border border-slate-400 p-3">
                    <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                      {analysis.facts.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </td>
                  <td className="border border-slate-400 p-3">
                    <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                      {analysis.generalizations.map((g, i) => <li key={i}>{g}</li>)}
                    </ul>
                  </td>
                  <td className="border border-slate-400 p-3">
                    <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                      {analysis.values.map((v, i) => <li key={i}>{v}</li>)}
                    </ul>
                  </td>
                  <td className="border border-slate-400 p-3">
                    <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                      {analysis.skills.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
