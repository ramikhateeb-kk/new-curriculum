import React, { useState } from 'react';
import { User, Book, UserRole, Specialization, AcademicCalendar } from '../types';
import { GRADES } from '../data/initialCatalog';
import { Shield, Plus, Trash2, BookOpen, Users, Calendar, Briefcase, Sparkles, Check, AlertCircle } from 'lucide-react';

interface AdminPanelProps {
  users: User[];
  books: Book[];
  specializations: Specialization[];
  calendar: AcademicCalendar;
  onAddUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  onAddBook: (book: Book) => void;
  onDeleteBook: (slug: string) => void;
  onAddSpecialization: (spec: Specialization) => void;
  onDeleteSpecialization: (id: string) => void;
  onUpdateCalendar: (cal: AcademicCalendar) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  users,
  books,
  specializations,
  calendar,
  onAddUser,
  onDeleteUser,
  onAddBook,
  onDeleteBook,
  onAddSpecialization,
  onDeleteSpecialization,
  onUpdateCalendar
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'catalog' | 'specializations' | 'calendar'>('specializations');

  // New user form state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('079');
  const [newRole, setNewRole] = useState<UserRole>('teacher');
  const [newGrade, setNewGrade] = useState<number>(10);
  const [newIsTrial, setNewIsTrial] = useState<boolean>(false);
  const [newSchoolName, setNewSchoolName] = useState('مدرسة الملك عبد الله الثاني للتميز');
  const [newDirectorate, setNewDirectorate] = useState('مديرية التربية والتعليم لقصبة عمان');

  // New book form state
  const [newSubject, setNewSubject] = useState('');
  const [newBookGrade, setNewBookGrade] = useState<number>(10);
  const [newBookSemester, setNewBookSemester] = useState<1 | 2>(1);
  const [newIsShared, setNewIsShared] = useState<boolean>(true);
  const [newBookSpec, setNewBookSpec] = useState<string>('هندسي (BTEC)');
  const [newBookLang, setNewBookLang] = useState<'ar' | 'en'>('ar');
  const [newUnitTitle, setNewUnitTitle] = useState('الوحدة الأولى: البداية');

