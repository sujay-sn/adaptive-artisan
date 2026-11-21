// ============================================================================
// Everything on the site that's about you lives in this file. To add a
// project, change a role, tag a skill, or adjust your routine, edit it here;
// nothing else needs to change.
//
// Checks run on every build (npm run build) and test run (npm test). A typo in
// a field name, a skill id that doesn't exist, two projects with the same id,
// or routine hours out of order stop the build and name the exact problem.
//
// Common edits:
// - New project: copy one in `projects` and give it a unique id. That id goes
//   in the share link (?project=your-id). Tag it with skill ids from `skills`.
// - Home page: mark up to six projects featured: true; they show in list order,
//   each leading with its headline (a short value and a label) if it has one.
// - Cover: put a screenshot in public/ and set media: { poster: '/name.webp' },
//   optionally with video: '/name.mp4' for a short muted loop on hover.
// - Gallery: list images, short clips, and YouTube or Loom demos in gallery: [...]
//   for the project's page. Every image and clip needs alt text describing it.
// - Tagging a skill: add its id to the `skills` list of the roles or projects
//   where you used it. Untagged skills still show, without evidence.
// - New skill: add it to `skills` with a unique id and one of the categories.
// ============================================================================

import type { Degree, PageCopy, Profile, Project, Role, Routine, Skill, SkillCategoryInfo } from '@/content/types';

// ----------------------------------------------------------------------------
// About you
// ----------------------------------------------------------------------------

// Facts here come from the resume. Keep the two in step.
export const profile: Profile = {
  name: 'Sujay S N',
  fullName: 'Sujay Sanakka Nagarajappa',
  role: 'Full-stack software engineer',
  title: 'Software Engineer',
  location: 'Boston, MA',
  email: 'sn.s@northeastern.edu',
  github: 'https://github.com/sujay-sn',
  linkedin: 'https://linkedin.com/in/sujay-s-n',
  // TODO(sujay): placeholder. Replace with the Google Drive share link
  // ("Anyone with the link", Viewer) before launch.
  resumeUrl: 'https://drive.google.com/file/d/RESUME_FILE_ID/view',
  // TODO(sujay): add a portrait to public/ and set photo: '/portrait.webp'.
  summary:
    "Master's student in Computer Software Engineering at Northeastern University, graduating December 2026. Nearly three years at Accenture building healthcare platforms, and most recently distributed pipelines and LLM automation at GeodeChain.",
  about: [
    "I'm finishing a Master's in Computer Software Engineering at Northeastern University and graduate in December 2026.",
    'At Accenture I spent nearly three years on healthcare platforms: reusable React components across 15+ production sites, a rebuilt real-time search handling 2,000+ searches a day, and accessibility work that raised scores by 35%.',
    'Most recently, at GeodeChain, I built a distributed BullMQ pipeline that cut a full data refresh from 4 hours to 40 minutes, plus Playwright and Gemini automation that replaced 8 hours a week of manual data entry.',
    'I also taught as a TA for web development at Northeastern, mentoring 60+ students through HTML, CSS, JavaScript, and responsive design.',
  ],
};

// ----------------------------------------------------------------------------
// Words on the page
// ----------------------------------------------------------------------------

export const copy: PageCopy = {
  pageDescription: 'Sujay S N, full-stack software engineer in Boston. A portfolio built as a working Material 3 Expressive design system.',
  skillsIntro:
    'Everything I work with, in one jar, drawn from the roles and projects on this page. Pick one up and throw it, or tap it to see where I used it.',
  projectsIntro: 'Everything I have built, with the stack, the results, and screenshots where I have them.',
  contactIntro: "I graduate in December 2026 and I'm looking for full-time software engineering roles. Send a message here, or reach me directly.",
  contactThanks: "Thanks for reaching out. I'll reply within a couple of days.",
  footerTagline: 'Built as a working Material 3 Expressive system.',
};

// ----------------------------------------------------------------------------
// Experience, newest first
// ----------------------------------------------------------------------------

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

// ----------------------------------------------------------------------------
// Education, newest first
// ----------------------------------------------------------------------------

