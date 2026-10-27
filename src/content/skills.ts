// Mirrors the Technical Skills section of the resume.
//
// No self-assessed levels and no hand-drawn connections: the chart view counts
// how many roles and projects use each skill, and constellation edges come from
// skills used together in the same role or project.

export const SKILL_CATEGORIES = [
  { id: 'languages', label: 'Languages' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend and distributed' },
  { id: 'data', label: 'Data and search' },
  { id: 'ai', label: 'AI and automation' },
  { id: 'tools', label: 'Tools and cloud' },
  { id: 'fundamentals', label: 'CS fundamentals' },
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number]['id'];

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
}

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