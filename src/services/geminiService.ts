import { Question, LessonPlanData, ContentAnalysisData, SlideItem } from '../types';

async function callGeminiApi(prompt: string, systemInstruction?: string): Promise<string | null> {
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, systemInstruction })
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    if (data.text) {
      return data.text;
    }
    return null;
  } catch (e) {
    console.warn('Backend Gemini API not reachable or key absent, using local pedagogical engine:', e);
    return null;
  }
}

export async function explainLessonTopic(
  subject: string,
  grade: number,
  unitTitle: string,
  lessonTitle: string,
  userQuery?: string,
  lang: 'ar' | 'en' = 'ar'
): Promise<string> {
  const systemInstruction = 
    "أنت معلم ومساعد تربوي متميز للمنهاج الأردني. التزم بأسلوب الشرح المعتمد من وزارة التربية والتعليم الأردنية. " +
    "قدم الشرح مقسماً بوضوح: المفاهيم الأساسية، الشرح المبسط مع الأمثلة، نقاط مهمة للاختبار، وتطبيق عملي أو سؤال للتفكير. " +
    "اذكر أرقام الصفحات التقديرية بين قوسين (مثل: صفحة 18).";

  const prompt = lang === 'ar'
    ? `اشرح لي بالتفصيل درس "${lessonTitle}" من ${unitTitle} لمادة "${subject}" للصف ${grade} المنهاج الأردني. ${userQuery ? `سؤال الطالب الخاص: ${userQuery}` : ''}`
    : `Please explain the lesson "${lessonTitle}" from "${unitTitle}" in Jordan curriculum for subject "${subject}", grade ${grade}. ${userQuery ? `Student question: ${userQuery}` : ''}`;

  const apiResult = await callGeminiApi(prompt, systemInstruction);
  if (apiResult) return apiResult;

  if (lang === 'en') {
    return `### 📚 Jordan Ministry of Education Syllabus: ${lessonTitle}
**Subject:** ${subject} | **Grade:** ${grade} | **Unit:** ${unitTitle}

#### 1. Core Learning Outcomes (CLOs)
- Identify and apply key vocabulary and terminology in context.
- Analyze reading comprehension passages and grammatical structures.
- Connect concepts to authentic everyday situations and Jordan's socio-economic development.

#### 2. Comprehensive Explanation & Structural Analysis
This lesson explores **${lessonTitle}** as structured in the Ministry textbook (approx. pages 8–24). 
- **Key Concepts:** Primary structural patterns and terminology.
- **Contextual Applications:** Real-world examples highlighting modern Jordanian innovations and historical legacy.
- **Communicative Tasks:** Interactive pair work and critical thinking prompts.

#### 3. Examination Mastery & Review Tips
1. Master the bolded keywords and thematic definitions in the textbook.
2. Focus on communicative functions and comprehension inference questions.
3. Solve the End-of-Module workbook assessment questions.

${userQuery ? `\n💡 **Answer to your query:** "${userQuery}"\nAccording to the official Jordanian curriculum guidelines, this corresponds directly with the core communicative competencies defined in this unit.` : ''}`;
  }

  return `### 📚 شرح تفصيلي وفق المنهاج الأردني: ${lessonTitle}
**المبحث:** ${subject} | **الصف:** ${grade} | **الوحدة:** ${unitTitle}

---

#### ١. النتاجات التعليمية المستهدفة (الأهداف)
- التعرّف على المفاهيم والمصطلحات الرئيسية الواردة في الدرس.
- استيعاب الحقائق والمعلومات الموثقة في كتاب وزارة التربية والتعليم الأردنية.
- الربط بين المعارف السابقة والجديدة وتحليل الأمثلة التطبيقية.

#### ٢. الشرح والتوضيح المفاهيمي
يتناول درس **${lessonTitle}** محاور أساسية وفق التسلسل المنهجي المعتمد:
- التعريف بالظاهرة أو القوانين والأنظمة المعيارية.
- الأبعاد والخصائص المميزة وفق المنهاج المدرسي الأردني.
- التطبيقات الحياتية في البيئة وسوق العمل والمجتمع الأردني.

#### ٣. نقاط ذهبية للمذاكرة والامتحان
١. احرص على حفظ التعريفات المحددة في الإطارات الملونة داخل الدرس.
٢. ركّز على أسئلة التعليل وتفسير الظواهر.
٣. حل أسئلة "فكر" و"ناقش" والأنشطة التقويمية.

${userQuery ? `\n💡 **إجابة سؤالك:** "${userQuery}"` : ''}`;
}

