import React, { useState } from 'react';
import { Book, StudentAttendance } from '../types';
import { Users, Printer, Plus, Trash2, Download, CheckCircle, XCircle } from 'lucide-react';

interface AttendanceRegisterProps {
  book: Book;
  grade: number;
}

const MONTHS = [
  'أيلول (9)', 'تشرين الأول (10)', 'تشرين الثاني (11)', 'كانون الأول (12)',
  'كانون الثاني (1)', 'شباط (2)', 'آذار (3)', 'نيسان (4)', 'أيار (5)', 'حزيران (6)'
];

const INITIAL_STUDENTS: StudentAttendance[] = [
  { id: '1', number: 1, name: 'أحمد محمود العبداللات', records: { 1: 'P', 2: 'P', 3: 'A', 4: 'P', 5: 'P' } },
  { id: '2', number: 2, name: 'إبراهيم خالد الزعبي', records: { 1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'E' } },
  { id: '3', number: 3, name: 'حمزة عمر المجالي', records: { 1: 'P', 2: 'A', 3: 'A', 4: 'P', 5: 'P' } },
  { id: '4', number: 4, name: 'راشد سامي الحديد', records: { 1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'P' } },
  { id: '5', number: 5, name: 'سيف الدين طارق الطراونة', records: { 1: 'A', 2: 'P', 3: 'P', 4: 'P', 5: 'P' } },
  { id: '6', number: 6, name: 'عبدالله حسام الرواشدة', records: { 1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'P' } },
  { id: '7', number: 7, name: 'عمر فيصل بني هاني', records: { 1: 'P', 2: 'P', 3: 'P', 4: 'A', 5: 'P' } },
  { id: '8', number: 8, name: 'محمد ناصر العبادي', records: { 1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'P' } },
  { id: '9', number: 9, name: 'يوسف جمال المعايطة', records: { 1: 'P', 2: 'E', 3: 'P', 4: 'P', 5: 'P' } }
];

export const AttendanceRegister: React.FC<AttendanceRegisterProps> = ({ book, grade }) => {
  const [selectedMonth, setSelectedMonth] = useState('أيلول (9)');
  const [students, setStudents] = useState<StudentAttendance[]>(INITIAL_STUDENTS);
  const [newStudentName, setNewStudentName] = useState('');
  const [selectedDay, setSelectedDay] = useState(1);

  const daysInMonth = 30; // standard view
  const daysList = Array.from({ length: 15 }, (_, i) => i + 1); // 1 to 15 for compact responsive view

  const handleToggleAttendance = (studentId: string, day: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      const current = s.records[day] || 'P';
      let next: 'P' | 'A' | 'E' = 'P';
      if (current === 'P') next = 'A';
      else if (current === 'A') next = 'E';
      else if (current === 'E') next = 'P';

      return {
        ...s,
        records: { ...s.records, [day]: next }
      };
    }));
  };

  const handleAddStudent = () => {
    if (!newStudentName.trim()) return;
    const newStudent: StudentAttendance = {
      id: String(Date.now()),
      number: students.length + 1,
      name: newStudentName.trim(),
      records: {}
    };
    setStudents([...students, newStudent]);
    setNewStudentName('');
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id).map((s, idx) => ({ ...s, number: idx + 1 })));
  };

  const countAbsences = (records: { [day: number]: 'P' | 'A' | 'E' }) => {
    return Object.values(records).filter(r => r === 'A').length;
  };

  const exportCSV = () => {
    let csv = `الرقم,اسم الطالب,أيام الغياب\n`;
    students.forEach(s => {
      csv += `${s.number},"${s.name}",${countAbsences(s.records)}\n`;
    });
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `سجل_الغياب_${selectedMonth}.csv`;
    a.click();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 no-print">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-100 text-rose-800 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-850">📋 سجل الحضور والغياب المدرسي الرسمي</h2>
            <p className="text-xs text-slate-500">رصد الحضور اليومي، احتساب الغياب المبرر وغير المبرر، وتصدير السجلات</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>تصدير Excel/CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة السجل</span>
          </button>
        </div>
      </div>

      {/* Month & Quick Add Student */}
      <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">الشهر الدراسي:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-800"
          >
            {MONTHS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">إضافة طالب جديد للقائمة:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="اسم الطالب الرباعي..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm"
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddStudent(); }}
            />
            <button
              onClick={handleAddStudent}
              className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
        <div className="p-3 bg-slate-100 border-b border-slate-300 flex justify-between items-center text-xs font-bold text-slate-700">
          <span>سجل غياب الصف {grade} - مبحث {book.subject} - شهر {selectedMonth}</span>
          <div className="flex gap-3 text-[11px] font-normal">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> حاضر (ح)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> غائب (غ)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> معذور (م)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-300 font-bold">
                <th className="p-2.5 w-10 text-center border-l border-slate-200">#</th>
                <th className="p-2.5 w-48 border-l border-slate-200">اسم الطالب</th>
                {daysList.map(d => (
                  <th key={d} className="p-1.5 w-8 text-center border-l border-slate-200 font-mono text-[11px]">
                    {d}
                  </th>
                ))}
                <th className="p-2.5 w-16 text-center border-l border-slate-200">مجموع الغياب</th>
                <th className="p-2.5 w-10 text-center no-print">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const absences = countAbsences(student.records);
                return (
                  <tr key={student.id} className="border-b border-slate-200 hover:bg-slate-50/70 transition-colors">
                    <td className="p-2 text-center border-l border-slate-200 font-mono text-slate-500">
                      {student.number}
                    </td>
                    <td className="p-2 border-l border-slate-200 font-bold text-slate-800 truncate">
                      {student.name}
                    </td>
                    {daysList.map(d => {
                      const status = student.records[d] || 'P';
                      return (
                        <td key={d} className="p-1 text-center border-l border-slate-200">
                          <button
                            type="button"
                            onClick={() => handleToggleAttendance(student.id, d)}
                            className={`w-6 h-6 rounded-md font-bold text-[11px] transition-all flex items-center justify-center mx-auto ${
                              status === 'P'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                                : status === 'A'
                                ? 'bg-rose-500 text-white font-black shadow-xs'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                            title="انقر لتغيير الحالة (حاضر / غائب / معذور)"
                          >
                            {status === 'P' ? 'ح' : status === 'A' ? 'غ' : 'م'}
                          </button>
                        </td>
                      );
                    })}
                    <td className="p-2 text-center border-l border-slate-200 font-bold font-mono">
                      <span className={`px-2 py-0.5 rounded-full ${absences > 0 ? 'bg-rose-100 text-rose-700' : 'text-slate-400'}`}>
                        {absences}
                      </span>
                    </td>
                    <td className="p-2 text-center no-print">
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                        title="حذف الطالب"
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
  );
};
