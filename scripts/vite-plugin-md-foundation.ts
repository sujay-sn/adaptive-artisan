// Bakes the design foundation into index.html at build (and dev) time:
//
//  - the default MD3 theme as an inline <style>, so the very first paint is
//    already in the right colors with no JavaScript involved
//  - the MD3 spring tokens as CSS linear() easings
//  - the Material Symbols stylesheet, subset by Google Fonts to only the icons
//    listed in src/ui/icons.ts
//
// index.html marks both spots with comments so the output order is explicit.

import type { Plugin } from 'vite';
import { DEFAULT_THEME, themeStylesheet } from '../src/theme/engine.ts';
import { ICON_NAMES } from '../src/ui/icons.ts';
import { springStylesheet } from '../src/motion/tokens.ts';

const THEME_MARKER = '<!-- md:default-theme -->';
const ICONS_MARKER = '<!-- md:icon-font -->';

function iconFontHref(): string {
  // Google Fonts requires icon_names to be sorted and comma separated.
  const names = [...new Set(ICON_NAMES)].sort().join(',');
  const axes = 'opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
  return `https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:${axes}&icon_names=${names}&display=block`;
}

export function mdFoundation(): Plugin {
  return {
    name: 'md-foundation',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (!html.includes(THEME_MARKER) || !html.includes(ICONS_MARKER)) {
          throw new Error('index.html is missing an md: marker comment');
        }
        const theme = [
          `<style id="md-default-theme">\n${themeStylesheet(DEFAULT_THEME)}\n</style>`,
          `<style id="md-motion">\n${springStylesheet()}\n</style>`,
        ].join('\n    ');
        const icons = [
          '<link rel="preconnect" href="https://fonts.googleapis.com">',
          '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
          `<link rel="stylesheet" href="${iconFontHref()}">`,
        ].join('\n    ');
        return html.replace(THEME_MARKER, theme).replace(ICONS_MARKER, icons);
      },
    },
  };
}
