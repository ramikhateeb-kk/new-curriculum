import React, { useState } from 'react';
import { Book, LessonPlanData, User } from '../types';
import { generateLessonPlan } from '../services/geminiService';
import { ClipboardList, Printer, Sparkles, Loader2, Target, AlertCircle, Lock } from 'lucide-react';

interface TeacherLessonPlanProps {
  book: Book;
  grade: number;
  currentUser: User;
  onUpdateUserUsage?: (field: 'trialPlansUsed' | 'trialSemesterPlansUsed') => void;
}

export const TeacherLessonPlan: React.FC<TeacherLessonPlanProps> = ({
  book,
  grade,
  currentUser,
  onUpdateUserUsage
}) => {
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [plan, setPlan] = useState<LessonPlanData | null>(null);
  const [loading, setLoading] = useState(false);
  const [trialLimitReached, setTrialLimitReached] = useState(false);

  const isEnglishSubject = book.language === 'en' || book.subject.toLowerCase().includes('english') || book.subject.includes('إنجليزية');
  const units = book.units || [];
  const currentUnit = units[selectedUnitIndex];
  const lessons = currentUnit ? currentUnit.lessons : [];
  const currentLesson = lessons[selectedLessonIndex] || lessons[0];

  const isTrial = currentUser.role === 'teacher' && currentUser.isTrial;
  const plansUsed = currentUser.trialPlansUsed || 0;

  const handleGenerate = async () => {
    if (!currentLesson) return;

    // Check trial limit: only 1 lesson plan allowed
    if (isTrial && plansUsed >= 1) {
      setTrialLimitReached(true);
      return;
    }

    setLoading(true);
    setTrialLimitReached(false);

    try {
      const generated = await generateLessonPlan(
        grade,
        book.semester,
        book.subject,
        currentUnit?.title || 'الوحدة',
        currentLesson.title,
        isEnglishSubject ? 'en' : 'ar'
      );
      setPlan(generated);

      if (isTrial && onUpdateUserUsage) {
        onUpdateUserUsage('trialPlansUsed');
      }
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
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-850">
              {isEnglishSubject ? '🗒️ Daily Lesson Plan (Jordan Official Model - English)' : '🗒️ خطة الدرس اليومية (النموذج الأردني الرسمي)'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEnglishSubject ? 'Official 4-stage pedagogical format adhering to MOE guidelines (LTR Layout)' : 'خطة درس متكاملة مقسمة إلى 4 مراحل إجرائية معتمدة من وزارة التربية'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isTrial && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-lg border border-amber-300">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>حساب تجريبي (متاح خطة درس واحدة: {plansUsed}/1)</span>
            </span>
          )}

          {plan && (
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>{isEnglishSubject ? 'Print Lesson Plan' : 'طباعة خطة الدرس'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Trial Limit Notice */}
      {isTrial && plansUsed >= 1 && (
        <div className="no-print mb-5 p-3.5 bg-amber-50 border-2 border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold text-sm mb-0.5">تم استهلاك الحد المسموح للحساب التجريبي (خطة واحدة)</strong>
            <span>
              بصفتك معلماً في الفترة التجريبية، يُسمح بإنشاء خطة درس لدرس واحد فقط لاختبار جودة المخرجات. للحصول على خطط الدروس لجميع وحدات ودروس المنهاج، يرجى ترقية الحساب إلى الاشتراك الكامل عبر إدارة النظام.
            </span>
          </div>
        </div>
      )}

      {/* Selectors */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {isEnglishSubject ? 'Select Unit / Module:' : 'الوحدة:'}
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
            {isEnglishSubject ? 'Select Lesson:' : 'الدرس:'}
          </label>
          <select
            value={selectedLessonIndex}
            onChange={(e) => setSelectedLessonIndex(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500"
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
          disabled={loading || !currentLesson || (isTrial && plansUsed >= 1)}
          className={`w-full inline-flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl shadow-md transition-all ${
            isTrial && plansUsed >= 1
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isEnglishSubject ? 'Generating English Lesson Plan...' : 'جارٍ صياغة خطة الدرس وفق معايير وزارة التربية...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{isEnglishSubject ? 'Generate Official Lesson Plan (English LTR)' : 'توليد خطة الدرس النموذجية'}</span>
            </>
          )}
        </button>
      </div>

      {/* Plan Document layout (RTL for Arabic, LTR for English) */}
      {plan && (
        <div
          dir={isEnglishSubject ? 'ltr' : 'rtl'}
          className={`bg-white border-2 border-slate-800 p-6 rounded-xl text-slate-900 printable-plan ${
            isEnglishSubject ? 'text-left font-sans' : 'text-right'
          }`}
        >
          {/* Header Table */}
          <div className="border-b-2 border-slate-800 pb-3 mb-4">
            <div className="text-center font-bold text-sm mb-2">
              {isEnglishSubject
                ? 'Ministry of Education - The Hashemite Kingdom of Jordan - Daily Lesson Plan Template'
                : 'وزارة التربية والتعليم - نموذج خطة الدرس اليومية الرسمية'}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-300">
              <div>
                <strong>{isEnglishSubject ? 'Subject:' : 'المبحث:'}</strong> {plan.subject}
              </div>
              <div>
                <strong>{isEnglishSubject ? 'Grade:' : 'الصف:'}</strong> {plan.grade}
              </div>
              <div>
                <strong>{isEnglishSubject ? 'Unit/Module:' : 'الوحدة:'}</strong> {plan.unit}
              </div>
              <div>
                <strong>{isEnglishSubject ? 'Date:' : 'التاريخ:'}</strong> {plan.date}
              </div>
            </div>
          </div>

          {/* Outcomes & Prior Learning */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-700" />
                {isEnglishSubject ? 'Intended Learning Outcomes (ILOs):' : 'النتاجات التعليمية المستهدفة:'}
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {plan.outcomes.map((o, idx) => (
                  <li key={idx}>{o}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-1.5">
                {isEnglishSubject ? 'Prior Learning & Prerequisites:' : 'التعلم القبلي والمفاهيم السابقة:'}
              </h4>
              <p className="leading-relaxed">{plan.priorLearning}</p>

              <h4 className="font-bold text-slate-800 mt-2 mb-1">
                {isEnglishSubject ? 'Teaching & Assessment Strategies:' : 'استراتيجيات التدريس والتقويم:'}
              </h4>
              <div className="flex flex-wrap gap-1">
                {plan.strategies.map((s, idx) => (
                  <span key={idx} className="bg-white border border-slate-300 px-1.5 py-0.5 rounded text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Official 4-Stage Execution Table */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-xs border-collapse border border-slate-400">
              <thead>
                <tr className="bg-slate-200 text-slate-800">
                  <th className={`border border-slate-400 p-2 w-1/4 ${isEnglishSubject ? 'text-left' : 'text-right'}`}>
                    {isEnglishSubject ? 'Stage & Allocated Time' : 'المرحلة الإجرائية والزمن'}
                  </th>
                  <th className={`border border-slate-400 p-2 w-3/8 ${isEnglishSubject ? 'text-left' : 'text-right'}`}>
                    {isEnglishSubject ? "Teacher's Role (Activities & Procedures)" : 'دور المعلم (الأنشطة والإجراءات)'}
                  </th>
                  <th className={`border border-slate-400 p-2 w-3/8 ${isEnglishSubject ? 'text-left' : 'text-right'}`}>
                    {isEnglishSubject ? "Students' Role (Responses & Tasks)" : 'دور المتعلم (الاستجابة والمهام)'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {plan.stages.map((stage, sIdx) => (
                  <tr key={sIdx} className={sIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="border border-slate-400 p-2 font-bold align-top">
                      <div>{stage.title}</div>
                      {stage.duration && (
                        <span className="text-[10px] text-slate-500 font-normal">({stage.duration})</span>
                      )}
                    </td>
                    <td className="border border-slate-400 p-2 align-top leading-relaxed">
                      {stage.teacherRole}
                    </td>
                    <td className="border border-slate-400 p-2 align-top leading-relaxed">
                      {stage.studentRole}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reflection */}
          {plan.reflection && (
            <div className="p-2.5 bg-slate-50 border border-slate-300 rounded text-xs">
              <strong>{isEnglishSubject ? "Teacher's Post-Lesson Reflection: " : 'التأمل الذاتي للمعلم: '}</strong>
              <span>{plan.reflection}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
