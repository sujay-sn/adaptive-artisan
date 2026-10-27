// Works around a packaging bug in @material/material-color-utilities 0.4.0:
// some of its ES modules import siblings without a file extension
// (`from '../dynamiccolor/dynamic_scheme'`). Bundlers tolerate that, but
// Node's ESM loader does not, which breaks vite.config.ts (it runs the theme
// engine in Node to bake the default theme) and Vitest.
//
// Adds the missing `.js` to relative specifiers. Idempotent, and a no-op once
// the package ships a fix. Runs on postinstall.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgDir = fileURLToPath(new URL('../node_modules/@material/material-color-utilities/', import.meta.url));
const SPECIFIER = /((?:from|import)\s*['"])(\.{1,2}\/[^'"]+?)(['"])/g;

async function* jsFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* jsFiles(path);
    else if (entry.name.endsWith('.js')) yield path;
  }
}

if (!existsSync(pkgDir)) process.exit(0);

let patched = 0;
for await (const file of jsFiles(pkgDir)) {
  const source = await readFile(file, 'utf8');
  const fixed = source.replace(SPECIFIER, (match, head, spec, tail) => {
    if (spec.endsWith('.js')) return match;
    return existsSync(resolve(dirname(file), `${spec}.js`)) ? `${head}${spec}.js${tail}` : match;
  });
  if (fixed !== source) {
    await writeFile(file, fixed);
    patched++;
  }
}
if (patched) console.log(`fix-mcu-esm: added .js extensions in ${patched} file(s)`);