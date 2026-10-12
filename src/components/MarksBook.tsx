import React, { useState } from 'react';
import { Book, StudentMark, User, AcademicCalendar } from '../types';
import { Award, Printer, Download, Plus, Trash2, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface MarksBookProps {
  book: Book;
  grade: number;
  currentUser: User;
  calendar: AcademicCalendar;
  specialization?: string;
  division?: string;
}

const INITIAL_MARKS: StudentMark[] = [
  { id: '1', number: 1, name: 'أحمد محمود العبداللات', firstExam: 19, secondExam: 18, participation: 20, finalExam: 38 },
  { id: '2', number: 2, name: 'إبراهيم خالد الزعبي', firstExam: 17, secondExam: 16, participation: 18, finalExam: 34 },
  { id: '3', number: 3, name: 'حمزة عمر المجالي', firstExam: 15, secondExam: 14, participation: 16, finalExam: 30 },
  { id: '4', number: 4, name: 'راشد سامي الحديد', firstExam: 20, secondExam: 20, participation: 20, finalExam: 40 },
  { id: '5', number: 5, name: 'سيف الدين طارق الطراونة', firstExam: 14, secondExam: 15, participation: 15, finalExam: 28 },
  { id: '6', number: 6, name: 'عبدالله حسام الرواشدة', firstExam: 18, secondExam: 17, participation: 19, finalExam: 36 },
  { id: '7', number: 7, name: 'عمر فيصل بني هاني', firstExam: 16, secondExam: 18, participation: 17, finalExam: 35 },
  { id: '8', number: 8, name: 'محمد ناصر العبادي', firstExam: 19, secondExam: 19, participation: 20, finalExam: 39 },
  { id: '9', number: 9, name: 'يوسف جمال المعايطة', firstExam: 18, secondExam: 18, participation: 19, finalExam: 37 }
];

export const MarksBook: React.FC<MarksBookProps> = ({
  book,
  grade,
  currentUser,
  calendar,
  specialization,
  division
}) => {
  const [activeTab, setActiveTab] = useState<'marks_table' | 'outer_cover' | 'inner_cover'>('marks_table');
  const [marks, setMarks] = useState<StudentMark[]>(INITIAL_MARKS);
  const [newStudentName, setNewStudentName] = useState('');

  // Auto-known data from current user & session
  const teacherName = currentUser.name || 'الأستاذ رامي الخطيب';
  const schoolName = currentUser.schoolName || 'مدرسة الملك عبد الله الثاني للتميز';
  const directorate = currentUser.directorate || 'مديرية التربية والتعليم لقصبة عمان';
  const subjectName = book.subject;
  const gradeLabel = `الصف ${grade}`;
  const trackInfo = specialization ? `تخصص: ${specialization}` : '';
  const sectionInfo = division || currentUser.division || 'شعبة (أ)';
  const hijriYear = calendar.hijriYear || '1447 - 1448 هـ';
  const gregorianYear = `${calendar.year1} / ${calendar.year1 + 1} م`;
  const semesterText = book.semester === 1 ? 'الفصل الدراسي الأول' : 'الفصل الدراسي الثاني';

  // Only non-system/unrecorded fields prompt to the user
  const [principalName, setPrincipalName] = useState('أ. محمد العبادي');
  const [supervisorName, setSupervisorName] = useState('د. خالد الشوابكة');
  const [notes, setNotes] = useState('تم رصد العلامات وفق استراتيجيات التقويم وأدواته المعتمدة من الوزارة.');

  const handleScoreChange = (id: string, field: keyof StudentMark, val: number) => {
    setMarks(prev => prev.map(m => {
      if (m.id !== id) return m;
      return { ...m, [field]: Number.isNaN(val) ? 0 : val };
    }));
  };

  const handleAddStudent = () => {
    if (!newStudentName.trim()) return;
    const newStudent: StudentMark = {
      id: String(Date.now()),
      number: marks.length + 1,
      name: newStudentName.trim(),
      firstExam: 15,
      secondExam: 15,
      participation: 15,
      finalExam: 30
    };
    setMarks([...marks, newStudent]);
    setNewStudentName('');
  };

  const handleDelete = (id: string) => {
    setMarks(marks.filter(m => m.id !== id).map((m, idx) => ({ ...m, number: idx + 1 })));
  };

  const getRating = (total: number) => {
    if (total >= 90) return { label: 'ممتاز', color: 'text-emerald-700 bg-emerald-100' };
    if (total >= 80) return { label: 'جيد جداً', color: 'text-blue-700 bg-blue-100' };
    if (total >= 70) return { label: 'جيد', color: 'text-indigo-700 bg-indigo-100' };
    if (total >= 50) return { label: 'مقبول', color: 'text-amber-700 bg-amber-100' };
    return { label: 'ضعيف', color: 'text-rose-700 bg-rose-100' };
  };

  const exportCSV = () => {
    let csv = `الرقم,اسم الطالب,الشهر الأول (20),الشهر الثاني (20),المشاركة (20),النهائي (40),المجموع (100),التقدير\n`;
    marks.forEach(m => {
      const tot = m.firstExam + m.secondExam + m.participation + m.finalExam;
      csv += `${m.number},"${m.name}",${m.firstExam},${m.secondExam},${m.participation},${m.finalExam},${tot},"${getRating(tot).label}"\n`;
    });
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `دفتر_العلامات_${subjectName}.csv`;
    a.click();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6">
      {/* Top Bar with Sub-tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 no-print">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-850">📒 دفتر رصد العلامات والغلاف المدرسي الرسمي</h2>
            <p className="text-xs text-slate-500">
              تعبئة تلقائية لبيانات المعلم والمدرسة والتاريخ الهجري مع نماذج الغلاف الخارجي والداخلي
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {activeTab === 'marks_table' && (
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>تصدير Excel/CSV</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الصفحة الحالية</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="no-print flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('marks_table')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'marks_table'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>جدول رصد العلامات والتقويم</span>
        </button>

        <button
          onClick={() => setActiveTab('outer_cover')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'outer_cover'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>الغلاف الخارجي لدفتر العلامات</span>
        </button>

        <button
          onClick={() => setActiveTab('inner_cover')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'inner_cover'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>الغلاف الداخلي وتعليمات التقويم</span>
        </button>
      </div>

      {/* Auto-filled Info Summary Banner (No-print) */}
      <div className="no-print mb-6 p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-950">
        <div className="flex items-center gap-2 font-bold mb-2 text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>البيانات المعرفة تلقائياً في النظام (مملوءة دون الحاجة لإعادة كتابتها):</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div><strong>المعلم:</strong> {teacherName}</div>
          <div><strong>المبحث:</strong> {subjectName}</div>
          <div><strong>الصف والتخصص:</strong> {gradeLabel} {trackInfo ? `(${trackInfo})` : ''} - {sectionInfo}</div>
          <div><strong>المدرسة:</strong> {schoolName}</div>
          <div><strong>المديرية:</strong> {directorate}</div>
          <div><strong>التاريخ الهجري:</strong> {hijriYear}</div>
          <div><strong>العام الميلادي:</strong> {gregorianYear}</div>
          <div><strong>الفصل:</strong> {semesterText}</div>
        </div>
      </div>

      {/* ----------------- TAB 1: MARKS TABLE ----------------- */}
      {activeTab === 'marks_table' && (
        <div>
          {/* Quick Add Bar */}
          <div className="no-print mb-5 flex gap-2">
            <input
              type="text"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="إضافة اسم طالب جديد لدفتر العلامات..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm"
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddStudent(); }}
            />
            <button
              onClick={handleAddStudent}
              className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة طالب</span>
            </button>
          </div>

          {/* Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
            <div className="p-3 bg-slate-100 border-b border-slate-300 flex justify-between items-center text-xs font-bold text-slate-700">
              <span>
                سجل علامات: {subjectName} - {gradeLabel} {trackInfo ? `(${trackInfo})` : ''} - {sectionInfo} - {semesterText}
              </span>
              <span className="text-[11px] font-normal text-slate-500">
                العام الدراسي: {hijriYear} / {gregorianYear}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-300 font-bold">
                    <th className="p-2.5 w-10 text-center border-l border-slate-200">#</th>
                    <th className="p-2.5 w-48 border-l border-slate-200">اسم الطالب</th>
                    <th className="p-2.5 w-24 text-center border-l border-slate-200">الشهر الأول (20)</th>
                    <th className="p-2.5 w-24 text-center border-l border-slate-200">الشهر الثاني (20)</th>
                    <th className="p-2.5 w-24 text-center border-l border-slate-200">المشاركة (20)</th>
                    <th className="p-2.5 w-24 text-center border-l border-slate-200">النهائي (40)</th>
                    <th className="p-2.5 w-24 text-center border-l border-slate-200 bg-amber-50/60 font-black">المجموع (100)</th>
                    <th className="p-2.5 w-24 text-center border-l border-slate-200">التقدير</th>
                    <th className="p-2.5 w-10 text-center no-print">إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((m) => {
                    const total = (m.firstExam || 0) + (m.secondExam || 0) + (m.participation || 0) + (m.finalExam || 0);
                    const rating = getRating(total);
                    return (
                      <tr key={m.id} className="border-b border-slate-200 hover:bg-slate-50/70 transition-colors">
                        <td className="p-2 text-center border-l border-slate-200 font-mono text-slate-500">{m.number}</td>
                        <td className="p-2 border-l border-slate-200 font-bold text-slate-800">{m.name}</td>
                        <td className="p-1 border-l border-slate-200 text-center">
                          <input
                            type="number"
                            min={0}
                            max={20}
                            value={m.firstExam}
                            onChange={(e) => handleScoreChange(m.id, 'firstExam', Number(e.target.value))}
                            className="w-14 text-center border border-slate-200 rounded p-1 font-mono font-bold"
                          />
                        </td>
                        <td className="p-1 border-l border-slate-200 text-center">
                          <input
                            type="number"
                            min={0}
                            max={20}
                            value={m.secondExam}
                            onChange={(e) => handleScoreChange(m.id, 'secondExam', Number(e.target.value))}
                            className="w-14 text-center border border-slate-200 rounded p-1 font-mono font-bold"
                          />
                        </td>
                        <td className="p-1 border-l border-slate-200 text-center">
                          <input
                            type="number"
                            min={0}
                            max={20}
                            value={m.participation}
                            onChange={(e) => handleScoreChange(m.id, 'participation', Number(e.target.value))}
                            className="w-14 text-center border border-slate-200 rounded p-1 font-mono font-bold"
                          />
                        </td>
                        <td className="p-1 border-l border-slate-200 text-center">
                          <input
                            type="number"
                            min={0}
                            max={40}
                            value={m.finalExam}
                            onChange={(e) => handleScoreChange(m.id, 'finalExam', Number(e.target.value))}
                            className="w-14 text-center border border-slate-200 rounded p-1 font-mono font-bold"
                          />
                        </td>
                        <td className="p-2 border-l border-slate-200 text-center font-black font-mono text-sm bg-amber-50/50">
                          {total}
                        </td>
                        <td className="p-2 border-l border-slate-200 text-center">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${rating.color}`}>
                            {rating.label}
                          </span>
                        </td>
                        <td className="p-2 text-center no-print">
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors"
                            title="حذف السجل"
                          >
                            <Trash2 className="w-3.5 h-3.5 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 2: OUTER COVER (الغلاف الخارجي) ----------------- */}
      {activeTab === 'outer_cover' && (
        <div className="bg-white border-4 border-double border-slate-900 p-8 sm:p-12 rounded-2xl max-w-2xl mx-auto text-center printable-outer-cover shadow-sm">
          {/* Header */}
          <div className="space-y-1 mb-8">
            <h3 className="text-sm font-bold text-slate-800">المملكة الأردنية الهاشمية</h3>
            <h2 className="text-base font-extrabold text-slate-900">وزارة التربية والتعليم</h2>
            <p className="text-xs font-semibold text-slate-700">{directorate}</p>
            <p className="text-xs font-semibold text-slate-700">{schoolName}</p>
          </div>

          <div className="w-24 h-0.5 bg-slate-800 mx-auto mb-8"></div>

          {/* Main Title Badge */}
          <div className="my-8 py-4 px-6 border-2 border-slate-800 bg-amber-50/50 rounded-xl inline-block max-w-md">
            <h1 className="text-2xl font-black text-slate-950 mb-1">
              سجل العلامات والتقويم المدرسي
            </h1>
            <p className="text-xs font-bold text-slate-700">
              {semesterText}
            </p>
          </div>

          {/* Academic Year with Hijri Date */}
          <div className="flex justify-center items-center gap-6 text-xs font-bold text-slate-800 mb-10">
            <div>
              <span>العام الهجري: </span>
              <span className="font-extrabold font-mono text-emerald-800">{hijriYear}</span>
            </div>
            <div className="text-slate-400">|</div>
            <div>
              <span>العام الدراسي: </span>
              <span className="font-extrabold font-mono text-slate-900">{gregorianYear}</span>
            </div>
          </div>

          {/* Subject & Grade & Teacher Grid */}
          <div className="border border-slate-800 rounded-xl p-6 text-sm text-right space-y-3 max-w-lg mx-auto bg-slate-50/60 font-semibold">
            <div className="flex justify-between border-b border-slate-300 pb-2">
              <span className="text-slate-600">المبحث الدراسي:</span>
              <span className="font-extrabold text-slate-900">{subjectName}</span>
            </div>

            <div className="flex justify-between border-b border-slate-300 pb-2">
              <span className="text-slate-600">الصف والتخصص:</span>
              <span className="font-bold text-slate-900">
                {gradeLabel} {trackInfo ? `(${trackInfo})` : ''}
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-300 pb-2">
              <span className="text-slate-600">الشعبة:</span>
              <span className="font-bold text-slate-900">{sectionInfo}</span>
            </div>

            <div className="flex justify-between border-b border-slate-300 pb-2">
              <span className="text-slate-600">معلم المبحث:</span>
              <span className="font-extrabold text-slate-900">{teacherName}</span>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-400 flex justify-between items-center text-xs font-bold text-slate-700">
            <div>توقيع المعلم: ............................</div>
            <div>توقيع مدير المدرسة والختم: ............................</div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 3: INNER COVER (الغلاف الداخلي) ----------------- */}
      {activeTab === 'inner_cover' && (
        <div className="bg-white border-2 border-slate-800 p-6 sm:p-8 rounded-2xl max-w-3xl mx-auto printable-inner-cover shadow-sm">
          {/* Header */}
          <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
            <h2 className="text-base font-extrabold text-slate-900">
              الغلاف الداخلي - تعليمات وأوزان التقويم المدرسي المعتمدة
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              المبحث: {subjectName} | {gradeLabel} {trackInfo ? `(${trackInfo})` : ''} | {sectionInfo} | العام: {hijriYear}
            </p>
          </div>

          {/* Official Evaluation Breakdown */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-800 mb-2">جدول أوزان التقويم لفصول السنة الدراسية:</h3>
            <table className="w-full text-xs text-right border-collapse border border-slate-400">
              <thead>
                <tr className="bg-slate-200 text-slate-900 font-bold">
                  <th className="border border-slate-400 p-2">فترة التقويم</th>
                  <th className="border border-slate-400 p-2">نوع التقييم وأدواته</th>
                  <th className="border border-slate-400 p-2 text-center w-24">الوزن / العلامة</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="border border-slate-400 p-2 font-bold">التقويم الأول</td>
                  <td className="border border-slate-400 p-2">اختبار تحريري مقنن في موضوعات الشهر الأول</td>
                  <td className="border border-slate-400 p-2 text-center font-bold">20 علامة</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="border border-slate-400 p-2 font-bold">التقويم الثاني</td>
                  <td className="border border-slate-400 p-2">اختبار تحريري في موضوعات الشهر الثاني أو مهمة أدائية موسعة</td>
                  <td className="border border-slate-400 p-2 text-center font-bold">20 علامة</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="border border-slate-400 p-2 font-bold">التقويم الثالث</td>
                  <td className="border border-slate-400 p-2">المشاركة الصفية، الواجبات، الأنشطة التطبيقية، وسلالم التقدير</td>
                  <td className="border border-slate-400 p-2 text-center font-bold">20 علامة</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="border border-slate-400 p-2 font-bold">التقويم الرابع</td>
                  <td className="border border-slate-400 p-2">امتحان نهاية الفصل الدراسي الشامل لكامل المنهاج المقرر</td>
                  <td className="border border-slate-400 p-2 text-center font-bold">40 علامة</td>
                </tr>
                <tr className="bg-amber-50 font-black">
                  <td colSpan={2} className="border border-slate-400 p-2 text-slate-900">المجموع الكلي للعلامة الفصلية</td>
                  <td className="border border-slate-400 p-2 text-center text-sm font-mono text-emerald-800">100 علامة</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Form to fill ONLY the remaining non-system fields */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 text-xs space-y-3 mb-6">
            <h4 className="font-bold text-slate-800">بيانات إدارية إضافية (اختيارية للمصادقة):</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1">اسم مدير / مديرة المدرسة:</label>
                <input
                  type="text"
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">اسم المشرف التربوي المتابع:</label>
                <input
                  type="text"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 mb-1">ملاحظات المعلم وتوجيهات الإشراف:</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2"
                />
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-4 border-t border-slate-400 flex justify-between items-center text-xs font-bold text-slate-800">
            <div>توقيع المعلم: {teacherName}</div>
            <div>المشرف التربوي: {supervisorName}</div>
            <div>مدير المدرسة: {principalName}</div>
          </div>
        </div>
      )}
    </div>
  );
};
