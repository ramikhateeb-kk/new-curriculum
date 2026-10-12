import React from 'react';
import { User, UserRole } from '../types';
import { BookOpen, User as UserIcon, Shield, GraduationCap, School } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  availableUsers: User[];
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onUserChange,
  availableUsers
}) => {
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'student':
        return { label: 'طالب مدرسي', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: GraduationCap };
      case 'teacher':
        return { label: 'معلم ممارس', bg: 'bg-blue-100 text-blue-800 border-blue-300', icon: School };
      case 'supervisor':
        return { label: 'مشرف تربوي', bg: 'bg-purple-100 text-purple-800 border-purple-300', icon: Shield };
      case 'admin':
        return { label: 'مدير عام', bg: 'bg-amber-100 text-amber-800 border-amber-300', icon: Shield };
    }
  };

  const badge = getRoleBadge(currentUser.role);
  const IconComponent = badge.icon;

  return (
    <header className="mb-6">
      {/* Top Bar with user selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-700">المملكة الأردنية الهاشمية - وزارة التربية والتعليم</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <UserIcon className="w-3.5 h-3.5" />
            <span>الحساب الحالي:</span>
          </div>

          <select
            value={currentUser.id}
            onChange={(e) => {
              const u = availableUsers.find(user => user.id === e.target.value);
              if (u) onUserChange(u);
            }}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {availableUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role === 'student' ? 'طالب' : u.role === 'teacher' ? 'معلم' : u.role === 'supervisor' ? 'مشرف' : 'مدير'})
              </option>
            ))}
          </select>

          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold border ${badge.bg}`}>
            <IconComponent className="w-3.5 h-3.5" />
            {badge.label}
          </span>
        </div>
      </div>

      {/* Hero Banner matching original design */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2e6f5e] p-6 sm:p-7 rounded-2xl text-center text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="inline-flex items-center justify-center p-2.5 bg-white/10 rounded-2xl mb-3 backdrop-blur-xs">
          <BookOpen className="w-8 h-8 text-emerald-300" />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight">
          📚 مساعد المنهاج الأردني
        </h1>
        <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto font-normal">
          اختر صفّك ومادتك، واحصل على شرح أو تقييم من الكتاب مباشرة، وإعداد الاختبارات والخطط المدرسية وسجلات الحضور والعلامات
        </p>
      </div>
    </header>
  );
};
