import { education, profile } from '@/content/profile';
import { skills } from '@/content/skills';
import { usesOf } from '@/skills/graph';

/**
 * Describes Sujay as a schema.org Person, for search engines. Built from the
 * same content as the page, so the two can't drift apart. Only skills with
 * evidence on the page are listed as things he knows about.
 */
export function structuredData(siteUrl?: string): Record<string, unknown> {
  const [locality, region] = profile.location.split(',').map((part) => part.trim());
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
  };
}