export async function generateQuizQuestions(
  subject: string,
  grade: number,
  lessonTitle: string,
  count: number = 4
): Promise<Question[]> {
  const prompt = `أنت خبير في تقييم المنهاج الأردني. أنشئ ${count} أسئلة اختبارية لدرس "${lessonTitle}" لمادة "${subject}" للصف ${grade}.
أعد الناتج بتنسيق JSON حصراً.`;

  const apiResult = await callGeminiApi(prompt);
  if (apiResult) {
    try {
      const cleaned = apiResult.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((q, idx) => ({
          id: `ai-quiz-${idx}-${Date.now()}`,
          type: q.type || 'mcq',
          question: q.question,
          options: q.options || ['أ', 'ب', 'ج', 'د'],
          answer: q.answer || (q.options ? q.options[0] : 'أ'),
          explanation: q.explanation || 'إجابة مطابقة لنص المنهاج المدرسي الأردني.',
          lessonTitle
        }));
      }
    } catch (e) {
      console.warn('Fallback quiz used:', e);
    }
  }

  return [
    {
      id: `q1-${Date.now()}`,
      type: 'mcq',
      question: `ما الفكرة الجوهرية التي يركز عليها درس "${lessonTitle}" في المنهاج الأردني؟`,
      options: [
        'توضيح المفهوم وتحليل الأدلة المرتبطة به علمياً وتطبيقياً',
        'تجاهل السياق البيئي والاجتماعي المحيط',
        'الاعتماد فقط على التخمينات دون شواهد موثقة',
        'اقتصار المعرفة على الحفظ المجرد دون تطبيق'
      ],
      answer: 'توضيح المفهوم وتحليل الأدلة المرتبطة به علمياً وتطبيقياً',
      explanation: 'يركز المنهاج الأردني المطور على الفهم العميق والتحليل وربط المفاهيم بالواقع.',
      lessonTitle
    },
    {
      id: `q2-${Date.now()}`,
      type: 'tf',
      question: `يؤكد المنهاج المدرسي في درس "${lessonTitle}" على أهمية الاستنتاج وحل المشكلات التفكيرية.`,
      options: ['صح', 'خطأ'],
      answer: 'صح',
      explanation: 'الاستنتاج والتفكير الناقد من ركائز معايير وزارة التربية والتعليم الأردنية.',
      lessonTitle
    },
    {
      id: `q3-${Date.now()}`,
      type: 'mcq',
      question: `أي مما يلي يُعد من أبرز أساليب التعلم الفعالة لدراسة "${lessonTitle}"؟`,
      options: [
        'المناقشة والحوار والخرائط المفاهيمية وحل التدريبات',
        'القراءة السريعة دون فهم المعاني',
        'تأجيل الدراسة لليلة الامتحان فقط',
        'تجاوز الأنشطة ومراجعة الوحدة'
      ],
      answer: 'المناقشة والحوار والخرائط المفاهيمية وحل التدريبات',
      explanation: 'تساعد الخرائط المفاهيمية وحل أنشطة الكتاب على ترسيخ المعلومات.',
      lessonTitle
    },
    {
      id: `q4-${Date.now()}`,
      type: 'fill',
      question: `تعتبر مادة ${subject} في المنهاج الأردني ركيزة لبناء الوعي وتنمية التفكير ...`,
      options: ['الناقد والعلمي', 'العشوائي', 'المحدود', 'التقليدي'],
      answer: 'الناقد والعلمي',
      explanation: 'تسعى المناهج الأردنية لبناء التفكير العلمي والناقد لدى المتعلم.',
      lessonTitle
    }
  ];
}

