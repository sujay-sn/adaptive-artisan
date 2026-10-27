// The single list of Material Symbols this site uses.
//
// The build plugin turns this list into a Google Fonts request with
// `icon_names=`, so visitors download only these glyphs instead of the
// multi-megabyte full icon font. Add a name here before using it.

export const ICON_NAMES = [
  'arrow_upward',
  'brightness_auto',
  'close',
  'code',
  'dark_mode',
  'download',
  'folder',
  'home',
  'hub',
  'light_mode',
  'mail',
  'menu',
  'open_in_new',
  'palette',
  'person',
  'school',
  'work',
] as const;

export type IconName = (typeof ICON_NAMES)[number];
