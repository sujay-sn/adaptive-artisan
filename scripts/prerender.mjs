// Runs after both builds (npm run build). Renders the page with the server
// build in dist-ssr/ and writes the HTML into dist/index.html, along with the
// social card tags and structured data. Set SITE_URL (https://example.com, no
// trailing slash) once there is a domain, for absolute and canonical URLs.

import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const siteUrl = process.env.SITE_URL?.replace(/\/+$/, '') || undefined;

const { render, structuredData, socialTags, headTags, validateContent } = await import(pathToFileURL(`${root}dist-ssr/entry-server.js`).href);

// A mistake in src/data.ts stops the build here, with every problem named.
const problems = validateContent();
if (problems.length > 0) {
  console.error(`\nsrc/data.ts has ${problems.length} problem${problems.length === 1 ? '' : 's'}:\n${problems.map((p) => `  - ${p}`).join('\n')}\n`);
  process.exit(1);
}

const indexPath = `${root}dist/index.html`;
const template = await readFile(indexPath, 'utf8');

const ROOT_MARKER = '<div id="root"></div>';
const SOCIAL_MARKER = '<!-- md:social -->';
if (!template.includes(ROOT_MARKER)) throw new Error(`prerender: ${ROOT_MARKER} not found in dist/index.html`);
if (!template.includes(SOCIAL_MARKER)) throw new Error(`prerender: ${SOCIAL_MARKER} not found in dist/index.html`);

const app = render();
// A blank render would ship an empty page that still looks like a success.
if (app.length < 5000 || !app.includes('id="skills"')) throw new Error(`prerender: the rendered page looks incomplete (${app.length} characters)`);

// Inside a <script>, "</script>" or "<!--" in the data would end it early.
const ld = JSON.stringify(structuredData(siteUrl)).replace(/</g, '\\u003c');

// The tab title and search description always match src/data.ts.
const head = headTags();
const TITLE = /<title>[\s\S]*?<\/title>/;
const DESCRIPTION = /<meta\s+name="description"[\s\S]*?\/>/;
if (!TITLE.test(template) || !DESCRIPTION.test(template)) throw new Error('prerender: <title> or the description meta tag is missing from index.html');

const html = template
  .replace(TITLE, `<title>${head.title}</title>`)
  .replace(DESCRIPTION, `<meta name="description" content="${head.description}" />`)
  .replace(ROOT_MARKER, `<div id="root">${app}</div>`)
  .replace(SOCIAL_MARKER, `${socialTags(siteUrl)}\n    <script type="application/ld+json">${ld}</script>`);

await writeFile(indexPath, html);
// The server build was only needed to render; it isn't part of the site.
await rm(`${root}dist-ssr`, { recursive: true, force: true });

console.log(`prerender: wrote dist/index.html (${Math.round(app.length / 1024)} kB of page HTML)${siteUrl ? ` for ${siteUrl}` : ', without a site URL'}`);
