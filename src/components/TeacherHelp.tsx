import React, { useState } from 'react';
import { Book } from '../types';
import { GraduationCap, Lightbulb, Users, AlertTriangle, Globe, Sparkles } from 'lucide-react';

interface TeacherHelpProps {
  book: Book;
  grade: number;
}

export const TeacherHelp: React.FC<TeacherHelpProps> = ({ book, grade }) => {
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

  const units = book.units || [];
  const currentUnit = units[selectedUnitIndex];
  const lessons = currentUnit ? currentUnit.lessons : [];
  const currentLesson = lessons[selectedLessonIndex] || lessons[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6">
      <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
        <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-850">🧑‍🏫 مساعد الشرح واستراتيجيات التدريس الحديثة</h2>
          <p className="text-xs text-slate-500">أفكار إبداعية للتهيئة الحافزة، الأنشطة الصفية، وتصويب المفاهيم المغلوطة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">الوحدة:</label>
          <select
            value={selectedUnitIndex}
            onChange={(e) => {
              setSelectedUnitIndex(Number(e.target.value));
              setSelectedLessonIndex(0);
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-amber-500"
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
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-amber-500"
          >
            {lessons.map((l, i) => (
              <option key={i} value={i}>{l.title}</option>
            ))}
          </select>
        </div>
      </div>

      {currentLesson && (
        <div className="space-y-4">
          {/* Card 1: Engaging Hook */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4.5">
            <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              أفكار للتهيئة الحافزة وبدء الحصة (3 - 5 دقائق)
            </h4>
            <ul className="text-xs text-amber-950 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>اعرض صورة لغز أو مقطعاً قصيراً يرتبط مباشرة بعنوان الدرس "{currentLesson.title}" واطلب من الطلبة تخمين العلاقة.</li>
              <li>اطرح سؤالاً افتراضياً: "ماذا لو لم تحدث هذه النتيجة؟ كيف كان سيبدو واقعنا اليوم؟".</li>
              <li>استخدم صندوق المفاجآت أو بطاقة الحقيقة والتحدي لإثارة فضول الطلبة واستدعاء خبراتهم السابقة.</li>
            </ul>
          </div>

          {/* Card 2: Interactive Activities */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4.5">
            <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              أنشطة صفية تفاعلية مقترحة
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-blue-950">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <strong className="block text-blue-800 mb-1">استراتيجية الرؤوس المرقمة:</strong>
                قسّم الصف إلى مجموعات رباعية، اطرح سؤالاً تحليلياً من كتاب المبحث، واطلب من المجموعة الاتفاق على الإجابة قبل اختيار رقم عشوائي.
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <strong className="block text-blue-800 mb-1">لعب الأدوار والمناظرة:</strong>
                وزّع أدواراً تمثيلية أو نظّم مناظرة سريعة بين فريقين لتوضيح وجهات النظر المختلفة في الدرس ودعمها بالأدلة.
              </div>
            </div>
          </div>

          {/* Card 3: Common Misconceptions */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4.5">
            <h4 className="font-bold text-rose-900 text-sm flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              المفاهيم الخاطئة الشائعة لدى الطلبة وطرق معالجتها
            </h4>
            <div className="space-y-2 text-xs text-rose-950">
              <div className="bg-white p-2.5 rounded-lg border border-rose-200 flex items-start gap-2">
                <span className="font-bold text-rose-700">المفهوم الخاطئ:</span>
                <span>الخلط بين المفاهيم المتشابهة في التسمية أو إغفال الترتيب الزمني/الشرطي للقوانين العلمية.</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-rose-200 flex items-start gap-2">
                <span className="font-bold text-emerald-700">التصويب الإجرائي:</span>
                <span>تصميم جدول مقارنة ثنائي على السبورة يُبرز الفروق الجوهرية مع أمثلة ونماذج تطبيقية مضادة.</span>
              </div>
            </div>
          </div>

          {/* Card 4: Jordanian Context & Real-world connection */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4.5">
            <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              ربط الدرس بالبيئة والمجتمع الأردني
            </h4>
            <p className="text-xs text-emerald-950 leading-relaxed">
              وجّه الطلبة لاستكشاف شواهد ومظاهر واقعية من مختلف محافظات المملكة (عمان، إربد، الزرقاء، الكرك، البترا، العقبة...) ذات الصلة بموضوع {book.subject}، لترسيخ الانتماء الوطني وإدراك أهمية المادة علمياً ومجتمعياً.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
