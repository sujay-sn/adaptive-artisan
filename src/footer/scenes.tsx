import type { CSSProperties, ReactNode } from 'react';
import { shapeSvgPoints } from '@/shape/shapes';
import { Character } from './Character';

const order = (i: number) => ({ '--i': i }) as CSSProperties;
const c = (role: string) => `var(--md-sys-color-${role})`;

/**
 * What every scene shares: the card, a window whose sky carries the time of
 * day, and the desk line, which draws itself in when the footer arrives.
 */
export function Room({ sky, children }: { sky: ReactNode; children: ReactNode }) {
  return (
    <>
      <rect width="360" height="200" rx="28" fill={c('surface-container')} />
      <g className="md-routine-part" style={order(1)}>
        <clipPath id="md-routine-window">
          <rect x="26" y="20" width="78" height="58" rx="12" />
        </clipPath>
        <g clipPath="url(#md-routine-window)">{sky}</g>
        <g fill="none" stroke={c('outline-variant')} strokeWidth="3">
          <rect x="26" y="20" width="78" height="58" rx="12" />
          <path d="M65 20 V78 M26 49 H104" />
        </g>
      </g>
      {children}
      <g fill="none" stroke={c('outline-variant')} strokeLinecap="round">
        <path className="md-routine-line" pathLength={1} d="M18 171 H342" strokeWidth="6" style={order(0)} />
        <path className="md-routine-line" pathLength={1} d="M44 175 V190" strokeWidth="5" style={order(2)} />
        <path className="md-routine-line" pathLength={1} d="M316 175 V190" strokeWidth="5" style={order(2)} />
      </g>
    </>
  );
}

/** An afternoon sky: daylight and a cloud. */
function DaySky() {
  return (
    <>
      <rect x="26" y="20" width="78" height="58" fill={c('secondary-container')} />
      {/* White on a light sky; in dark mode the lowest surface goes near-black,
          so the cloud switches to a fixed role, which stays pale in both schemes. */}
      <g style={{ fill: `light-dark(${c('surface-container-lowest')}, ${c('secondary-fixed')})` }}>
        <circle cx="44" cy="44" r="7" />
        <circle cx="54" cy="39" r="9.5" />
        <circle cx="63" cy="45" r="6.5" />
        <rect x="40" y="44" width="26" height="7.5" rx="3.75" />
      </g>
    </>
  );
}

// Code on the monitor: indentation and length vary like a real file.
const CODE = [
  { x: 250, w: 38, role: 'primary' },
  { x: 260, w: 30, role: 'tertiary' },
  { x: 260, w: 50, role: 'secondary' },
  { x: 270, w: 24, role: 'primary' },
  { x: 250, w: 34, role: 'on-surface-variant' },
];

/** Afternoon: deep in a project, a laptop and a monitor of code. */
export function ProjectsScene() {
  return (
    <Room sky={<DaySky />}>
      <g className="md-routine-part" style={order(2)}>
        <path d="M64 134 V112" stroke={c('tertiary')} strokeWidth="3" strokeLinecap="round" />
        <polygon points={shapeSvgPoints('flower', 64, 108, 20, 0.2)} fill={c('tertiary-container')} />
        <circle cx="64" cy="108" r="5" fill={c('tertiary')} />
        <path d="M48 140 L80 140 L76 168 L52 168 Z" fill={c('secondary-container')} />
        <rect x="45" y="134" width="38" height="8" rx="4" fill={c('secondary')} />
      </g>

      <g className="md-routine-part" style={order(2)}>
        <rect x="283" y="134" width="12" height="30" fill={c('outline-variant')} />
        <rect x="268" y="162" width="42" height="6" rx="3" fill={c('outline-variant')} />
        <rect x="236" y="62" width="106" height="72" rx="9" fill={c('surface-container-lowest')} stroke={c('outline')} strokeWidth="2.5" />
        {CODE.map((line, i) => (
          <rect
            key={i}
            className="md-routine-code"
            x={line.x}
            y={76 + i * 11}
            width={line.w}
            height="6"
            rx="3"
            fill={c(line.role)}
            style={order(i)}
          />
        ))}
      </g>

      <Character />

      <g className="md-routine-part" style={order(4)}>
        <rect x="125" y="120" width="80" height="48" rx="7" fill={c('surface-container-highest')} stroke={c('outline')} strokeWidth="2" />
        <polygon points={shapeSvgPoints('sunny', 160, 142, 11)} fill={c('tertiary-container')} />
        <polygon points={shapeSvgPoints('clover4', 188, 156, 6.5, 0.4)} fill={c('primary-container')} />
        <rect x="113" y="165" width="104" height="6" rx="3" fill={c('outline')} />
      </g>
    </Room>
  );
}