  // New specialization form state
  const [newSpecGrade, setNewSpecGrade] = useState<number>(10);
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecCode, setNewSpecCode] = useState('');
  const [newSpecDesc, setNewSpecDesc] = useState('');

  // Calendar form state
  const [hijriInput, setHijriInput] = useState(calendar.hijriYear);
  const [gregorianYearInput, setGregorianYearInput] = useState(calendar.year1);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const user: User = {
      id: `user-${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      role: newRole,
      grade: newRole === 'student' ? newGrade : undefined,
      schoolName: newSchoolName.trim(),
      directorate: newDirectorate.trim(),
      isTrial: newRole === 'teacher' ? newIsTrial : false,
      trialPlansUsed: 0,
      trialSemesterPlansUsed: 0
    };
    onAddUser(user);
    setNewName('');
    alert(newIsTrial ? 'تمت إضافة حساب المعلم كـ (حساب تجريبي مقيد الصلاحيات)' : 'تمت إضافة الحساب بنجاح');
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    const slug = `b_${Date.now()}`;
    const newBook: Book = {
      grade: newBookGrade,
      semester: newBookSemester,
      subject: newSubject.trim(),
      slug,
      page_offset: 0,
      isShared: newIsShared,
      specialization: newIsShared ? 'all' : newBookSpec,
      language: newBookLang,
      units: [
        {
          title: newUnitTitle.trim() || 'الوحدة الأولى',
          start: 5,
          end: 35,
          lessons: [
            { title: 'الدرس الأول: مقدمة وتمهيد', start: 6, end: 15 },
            { title: 'الدرس الثاني: المفاهيم والتطبيقات', start: 16, end: 35 }
          ]
        }
      ]
    };
    onAddBook(newBook);
    setNewSubject('');
    alert('تمت إضافة المنهاج بنجاح');
  };

  const handleCreateSpecialization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecName.trim()) return;
    const spec: Specialization = {
      id: `spec-${Date.now()}`,
      grade: newSpecGrade,
      name: newSpecName.trim(),
      code: newSpecCode.trim() || newSpecName.slice(0, 3).toUpperCase(),
      description: newSpecDesc.trim()
    };
    onAddSpecialization(spec);
    setNewSpecName('');
    setNewSpecCode('');
    setNewSpecDesc('');
    alert(`تمت إضافة تخصص (${spec.name}) للصف ${spec.grade} بنجاح`);
  };

  const handleAutoGenerateHijri = () => {
    // Standard approximation: Gregorian year 2026 -> 1447-1448 AH
    const startHijri = Math.round((gregorianYearInput - 622) * (33 / 32));
    const generated = `${startHijri} - ${startHijri + 1} هـ`;
    setHijriInput(generated);
    onUpdateCalendar({
      ...calendar,
      year1: gregorianYearInput,
      hijriYear: generated
    });
  };

  const handleSaveCalendar = () => {
    onUpdateCalendar({
      ...calendar,
      year1: gregorianYearInput,
      hijriYear: hijriInput.trim()
    });
    alert('تم حفظ إعدادات العام الدراسي والتاريخ الهجري بنجاح');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6">
      <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
        <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-850">👑 لوحة التحكم والإدارة المركزية للنظام</h2>
          <p className="text-xs text-slate-500">
            إدارة تخصصات الصفوف 10 و 11 و 12، التاريخ الهجري، الحسابات التجريبية، والمناهج المشتركة
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-6 pb-2">
        <button
          onClick={() => setActiveTab('specializations')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'specializations'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>إدارة التخصصات والمسارات ({specializations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'calendar'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>التاريخ الهجري والتقويم المدرسي</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>إدارة الحسابات والتجريبي ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'catalog'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>إدارة الكتب والمناهج ({books.length})</span>
        </button>
      </div>

      {/* ----------------- TAB: SPECIALIZATIONS ----------------- */}
      {activeTab === 'specializations' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateSpecialization} className="bg-blue-50/60 p-4 rounded-xl border border-blue-200">
            <h3 className="text-xs font-bold text-blue-900 mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-700" />
              إضافة تخصص جديد (للصفوف العاشر، الحادي عشر، الثاني عشر):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs mb-3">
              <div>
                <label className="font-semibold block mb-1">الصف المستهدف:</label>
                <select
                  value={newSpecGrade}
                  onChange={(e) => setNewSpecGrade(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold"
                >
                  <option value={10}>الصف العاشر</option>
                  <option value={11}>الصف الحادي عشر</option>
                  <option value={12}>الصف الثاني عشر (التوجيهي)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">اسم التخصص / المسار:</label>
                <input
                  type="text"
                  required
                  value={newSpecName}
                  onChange={(e) => setNewSpecName(e.target.value)}
                  placeholder="مثال: هندسي (BTEC)، زراعي، صناعي..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">رمز التخصص (Code):</label>
                <input
                  type="text"
                  value={newSpecCode}
                  onChange={(e) => setNewSpecCode(e.target.value)}
                  placeholder="مثال: ENG, AGR, SCI..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono uppercase"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">وصف مختصر:</label>
                <input
                  type="text"
                  value={newSpecDesc}
                  onChange={(e) => setNewSpecDesc(e.target.value)}
                  placeholder="وصف المسار والمقررات..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs"
            >
              حفظ التخصص وتفعيله في النظام
            </button>
          </form>

          {/* List of Specializations grouped by grade */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">الصف</th>
                  <th className="p-3">اسم التخصص</th>
                  <th className="p-3">الرمز</th>
                  <th className="p-3">الوصف</th>
                  <th className="p-3 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {specializations.map(s => (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-bold text-blue-900">الصف {s.grade}</td>
                    <td className="p-3 font-extrabold text-slate-900">{s.name}</td>
                    <td className="p-3 font-mono font-bold text-slate-600">{s.code}</td>
                    <td className="p-3 text-slate-500">{s.description || '-'}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onDeleteSpecialization(s.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                        title="حذف التخصص"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------- TAB: CALENDAR & HIJRI ----------------- */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="bg-amber-50/70 p-5 rounded-xl border border-amber-200 space-y-4">
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-700" />
              ضبط التاريخ الهجري للعام الدراسي (يُستخدم في أغلفة وسجلات العلامات):
            </h3>
            <p className="text-xs text-amber-950 leading-relaxed">
              يقوم مدير النظام بإدخال التاريخ الهجري المعتمد يدوياً، أو النقر على زر التوليد التلقائي لإنتاج التاريخ الهجري المقابل للعام الدراسي الجاري.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-slate-700">السنة الميلادية الأولى للعام الدراسي:</label>
                <input
                  type="number"
                  value={gregorianYearInput}
                  onChange={(e) => setGregorianYearInput(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700">التاريخ الهجري للعام الدراسي:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hijriInput}
                    onChange={(e) => setHijriInput(e.target.value)}
                    placeholder="مثال: 1447 - 1448 هـ"
                    className="flex-1 bg-white border border-slate-300 rounded-lg p-2 font-bold font-mono text-emerald-850"
                  />
                  <button
                    type="button"
                    onClick={handleAutoGenerateHijri}
                    className="inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-2 rounded-lg text-xs"
                    title="توليد التاريخ الهجري تلقائياً بناءً على السنة"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>توليد تلقائي</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSaveCalendar}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-xs"
              >
                اعتماد وتحديث التاريخ الهجري في النظام
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB: USERS & TRIAL CONTROL ----------------- */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateUser} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              إضافة حساب مستخدم جديد (مع تحديد الحسابات التجريبية للمعلمين):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
              <div>
                <label className="font-semibold block mb-1">الاسم الكامل:</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="اسم المعلم أو الطالب..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">رقم الهاتف:</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">الدور والصلاحية:</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold"
                >
                  <option value="teacher">معلم ممارس</option>
                  <option value="student">طالب مدرسي</option>
                  <option value="supervisor">مشرف تربوي</option>
                  <option value="admin">مدير عام</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">اسم المدرسة:</label>
                <input
                  type="text"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">مديرية التربية:</label>
                <input
                  type="text"
                  value={newDirectorate}
                  onChange={(e) => setNewDirectorate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2"
                />
              </div>

              {/* Trial Teacher Checkbox */}
              {newRole === 'teacher' && (
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="trialCheck"
                    checked={newIsTrial}
                    onChange={(e) => setNewIsTrial(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <label htmlFor="trialCheck" className="text-xs font-bold text-amber-900 cursor-pointer">
                    حساب تجريبي للمعلم (خطة درس واحدة + خطة فصلية لوحدة واحدة فقط)
                  </label>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs"
            >
              حفظ الحساب
            </button>
          </form>

          {/* User List with Trial Badges */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">اسم المستخدم</th>
                  <th className="p-3">رقم الهاتف</th>
                  <th className="p-3">الدور والاشتراك</th>
                  <th className="p-3">المدرسة والمديرية</th>
                  <th className="p-3 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">{u.name}</td>
                    <td className="p-3 font-mono text-slate-500">{u.phone}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 text-slate-800">
                          {u.role === 'student' ? 'طالب' : u.role === 'teacher' ? 'معلم' : u.role === 'supervisor' ? 'مشرف' : 'مدير'}
                        </span>
                        {u.isTrial && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            تجريبي ({u.trialPlansUsed || 0}/1 خطة)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-slate-600">{u.schoolName || '-'}</td>
                    <td className="p-3 text-center">
                      {users.length > 1 && (
                        <button
                          onClick={() => onDeleteUser(u.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------- TAB: CATALOG & SHARED CURRICULA ----------------- */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateBook} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              إضافة منهاج مدرسي (مشترك أو خاص بتخصص محدد):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs mb-3">
              <div>
                <label className="font-semibold block mb-1">الصف:</label>
                <select
                  value={newBookGrade}
                  onChange={(e) => setNewBookGrade(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold"
                >
                  {GRADES.map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">الفصل:</label>
                <select
                  value={newBookSemester}
                  onChange={(e) => setNewBookSemester(Number(e.target.value) as 1 | 2)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2"
                >
                  <option value={1}>الفصل الأول</option>
                  <option value={2}>الفصل الثاني</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">اسم المبحث:</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="مثال: المهارات الرقمية، الرسم الهندسي..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">لغة المبحث:</label>
                <select
                  value={newBookLang}
                  onChange={(e) => setNewBookLang(e.target.value as 'ar' | 'en')}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold"
                >
                  <option value="ar">العربية (RTL)</option>
                  <option value="en">English (LTR)</option>
                </select>
              </div>

              {/* Shared or specific track */}
              <div className="sm:col-span-2 flex items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-200">
                <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                  <input
                    type="radio"
                    name="bookShared"
                    checked={newIsShared}
                    onChange={() => setNewIsShared(true)}
                  />
                  <span>منهاج مشترك لجميع تخصصات الصف (مثل المهارات الرقمية)</span>
                </label>
                <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                  <input
                    type="radio"
                    name="bookShared"
                    checked={!newIsShared}
                    onChange={() => setNewIsShared(false)}
                  />
                  <span>مرتبط بتخصص معين فقط</span>
                </label>
              </div>

              {!newIsShared && (
                <div className="sm:col-span-2">
                  <label className="font-semibold block mb-1">اختر التخصص المرتبط بهذا الكتاب:</label>
                  <select
                    value={newBookSpec}
                    onChange={(e) => setNewBookSpec(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-blue-900"
                  >
                    {specializations.filter(s => s.grade === newBookGrade).map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs"
            >
              إضافة الكتاب للمنهاج
            </button>
          </form>

          {/* Books List */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">الصف</th>
                  <th className="p-3">اسم المبحث</th>
                  <th className="p-3">نوع المنهاج والتخصص</th>
                  <th className="p-3">اللغة</th>
                  <th className="p-3 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {books.map(b => (
                  <tr key={b.slug} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">الصف {b.grade}</td>
                    <td className="p-3 font-extrabold text-emerald-900">{b.subject}</td>
                    <td className="p-3">
                      {b.isShared ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          ⭐ مشترك لجميع التخصصات
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900">
                          🎯 تخصص: {b.specialization}
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono font-bold">
                      {b.language === 'en' ? 'English (LTR)' : 'العربية (RTL)'}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onDeleteBook(b.slug)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