export const education: Degree[] = [
  {
    id: 'northeastern',
    degree: 'Master of Science, Computer Software Engineering',
    school: 'Northeastern University',
    location: 'Boston, MA',
    period: 'Sept 2024 to Dec 2026',
    start: '2024-09',
    end: '2026-12',
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
    start: '2017-09',
    end: '2021-07',
    gpa: '3.5 / 4.0',
    coursework: ['Computer Organization', 'Computer Networks', 'Operating Systems', 'Data Structures and Algorithms'],
  },
];

// ----------------------------------------------------------------------------
// Projects, in the order they appear
// ----------------------------------------------------------------------------

// TODO(sujay): add repo and demo URLs (the resume links Burrow's GitHub and
// demo, and the Insurance platform's GitHub).
export const projects: Project[] = [
  {
    id: 'burrow-housing',
    title: 'Burrow Housing',
    summary: 'Sublease marketplace with geospatial search, secure sign-in, and real-time messaging.',
    headline: { value: '85% → 34%', label: 'server load, after moving uploads to S3 presigned URLs' },
    description:
      'A sublease marketplace where tenants list rooms and people looking for short-term housing find them by distance. Search runs on MongoDB geospatial queries with Google Maps, chat and media uploads are built in, and sign-up is verified by email.',
    status: 'completed',
    featured: true,
    year: '2025',
    duration: '4 months',
    team: 'solo project',
    role: 'Full-stack developer and designer',
    technologies: ['React', 'Redux Toolkit', 'Node.js', 'MongoDB', 'Redis', 'AWS S3', 'Google Maps and Places API', 'Stream Chat', 'SendGrid'],
    skills: ['react', 'redux', 'nodejs', 'mongodb', 'redis', 'jwt', 'aws', 'restapi'],
    features: [
      'Radius-filtered geospatial search over active listings',
      'Layered authentication with JWT, Redis sessions, and Google OAuth',
      'Media uploads through AWS S3 presigned URLs',
      'Real-time chat channels between users',
      'Email verification through SendGrid',
    ],
    results: [
      'Built radius-filtered geospatial search over 500+ active listings by pairing MongoDB 2dsphere queries with Google Maps and Places API integration through custom middleware',
      'Reduced authentication failures from 12% to 1.2% by implementing JWT with Redis session control, Google OAuth, and automated SendGrid email verification',
      'Cut server load from 85% to 34% by offloading media uploads to AWS S3 presigned URLs coordinated with MongoDB transactions for atomic listing updates',
    ],
    challenges: [
      'Secure file uploads with S3 presigned URLs',
      'Real-time chat that stays fast as conversations grow',
      'Map-based search that is easy to use',
    ],
  },
  {
    id: 'insurance-data-platform',
    title: 'Insurance Data Orchestration Platform',
    summary: 'Event-driven REST platform with caching, schema validation, and full-text search.',
    headline: { value: '120ms → 35ms', label: 'API response time, with Redis caching and ETags' },
    description:
      'A Node.js REST API for insurance data built around event-driven services. Writes flow through RabbitMQ into Elasticsearch for full-text search, reads are cached in Redis with ETag-based conditional requests, and every payload is checked against JSON Schema.',
    status: 'completed',
    featured: true,
    year: '2025',
    technologies: ['Node.js', 'Redis', 'RabbitMQ', 'Elasticsearch', 'JSON Schema', 'Google OAuth', 'RS256 JWT', 'Docker Compose'],
    skills: ['nodejs', 'restapi', 'redis', 'rabbitmq', 'elasticsearch', 'jwt', 'docker', 'distributed-systems'],
    features: [
      'ETag-based conditional retrieval',
      'JSON Schema validation across 12 resource types',
      'Event-driven services on RabbitMQ',
      'Full-text search with Elasticsearch',
      'Google OAuth with RS256 JWTs',
      'Containerized with Docker Compose',
    ],
    results: [
      'Lowered API response time from 120ms to 35ms by adding a Redis caching layer and ETag-based conditional retrieval to a Node.js REST API',
      'Scaled to 80+ concurrent requests at a 99.5% success rate by building event-driven services on RabbitMQ message queues with Elasticsearch indexing for full-text search',
      'Blocked malformed payloads across 12 resource types by enforcing JSON Schema validation, securing endpoints with Google OAuth and RS256 JWTs, and containerizing services via Docker Compose',
    ],
    challenges: [],
  },
  {
    id: 'stockwise',
    title: 'StockWise',
    summary: 'Stock trading and investment platform with AI-assisted analysis and live market data.',
    description:
      'A trading platform that pairs live market data with AI-generated, portfolio-aware analysis. Includes role-based access, identity verification with document upload, Stripe payments, and portfolio charts.',
    status: 'completed',
    featured: true,
    year: '2025',
    duration: '6 months',
    team: 'solo project',
    role: 'Full-stack developer and product designer',
    technologies: ['React', 'Redux', 'Node.js', 'Express', 'MongoDB', 'OpenRouter API', 'Stripe', 'Recharts', 'Yahoo Finance'],
    skills: ['react', 'redux', 'nodejs', 'express', 'mongodb', 'jwt', 'restapi', 'openrouter'],
    features: [
      'Trading platform with role-based permissions',
      'Authentication with JWT and Google OAuth',
      'User verification with document upload',
      'AI stock analysis that takes the user\u2019s portfolio into account',
      'Portfolio visualization and Stripe payments',
    ],
    results: [],
    challenges: [
      'Combining financial APIs with different rate limits',
      'Secure payment processing with Stripe',
      'State management for live financial data',
    ],
  },
  {
    id: 'adaptive-artisan',
    title: 'The Adaptive Artisan',
    summary: 'This site: a working Material 3 Expressive design system on the web.',
    description:
      'A portfolio built as a demonstration of Material 3 Expressive on the web, where Google\u2019s own web components are in maintenance mode. Dynamic color, spring motion, variable type, and shape morphing, built from the spec.',
    status: 'in-progress',
    featured: true,
    year: '2026',
    team: 'solo project',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Motion', 'Base UI', 'Material Color Utilities'],
    skills: ['react', 'typescript', 'vite', 'tailwind', 'html-css', 'wcag'],
    features: [
      'Dynamic color from any seed on the 2025 Material color spec, nine scheme variants',
      'Light, dark, and system modes with no flash on load',
      'Contrast tests across 750+ theme combinations',
      'Display type subset from 1.4 MB to 132 KB while keeping the expressive axes',
    ],
    results: [],
    challenges: [
      'Implementing Material 3 Expressive without an official web library',
      'Keeping expressive motion fast and accessible',
    ],
  },
];

