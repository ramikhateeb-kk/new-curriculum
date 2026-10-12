export type UserRole = 'student' | 'teacher' | 'supervisor' | 'admin';

export interface Specialization {
  id: string;
  grade: number; // 10, 11, 12
  name: string; // e.g., 'هندسي', 'زراعي', 'علمي', 'أدبي', 'تكنولوجيا المعلومات'
  code: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  grade?: number;
  specialization?: string; // التخصص للطلبة والمعلمين في الصفوف 10، 11، 12
  division?: string;       // الشعبة: أ، ب، ج...
  schoolName?: string;     // اسم المدرسة
  directorate?: string;    // مديرية التربية والتعليم
  isTrial?: boolean;       // حساب تجريبي للمعلم
  trialPlansUsed?: number; // عدد خطط الدروس المستخدمة (الحد الأقصى: 1 للحساب التجريبي)
  trialSemesterPlansUsed?: number; // عدد الخطط الفصلية المستخدمة
  assignedSubjects?: string[];
}

export interface Lesson {
  title: string;
  start: number;
  end?: number;
}

export interface Unit {
  title: string;
  start: number;
  end?: number;
  lessons: Lesson[];
}

export interface Book {
  grade: number; // 1 to 12
  semester: 1 | 2;
  subject: string;
  slug: string;
  pdf_url?: string;
  page_offset: number;
  units: Unit[];
  specialization?: string; // 'all' للمناهج المشتركة (كالمهارات الرقمية) أو اسم التخصص المحدد
  isShared?: boolean;      // منهاج مشترك بين جميع تخصصات هذا الصف
  language?: 'ar' | 'en';  // لغة المنهاج (إنجليزية أو عربية)
}

export interface AcademicCalendar {
  year1: number;
  hijriYear: string;       // التاريخ الهجري المعتمد للعام الدراسي (مثال: 1447 - 1448 هـ)
  sem1Start: string;
  sem1End: string;
  sem2Start: string;
  sem2End: string;
}

export type ActionType = 
  | 'explain'
  | 'quiz'
  | 'exam'
  | 'plan'
  | 'semester_plan'
  | 'content_analysis'
  | 'teach_help'
  | 'slides'
  | 'attendance'
  | 'marks_book'
  | 'qbank'
  | 'admin_accounts'
  | 'admin_catalog'
  | 'admin_specializations';

export type QuestionType = 'mcq' | 'tf' | 'fill' | 'short';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  answer: string | number;
  explanation?: string;
  lessonTitle?: string;
  unitTitle?: string;
  page?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  bloomLevel?: 'تذكر' | 'فهم' | 'تطبيق' | 'تحليل';
}

export interface LessonPlanStage {
  title: string;
  teacherRole: string;
  studentRole: string;
  duration?: string;
}

export interface LessonPlanData {
  grade: number;
  semester: number;
  subject: string;
  unit: string;
  lesson: string;
  date: string;
  priorLearning: string;
  outcomes: string[];
  strategies: string[];
  assessmentMethods: string[];
  stages: LessonPlanStage[];
  reflection?: string;
  language?: 'ar' | 'en';
}

export interface ContentAnalysisData {
  unit: string;
  lesson: string;
  concepts: string[];
  facts: string[];
  generalizations: string[];
  values: string[];
  skills: string[];
  language?: 'ar' | 'en';
}

export interface SlideItem {
  title: string;
  bullets: string[];
  notes?: string;
}

export interface StudentAttendance {
  id: string;
  name: string;
  number: number;
  records: { [day: number]: 'P' | 'A' | 'E' };
}

export interface StudentMark {
  id: string;
  name: string;
  number: number;
  firstExam: number;
  secondExam: number;
  participation: number;
  finalExam: number;
}
