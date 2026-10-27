import type { IconName } from '@/ui/icons';

export interface Profile {
  name: string;
  fullName: string;
  role: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  /** Google Drive share link to the resume PDF. */
  resumeUrl?: string;
  summary: string;
  about: string[];
}

// Facts here come from the resume. Keep the two in step.
export const profile: Profile = {
  name: 'Sujay S N',
  fullName: 'Sujay Sanakka Nagarajappa',
  role: 'Full-stack software engineer',
  location: 'Boston, MA',
  email: 'sn.s@northeastern.edu',
  github: 'https://github.com/sujay-sn',
  linkedin: 'https://linkedin.com/in/sujay-s-n',
  // TODO(sujay): placeholder. Replace with the Google Drive share link
  // ("Anyone with the link", Viewer) before launch.
  resumeUrl: 'https://drive.google.com/file/d/RESUME_FILE_ID/view',
  summary:
    "Master's student in Computer Software Engineering at Northeastern University, graduating December 2026. Nearly three years at Accenture building healthcare platforms, and most recently distributed pipelines and LLM automation at GeodeChain.",
  about: [
    "I'm finishing a Master's in Computer Software Engineering at Northeastern University and graduate in December 2026.",
    'At Accenture I spent nearly three years on healthcare platforms: reusable React components across 15+ production sites, a rebuilt real-time search handling 2,000+ searches a day, and accessibility work that raised scores by 35%.',
    'Most recently, at GeodeChain, I built a distributed BullMQ pipeline that cut a full data refresh from 4 hours to 40 minutes, plus Playwright and Gemini automation that replaced 8 hours a week of manual data entry.',
    'I also taught as a TA for web development at Northeastern, mentoring 60+ students through HTML, CSS, JavaScript, and responsive design.',
  ],
};

/** The single list of page sections. Navigation and section ids both come from here. */
export const SECTIONS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'about', label: 'About', icon: 'person' },
  { id: 'skills', label: 'Skills', icon: 'hub' },
  { id: 'experience', label: 'Experience', icon: 'work' },
  { id: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'education', label: 'Education', icon: 'school' },
  { id: 'contact', label: 'Contact', icon: 'mail' },
] as const satisfies ReadonlyArray<{ id: string; label: string; icon: IconName }>;

export type SectionId = (typeof SECTIONS)[number]['id'];

export function sectionLabel(id: SectionId): string {
  return SECTIONS.find((section) => section.id === id)?.label ?? id;
}

export interface Role {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  type: string;
  summary: string;
  highlights: string[];
  technologies: string[];
  /** Skill ids from skills.ts. Constellation edges are derived from these. */
  skills: string[];
}

export const experience: Role[] = [
  {
    id: 'geodechain',
    title: 'Software Engineer Intern',
    company: 'GeodeChain',
    location: 'Remote (Clearwater, FL)',
    period: 'Jan 2026 to Apr 2026',
    type: 'Internship',
    summary: 'Distributed data pipelines, LLM-driven automation, and payments.',
    highlights: [
      'Proposed and delivered a distributed 5-stage BullMQ pipeline that cut a full data refresh over 500+ dApp records from 4 hours to 40 minutes, replacing manual Make.com workflows with concurrent TypeScript/Node.js workers and per-stage retry on failure',
      'Eliminated 8 hours of weekly manual data entry by integrating a Playwright scraping system with a Gemini 2.5 Flash generation stage for automated discovery, enrichment, and content drafting',
      'Delivered a Pay-to-Boost payments feature with zero double-charge defects by implementing Stripe webhooks and PaymentIntents across 6 REST endpoints, atomic PostgreSQL transaction logic, and React checkout components on Stripe Elements',
      'Instrumented 5 concurrent worker stages with real-time observability by building an auth-protected Express.js admin API with pipeline control endpoints, BullBoard queue monitoring, and graceful shutdown that drains in-flight jobs',
    ],
    technologies: ['TypeScript', 'Node.js', 'BullMQ', 'Playwright', 'Gemini 2.5 Flash', 'Stripe', 'PostgreSQL', 'React', 'Express.js', 'BullBoard'],
    skills: ['typescript', 'nodejs', 'express', 'bullmq', 'restapi', 'postgresql', 'react', 'playwright', 'gemini', 'llm-automation', 'makecom', 'distributed-systems'],
  },
  {
    id: 'northeastern-ta',
    title: 'Teaching Assistant, Web Development',
    company: 'Northeastern University',
    location: 'Boston, MA',
    period: 'Sept 2025 to Dec 2025',
    type: 'Teaching',
    summary: 'Mentored 60+ students through full-stack web development and authored 6 written module guides.',
    highlights: [
      'Ran weekly office hours on HTML, CSS, JavaScript, and responsive design',
      'Resolved 200+ student debugging requests across DOM manipulation, async JavaScript, and CSS layout by reproducing failures in isolated test cases and working through browser developer tools',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive design', 'Browser DevTools'],
    skills: ['html-css', 'javascript'],
  },
  {
    id: 'accenture',
    title: 'Software Engineer',
    company: 'Accenture',
    location: 'Bengaluru, India',
    period: 'Nov 2021 to Jul 2024',
    type: 'Full-time',
    summary: 'Healthcare platforms across 15+ production sites: reusable React components, real-time search, accessibility, and API modernization.',
    highlights: [
      'Reduced deployment cycles by 50% by delivering 8 healthcare platform modules with reusable React components, REST API integrations, and automated testing pipelines across 15+ production sites',
      'Decreased search query response time by 40% and raised accuracy 5% by rebuilding real-time site search with AJAX and custom JavaScript components for 2,000+ daily searches',
      'Raised accessibility scores by 35% across shared theme components by aligning markup with WCAG 2.1 guidelines and authoring technical documentation on component structure and ARIA practices',
      'Accelerated response time from 800ms to 480ms by modernizing a legacy Java application into a MERN stack API management tool with JWT authentication',
    ],
    technologies: ['React', 'JavaScript', 'REST APIs', 'AJAX', 'WCAG 2.1', 'Java', 'MongoDB', 'Express.js', 'Node.js', 'JWT'],
    skills: ['react', 'javascript', 'restapi', 'wcag', 'java', 'mongodb', 'express', 'nodejs', 'jwt', 'wordpress'],
  },
];

export interface Degree {
  id: string;
  degree: string;
  school: string;
  location: string;
  period: string;
  gpa: string;
  summary?: string;
  coursework: string[];
}

export const education: Degree[] = [
  {
    id: 'northeastern',
    degree: 'Master of Science, Computer Software Engineering',
    school: 'Northeastern University',
    location: 'Boston, MA',
    period: 'Sept 2024 to Dec 2026',
    gpa: '3.72 / 4.0',
    coursework: [
      'Program Structure and Algorithms',
      'Object-Oriented Design',
      'Software Design Patterns',
      'Software Engineering',
      'Advanced Big-Data Applications and Indexing',
      'Applied Generative AI Models',
      'Database Design',
      'Web Design and UX Engineering',
    ],
  },
  {
    id: 'biet',
    degree: 'Bachelor of Engineering, Information Science and Engineering',
    school: 'Bapuji Institute of Engineering and Technology',
    location: 'Davanagere, India',
    period: 'Sept 2017 to Jul 2021',
    gpa: '3.5 / 4.0',
    coursework: ['Computer Organization', 'Computer Networks', 'Operating Systems', 'Data Structures and Algorithms'],
  },
];