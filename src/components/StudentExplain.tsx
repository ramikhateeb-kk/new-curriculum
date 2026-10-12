import React, { useState } from 'react';
import { Book } from '../types';
import { explainLessonTopic } from '../services/geminiService';
import { BookOpen, Volume2, VolumeX, Send, Sparkles, HelpCircle, Languages, Loader2 } from 'lucide-react';

interface StudentExplainProps {
  book: Book;
  grade: number;
}

export const StudentExplain: React.FC<StudentExplainProps> = ({ book, grade }) => {
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>(0);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [userQuery, setUserQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);

  const units = book.units || [];
  const currentUnit = units[selectedUnitIndex];
  const lessons = currentUnit ? currentUnit.lessons : [];
  const currentLesson = lessons[selectedLessonIndex] || lessons[0];

  const handleExplain = async () => {
    if (!currentLesson) return;
    setLoading(true);
    // Stop any ongoing speech
    window.speechSynthesis?.cancel();
    setSpeaking(false);

    try {
      const res = await explainLessonTopic(
        book.subject,
        grade,
        currentUnit?.title || 'الوحدة',
        currentLesson.title,
        userQuery.trim() || undefined,
        lang
      );
      setExplanation(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = () => {
    if (!explanation) return;
    if (speaking) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert('متصفحك لا يدعم القراءة الصوتية');
      return;
    }

    // Clean markdown for clearer speech
    const cleanText = explanation
      .replace(/[#*`_>-]/g, ' ')
      .replace(/\[.*?\]\(.*?\)/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'ar' ? 'ar-JO' : 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 0.9; // Deeper male/formal tone

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-850">📖 ميزة "اشرح لي" التفاعلية</h2>
            <p className="text-xs text-slate-500">شرح معتمد على المنهاج الأردني مع ربط دقيق بصفحات الكتاب</p>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <Languages className="w-3.5 h-3.5 text-slate-500 mr-1" />
          <button
            onClick={() => setLang('ar')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              lang === 'ar' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            العربية
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              lang === 'en' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Select Unit & Lesson */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            اختر الوحدة الدراسية:
          </label>
          <select
            value={selectedUnitIndex}
            onChange={(e) => {
              setSelectedUnitIndex(Number(e.target.value));
              setSelectedLessonIndex(0);
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500"
          >
            {units.map((u, i) => (
              <option key={i} value={i}>{u.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            اختر الدرس المطلوب:
          </label>
          <select
            value={selectedLessonIndex}
            onChange={(e) => setSelectedLessonIndex(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500"
          >
            {lessons.map((l, i) => (
              <option key={i} value={i}>
                {l.title} (صفحة {l.start}{l.end ? ` - ${l.end}` : ''})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Custom question input */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>هل لديك سؤال أو استفسار محدد في هذا الدرس؟ (اختياري):</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="مثال: اشرح لي أسباب هذا الحدث، أو وضّح لي الفرق بين المصطلحين..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-normal text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onKeyDown={(e) => { if (e.key === 'Enter') handleExplain(); }}
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleExplain}
          disabled={loading || !currentLesson}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-[#1e3a5f] hover:from-emerald-700 hover:to-[#172c47] text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جارٍ استحضار الشرح من المنهاج...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>ابدأ الشرح الآن</span>
            </>
          )}
        </button>

        {explanation && (
          <button
            onClick={handleSpeak}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold border transition-all ${
              speaking
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
            }`}
            title="القراءة الصوتية بصوت المعلم"
          >
            {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{speaking ? 'إيقاف الصوت' : 'استمع للشرح'}</span>
          </button>
        )}
      </div>

      {/* Explanation Result Output */}
      {explanation && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6 text-slate-800 animate-fadeIn">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              كتاب {book.subject} - الصف {grade} (المنهاج الأردني)
            </span>
            <span className="text-xs text-slate-500">
              الوحدة: {currentUnit?.title}
            </span>
          </div>

          <div className="prose prose-slate max-w-none text-sm md:text-base leading-relaxed space-y-3 whitespace-pre-wrap font-normal">
            {explanation}
          </div>
        </div>
      )}
    </div>
  );
};
