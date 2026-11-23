import { awards, certifications, education, profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { skills } from '@/content/skills';
import { projectPath } from '@/router';
import { usesOf } from '@/skills/graph';

/**
 * Describes Sujay as a schema.org Person, for search engines. Built from the
 * same content as the page, so the two can't drift apart. Only skills with
 * evidence on the page are listed as things he knows about.
 */
export function structuredData(siteUrl?: string): Record<string, unknown> {
  const [locality, region] = profile.location.split(',').map((part) => part.trim());
  // Example placeholders never reach search engines.
  const realAwards = awards.filter((award) => !award.example);
  const realCertifications = certifications.filter((certification) => !certification.example);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    alternateName: profile.fullName,
    jobTitle: profile.role,
    description: profile.summary,
    ...(siteUrl ? { url: siteUrl } : {}),
    email: `mailto:${profile.email}`,
    address: { '@type': 'PostalAddress', addressLocality: locality, addressRegion: region, addressCountry: 'US' },
    alumniOf: education.map((degree) => ({ '@type': 'CollegeOrUniversity', name: degree.school })),
    sameAs: [profile.linkedin, profile.github],
    knowsAbout: skills.filter((skill) => usesOf(skill.id).length > 0).map((skill) => skill.name),
    ...(realAwards.length > 0 ? { award: realAwards.map((award) => `${award.title}, ${award.from} (${award.date.slice(0, 4)})`) } : {}),
    ...(realCertifications.length > 0
      ? {
          hasCredential: realCertifications.map((certification) => ({
            '@type': 'EducationalOccupationalCredential',
            name: certification.name,
            credentialCategory: 'certification',
            recognizedBy: { '@type': 'Organization', name: certification.issuer },
            dateCreated: certification.issued,
            ...(certification.expires ? { expires: certification.expires } : {}),
            url: certification.verifyUrl,
          })),
        }
      : {}),
  };
}

/** Describes one project as a schema.org CreativeWork, credited to Sujay. */
export function projectStructuredData(id: string, siteUrl?: string): Record<string, unknown> | null {
  const project = projects.find((p) => p.id === id);
  if (!project) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    ...(siteUrl ? { url: `${siteUrl}${projectPath(project.id)}` } : {}),
    ...(project.media ? { image: siteUrl ? `${siteUrl}${project.media.poster}` : project.media.poster } : {}),
    dateCreated: project.year,
    keywords: project.technologies.join(', '),
    author: { '@type': 'Person', name: profile.name, ...(siteUrl ? { url: siteUrl } : {}) },
    ...(project.repoUrl ? { codeRepository: project.repoUrl } : {}),
  };
}
