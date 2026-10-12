import React from 'react';
import { Book, User, Specialization } from '../types';
import { GRADES } from '../data/initialCatalog';
import { Layers, Bookmark, Calendar, Briefcase, Hash } from 'lucide-react';

interface SubjectSelectorProps {
  books: Book[];
  specializations: Specialization[];
  selectedGrade: number;
  selectedSpecialization: string;
  selectedDivision: string;
  selectedSemester: 1 | 2;
  selectedBook: Book | null;
  onGradeChange: (grade: number) => void;
  onSpecializationChange: (specialization: string) => void;
  onDivisionChange: (division: string) => void;
  onSemesterChange: (semester: 1 | 2) => void;
  onBookChange: (book: Book) => void;
  currentUser: User;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  books,
  specializations,
  selectedGrade,
  selectedSpecialization,
  selectedDivision,
  selectedSemester,
  selectedBook,
  onGradeChange,
  onSpecializationChange,
  onDivisionChange,
  onSemesterChange,
  onBookChange,
  currentUser
}) => {
  const isStudent = currentUser.role === 'student';
  const effectiveGrade = isStudent && currentUser.grade ? currentUser.grade : selectedGrade;
  const isSecondaryTrackGrade = effectiveGrade === 10 || effectiveGrade === 11 || effectiveGrade === 12;

  // Available specializations for this grade
  const availableSpecs = specializations.filter(s => s.grade === effectiveGrade);

  // Filter books:
  // Must match grade & semester.
  // If grade has specializations: include books marked as 'all' or isShared, plus books matching chosen specialization.
  const availableBooks = books.filter(b => {
    if (b.grade !== effectiveGrade || b.semester !== selectedSemester) return false;
    if (!isSecondaryTrackGrade) return true;
    if (b.isShared || b.specialization === 'all') return true;
    return b.specialization === selectedSpecialization;
  });

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>تحديد الصف الدراسي والتخصص والمبحث:</span>
        </h3>

        {isSecondaryTrackGrade && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            {effectiveGrade === 10 ? 'الصف العاشر (نظام المسارات BTEC والأكاديمي)' : effectiveGrade === 11 ? 'الصف الحادي عشر (الفروع والتخصصات)' : 'الصف الثاني عشر - التوجيهي'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Grade Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            الصف الدراسي:
          </label>
          {isStudent ? (
            <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-bold rounded-xl p-2.5">
              الصف {currentUser.grade || 12}
            </div>
          ) : (
            <select
              value={selectedGrade}
              onChange={(e) => {
                const newG = Number(e.target.value);
                onGradeChange(newG);
                const nextSpecs = specializations.filter(s => s.grade === newG);
                if (nextSpecs.length > 0) {
                  onSpecializationChange(nextSpecs[0].name);
                }
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {GRADES.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          )}
        </div>

        {/* Track / Specialization Selection for Grades 10, 11, 12 */}
        {isSecondaryTrackGrade && (
          <div>
            <label className="block text-xs font-bold text-blue-900 mb-1.5 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>التخصص / المسار (إلزامي):</span>
            </label>
            <select
              value={selectedSpecialization}
              onChange={(e) => onSpecializationChange(e.target.value)}
              className="w-full bg-blue-50/60 border-2 border-blue-400 rounded-xl px-3 py-2 text-sm font-bold text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {availableSpecs.map(s => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Division / Section (الشعبة) */}
        {isSecondaryTrackGrade && (
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-slate-500" />
              <span>الشعبة الدراسية:</span>
            </label>
            <select
              value={selectedDivision}
              onChange={(e) => onDivisionChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="شعبة أ">شعبة (أ)</option>
              <option value="شعبة ب">شعبة (ب)</option>
              <option value="شعبة ج">شعبة (ج)</option>
              <option value="شعبة د">شعبة (د)</option>
            </select>
          </div>
        )}

        {/* Semester Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>الفصل الدراسي:</span>
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => onSemesterChange(Number(e.target.value) as 1 | 2)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value={1}>الفصل الدراسي الأول</option>
            <option value={2}>الفصل الدراسي الثاني</option>
          </select>
        </div>

        {/* Subject / Curriculum Selection */}
        <div className={isSecondaryTrackGrade ? 'sm:col-span-2 md:col-span-4' : 'sm:col-span-2'}>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5 text-slate-500" />
            <span>المبحث / الكتاب (المناهج المشتركة والخاصة بالتخصص):</span>
          </label>
          {availableBooks.length > 0 ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedBook?.slug || availableBooks[0]?.slug}
                onChange={(e) => {
                  const b = availableBooks.find(item => item.slug === e.target.value);
                  if (b) onBookChange(b);
                }}
                className="flex-1 bg-slate-50 border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {availableBooks.map(b => (
                  <option key={b.slug} value={b.slug}>
                    {b.isShared ? `⭐ [مشترك] ${b.subject}` : `🎯 [تخصص: ${b.specialization}] ${b.subject}`}
                  </option>
                ))}
              </select>

              {selectedBook && (
                <div className="flex items-center gap-2 text-xs font-bold px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
                  {selectedBook.isShared ? (
                    <span>منهاج مشترك لجميع التخصصات</span>
                  ) : (
                    <span>مرتبط بتخصص: {selectedBook.specialization}</span>
                  )}
                  {selectedBook.language === 'en' && (
                    <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded text-[11px]">English LTR</span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl p-3">
              لا توجد كتب مسجلة لهذا التخصص والفصل حتى الآن. يمكنك إضافة كتب للتخصص من لوحة الإدارة.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
