export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  status: 'completed' | 'in-progress';
  year: string;
  duration?: string;
  team?: string;
  role?: string;
  technologies: string[];
  /** Skill ids from skills.ts. Drives constellation-to-project filtering. */
  skills: string[];
  features: string[];
  /** Measured outcomes. Only numbers that also appear on the resume. */
  results: string[];
  challenges: string[];
  repoUrl?: string;
  demoUrl?: string;
}

// TODO(sujay): add repo and demo URLs (the resume links Burrow's GitHub and
// demo, and the Insurance platform's GitHub).
export const projects: Project[] = [
  {
    id: 'burrow-housing',
    title: 'Burrow Housing',
    summary: 'Sublease marketplace with geospatial search, secure sign-in, and real-time messaging.',
    description:
      'A sublease marketplace where tenants list rooms and people looking for short-term housing find them by distance. Search runs on MongoDB geospatial queries with Google Maps, chat and media uploads are built in, and sign-up is verified by email.',
    status: 'completed',
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
    description:
      'A Node.js REST API for insurance data built around event-driven services. Writes flow through RabbitMQ into Elasticsearch for full-text search, reads are cached in Redis with ETag-based conditional requests, and every payload is checked against JSON Schema.',
    status: 'completed',
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