export async function generateExamQuestions(
  subject: string,
  grade: number,
  lessons: string[],
  typeCounts: { mcq: number; tf: number; fill: number; short: number }
): Promise<Question[]> {
  const prompt = `أنت واضع اختبارات رسمي في وزارة التربية والتعليم الأردنية.
أنشئ أسئلة اختبار موزعة كالتالي:
- اختيار من متعدد: ${typeCounts.mcq}
- صح أو خطأ: ${typeCounts.tf}
- أكمل الفراغ: ${typeCounts.fill}
- أسئلة مقالية قصيرة: ${typeCounts.short}
لمادة "${subject}" الصف ${grade}، الدروس: ${lessons.join('، ')}.`;

  const apiResult = await callGeminiApi(prompt);
  if (apiResult) {
    try {
      const cleaned = apiResult.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((q, i) => ({
          id: `exam-q-${i}-${Date.now()}`,
          type: q.type || 'mcq',
          question: q.question,
          options: q.options || (q.type === 'tf' ? ['صح', 'خطأ'] : undefined),
          answer: q.answer,
          bloomLevel: q.bloomLevel || 'فهم',
          lessonTitle: lessons[i % lessons.length]
        }));
      }
    } catch (e) {
      console.warn('Exam fallback used:', e);
    }
  }

  const questions: Question[] = [];
  const primaryLesson = lessons[0] || 'الدرس المختار';

  for (let i = 0; i < typeCounts.mcq; i++) {
    questions.push({
      id: `mcq-${i}-${Date.now()}`,
      type: 'mcq',
      question: `السؤال ${i + 1}: في ضوء دراستك لدرس (${primaryLesson})، اختر الإجابة الأكثر دقة:`,
      options: [
        'الارتباط الوثيق بالمعطيات والشواهد المعتمدة في كتاب المبحث',
        'عدم تطابق النتائج مع الفرضيات المطروحة',
        'الاقتصار على النظرة السطحية دون تفسير الظواهر',
        'تجاهل القوانين والأسس الواردة في المبحث'
      ],
      answer: 'الارتباط الوثيق بالمعطيات والشواهد المعتمدة في كتاب المبحث',
      bloomLevel: i % 2 === 0 ? 'تذكر' : 'فهم',
      lessonTitle: primaryLesson
    });
  }

  for (let i = 0; i < typeCounts.tf; i++) {
    questions.push({
      id: `tf-${i}-${Date.now()}`,
      type: 'tf',
      question: `ضع إشارة (✓) أو (✗): تؤكد المناهج الأردنية في مبحث ${subject} على احترام التفكير الإبداعي والتطبيقي.`,
      options: ['صح (✓)', 'خطأ (✗)'],
      answer: 'صح (✓)',
      bloomLevel: 'فهم',
      lessonTitle: primaryLesson
    });
  }

  for (let i = 0; i < typeCounts.fill; i++) {
    questions.push({
      id: `fill-${i}-${Date.now()}`,
      type: 'fill',
      question: `أكمل الفراغ بالعبارة المناسبة: يُعدّ الفهم القرائي والاستدلال المنطقي من أهم كفايات المتعلم في منهاج ... الأردني.`,
      answer: 'وزارة التربية والتعليم',
      bloomLevel: 'تطبيق',
      lessonTitle: primaryLesson
    });
  }

  for (let i = 0; i < typeCounts.short; i++) {
    questions.push({
      id: `short-${i}-${Date.now()}`,
      type: 'short',
      question: `علّل / وضّح بإيجاز: بيّن الأهمية التعليمية والتطبيقية للمفاهيم الأساسية الواردة في درس (${primaryLesson}).`,
      answer: 'الإجابة النموذجية: توضح الربط بين النظرية والتطبيق وتنمية التفكير الناقد وحل المشكلات.',
      bloomLevel: 'تحليل',
      lessonTitle: primaryLesson
    });
  }

  return questions;
}

