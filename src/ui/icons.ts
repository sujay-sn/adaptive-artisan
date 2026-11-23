// The single list of Material Symbols this site uses.
//
// The build plugin turns this list into a Google Fonts request with
// `icon_names=`, so visitors download only these glyphs instead of the
// multi-megabyte full icon font. Add a name here before using it.

export const ICON_NAMES = [
  'add',
  'arrow_back',
  'arrow_forward',
  'arrow_upward',
  'brightness_auto',
  'check',
  'chevron_left',
  'chevron_right',
  'close',
  'code',
  'dark_mode',
  'description',
  'download',
  'edit',
  'error',
  'favorite',
  'folder',
  'home',
  'hub',
  'image',
  'light_mode',
  'mail',
  'menu',
  'open_in_new',
  'palette',
  'pause',
  'person',
  'play_arrow',
  'school',
  'send',
  'share',
  'verified',
  'work',
  'workspace_premium',
] as const;

export type IconName = (typeof ICON_NAMES)[number];