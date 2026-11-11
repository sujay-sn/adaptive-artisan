import type { ReactNode } from 'react';

// Sujay, full body, walking or standing, facing +x. Local coordinates: feet
// on y = 0, about 180 units tall. Every limb is drawn with its joint at its own
// origin and wrapped in a translate to where that joint sits, so the CSS walk
// cycle (index.css, md-walk-*) only has to rotate it.

/** Fixed colors: these describe the person, so they don't follow the theme. */
const SKIN = '#b47b55';
const SKIN_SHADE = '#8f5c3d';
const HAIR = '#2b1f1a';
const FRAMES = '#221d1b';
const JEANS = '#3a4763';
const JEANS_BACK = '#2c3650';
const SHOE = '#f1f0ec';
const SOLE = '#b9b6ae';
const CONTROLLER = '#2a2d31';

const HOODIE = 'var(--md-sys-color-primary)';
const HOOD = 'color-mix(in srgb, var(--md-sys-color-primary) 72%, black)';
const STRINGS = 'var(--md-sys-color-on-primary)';

/** A joint: positions its children so (0, 0) is the pivot, and names the part that rotates. */
function Joint({ at, part, children }: { at: [number, number]; part: string; children: ReactNode }) {
  return (
    <g transform={`translate(${at[0]} ${at[1]})`}>
      <g className={part}>{children}</g>
    </g>
  );
}

function Leg({ side }: { side: 'front' | 'back' }) {
  const color = side === 'front' ? JEANS : JEANS_BACK;
  return (
    <Joint at={[0, -66]} part={`md-leg md-leg-${side}`}>
      <path d="M0 0 V33" stroke={color} strokeWidth="15" strokeLinecap="round" />
      <Joint at={[0, 33]} part={`md-shin md-shin-${side}`}>
        <path d="M0 0 V26" stroke={color} strokeWidth="13" strokeLinecap="round" />
        <rect x="-7" y="24" width="24" height="10" rx="5" fill={SHOE} />
        <rect x="-7" y="31" width="24" height="3" rx="1.5" fill={SOLE} />
      </Joint>
    </Joint>
  );
}

/** A sleeve with a darker edge, so an arm in front of the hoodie still reads as an arm. */
function Sleeve({ length, width, color }: { length: number; width: number; color: string }) {
  return (
    <>
      <path d={`M0 0 V${length}`} stroke={HOOD} strokeWidth={width + 3} strokeLinecap="round" />
      <path d={`M0 0 V${length}`} stroke={color} strokeWidth={width} strokeLinecap="round" />
    </>
  );
}

/** `held` is drawn at the hand, under the fingers, and turns with the forearm. */
function Arm({ side, held }: { side: 'front' | 'back'; held?: ReactNode }) {
  const color = side === 'front' ? HOODIE : HOOD;
  return (
    <Joint at={[2, -120]} part={`md-arm md-arm-${side}`}>
      <Sleeve length={30} width={12} color={color} />
      <Joint at={[0, 30]} part="md-forearm">
        <Sleeve length={22} width={11} color={color} />
        {held}
        <circle cx="0" cy="28" r="6.5" fill={SKIN} />
      </Joint>
    </Joint>
  );
}

/** The head, turned three-quarters toward +x so the beard and glasses still read. Centered on (0, 0). */
function Head() {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="19" ry="22" fill={SKIN} />
      <circle cx="-15" cy="2" r="4.5" fill={SKIN} />
      <circle cx="-15" cy="2" r="1.8" fill={SKIN_SHADE} />
      <path d="M-19 -1 Q-22 -24 0 -24 Q20 -24 19 -8 Q14 -15 6 -16 Q-4 -12 -10 -14 Q-13 -8 -11 -3 Q-15 -4 -19 -1 Z" fill={HAIR} />
      <path d="M-12 3 Q-12 22 6 23 Q19 22 19 2 Q15 10 9 11 Q2 14 -4 10 Q-9 8 -12 3 Z" fill={HAIR} />
      <path d="M2 11 Q10 7 18 10 Q13 13 10 12 Q6 13 2 11 Z" fill={HAIR} />
      <path d="M6 16 Q10.5 18.5 15 16" fill="none" stroke={SKIN} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 1 Q12 6 16 7" fill="none" stroke={SKIN_SHADE} strokeWidth="1.7" strokeLinecap="round" />
      <g className="md-blink" fill={HAIR}>
        <circle cx="2.5" cy="-3" r="1.7" />
        <circle cx="15.5" cy="-3" r="1.5" />
      </g>
      <g fill="none" stroke={HAIR} strokeWidth="2" strokeLinecap="round">
        <path d="M-3 -12 Q2.5 -14.5 8 -12" />
        <path d="M11 -12 Q15 -13.5 19 -12" />
      </g>
      <g className="md-glasses" fill="none" stroke={FRAMES} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        <rect x="-4" y="-8" width="13" height="10" rx="3.5" />
        <rect x="11" y="-8" width="9" height="10" rx="3" />
        <path d="M9 -4 Q10 -5.5 11 -4" />
        <path d="M-4 -4 L-13 -2" />
      </g>
    </g>
  );
}

/** The whole figure. Legs first, so the hoodie's hem covers their tops; then the back arm, body, head, and front arm. */
export function Person() {
  return (
    <g className="md-person-body">
      <Leg side="back" />
      <Leg side="front" />
      <g className="md-upper">
        <Arm side="back" />
        <rect x="-2" y="-138" width="9" height="14" fill={SKIN} />
        <path d="M-15 -62 L-15 -112 Q-15 -128 2 -128 Q19 -128 19 -112 L19 -66 Q19 -62 15 -62 Z" fill={HOODIE} />
        <ellipse cx="-10" cy="-125" rx="7" ry="6" fill={HOOD} />
        <rect x="-15" y="-68" width="34" height="7" rx="3.5" fill={HOOD} />
        <path d="M15 -122 L14 -105" stroke={STRINGS} strokeWidth="2.2" strokeLinecap="round" />
        <g transform="translate(3 -158)">
          <Head />
        </g>
        {/* Tea: held at the chest, steaming (md-mug in index.css). */}
        <g className="md-mug">
          <g className="md-mug-steam" fill="none" stroke="var(--md-sys-color-outline)" strokeWidth="2" strokeLinecap="round">
            <path d="M36 -118 Q33 -123 36 -128" />
            <path d="M42 -118 Q39 -125 42 -132" />
          </g>
          <rect x="31" y="-114" width="14" height="15" rx="3.5" fill="var(--md-sys-color-tertiary)" />
        </g>
        {/* Only shown on the couch (md-controller in index.css), held where both hands meet. */}
        <g className="md-controller">
          <rect x="31" y="-103" width="24" height="11" rx="5.5" fill={CONTROLLER} />
          <circle cx="49" cy="-99" r="1.6" fill="var(--md-sys-color-tertiary-container)" />
          <circle cx="37" cy="-99" r="1.6" fill="var(--md-sys-color-primary-container)" />
        </g>
        <Arm
          side="front"
          held={
            // Seen in profile, a dumbbell is its end plate. Only shown at the gym.
            <g className="md-dumbbell">
              <circle cx="0" cy="28" r="10" fill="var(--md-sys-color-primary)" />
              <circle cx="0" cy="28" r="10" fill="none" stroke={HOOD} strokeWidth="2" />
            </g>
          }
        />
      </g>
    </g>
  );
}
