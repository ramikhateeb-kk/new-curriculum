import React, { useState, useEffect } from 'react';
import { User, Book, ActionType, Specialization, AcademicCalendar } from './types';
import { INITIAL_BOOKS, INITIAL_SPECIALIZATIONS, INITIAL_CALENDAR } from './data/initialCatalog';
import { Header } from './components/Header';
import { SubjectSelector } from './components/SubjectSelector';
import { StudentExplain } from './components/StudentExplain';
import { StudentQuiz } from './components/StudentQuiz';
import { TeacherExamBuilder } from './components/TeacherExamBuilder';
import { TeacherLessonPlan } from './components/TeacherLessonPlan';
import { TeacherSemesterPlan } from './components/TeacherSemesterPlan';
import { TeacherContentAnalysis } from './components/TeacherContentAnalysis';
import { TeacherHelp } from './components/TeacherHelp';
import { TeacherSlides } from './components/TeacherSlides';
import { AttendanceRegister } from './components/AttendanceRegister';
import { MarksBook } from './components/MarksBook';
import { QuestionBank } from './components/QuestionBank';
import { AdminPanel } from './components/AdminPanel';

import {
  BookOpen,
  Award,
  FileText,
  ClipboardList,
  Calendar,
  BarChart3,
  Lightbulb,
  Presentation,
  Users,
  Shield,
  Layers
} from 'lucide-react';

const DEFAULT_USERS: User[] = [
  {
    id: 'u-teacher-sub',
    name: 'الأستاذ رامي الخطيب',
    phone: '0791234567',
    role: 'teacher',
    isTrial: false,
    schoolName: 'مدرسة الملك عبد الله الثاني للتميز',
    directorate: 'مديرية التربية والتعليم لقصبة عمان',
    division: 'شعبة (أ)'
  },
  {
    id: 'u-teacher-trial',
    name: 'الأستاذ عمر النجار (معلم - حساب تجريبي)',
    phone: '0795551234',
    role: 'teacher',
    isTrial: true,
    trialPlansUsed: 0,
    trialSemesterPlansUsed: 0,
    schoolName: 'مدرسة اليرموك الثانوية الشاملة للبنين',
    directorate: 'مديرية التربية والتعليم للواء الجامعة',
    division: 'شعبة (أ)'
  },
  {
    id: 'u-student',
    name: 'سيف الدين الطالب (الصف العاشر - هندسي)',
    phone: '0789876543',
    role: 'student',
    grade: 10,
    specialization: 'هندسي (BTEC)',
    division: 'شعبة (أ)'
  },
  {
    id: 'u-supervisor',
    name: 'المشرف التربوي د. خالد الشوابكة',
    phone: '0776543210',
    role: 'supervisor',
    directorate: 'إدارة الإشراف والتدريب التربوي'
  },
  {
    id: 'u-admin',
    name: 'مدير عام المنصة والنظام',
    phone: '0799999999',
    role: 'admin'
  },
];

