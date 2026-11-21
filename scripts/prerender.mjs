// Runs after both builds (npm run build). Renders every page with the server
// build in dist-ssr/ and writes each as its own HTML file in dist/, with its
// title, description, share card, and structured data. Pages live in folders
// (dist/projects/burrow-housing/index.html), so their addresses end in a
// slash. Set SITE_URL (https://example.com, no trailing slash) once there is a
// domain, for absolute and canonical URLs.

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const siteUrl = process.env.SITE_URL?.replace(/\/+$/, '') || undefined;

const server = await import(pathToFileURL(`${root}dist-ssr/entry-server.js`).href);
const { render, pages, routeOf, pageHead, socialTags, escapeHtml, structuredData, projectStructuredData, validateContent } = server;

// A mistake in src/data.ts stops the build here, with every problem named.
const problems = validateContent();
if (problems.length > 0) {
  console.error(`\nsrc/data.ts has ${problems.length} problem${problems.length === 1 ? '' : 's'}:\n${problems.map((p) => `  - ${p}`).join('\n')}\n`);
  process.exit(1);
}

const template = await readFile(`${root}dist/index.html`, 'utf8');
const ROOT_MARKER = '<div id="root"></div>';
const SOCIAL_MARKER = '<!-- md:social -->';
const TITLE = /<title>[\s\S]*?<\/title>/;
const DESCRIPTION = /<meta\s+name="description"[\s\S]*?\/>/;
for (const [label, found] of [
  [ROOT_MARKER, template.includes(ROOT_MARKER)],
  [SOCIAL_MARKER, template.includes(SOCIAL_MARKER)],
  ['<title>', TITLE.test(template)],
  ['the description meta tag', DESCRIPTION.test(template)],
]) {
  if (!found) throw new Error(`prerender: ${label} not found in dist/index.html`);
}

/** Where a page's file goes: "/" is index.html, "/404" is 404.html, anything else a folder's index.html. */
const fileFor = (path) => (path === '/' ? 'index.html' : path === '/404' ? '404.html' : `${path.replace(/^\/|\/$/g, '')}/index.html`);

// Inside a <script>, "</script>" or "<!--" in the data would end it early.
const ldScript = (data) => (data ? `\n    <script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>` : '');

let total = 0;
for (const path of pages()) {
  const route = routeOf(path);
  const head = pageHead(route);
  const app = render(path);

  // A blank render would ship an empty page that still looks like a success.
  const expected = route.name === 'home' ? 'id="skills"' : route.name === 'project' ? 'id="project-title"' : 'data-page-heading';
  if (app.length < 2000 || !app.includes(expected)) throw new Error(`prerender: ${path} looks incomplete (${app.length} characters, no ${expected})`);

  const data = route.name === 'home' ? structuredData(siteUrl) : route.name === 'project' ? projectStructuredData(route.id, siteUrl) : null;
  const html = template
    .replace(TITLE, `<title>${escapeHtml(head.title)}</title>`)
    .replace(DESCRIPTION, `<meta name="description" content="${escapeHtml(head.description)}" />`)
    .replace(SOCIAL_MARKER, `${socialTags(head, path === '/404' ? '/404.html' : path, siteUrl)}${ldScript(data)}`)
    .replace(ROOT_MARKER, `<div id="root">${app}</div>`);

  const file = `${root}dist/${fileFor(path)}`;
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
  total += 1;
}

// The server build was only needed to render; it isn't part of the site.
await rm(`${root}dist-ssr`, { recursive: true, force: true });

console.log(`prerender: wrote ${total} pages${siteUrl ? ` for ${siteUrl}` : ', without a site URL'}`);
