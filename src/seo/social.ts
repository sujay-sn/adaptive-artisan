import { profile } from '@/content/profile';

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** The social card image in public/, regenerated from scripts/og-card.html. */
export const SOCIAL_IMAGE = { path: '/og.png', width: 1200, height: 630 };

/**
 * Open Graph and Twitter tags, so a shared link shows a card with Sujay's
 * name, role, and summary. Absolute URLs need the site's address, which comes
 * from SITE_URL at build time; until there is a domain, the image path stays
 * relative and there is no canonical URL.
 */
export function socialTags(siteUrl?: string): string {
  const title = `${profile.name} | Software Engineer`;
  const image = siteUrl ? `${siteUrl}${SOCIAL_IMAGE.path}` : SOCIAL_IMAGE.path;
  const tags: Array<[string, string, string]> = [
    ['property', 'og:type', 'profile'],
    ['property', 'og:title', title],
    ['property', 'og:description', profile.summary],
    ['property', 'og:image', image],
    ['property', 'og:image:width', String(SOCIAL_IMAGE.width)],
    ['property', 'og:image:height', String(SOCIAL_IMAGE.height)],
    ['property', 'og:image:alt', `${profile.name}, ${profile.role} in ${profile.location}`],
    ['property', 'profile:first_name', profile.name.split(' ')[0] ?? profile.name],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', profile.summary],
    ['name', 'twitter:image', image],
  ];
  if (siteUrl) tags.push(['property', 'og:url', `${siteUrl}/`]);
  const meta = tags.map(([key, name, content]) => `<meta ${key}="${name}" content="${escape(content)}" />`);
  if (siteUrl) meta.push(`<link rel="canonical" href="${escape(`${siteUrl}/`)}" />`);
  return meta.join('\n    ');
}
