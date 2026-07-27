/* ============================================================
   Micah Guevarra Portfolio — Site data
   ------------------------------------------------------------
   Edit any value below to update content on the page.
   Structure: keys are simple, easy to find.
   ============================================================ */

const SITE_DATA = {
  /* ---------- Profile / Hero ---------- */
  profile: {
    badge: 'Virtual Assistant & ESL Teacher',
    greeting: 'Hi, I’m',
    name: 'Micah',
    role: 'LPT | Customer Service Professional',
    tagline: 'Helping businesses thrive with organized, efficient, and friendly support. Let’s make your workload lighter.',
    portrait: {
      src: 'assets/images/micah image.jpg',
      alt: 'Micah Guevarra',
    },
    portraitBadge: {
      title: 'LPT',
      subtitle: 'Licensed Professional Teacher',
    },
  },

  /* ---------- Nav links (order shown in navbar) ---------- */
  navLinks: [
    { id: 'about',       label: 'About' },
    { id: 'services',    label: 'Services' },
    { id: 'experience',  label: 'Experience' },
    { id: 'skills',      label: 'Skills' },
    { id: 'testimonials',label: 'Testimonials' },
    { id: 'projects',    label: 'Projects' },
    { id: 'contact',     label: 'Contact' },
  ],
  resume: {
    href: 'assets/MBG_RESUME.pdf',
    label: 'Resume',
    mobileLabel: 'Download Resume',
  },

  /* ---------- About section ---------- */
  about: {
    title: 'About Me',
    subtitle: 'Get to know the person behind the services',
    image: { src: 'assets/images/micah image 2.jpg', alt: 'About Micah' },
    heading: 'Dedicated Professional Ready to Help You Succeed',
    paragraphs: [
      'Hello! I’m <strong class="font-semibold text-accent">Micah Guevarra, LPT</strong> — a Licensed Professional Teacher with a diverse background in customer service, virtual assistance, and English language instruction.',
      'With hands-on experience in healthcare account handling, pension administration, and ESL teaching, I bring organizational skills, communication expertise, and a genuine passion for helping others succeed.',
      'I hold a <strong class="font-semibold">Bachelor of Secondary Education (Major in English)</strong> and passed the Licensure Examination for Professional Teachers (LEPT) in September 2023 with an <strong class="font-semibold text-accent">86.40% score</strong>.',
    ],
    stats: [
      { value: '2+',     label: 'Years Experience' },
      { value: '95-98%', label: 'QA Score' },
      { value: 'LPT',    label: 'Board Passer' },
    ],
  },

  /* ---------- Services ---------- */
  services: {
    title: 'My Services',
    subtitle: 'What I can do to help your business grow',
    items: [
      {
        icon: '💼', // briefcase
        title: 'Virtual Assistant',
        description: 'Reliable administrative support to help you stay organized.',
        bullets: [
          'Email & Calendar Management',
          'Data Entry & Research',
          'Document Preparation',
          'Scheduling & Coordination',
        ],
      },
      {
        icon: '🏥', // hospital
        title: 'Customer Service',
        description: 'Exceptional support with high QA scores and HIPAA compliance.',
        bullets: [
          'Inbound/Outbound Calls',
          'Billing & Payments',
          'Policy Information',
          'Conflict Resolution',
        ],
      },
      {
        icon: '📚', // books
        title: 'ESL Teaching',
        description: 'Student-centered English lessons for all levels.',
        bullets: [
          'CEFR-Aligned Lessons',
          'Conversation Practice',
          'Business English',
          'Young Learners & Adults',
        ],
      },
    ],
  },

  /* ---------- Work experience (most recent first) ---------- */
  experience: {
    title: 'Work Experience',
    subtitle: 'My professional journey',
    items: [
      {
        dateRange: 'Dec 2025 – Present',
        role: 'Pension Benefit Administrator',
        company: 'Willis Towers Watson (WTW)',
        description: 'Supported pension administration for four North American clients. Processed pension payments and retirement benefit transactions with high accuracy while ensuring SLA compliance.',
      },
      {
        dateRange: 'Nov 2024 – Dec 2025',
        role: 'Process Executive',
        company: 'Cognizant Philippines',
        description: 'Provided customer support for U.S. healthcare account (Medicare & Medicare Supplement). Handled 60-80 inbound calls per shift. Maintained 95-98% QA score with HIPAA compliance.',
      },
      {
        dateRange: 'Feb 2024 – Mar 2026',
        role: 'Part-Time ESL Instructor',
        company: 'Enderun Colleges',
        description: 'Taught English to international students through Summer/Winter Camps. Conducted one-on-one ESL classes. Developed CEFR-aligned lesson plans (A1-B2).',
      },
    ],
  },

  /* ---------- Skills / Tools / Languages ---------- */
  skills: {
    title: 'Skills & Tools',
    subtitle: 'What I bring to the table',
    groups: [
      {
        heading: 'Tools & Software',
        items: [
          'Microsoft Excel', 'Microsoft Word', 'PowerPoint',
          'Google Workspace', 'Outlook', 'Zoom', 'MS Teams',
        ],
      },
      {
        heading: 'Core Competencies',
        items: [
          'Customer Service', 'Client Support', 'Healthcare Accounts',
          'HIPAA Compliance', 'ESL Instruction', 'Administrative Support',
          'Email Management', 'Calendar Management',
        ],
      },
      {
        heading: 'Languages',
        items: [
          'English (Professional)',
          'Filipino/Tagalog (Native)',
        ],
      },
    ],
  },

  /* ---------- Testimonials ---------- */
  testimonials: {
    title: 'What Clients Say',
    subtitle: 'Feedback from people I’ve worked with',
    items: [
      {
        rating: 5,
        quote: '“Micah has been an incredible help to our team. She’s detail-oriented, professional, and always completes tasks ahead of schedule. Her customer service skills are exceptional!”',
        author: 'Anonymous Colleague',
        authorMeta: 'Cognizant Philippines',
      },
      {
        rating: 5,
        quote: '“I love teacher Micah’s teaching style. She’s patient, encouraging, and very knowledgeable. Her CEFR-aligned lessons have significantly improved my English proficiency.”',
        author: 'Her Student',
        authorMeta: 'Enderun Colleges',
      },
    ],
  },

  /* ---------- Projects (videos) ---------- */
  projects: {
    title: 'Projects',
    subtitle: 'A quick look at recent work — To be updated soon.',
    videos: [
      {
        src: 'assets/videos/reel2.mp4',
        title: 'Calendar & Email Triage System',
        description: 'How I keep an executive’s inbox at zero and schedule conflict-free.',
      },
      {
        src: 'assets/videos/reel3.mp4',
        title: 'CEFR-Aligned ESL Lesson: B1 Business English',
        description: 'Sample 8-minute speaking drill built around negotiation vocabulary.',
      },
      {
        src: 'assets/videos/reel4.mp4',
        title: 'Pension Benefit Admin Workflow',
        description: 'WTW pipeline: intake, eligibility check, payment processing, audit trail.',
      },
      {
        src: 'assets/videos/reel5.mp4',
        title: 'Document Automation with Excel + Word',
        description: 'Mail-merge templates and macros that save 6+ hours per week.',
      },
    ],
  },

  /* ---------- Contact ---------- */
  contact: {
    title: 'Get In Touch',
    subtitle: 'Ready to work together? Let’s talk!',
    heading: 'Let’s Connect',
    blurb: 'I’m always open to discussing new projects or opportunities. Feel free to reach out!',
    formspreeEndpoint: 'https://formspree.io/f/xeeyvzkg',
    successMessage: 'Thank you! Your message has been sent successfully.',
    errorMessage: 'Something went wrong. Please email me directly at micahguevarra026@gmail.com.',
    methods: [
      { icon: '📧', label: 'micahguevarra026@gmail.com',  href: 'mailto:micahguevarra026@gmail.com', external: false },
      { icon: '💼', label: 'LinkedIn Profile',              href: 'https://linkedin.com/in/micah-b-guevarra-lpt-19428b265', external: true  },
      { icon: '📱', label: '0991-320-6747',                href: null, external: false },
      { icon: '📍', label: 'Batangas, Philippines',     href: null, external: false },
    ],
  },

  /* ---------- Footer ---------- */
  footer: {
    copyright: '© 2026 Micah Guevarra, LPT. All rights reserved.',
    tagline: 'Helping businesses thrive with organized, efficient, and friendly support.',
  },    
};

// Expose for use by main.js (also useful in DevTools).
if (typeof window !== 'undefined') window.SITE_DATA = SITE_DATA;