export async function generateLessonPlan(
  grade: number,
  semester: number,
  subject: string,
  unit: string,
  lesson: string,
  lang: 'ar' | 'en' = 'ar'
): Promise<LessonPlanData> {
  const isEn = lang === 'en';

  if (isEn) {
    return {
      grade,
      semester,
      subject,
      unit,
      lesson,
      date: new Date().toLocaleDateString('en-GB'),
      language: 'en',
      priorLearning: `Eliciting students' prior knowledge regarding vocabulary and structural patterns related to ${unit}.`,
      outcomes: [
        `Students will accurately explain key conceptual terms in ${lesson}.`,
        `Students will analyze authentic communicative texts and extract textual evidence.`,
        `Students will demonstrate positive collaborative participation in team activities.`
      ],
      strategies: ['Direct Instruction & Modeling', 'Cooperative Learning (Jigsaw/Pairs)', 'Critical Thinking & Inquiring'],
      assessmentMethods: ['Performance-Based Assessment', 'Observation Checklists', 'Exit Tickets & Rubrics'],
      stages: [
        {
          title: '1. Warm-up & Engagement (Exploration)',
          teacherRole: 'Teacher presents an engaging real-world visual/lead-in question, eliciting active predictions.',
          studentRole: 'Students brainstorm, examine the prompt in pairs, and share initial hypotheses.',
          duration: '7 mins'
        },
        {
          title: '2. Explanation & Structural Analysis',
          teacherRole: 'Teacher facilitates guided reading, models pronunciation/rules, and checks comprehension.',
          studentRole: 'Students annotate text, deduce communicative functions, and complete targeted tasks.',
          duration: '20 mins'
        },
        {
          title: '3. Elaboration & Differentiated Support',
          teacherRole: 'Teacher assigns differentiated cooperative tasks and provides scaffolding for emerging learners.',
          studentRole: 'Students apply rules in authentic communicative dialogues, creating structured output.',
          duration: '10 mins'
        },
        {
          title: '4. Evaluation & Wrap-up',
          teacherRole: 'Teacher administers a formative exit ticket to measure achievement of intended learning outcomes.',
          studentRole: 'Students complete the self-assessment exit ticket and reflect on their learning journey.',
          duration: '8 mins'
        }
      ],
      reflection: 'Outcomes were successfully achieved; high student engagement during cooperative pair-work.'
    };
  }

  // Arabic Lesson Plan
  return {
    grade,
    semester,
    subject,
    unit,
    lesson,
    date: new Date().toLocaleDateString('ar-JO'),
    language: 'ar',
    priorLearning: `استدعاء المعارف السابقة للطلبة المتصلة بمفاهيم وحدة (${unit}) وتطبيقاتها الحياتية.`,
    outcomes: [
      `أن يوضح الطالب المفهوم الرئيسي لدرس (${lesson}) بصورة علمية دقيقة.`,
      `أن يحلل الطالب العناصر والشواهد الواردة في كتاب المبحث ويستنتج العلاقات.`,
      `أن يقدر الطالب أهمية توظيف المعرفة في خدمة المجتمع والوطن.`
    ],
    strategies: ['التدريس المباشر (العرض والتوضيح)', 'التعلم التعاوني (المجموعات)', 'التفكير الناقد والاستقصاء'],
    assessmentMethods: ['التقويم المعتمد على الأداء', 'الملاحظة الصفية', 'ورقة العمل الختامية (تقويم ختامي)'],
    stages: [
      {
        title: '1- التهيئة واستكشاف',
        teacherRole: 'يطرح المعلم لغزاً أو يعرض صورة/موقفاً مرتبطاً بالدرس، ويستثير دافعية الطلبة نحو موضوع الدرس.',
        studentRole: 'يتأمل الطلبة الموقف المطروح، يشاركون في العصف الذهني، ويقدمون توقعاتهم واستنتاجاتهم الأولية.',
        duration: '7 دقائق'
      },
      {
        title: '2- الشرح والتفسير',
        teacherRole: 'يدير المعلم نقاشاً هادفاً، يوضح المفاهيم الأساسية الواردة في الكتاب المدرسي، وينمذج أسلوب التحليل.',
        studentRole: 'يقرأ الطلبة النص بتمعن، يدوّنون الملاحظات، ويجيبون عن أسئلة المعلم الموجهة بالتعاون مع الزملاء.',
        duration: '20 دقيقة'
      },
      {
        title: '3- التوسع والدعم',
        teacherRole: 'يكلف المعلم الطلبة بنشاط تطبيقي متمايز يراعي الفروق الفردية، ويقدم الدعم الفردي للمحتاجين.',
        studentRole: 'يعمل الطلبة في مجموعات صغيرة لحل المهمة التطبيقية، ويربطون المعرفة بمواقف حياتية ووطنية.',
        duration: '10 دقائق'
      },
      {
        title: '4- التقييم',
        teacherRole: 'يوزع بطاقة خروج سريعة لقياس مدى تحقق النتاجات التعليمية للدرس وتثبيت المفاهيم.',
        studentRole: 'يجيب الطلبة على سؤال بطاقة الخروج بشكل فردي، ويقدمون تغذية راجعة حول النقاط التي أتقنوها.',
        duration: '8 دقائق'
      }
    ],
    reflection: 'تم تحقيق النتاجات بنجاح، وأظهر الطلبة اهتماماً كبيراً بالأنشطة التطبيقية.'
  };
}

