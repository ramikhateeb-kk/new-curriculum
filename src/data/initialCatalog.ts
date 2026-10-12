import { Book, Specialization, AcademicCalendar } from '../types';

export const GRADES = [
  { value: 1, label: 'الصف الأول' },
  { value: 2, label: 'الصف الثاني' },
  { value: 3, label: 'الصف الثالث' },
  { value: 4, label: 'الصف الرابع' },
  { value: 5, label: 'الصف الخامس' },
  { value: 6, label: 'الصف السادس' },
  { value: 7, label: 'الصف السابع' },
  { value: 8, label: 'الصف الثامن' },
  { value: 9, label: 'الصف التاسع' },
  { value: 10, label: 'الصف العاشر (مسارات وتخصصات)' },
  { value: 11, label: 'الصف الحادي عشر (فروع وتخصصات)' },
  { value: 12, label: 'الصف الثاني عشر - التوجيهي (فروع وتخصصات)' },
];

export const INITIAL_SPECIALIZATIONS: Specialization[] = [
  // Grade 10 Specializations
  { id: 'spec-10-eng', grade: 10, name: 'هندسي (BTEC)', code: 'ENG', description: 'المسار المهني الهندسي والتطبيقي' },
  { id: 'spec-10-it', grade: 10, name: 'تكنولوجيا المعلومات (BTEC)', code: 'IT', description: 'مسار البرمجيات والشبكات' },
  { id: 'spec-10-agr', grade: 10, name: 'زراعي', code: 'AGR', description: 'المسار الزراعي المهني' },
  { id: 'spec-10-acad', grade: 10, name: 'أكاديمي عام', code: 'ACAD', description: 'المسار الأكاديمي الشامل' },

  // Grade 11 Specializations
  { id: 'spec-11-sci', grade: 11, name: 'علمي', code: 'SCI', description: 'الفرع العلمي' },
  { id: 'spec-11-lit', grade: 11, name: 'أدبي', code: 'LIT', description: 'الفرع الأدبي والإنساني' },
  { id: 'spec-11-agr', grade: 11, name: 'زراعي', code: 'AGR', description: 'الفرع الزراعي والإنتاج النباتي والحيواني' },
  { id: 'spec-11-eng', grade: 11, name: 'هندسي (BTEC)', code: 'ENG', description: 'المسار التقني الهندسي' },
  { id: 'spec-11-ind', grade: 11, name: 'صناعي', code: 'IND', description: 'الفرع الصناعي المهني' },

  // Grade 12 Specializations
  { id: 'spec-12-sci', grade: 12, name: 'علمي', code: 'SCI', description: 'فرع العلوم التطبيقية والتكنولوجية' },
  { id: 'spec-12-lit', grade: 12, name: 'أدبي', code: 'LIT', description: 'فرع الآداب والعلوم الإنسانية' },
  { id: 'spec-12-eng', grade: 12, name: 'هندسي (BTEC)', code: 'ENG', description: 'المسار الهندسي BTEC' },
  { id: 'spec-12-agr', grade: 12, name: 'زراعي', code: 'AGR', description: 'الفرع الزراعي المهني' },
  { id: 'spec-12-ind', grade: 12, name: 'صناعي', code: 'IND', description: 'الفرع الصناعي المهني' }
];

export const INITIAL_CALENDAR: AcademicCalendar = {
  year1: 2026,
  hijriYear: '1447 - 1448 هـ',
  sem1Start: '2026-08-25',
  sem1End: '2027-01-14',
  sem2Start: '2027-02-01',
  sem2End: '2027-06-25'
};

