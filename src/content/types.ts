// The shapes everything in src/data.ts must follow. TypeScript checks data.ts
// against these, so a misspelled field or a missing title fails the build
// with the exact line. You shouldn't need to edit this file to change content.

import type { skillCategories } from '@/data';
import type { YearMonth } from '@/lib/degreeProgress';

export interface Profile {
  name: string;
  fullName: string;
  role: string;
  /** Shown after your name in the browser tab and on shared-link cards: "Sujay S N | Software Engineer". */
  title: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  /** Google Drive share link to the resume PDF. */
  resumeUrl?: string;
  /** Portrait for the About section. Until it exists, a monogram fills the frame. */
  photo?: string;
  summary: string;
  about: string[];
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

export interface Degree {
  id: string;
  degree: string;
  school: string;
  location: string;
  period: string;
  /** First and last months, which drive the progress bar and the completed state. */
  start: YearMonth;
  end: YearMonth;
  gpa: string;
  summary?: string;
  coursework: string[];
}

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
  /** Shown on the home page. Up to six; they appear in the order listed. Without any, the first six show. */
  featured?: boolean;
  /** The result a featured row leads with, in large type: { value: '85% → 34%', label: 'server load, after ...' }. */
  headline?: { value: string; label: string };
  /** Screenshots, short clips, and demo videos, shown on the project's page. */
  gallery?: GalleryItem[];
  /** Cover media. Until a project has some, its cover is generated from MD3 shapes. */
  media?: {
    /** A screenshot, also the video's first frame. */
    poster: string;
    /** A short muted loop, played while the card is hovered or focused. */
    video?: string;
  };
}

/**
 * One item in a project's gallery. Files go in public/ (public/projects/<project-id>/ keeps
 * them together) and are referenced from "/", like "/projects/burrow-housing/search.webp".
 */
export type GalleryItem =
  | {
      type: 'image';
      src: string;
      /** What the image shows, for people who can't see it. Required. */
      alt: string;
      caption?: string;
    }
  | {
      /** A short clip, under about 30 seconds: plays muted and looping, with a pause button. */
      type: 'video';
      src: string;
      /** A still to show before it plays. */
      poster?: string;
      /** What the clip shows. Required. */
      alt: string;
      caption?: string;
    }
  | {
      /** A longer demo on YouTube or Loom. Loads only when someone presses play. */
      type: 'embed';
      provider: 'youtube' | 'loom';
      /** The video's id: the part after "watch?v=" on YouTube, or after "/share/" on Loom. */
      id: string;
      title: string;
      /** A still for Loom videos; YouTube's own thumbnail is used otherwise. */
      poster?: string;
      caption?: string;
    };

/** An award or recognition, such as one given by a company. */
export interface Award {
  id: string;
  title: string;
  /** Who gave it: "Accenture". */
  from: string;
  date: YearMonth;
  /** One line on why it was given. */
  reason: string;
  /** The id of the role in `experience` it came from; that role's card links to it. */
  role?: string;
  /** A page about it, if there is one. */
  url?: string;
  /** A placeholder: labeled "Example" on the page and named in a build warning until replaced. */
  example?: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issued: YearMonth;
  expires?: YearMonth;
  credentialId?: string;
  /** Where anyone can confirm it: the Credly badge page, or the issuer's verification page. */
  verifyUrl: string;
  /** Skill ids it covers; the skills section shows it as evidence for them. */
  skills: string[];
  /** The badge image, in public/: "/certifications/aws-cloud-practitioner.png". */
  badge?: string;
  /** A placeholder: labeled "Example" on the page and named in a build warning until replaced. */
  example?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
}

export interface SkillCategoryInfo {
  id: string;
  /** The full name, shown in the evidence panel and the list view. */
  label: string;
  /** One word for the large category filter above the skills pile. */
  short: string;
}

export type SkillCategory = (typeof skillCategories)[number]['id'];

/** Sentences on the page that are yours rather than the interface's. */
export interface PageCopy {
  /** The search-result and link-preview description. */
  pageDescription: string;
  skillsIntro: string;
  /** Under the heading on the Projects page. */
  projectsIntro: string;
  contactIntro: string;
  /** Shown after the contact form sends. */
  contactThanks: string;
  footerTagline: string;
}

/** The footer room's six drawings. Each block of your day shows one of them. */
export type Scene = 'sleep' | 'gym' | 'study' | 'projects' | 'tea' | 'gaming';

export interface RoutineBlock {
  scene: Scene;
  /** The hour it starts, 0 to 23, in your time zone. It runs until the next block's hour. */
  from: number;
  caption: string;
}

export interface Routine {
  /** Shown in the footer: "3:12 PM in Boston." */
  city: string;
  /** An IANA time zone, such as America/New_York. Daylight saving is handled for you. */
  timeZone: string;
  /** In order of hour; the first must start at 0. */
  blocks: RoutineBlock[];
}
