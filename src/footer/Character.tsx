import type { CSSProperties } from 'react';

// Sujay as a character, seated and seen from the front, drawn for a 360x200
// scene. Everything but skin, hair, and glasses takes its color from the theme,
// so the hoodie follows whatever seed the visitor picks.

/** Fixed colors: these describe the person, so they don't follow the theme. */
const PERSON = {
  skin: '#b47b55',
  skinShade: '#8f5c3d',
  hair: '#2b1f1a',
  frames: '#221d1b',
} as const;

const HOODIE = 'var(--md-sys-color-primary)';
const HOOD = 'color-mix(in srgb, var(--md-sys-color-primary) 72%, black)';
const STRINGS = 'var(--md-sys-color-on-primary)';

/** Head and shoulders, centered on x = 165, with the torso running down to the desk at y = 172. */
export function Character() {
  return (
    <g className="md-routine-part md-routine-person" style={{ '--i': 3 } as CSSProperties}>
      <rect x="158" y="86" width="14" height="16" fill={PERSON.skin} />
      <path d="M108 172 L108 132 Q108 104 140 99 L190 99 Q222 104 222 132 L222 172 Z" fill={HOODIE} />
      <path d="M139 100 Q165 117 191 100 Q189 94 165 96 Q141 94 139 100 Z" fill={HOOD} />
      <g stroke={STRINGS} strokeWidth="2.5" strokeLinecap="round">
        <path d="M159 106 L157 121" />
        <path d="M171 106 L173 121" />
      </g>

      <circle cx="145" cy="70" r="5" fill={PERSON.skin} />
      <circle cx="185" cy="70" r="5" fill={PERSON.skin} />
      <ellipse cx="165" cy="70" rx="20" ry="23" fill={PERSON.skin} />
      <path d="M145 64 Q142 42 165 41 Q189 42 185 64 Q182 54 174 52 Q166 56 156 53 Q149 56 145 64 Z" fill={PERSON.hair} />
      <path d="M145 68 Q146 97 165 97 Q184 97 185 68 Q182 79 175 81 Q165 85 155 81 Q148 79 145 68 Z" fill={PERSON.hair} />
      <path d="M155 81 Q165 76 175 81 Q170 84 165 82 Q160 84 155 81 Z" fill={PERSON.hair} />
      <path d="M160 87.5 Q165 90.5 170 87.5" fill="none" stroke={PERSON.skin} strokeWidth="2" strokeLinecap="round" />
      <path d="M165 69 Q162.5 75.5 166 76" fill="none" stroke={PERSON.skinShade} strokeWidth="1.8" strokeLinecap="round" />

      <g className="md-routine-blink" fill={PERSON.hair}>
        <circle cx="154.5" cy="67.5" r="1.9" />
        <circle cx="175.5" cy="67.5" r="1.9" />
      </g>
      <g fill="none" stroke={PERSON.hair} strokeWidth="2.2" strokeLinecap="round">
        <path d="M149 58.5 Q154.5 56 160 58.5" />
        <path d="M170 58.5 Q175.5 56 181 58.5" />
      </g>
      <g fill="none" stroke={PERSON.frames} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <rect x="147" y="62" width="15" height="11" rx="4" />
        <rect x="168" y="62" width="15" height="11" rx="4" />
        <path d="M162 66.5 Q165 64.5 168 66.5" />
        <path d="M147 66 L145 67.5" />
        <path d="M183 66 L185 67.5" />
      </g>

      {/* Hidden until a wave: the right arm swings up from the shoulder. */}
      <g className="md-routine-arm">
        <path d="M204 112 L220 96 L222 76" fill="none" stroke={HOODIE} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="222" cy="70" r="6.5" fill={PERSON.skin} />
      </g>
    </g>
  );
}