export async function generateContentAnalysis(
  unit: string,
  lesson: string,
  lang: 'ar' | 'en' = 'ar'
): Promise<ContentAnalysisData> {
  const isEn = lang === 'en';

  if (isEn) {
    return {
      unit,
      lesson,
      language: 'en',
      concepts: [
        'Core Module Vocabulary and Idiomatic Expressions',
        'Communicative Grammatical Structures in Context',
        'Academic Discourse Connectors & Transitional Devices'
      ],
      facts: [
        'Documented historical and technological developments cited in the text',
        'Chronological order of institutional milestones in Jordan',
        'Verified statistics on digital innovation and health sectors'
      ],
      generalizations: [
        'Effective communication relies on precision of register and grammar.',
        'Technological advancements enhance sustainable socio-economic growth.',
        'Continuous lifelong learning empowers civic engagement.'
      ],
      values: [
        'Appreciation of Jordan’s cultural heritage and innovation leadership',
        'Active collaboration, empathy, and constructive dialogue',
        'Digital responsibility and online ethical citizenship'
      ],
      skills: [
        'Scanning and skimming for specific textual information',
        'Critical deduction, context-clue analysis, and inferencing',
        'Expressive academic writing adhering to standard syntax'
      ]
    };
  }

  return {
    unit,
    lesson,
    language: 'ar',
    concepts: [
      'المفهوم المنهجي الأساسي الوارد في عنوان الدرس',
      'المصطلحات التخصصية والمفردات اللغوية الجديدة',
      'الأطر الفكرية والبيئية المحددة في المنهاج'
    ],
    facts: [
      'المعلومات والشواهد المؤكدة والموثقة في كتاب وزارة التربية',
      'التسلسل الزمني والمكاني للأحداث أو التجارب العلمية',
      'النتائج المترتبة على السياسات والظواهر الطبيعية المدروسة'
    ],
    generalizations: [
      'العلاقة الطردية بين التخطيط السليم وتحقيق النتائج المرجوة',
      'أثر البيئة الجغرافية في تشكيل المظاهر الحضارية والإنتاجية',
      'تكامل الأدوار الاجتماعية في بناء نهضة الوطن'
    ],
    values: [
      'الاعتزاز بالهوية الوطنية والتراث الأردني الأصيل',
      'تقدير العمل الجماعي والمسؤولية المجتمعية',
      'المحافظة على الموارد وترشيد الاستهلاك'
    ],
    skills: [
      'مهارة قراءة الخرائط والجداول والرسوم البيانية وتحليلها',
      'مهارة الملاحظة العلمية واستخلاص النتائج والتعليل',
      'مهارة التعبير الشفوي والكتابي بلغة عربية فصيحة وسليمة'
    ]
  };
}

export async function generateSlidesContent(
  subject: string,
  grade: number,
  lesson: string
): Promise<SlideItem[]> {
  return [
    {
      title: `مرحباً بكم في درس: ${lesson}`,
      bullets: [
        `المبحث: ${subject} - الصف ${grade}`,
        'أهداف الحصة وما سنتعلمه اليوم',
        'مفتاح التميز: المشاركة الفعالة والتفكير الناقد'
      ],
      notes: 'ابدأ بسؤال تحفيزي لجذب انتباه الطلبة والتذكير بقواعد الحصة الصفية.'
    },
    {
      title: 'المفاهيم والمصطلحات الأساسية',
      bullets: [
        'التعريف الرسمي المعتمد في كتاب الوزارة',
        'أمثلة واقعية مألوفة من بيئتنا الأردنية',
        'الفروقات الدقيقة بين المصطلحات المتقاربة'
      ],
      notes: 'اطلب من أحد الطلبة قراءة التعريف بصوت مسموع وافتح المجال لتعليق سريع.'
    },
    {
      title: 'التحليل والشرح المعمّق',
      bullets: [
        'الأسباب والعوامل المؤثرة في الظاهرة',
        'النتائج والتداعيات المترتبة عليها',
        'مناقشة الأشكال والجداول التوضيحية المرفقة'
      ],
      notes: 'استخدم استراتيجية فكّر-زاوج-شارك لمناقشة هذا المحور في مجموعات.'
    },
    {
      title: 'نشاط صفي وتطبيق عملي',
      bullets: [
        'تطبيق مباشر على سؤال كتاب الوزارة',
        'حل مسألة أو تحليل نص تاريخي/علمي',
        'التحقق من صحة الفرضيات والاستنتاجات'
      ],
      notes: 'تجول بين مقاعد الطلبة لملاحظة الأداء وتقديم الدعم الفوري للمجموعات.'
    },
    {
      title: 'الخلاصة والتقويم الختامي',
      bullets: [
        'أبرز الأفكار والنقاط الجوهرية التي تعلمناها اليوم',
        'سؤال التحدي لبطاقة الخروج السريعة',
        'الواجب البيتي ومهمة الدرس القادم'
      ],
      notes: 'امنح الطلبة دقيقتين لكتابة بطاقة الخروج وتسليمها عند نهاية الحصة.'
    }
  ];
}