export const INITIAL_BOOKS: Book[] = [
  // --- Grade 12 Shared (مشترك لجميع التخصصات) ---
  {
    grade: 12,
    semester: 1,
    subject: 'تاريخ الأردن (مشترك)',
    slug: 'b0e979746',
    page_offset: 0,
    isShared: true,
    specialization: 'all',
    language: 'ar',
    units: [
      {
        title: 'الوحدة الأولى: الأردنّ في العصور القديمة',
        start: 6,
        end: 41,
        lessons: [
          { title: 'الدرس الأول: الأردنّ في العصور الحجرية', start: 8, end: 15 },
          { title: 'الدرس الثاني: الأردنّ في العصر الحديدي', start: 16, end: 20 },
          { title: 'الدرس الثالث: مملكة الأنباط', start: 21, end: 28 },
          { title: 'الدرس الرابع: مظاهر الحضارتين اليونانية والرومانية-البيزنطية في الأردنّ', start: 29, end: 39 },
          { title: 'مراجعة الوحدة الأولى', start: 40, end: 41 }
        ]
      },
      {
        title: 'الوحدة الثانية: الأردنّ في العصور الإسلامية',
        start: 42,
        end: 79,
        lessons: [
          { title: 'الدرس الأول: الأردنّ في صدر الإسلام', start: 44, end: 52 },
          { title: 'الدرس الثاني: الأردنّ في العصرين الأموي والعباسي', start: 53, end: 61 },
          { title: 'الدرس الثالث: الأردنّ خلال حملات الفرنجة', start: 62, end: 67 }
        ]
      }
    ]
  },
  // English Curriculum (مشترك / English Language)
  {
    grade: 12,
    semester: 1,
    subject: 'English (Action Pack 12 - مشترك)',
    slug: 'b_english_12',
    page_offset: 0,
    isShared: true,
    specialization: 'all',
    language: 'en',
    units: [
      {
        title: 'Module 1: Information Technology in Jordan',
        start: 6,
        end: 30,
        lessons: [
          { title: 'Unit 1: The King Hussein Business Park & Startups', start: 6, end: 14 },
          { title: 'Unit 2: Artificial Intelligence and Green Tech', start: 15, end: 22 },
          { title: 'Unit 3: Grammar in Context: Passive Voice & Modals', start: 23, end: 30 }
        ]
      },
      {
        title: 'Module 2: A Healthy Life & Medical Innovations',
        start: 31,
        end: 55,
        lessons: [
          { title: 'Unit 4: The King Hussein Cancer Center (KHCC)', start: 32, end: 42 },
          { title: 'Unit 5: Health and Wellness Strategies', start: 43, end: 55 }
        ]
      }
    ]
  },
  // Shared Digital Skills for Grade 10 (المهارات الرقمية المشترك)
  {
    grade: 10,
    semester: 1,
    subject: 'المهارات الرقمية (مشترك لجميع التخصصات)',
    slug: 'b_digital_skills_10',
    page_offset: 0,
    isShared: true,
    specialization: 'all',
    language: 'ar',
    units: [
      {
        title: 'الوحدة الأولى: الأمن السيبراني وحماية البيانات الرقمية',
        start: 5,
        end: 35,
        lessons: [
          { title: 'الدرس الأول: مفاهيم الأمن السيبراني والتهديدات الشائعة', start: 6, end: 18 },
          { title: 'الدرس الثاني: التشفير وحماية الخصوصية الرقمية', start: 19, end: 35 }
        ]
      },
      {
        title: 'الوحدة الثانية: تحليل البيانات والنمذجة السحابية',
        start: 36,
        end: 70,
        lessons: [
          { title: 'الدرس الأول: جمع البيانات وتنظيمها في جداول إلكترونية', start: 38, end: 52 },
          { title: 'الدرس الثاني: الرسوم البيانية وصنع القرار الرقمي', start: 53, end: 70 }
        ]
      }
    ]
  },
  // Grade 10 Engineering (هندسي) Specific
  {
    grade: 10,
    semester: 1,
    subject: 'الرسم والتصميم الهندسي (تخصص هندسي)',
    slug: 'b_eng_draw_10',
    page_offset: 0,
    isShared: false,
    specialization: 'هندسي (BTEC)',
    language: 'ar',
    units: [
      {
        title: 'الوحدة الأولى: أساسيات الإسقاط والمساقط الهندسية',
        start: 6,
        end: 40,
        lessons: [
          { title: 'الدرس الأول: أدوات الرسم الهندسي والرموز المعيارية', start: 8, end: 20 },
          { title: 'الدرس الثاني: رسم المساقط الثلاثة للأجسام المجسمة', start: 21, end: 40 }
        ]
      }
    ]
  },
  // Grade 11 Agricultural (زراعي) Specific
  {
    grade: 11,
    semester: 1,
    subject: 'الإنتاج النباتي والوقاية الزراعية (تخصص زراعي)',
    slug: 'b_plant_prod_11',
    page_offset: 0,
    isShared: false,
    specialization: 'زراعي',
    language: 'ar',
    units: [
      {
        title: 'الوحدة الأولى: نظم الزراعة الحديثة والبيوت المحمية',
        start: 6,
        end: 45,
        lessons: [
          { title: 'الدرس الأول: إنشاء وإدارة البيوت البلاستيكية والزجاجية في الأردن', start: 8, end: 24 },
          { title: 'الدرس الثاني: تقنيات الري بالتنقيط وإدارة التسميد', start: 25, end: 45 }
        ]
      }
    ]
  },
  // Grade 12 Scientific (علمي) Specific
  {
    grade: 12,
    semester: 1,
    subject: 'الفيزياء المتقدمة (الفرع العلمي)',
    slug: 'b_physics_12_sci',
    page_offset: 0,
    isShared: false,
    specialization: 'علمي',
    language: 'ar',
    units: [
      {
        title: 'الوحدة الأولى: الزخم الخطي والتصادمات',
        start: 6,
        end: 45,
        lessons: [
          { title: 'الدرس الأول: الزخم الخطي والدفع', start: 8, end: 22 },
          { title: 'الدرس الثاني: حفظ الزخم والتصادمات المرنة وغير المرنة', start: 23, end: 45 }
        ]
      }
    ]
  },
  // Grade 12 Literary (أدبي) Specific
  {
    grade: 12,
    semester: 1,
    subject: 'الجغرافيا ودراسات التنمية (الفرع الأدبي)',
    slug: 'b_geo_12_lit',
    page_offset: 0,
    isShared: false,
    specialization: 'أدبي',
    language: 'ar',
    units: [
      {
        title: 'الوحدة الأولى: الجغرافيا السكانية والتخطيط الإقليمي',
        start: 6,
        end: 40,
        lessons: [
          { title: 'الدرس الأول: النمو السكاني والتحضر في الأردن', start: 8, end: 22 },
          { title: 'الدرس الثاني: التنمية المستدامة واستغلال الموارد الوطنية', start: 23, end: 40 }
        ]
      }
    ]
  }
];
