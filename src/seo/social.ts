import { profile } from '@/content/profile';
import type { PageHead } from './pages';

/** Escapes text for an HTML attribute or element. */
export const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** The site's default share image in public/, regenerated from scripts/og-card.html. */
export const SOCIAL_IMAGE = { path: '/og.png', width: 1200, height: 630 };

/**
 * Open Graph and Twitter tags for one page, so a shared link shows a card with
 * that page's title, description, and image (a project's screenshot when it
 * has one). Absolute URLs need the site's address, from SITE_URL at build;
 * until there is a domain, image paths stay relative and there is no
 * canonical URL.
 */
export function socialTags(head: PageHead, path: string, siteUrl?: string): string {
  const imagePath = head.image ?? SOCIAL_IMAGE.path;
  const image = siteUrl ? `${siteUrl}${imagePath}` : imagePath;
  const home = path === '/';
  const tags: Array<[string, string, string]> = [
    ['property', 'og:type', home ? 'profile' : 'website'],
    ['property', 'og:title', head.title],
    ['property', 'og:description', head.description],
    ['property', 'og:image', image],
    ...(head.image
      ? []
      : ([
          ['property', 'og:image:width', String(SOCIAL_IMAGE.width)],
          ['property', 'og:image:height', String(SOCIAL_IMAGE.height)],
        ] as Array<[string, string, string]>)),
    ['property', 'og:image:alt', head.image ? head.title : `${profile.name}, ${profile.role} in ${profile.location}`],
    ...(home ? ([['property', 'profile:first_name', profile.name.split(' ')[0] ?? profile.name]] as Array<[string, string, string]>) : []),
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', head.title],
    ['name', 'twitter:description', head.description],
    ['name', 'twitter:image', image],
  ];
  if (siteUrl) tags.push(['property', 'og:url', `${siteUrl}${path}`]);
  const meta = tags.map(([key, name, content]) => `<meta ${key}="${name}" content="${escapeHtml(content)}" />`);
  if (siteUrl) meta.push(`<link rel="canonical" href="${escapeHtml(`${siteUrl}${path}`)}" />`);
  return meta.join('\n    ');
}