export function App() {
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USERS[0]);
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [specializations, setSpecializations] = useState<Specialization[]>(INITIAL_SPECIALIZATIONS);
  const [calendar, setCalendar] = useState<AcademicCalendar>(INITIAL_CALENDAR);
  
  const [selectedGrade, setSelectedGrade] = useState<number>(10);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('هندسي (BTEC)');
  const [selectedDivision, setSelectedDivision] = useState<string>('شعبة أ');
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
  const [selectedBook, setSelectedBook] = useState<Book>(INITIAL_BOOKS[2] || INITIAL_BOOKS[0]);

  const [currentAction, setCurrentAction] = useState<ActionType>('explain');

  // Sync action when role changes
  useEffect(() => {
    if (currentUser.role === 'student') {
      if (currentAction !== 'explain' && currentAction !== 'quiz') {
        setCurrentAction('explain');
      }
      if (currentUser.grade) {
        setSelectedGrade(currentUser.grade);
      }
      if (currentUser.specialization) {
        setSelectedSpecialization(currentUser.specialization);
      }
    }
  }, [currentUser.role, currentUser.grade, currentUser.specialization]);

  // Sync selected book when grade / track / semester changes
  useEffect(() => {
    const isSecondaryTrackGrade = selectedGrade === 10 || selectedGrade === 11 || selectedGrade === 12;
    const available = books.filter(b => {
      if (b.grade !== selectedGrade || b.semester !== selectedSemester) return false;
      if (!isSecondaryTrackGrade) return true;
      if (b.isShared || b.specialization === 'all') return true;
      return b.specialization === selectedSpecialization;
    });

    if (available.length > 0) {
      if (!available.some(b => b.slug === selectedBook?.slug)) {
        setSelectedBook(available[0]);
      }
    }
  }, [selectedGrade, selectedSpecialization, selectedSemester, books]);

  const handleAddUser = (user: User) => {
    setUsers([...users, user]);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleAddBook = (book: Book) => {
    setBooks([...books, book]);
  };

  const handleDeleteBook = (slug: string) => {
    setBooks(books.filter(b => b.slug !== slug));
  };

  const handleAddSpecialization = (spec: Specialization) => {
    setSpecializations([...specializations, spec]);
  };

  const handleDeleteSpecialization = (id: string) => {
    setSpecializations(specializations.filter(s => s.id !== id));
  };

  const handleUpdateUserUsage = (field: 'trialPlansUsed' | 'trialSemesterPlansUsed') => {
    setUsers(prev => prev.map(u => {
      if (u.id !== currentUser.id) return u;
      const updated = {
        ...u,
        [field]: (u[field] || 0) + 1
      };
      setCurrentUser(updated);
      return updated;
    }));
  };

  const isStudent = currentUser.role === 'student';
  const isSupervisorOrAdmin = currentUser.role === 'supervisor' || currentUser.role === 'admin';
  const effectiveGrade = isStudent && currentUser.grade ? currentUser.grade : selectedGrade;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5">
        {/* Header with Jordan banner & user role switcher */}
        <Header
          currentUser={currentUser}
          onUserChange={setCurrentUser}
          availableUsers={users}
        />

        {/* Grade, Specialization (for 10,11,12), Division and Book Selection */}
        {currentAction !== 'admin_accounts' && (
          <SubjectSelector
            books={books}
            specializations={specializations}
            selectedGrade={effectiveGrade}
            selectedSpecialization={selectedSpecialization}
            selectedDivision={selectedDivision}
            selectedSemester={selectedSemester}
            selectedBook={selectedBook}
            onGradeChange={(g) => {
              setSelectedGrade(g);
              const nextSpecs = specializations.filter(s => s.grade === g);
              if (nextSpecs.length > 0) {
                setSelectedSpecialization(nextSpecs[0].name);
              }
            }}
            onSpecializationChange={setSelectedSpecialization}
            onDivisionChange={setSelectedDivision}
            onSemesterChange={setSelectedSemester}
            onBookChange={setSelectedBook}
            currentUser={currentUser}
          />
        )}

        {/* Action Selection Buttons */}
        <div className="mb-6 no-print">
          <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            ماذا تريد أن تفعل؟
          </h3>

          {/* Student Actions */}
          {isStudent ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCurrentAction('explain')}
                className={`p-4 rounded-2xl border text-center font-bold text-base transition-all shadow-xs flex flex-col items-center justify-center gap-2 ${
                  currentAction === 'explain'
                    ? 'bg-gradient-to-r from-emerald-700 to-[#1e3a5f] text-white border-transparent ring-2 ring-emerald-500'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-500 hover:text-emerald-700'
                }`}
              >
                <BookOpen className="w-6 h-6" />
                <span>📖 اشرح لي</span>
              </button>

              <button
                onClick={() => setCurrentAction('quiz')}
                className={`p-4 rounded-2xl border text-center font-bold text-base transition-all shadow-xs flex flex-col items-center justify-center gap-2 ${
                  currentAction === 'quiz'
                    ? 'bg-gradient-to-r from-emerald-700 to-[#1e3a5f] text-white border-transparent ring-2 ring-emerald-500'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-500 hover:text-emerald-700'
                }`}
              >
                <Award className="w-6 h-6" />
                <span>📝 قيّمني</span>
              </button>
            </div>
          ) : (
            /* Teacher & Supervisor Actions */
            <div className="space-y-3">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setCurrentAction('exam')}
                  className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 ${
                    currentAction === 'exam'
                      ? 'bg-gradient-to-r from-[#2e6f5e] to-[#1e3a5f] text-white border-transparent shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-600 hover:text-emerald-700'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>🧾 إنشاء اختبار</span>
                </button>

                <button
                  onClick={() => setCurrentAction('plan')}
                  className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 ${
                    currentAction === 'plan'
                      ? 'bg-gradient-to-r from-[#2e6f5e] to-[#1e3a5f] text-white border-transparent shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-600 hover:text-emerald-700'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>🗒️ خطة درس {selectedBook?.language === 'en' ? '(English)' : ''}</span>
                </button>

                <button
                  onClick={() => setCurrentAction('semester_plan')}
                  className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 ${
                    currentAction === 'semester_plan'
                      ? 'bg-gradient-to-r from-[#2e6f5e] to-[#1e3a5f] text-white border-transparent shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-600 hover:text-emerald-700'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>📅 الخطة الفصلية {selectedBook?.language === 'en' ? '(English)' : ''}</span>
                </button>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setCurrentAction('content_analysis')}
                  className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 ${
                    currentAction === 'content_analysis'
                      ? 'bg-gradient-to-r from-[#2e6f5e] to-[#1e3a5f] text-white border-transparent shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-600 hover:text-emerald-700'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>📊 تحليل المحتوى {selectedBook?.language === 'en' ? '(English)' : ''}</span>
                </button>

                <button
                  onClick={() => setCurrentAction('teach_help')}
                  className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 ${
                    currentAction === 'teach_help'
                      ? 'bg-gradient-to-r from-[#2e6f5e] to-[#1e3a5f] text-white border-transparent shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-600 hover:text-emerald-700'
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>🧑‍🏫 مساعد الشرح</span>
                </button>

                <button
                  onClick={() => setCurrentAction('slides')}
                  className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 ${
                    currentAction === 'slides'
                      ? 'bg-gradient-to-r from-[#2e6f5e] to-[#1e3a5f] text-white border-transparent shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-600 hover:text-emerald-700'
                  }`}
                >
                  <Presentation className="w-4 h-4" />
                  <span>💻 عرض تقديمي</span>
                </button>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setCurrentAction('attendance')}
                  className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 ${
                    currentAction === 'attendance'
                      ? 'bg-gradient-to-r from-[#2e6f5e] to-[#1e3a5f] text-white border-transparent shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-600 hover:text-emerald-700'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>📋 دفتر الحضور والغياب</span>
                </button>

                <button
                  onClick={() => setCurrentAction('marks_book')}
                  className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 ${
                    currentAction === 'marks_book'
                      ? 'bg-gradient-to-r from-[#2e6f5e] to-[#1e3a5f] text-white border-transparent shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-600 hover:text-emerald-700'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>📒 دفتر العلامات والغلاف</span>
                </button>

                {isSupervisorOrAdmin ? (
                  <button
                    onClick={() => setCurrentAction('qbank')}
                    className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 ${
                      currentAction === 'qbank'
                        ? 'bg-gradient-to-r from-[#2e6f5e] to-[#1e3a5f] text-white border-transparent shadow-md'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-600 hover:text-emerald-700'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>🏦 بنك الأسئلة</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentAction('explain')}
                    className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 ${
                      currentAction === 'explain'
                        ? 'bg-gradient-to-r from-[#2e6f5e] to-[#1e3a5f] text-white border-transparent shadow-md'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-600 hover:text-emerald-700'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>📖 استعراض الشرح</span>
                  </button>
                )}
              </div>

              {/* Admin Panel Action */}
              {currentUser.role === 'admin' && (
                <div className="pt-2">
                  <button
                    onClick={() => setCurrentAction('admin_accounts')}
                    className={`w-full p-3 rounded-xl border text-center font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 ${
                      currentAction === 'admin_accounts'
                        ? 'bg-blue-700 text-white border-transparent shadow-md'
                        : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>👑 لوحة تحكم المدير العام (التخصصات، التاريخ الهجري، الحسابات التجريبية، والمناهج)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feature Component Render */}
        <main>
          {selectedBook ? (
            <>
              {currentAction === 'explain' && (
                <StudentExplain book={selectedBook} grade={effectiveGrade} />
              )}
              {currentAction === 'quiz' && (
                <StudentQuiz book={selectedBook} grade={effectiveGrade} />
              )}
              {currentAction === 'exam' && (
                <TeacherExamBuilder book={selectedBook} grade={effectiveGrade} />
              )}
              {currentAction === 'plan' && (
                <TeacherLessonPlan
                  book={selectedBook}
                  grade={effectiveGrade}
                  currentUser={currentUser}
                  onUpdateUserUsage={handleUpdateUserUsage}
                />
              )}
              {currentAction === 'semester_plan' && (
                <TeacherSemesterPlan
                  book={selectedBook}
                  grade={effectiveGrade}
                  currentUser={currentUser}
                />
              )}
              {currentAction === 'content_analysis' && (
                <TeacherContentAnalysis book={selectedBook} grade={effectiveGrade} />
              )}
              {currentAction === 'teach_help' && (
                <TeacherHelp book={selectedBook} grade={effectiveGrade} />
              )}
              {currentAction === 'slides' && (
                <TeacherSlides book={selectedBook} grade={effectiveGrade} />
              )}
              {currentAction === 'attendance' && (
                <AttendanceRegister book={selectedBook} grade={effectiveGrade} />
              )}
              {currentAction === 'marks_book' && (
                <MarksBook
                  book={selectedBook}
                  grade={effectiveGrade}
                  currentUser={currentUser}
                  calendar={calendar}
                  specialization={selectedSpecialization}
                  division={selectedDivision}
                />
              )}
              {currentAction === 'qbank' && isSupervisorOrAdmin && (
                <QuestionBank book={selectedBook} grade={effectiveGrade} />
              )}
              {currentAction === 'admin_accounts' && currentUser.role === 'admin' && (
                <AdminPanel
                  users={users}
                  books={books}
                  specializations={specializations}
                  calendar={calendar}
                  onAddUser={handleAddUser}
                  onDeleteUser={handleDeleteUser}
                  onAddBook={handleAddBook}
                  onDeleteBook={handleDeleteBook}
                  onAddSpecialization={handleAddSpecialization}
                  onDeleteSpecialization={handleDeleteSpecialization}
                  onUpdateCalendar={setCalendar}
                />
              )}
            </>
          ) : (
            <div className="bg-white p-8 rounded-2xl text-center text-slate-600 border border-slate-200">
              يرجى اختيار كتاب للمتابعة
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
