// Builds the display cut of Google Sans Flex.
//
// The full variable font (all six axes) is ~1.4 MB for Latin alone, far too
// heavy to load up front. The display cut keeps the axes display type animates
// (wght, wdth, ROND), pins the rest, and keeps only Basic Latin plus a few
// typographic marks. Measured sizes for this source file:
//   all axes, Basic Latin ............ 943 KB
//   opsz + slnt pinned ............... 199 KB
//   opsz + slnt + GRAD pinned ........ 129 KB  <- this config
// Body text uses Fontsource's wght-only cut (~50 KB). The Playground lazy-loads
// the full font when it opens, since that is where every axis is on show.
//
// Run: npm run fonts

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';

const root = new URL('..', import.meta.url);
const source = new URL(
  'node_modules/@fontsource-variable/google-sans-flex/files/google-sans-flex-latin-full-normal.woff2',
  root,
);
// Written to public/ so index.html can preload it at a stable URL.
const outDir = new URL('public/fonts/', root);
const out = new URL('google-sans-flex-display.woff2', outDir);

// Basic Latin printable range plus curly quotes, dashes, ellipsis, bullet.
const basicLatin = Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) => String.fromCodePoint(0x20 + i)).join('');
const extras = '\u2018\u2019\u201C\u201D\u2013\u2014\u2026\u2022\u00B7\u00A9';

const input = await readFile(source);
const output = await subsetFont(input, basicLatin + extras, {
  targetFormat: 'woff2',
  // opsz 72 suits display sizes; slant and grade are fixed at their defaults.
  variationAxes: { opsz: 72, slnt: 0, GRAD: 0 },
});

await mkdir(outDir, { recursive: true });
await writeFile(out, output);

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log(`display font: ${kb(input.length)} -> ${kb(output.length)}`);
console.log(`written to ${fileURLToPath(out)}`);