// ----------------------------------------------------------------------------
// Skills
// ----------------------------------------------------------------------------

// Mirrors the Technical Skills section of the resume.
//
// No self-assessed levels and no hand-drawn connections: the chart view counts
// how many roles and projects use each skill, and constellation edges come from
// skills used together in the same role or project.

export const skillCategories = [
  { id: 'languages', label: 'Languages', short: 'Languages' },
  { id: 'frontend', label: 'Frontend', short: 'Frontend' },
  { id: 'backend', label: 'Backend and distributed', short: 'Backend' },
  { id: 'data', label: 'Data and search', short: 'Data' },
  { id: 'ai', label: 'AI and automation', short: 'AI' },
  { id: 'tools', label: 'Tools and cloud', short: 'Tools' },
  { id: 'fundamentals', label: 'CS fundamentals', short: 'Fundamentals' },
] as const satisfies ReadonlyArray<SkillCategoryInfo>;

export const skills: Skill[] = [
  { id: 'python', name: 'Python', category: 'languages' },
  { id: 'javascript', name: 'JavaScript', category: 'languages' },
  { id: 'typescript', name: 'TypeScript', category: 'languages' },
  { id: 'java', name: 'Java', category: 'languages' },
  { id: 'sql', name: 'SQL', category: 'languages' },
  { id: 'html-css', name: 'HTML and CSS', category: 'languages' },

  { id: 'react', name: 'React', category: 'frontend' },
  { id: 'nextjs', name: 'Next.js', category: 'frontend' },
  { id: 'redux', name: 'Redux Toolkit', category: 'frontend' },
  { id: 'vite', name: 'Vite', category: 'frontend' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend' },
  { id: 'materialui', name: 'Material UI', category: 'frontend' },
  { id: 'wordpress', name: 'WordPress', category: 'frontend' },
  { id: 'wcag', name: 'WCAG accessibility', category: 'frontend' },

  { id: 'fastapi', name: 'FastAPI', category: 'backend' },
  { id: 'flask', name: 'Flask', category: 'backend' },
  { id: 'nodejs', name: 'Node.js', category: 'backend' },
  { id: 'express', name: 'Express', category: 'backend' },
  { id: 'restapi', name: 'REST APIs', category: 'backend' },
  { id: 'graphql', name: 'GraphQL', category: 'backend' },
  { id: 'bullmq', name: 'BullMQ', category: 'backend' },
  { id: 'rabbitmq', name: 'RabbitMQ', category: 'backend' },
  { id: 'jwt', name: 'JWT and OAuth', category: 'backend' },

  { id: 'mysql', name: 'MySQL', category: 'data' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'data' },
  { id: 'mongodb', name: 'MongoDB', category: 'data' },
  { id: 'redis', name: 'Redis', category: 'data' },
  { id: 'elasticsearch', name: 'Elasticsearch', category: 'data' },
  { id: 'firebase', name: 'Firebase Realtime Database', category: 'data' },

  { id: 'gemini', name: 'Gemini API', category: 'ai' },
  { id: 'openrouter', name: 'OpenRouter', category: 'ai' },
  { id: 'rag', name: 'RAG', category: 'ai' },
  { id: 'prompt-engineering', name: 'Prompt engineering', category: 'ai' },
  { id: 'llm-automation', name: 'LLM-driven automation', category: 'ai' },
  { id: 'playwright', name: 'Playwright', category: 'ai' },
  { id: 'makecom', name: 'Make.com', category: 'ai' },

  { id: 'git', name: 'Git', category: 'tools' },
  { id: 'github', name: 'GitHub', category: 'tools' },
  { id: 'docker', name: 'Docker', category: 'tools' },
  { id: 'aws', name: 'AWS S3', category: 'tools' },
  { id: 'gcp', name: 'Google Cloud', category: 'tools' },
  { id: 'linux', name: 'Linux', category: 'tools' },
  { id: 'postman', name: 'Postman', category: 'tools' },
  { id: 'openapi', name: 'Swagger and OpenAPI', category: 'tools' },
  { id: 'jira', name: 'Jira', category: 'tools' },
  { id: 'copilot', name: 'GitHub Copilot', category: 'tools' },
  { id: 'claude-code', name: 'Claude Code', category: 'tools' },

  { id: 'dsa', name: 'Data structures and algorithms', category: 'fundamentals' },
  { id: 'ood', name: 'Object-oriented design', category: 'fundamentals' },
  { id: 'design-patterns', name: 'Design patterns', category: 'fundamentals' },
  { id: 'distributed-systems', name: 'Distributed systems', category: 'fundamentals' },
  { id: 'system-design', name: 'System design', category: 'fundamentals' },
];

// ----------------------------------------------------------------------------
// Your day, for the footer room
// ----------------------------------------------------------------------------

// Each block runs from its hour until the next block's, in your time zone. The
// six scenes are the room's drawings; the hours and captions are yours.
export const routine: Routine = {
  city: 'Boston',
  timeZone: 'America/New_York',
  blocks: [
    { scene: 'sleep', from: 0, caption: 'Asleep. Gym at 6.' },
    { scene: 'gym', from: 6, caption: 'At the gym.' },
    { scene: 'study', from: 9, caption: 'Coffee, coursework, TA work, and email.' },
    { scene: 'projects', from: 12, caption: 'Working on a project.' },
    { scene: 'tea', from: 17, caption: 'Tea and snacks.' },
    { scene: 'gaming', from: 20, caption: 'Gaming.' },
  ],
};
