import React from 'react';
import { Book, User } from '../types';
import { Calendar, Printer, Lock, AlertCircle } from 'lucide-react';

interface TeacherSemesterPlanProps {
  book: Book;
  grade: number;
  currentUser: User;
}

export const TeacherSemesterPlan: React.FC<TeacherSemesterPlanProps> = ({
  book,
  grade,
  currentUser
}) => {
  const isEnglishSubject = book.language === 'en' || book.subject.toLowerCase().includes('english') || book.subject.includes('إنجليزية');
  const isTrial = currentUser.role === 'teacher' && currentUser.isTrial;

  const units = book.units || [];
  // If trial: limit to first 2 weeks (preview of 1 unit), otherwise full 16 weeks
  const semesterWeeks = isTrial ? 2 : 16;
  const lessonsPerUnit = units.length > 0 ? Math.ceil(16 / units.length) : 4;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 no-print">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-teal-100 text-teal-800 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-850">
              {isEnglishSubject ? '📅 Semester Syllabus Plan (Jordan MOE)' : '📅 الخطة الفصلية للمبحث'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEnglishSubject
                ? 'Curriculum unit distribution across semester weeks adhering to the academic calendar'
                : 'توزيع وحدات ودروس المنهاج على أسابيع الفصل الدراسي وفق التقويم المدرسي'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isTrial && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-lg border border-amber-300">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>حساب تجريبي (معاينة وحدة واحدة فقط)</span>
            </span>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>{isEnglishSubject ? 'Print Semester Plan' : 'طباعة الخطة الفصلية'}</span>
          </button>
        </div>
      </div>

      {isTrial && (
        <div className="no-print mb-5 p-3.5 bg-amber-50 border-2 border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold text-sm mb-0.5">صلاحية المعلم التجريبي (وحدة واحدة)</strong>
            <span>
              يتيح الحساب التجريبي معاينة الخطة الفصلية لوحدة دراسية واحدة فقط لاختبار التنسيق. للحصول على الخطة الفصلية الكاملة الممتدة على مدار 16 أسبوعاً، يرجى تفعيل اشتراك المعلم الكامل.
            </span>
          </div>
        </div>
      )}

      {/* Official Plan Table (RTL or LTR) */}
      <div
        dir={isEnglishSubject ? 'ltr' : 'rtl'}
        className={`bg-white border-2 border-slate-800 p-6 rounded-xl text-slate-900 printable-semester-plan ${
          isEnglishSubject ? 'text-left font-sans' : 'text-right'
        }`}
      >
        <div className="text-center font-extrabold text-sm border-b-2 border-slate-800 pb-3 mb-4">
          {isEnglishSubject ? (
            <>
              Ministry of Education - Curricula and Textbooks Directorate
              <br />
              Semester Syllabus Plan - {book.semester === 1 ? 'First Semester' : 'Second Semester'}
              <div className="text-xs font-normal mt-1 text-slate-600">
                Subject: {book.subject} | Grade: {grade} | Academic Year: 2026/2027
              </div>
            </>
          ) : (
            <>
              وزارة التربية والتعليم - مديرية المناهج والكتب المدرسية
              <br />
              خطة توزيع المادة الدراسية للفصل الدراسي {book.semester === 1 ? 'الأول' : 'الثاني'}
              <div className="text-xs font-normal mt-1 text-slate-600">
                المبحث: {book.subject} | الصف: {grade} | العام الدراسي: 2026/2027
              </div>
            </>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse border border-slate-400">
            <thead>
              <tr className="bg-slate-200 text-slate-800">
                <th className="border border-slate-400 p-2 w-16 text-center">
                  {isEnglishSubject ? 'Week' : 'الأسبوع'}
                </th>
                <th className={`border border-slate-400 p-2 w-1/4 ${isEnglishSubject ? 'text-left' : 'text-right'}`}>
                  {isEnglishSubject ? 'Module & Scheduled Lessons' : 'الوحدة والدروس المقررة'}
                </th>
                <th className={`border border-slate-400 p-2 w-1/4 ${isEnglishSubject ? 'text-left' : 'text-right'}`}>
                  {isEnglishSubject ? 'Specific Learning Outcomes' : 'النتاجات التعليمية الخاصة'}
                </th>
                <th className={`border border-slate-400 p-2 ${isEnglishSubject ? 'text-left' : 'text-right'}`}>
                  {isEnglishSubject ? 'Instructional Aids & Materials' : 'المواد والأدوات التعليمية'}
                </th>
                <th className={`border border-slate-400 p-2 ${isEnglishSubject ? 'text-left' : 'text-right'}`}>
                  {isEnglishSubject ? 'Teaching & Assessment Strategies' : 'استراتيجيات التدريس والتقويم'}
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: semesterWeeks }).map((_, weekIdx) => {
                const weekNum = weekIdx + 1;
                const unitIdx = Math.min(Math.floor(weekIdx / lessonsPerUnit), units.length - 1);
                const currentUnit = units[unitIdx];
                const lessonIdx = (weekIdx % lessonsPerUnit) % (currentUnit?.lessons.length || 1);
                const currentLesson = currentUnit?.lessons[lessonIdx];

                return (
                  <tr key={weekIdx} className={weekIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="border border-slate-400 p-2 font-bold text-center">
                      {weekNum}
                    </td>
                    <td className="border border-slate-400 p-2 font-semibold">
                      {weekNum === 8 ? (
                        <span className="text-indigo-700 font-bold">
                          {isEnglishSubject ? 'First Exam & Unit Consolidation' : 'امتحان الشهر الأول ومراجعة'}
                        </span>
                      ) : weekNum === 16 ? (
                        <span className="text-rose-700 font-bold">
                          {isEnglishSubject ? 'Final Comprehensive Examinations' : 'الامتحانات النهائية وتقويم الأداء'}
                        </span>
                      ) : (
                        <div>
                          <div className="text-[11px] text-slate-500">{currentUnit?.title}</div>
                          <div className="text-slate-800">{currentLesson?.title || 'Continuation of topic'}</div>
                        </div>
                      )}
                    </td>
                    <td className="border border-slate-400 p-2">
                      {isEnglishSubject
                        ? 'Students will demonstrate mastery of communicative functions and vocabulary.'
                        : 'أن يستوعب الطالب مفاهيم الدرس ويحل تدريبات الكتاب ذات الصلة.'}
                    </td>
                    <td className="border border-slate-400 p-2">
                      {isEnglishSubject
                        ? 'Student Book, Audio Tracks, Smartboard, Concept Graphic Organizers'
                        : 'الكتاب المدرسي، السبورة الذكية، خرائط ومخططات مفاهيمية، أوراق عمل'}
                    </td>
                    <td className="border border-slate-400 p-2">
                      {isEnglishSubject
                        ? 'Direct Instruction, Pair-work, Performance Tasks, Formative Observations'
                        : 'التدريس المباشر، العمل في مجموعات، الملاحظة الصفية، الأسئلة والأجوبة'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center text-xs font-bold pt-4 border-t border-slate-400">
          <div>{isEnglishSubject ? 'Teacher Signature: ..................' : 'توقيع معلم المبحث: .................................'}</div>
          <div>{isEnglishSubject ? 'Coordinator: ..................' : 'توقيع منسق المادة: .................................'}</div>
          <div>{isEnglishSubject ? 'School Principal / Stamp: ..................' : 'مدير المدرسة / الختم: .................................'}</div>
        </div>
      </div>
    </div>
  );
};
