import React, { useState } from 'react';
import { Book, SlideItem } from '../types';
import { generateSlidesContent } from '../services/geminiService';
import { Presentation, ChevronRight, ChevronLeft, Maximize2, Minimize2, Sparkles, Loader2, Printer } from 'lucide-react';

interface TeacherSlidesProps {
  book: Book;
  grade: number;
}

export const TeacherSlides: React.FC<TeacherSlidesProps> = ({ book, grade }) => {
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);

  const units = book.units || [];
  const currentUnit = units[selectedUnitIndex];
  const lessons = currentUnit ? currentUnit.lessons : [];
  const currentLesson = lessons[selectedLessonIndex] || lessons[0];

  const handleGenerate = async () => {
    if (!currentLesson) return;
    setLoading(true);
    setCurrentSlideIndex(0);
    try {
      const res = await generateSlidesContent(book.subject, grade, currentLesson.title);
      setSlides(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 no-print">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-sky-100 text-sky-800 rounded-xl">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-850">💻 العروض التقديمية التعليمية (شرائح الدرس)</h2>
            <p className="text-xs text-slate-500">إنشاء شرائح عرض تفاعلية مدعومة بملاحظات المعلم وتنسيق حديث</p>
          </div>
        </div>

        {slides.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span>{isFullscreen ? 'تصغير العرض' : 'عرض ملء الشاشة'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition-all border border-slate-300"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الشرائح</span>
            </button>
          </div>
        )}
      </div>

      <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">الوحدة:</label>
          <select
            value={selectedUnitIndex}
            onChange={(e) => {
              setSelectedUnitIndex(Number(e.target.value));
              setSelectedLessonIndex(0);
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-sky-500"
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
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-sky-500"
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
          className="w-full inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جارٍ إعداد وتوليد شرائح الدرس...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>توليد العرض التقديمي</span>
            </>
          )}
        </button>
      </div>

      {/* Presentation Interactive Player */}
      {slides.length > 0 && (
        <div>
          {/* Main Slide Card */}
          <div
            className={`transition-all ${
              isFullscreen
                ? 'fixed inset-0 z-50 bg-slate-950 p-8 flex flex-col justify-between text-white'
                : 'bg-gradient-to-br from-slate-900 to-[#1e3a5f] text-white p-8 rounded-2xl shadow-xl min-h-[380px] flex flex-col justify-between relative overflow-hidden'
            }`}
          >
            {/* Top Slide Meta */}
            <div className="flex justify-between items-center text-xs opacity-80 border-b border-white/10 pb-3">
              <span>{book.subject} - الصف {grade}</span>
              <span className="font-bold px-2 py-0.5 bg-white/20 rounded-full">
                شريحة {currentSlideIndex + 1} من {slides.length}
              </span>
            </div>

            {/* Slide Body */}
            <div className="my-auto py-4">
              <h3 className="text-xl sm:text-2xl font-black mb-5 text-emerald-300">
                {slides[currentSlideIndex].title}
              </h3>
              <ul className="space-y-3 pr-2 text-sm sm:text-base leading-relaxed">
                {slides[currentSlideIndex].bullets.map((b, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Navigation */}
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <button
                onClick={prevSlide}
                disabled={currentSlideIndex === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-xl text-xs font-bold transition-all"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الشريحة السابقة</span>
              </button>

              <div className="flex gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlideIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === currentSlideIndex ? 'bg-emerald-400 w-6' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                disabled={currentSlideIndex === slides.length - 1}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30 rounded-xl text-xs font-bold transition-all text-slate-950"
              >
                <span>الشريحة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Teacher Speaking Notes */}
          {slides[currentSlideIndex].notes && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2 no-print">
              <span className="font-bold shrink-0">💡 ملاحظات وتوجيهات الشرح للمعلم:</span>
              <span className="leading-relaxed">{slides[currentSlideIndex].notes}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
