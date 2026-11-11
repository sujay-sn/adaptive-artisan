import type { CSSProperties } from 'react';
import { shapeSvgPoints } from '@/shape/shapes';
import type { BostonTime, RoutineId, Sky } from './routine';

// The room is 1600 x 620 units, floor at y = 470, with a deep strip of floor
// in front for the footer bar to sit on without covering anything. The wall itself isn't
// painted: it's the footer's own background, so it runs on seamlessly above
// the drawing when the footer is taller than the room.
const ROOM = { width: 1600, height: 620, floor: 470 } as const;

const c = (role: string) => `var(--md-sys-color-${role})`;

/** Everything in the room except the person. Some props only appear during their block. */
export function RoomArt({ time, sky, block }: { time: BostonTime; sky: Sky; block: RoutineId }) {
  return (
    <>
      <Floor />
      <Door />
      <GymCorner />
      <Desk coffee={block === 'study'} />
      <Window sky={sky} />
      <FloorPlant />
      <Kitchen />
      <WallClock time={time} />
      <Lounge gaming={block === 'gaming'} />
      <Bed />
    </>
  );
}

function Floor() {
  return (
    <>
      <rect y={ROOM.floor} width={ROOM.width} height={ROOM.height - ROOM.floor} fill={c('surface-container-high')} />
      <rect y={ROOM.floor - 8} width={ROOM.width} height="8" fill={c('surface-container-highest')} />
      <ellipse cx="1180" cy="492" rx="150" ry="16" fill={c('secondary-container')} />
    </>
  );
}

function Door() {
  return (
    <g>
      <rect x="40" y="246" width="112" height="224" rx="8" fill={c('surface-container-highest')} />
      <rect x="50" y="256" width="92" height="214" rx="4" fill={c('secondary-container')} />
      <g fill="none" stroke={c('outline-variant')} strokeWidth="3">
        <rect x="62" y="270" width="68" height="72" rx="8" />
        <rect x="62" y="356" width="68" height="96" rx="8" />
      </g>
      <circle cx="130" cy="362" r="6" fill={c('secondary')} />
    </g>
  );
}

function Dumbbell({ x, y, plate }: { x: number; y: number; plate: string }) {
  return (
    <g>
      <rect x={x} y={y - 2.5} width="44" height="5" rx="2.5" fill={c('outline')} />
      <rect x={x - 2} y={y - 9} width="10" height="18" rx="3" fill={plate} />
      <rect x={x + 36} y={y - 9} width="10" height="18" rx="3" fill={plate} />
    </g>
  );
}

function GymCorner() {
  return (
    <g>
      <rect x="182" y="464" width="150" height="9" rx="4.5" fill={c('tertiary-container')} />
      {/* Kettlebell */}
      <path d="M197 432 Q197 414 210 414 Q223 414 223 432" fill="none" stroke={c('on-surface-variant')} strokeWidth="6" strokeLinecap="round" />
      <circle cx="210" cy="448" r="18" fill={c('on-surface-variant')} />
      {/* Water bottle */}
      <rect x="244" y="430" width="16" height="36" rx="6" fill={c('tertiary')} />
      <rect x="247" y="422" width="10" height="10" rx="3" fill={c('on-surface-variant')} />
      {/* Rack */}
      <g fill={c('outline-variant')}>
        <rect x="282" y="396" width="6" height="74" rx="3" />
        <rect x="346" y="396" width="6" height="74" rx="3" />
        <rect x="282" y="420" width="70" height="5" rx="2.5" />
        <rect x="282" y="450" width="70" height="5" rx="2.5" />
      </g>
      <Dumbbell x={295} y={411} plate={c('primary')} />
      <Dumbbell x={295} y={441} plate={c('secondary')} />
    </g>
  );
}

const CODE = [
  { x: 480, w: 40, role: 'primary' },
  { x: 492, w: 34, role: 'tertiary' },
  { x: 492, w: 56, role: 'secondary' },
  { x: 504, w: 26, role: 'primary' },
  { x: 480, w: 38, role: 'on-surface-variant' },
];

/**
 * Sized to Sujay: seated, his knees are at the seat, his elbows at the desk
 * top, and his eyes at the middle of the monitor. The code types itself in
 * while he's sitting here (md-code in index.css).
 */
function Desk({ coffee }: { coffee: boolean }) {
  return (
    <g>
      {/* Monitor */}
      <rect x="466" y="306" width="124" height="80" rx="10" fill={c('surface-container-lowest')} stroke={c('outline')} strokeWidth="3" />
      {CODE.map((line, i) => (
        <rect
          key={i}
          className="md-code"
          x={line.x}
          y={320 + i * 12}
          width={line.w}
          height="6"
          rx="3"
          fill={c(line.role)}
          style={{ '--i': i } as CSSProperties}
        />
      ))}
      <rect x="521" y="386" width="14" height="16" fill={c('outline-variant')} />
      <rect x="504" y="400" width="48" height="6" rx="3" fill={c('outline-variant')} />
      {/* Lamp, at the far end so its light falls on the work, not behind his head */}
      <rect x="612" y="398" width="38" height="10" rx="5" fill={c('secondary')} />
      <path d="M631 400 L644 358 L612 336" fill="none" stroke={c('secondary')} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M628 340 Q614 314 590 328 L600 348 Z" fill={c('primary')} />
      {/* Desk, drawers, keyboard */}
      <rect x="380" y="408" width="276" height="12" rx="5" fill={c('surface-container-highest')} stroke={c('outline')} strokeWidth="2" />
      <rect x="392" y="420" width="10" height="50" fill={c('outline-variant')} />
      <rect x="634" y="420" width="10" height="50" fill={c('outline-variant')} />
      <rect x="566" y="420" width="68" height="40" rx="4" fill={c('surface-container-highest')} />
      <rect x="590" y="436" width="20" height="4" rx="2" fill={c('outline')} />
      <rect x="500" y="402" width="66" height="6" rx="3" fill={c('outline')} />
      {/* Morning coffee, beside the keyboard */}
      {coffee && (
        <g>
          <path d="M579 376 Q574 370 579 364 M587 376 Q582 368 587 360" fill="none" stroke={c('outline-variant')} strokeWidth="2.5" strokeLinecap="round" />
          <rect x="574" y="384" width="20" height="24" rx="5" fill={c('tertiary')} />
          <path d="M594 389 Q603 396 594 403" fill="none" stroke={c('tertiary')} strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
      {/* Chair, in profile, facing the desk */}
      <g fill={c('secondary-container')}>
        <rect x="428" y="386" width="14" height="66" rx="7" />
        <rect x="428" y="444" width="66" height="12" rx="6" />
      </g>
      <rect x="456" y="456" width="8" height="6" fill={c('outline')} />
      <rect x="434" y="460" width="54" height="5" rx="2.5" fill={c('outline')} />
      <circle cx="440" cy="468" r="5" fill={c('on-surface-variant')} />
      <circle cx="482" cy="468" r="5" fill={c('on-surface-variant')} />
    </g>
  );
}

/** The window shows the actual sky in Boston, so its colors are the sky's, not the theme's. */
function Window({ sky }: { sky: Sky }) {
  return (
    <g>
      <clipPath id="md-room-window">
        <rect x="694" y="168" width="156" height="176" rx="14" />
      </clipPath>
      <g clipPath="url(#md-room-window)">
        <SkyView sky={sky} />
      </g>
      <g fill="none" stroke={c('surface-container-highest')} strokeWidth="8">
        <rect x="694" y="168" width="156" height="176" rx="14" />
        <path d="M772 168 V344 M694 256 H850" />
      </g>
      <rect x="684" y="342" width="176" height="10" rx="5" fill={c('surface-container-highest')} />
    </g>
  );
}

const SKIES: Record<Sky, [string, string]> = {
  dawn: ['#a8bfe0', '#f8cfae'],
  day: ['#a9d6f2', '#e2f2fb'],
  dusk: ['#4a4f8f', '#f2a07f'],
  night: ['#0d1634', '#1e2c58'],
};

function SkyView({ sky }: { sky: Sky }) {
  const [top, bottom] = SKIES[sky];
  return (
    <>
      <linearGradient id="md-room-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={top} />
        <stop offset="1" stopColor={bottom} />
      </linearGradient>
      <rect x="694" y="168" width="156" height="176" fill="url(#md-room-sky)" />
      {sky === 'day' && (
        <g fill="#ffffff">
          <circle cx="730" cy="214" r="12" />
          <circle cx="746" cy="206" r="15" />
          <circle cx="762" cy="215" r="10" />
          <rect x="726" y="214" width="40" height="12" rx="6" />
          <circle cx="808" cy="290" r="9" opacity="0.85" />
          <circle cx="820" cy="284" r="11" opacity="0.85" />
          <rect x="804" y="288" width="26" height="9" rx="4.5" opacity="0.85" />
        </g>
      )}
      {(sky === 'dawn' || sky === 'dusk') && <circle cx={sky === 'dawn' ? 740 : 812} cy="330" r="22" fill="#fde3a7" />}
      {sky === 'night' && (
        <>
          <mask id="md-room-moon">
            <rect x="694" y="168" width="156" height="176" fill="white" />
            <circle cx="818" cy="200" r="16" fill="black" />
          </mask>
          <circle cx="806" cy="208" r="17" fill="#f3efe2" mask="url(#md-room-moon)" />
          <g fill="#f3efe2">
            <circle cx="716" cy="190" r="1.8" />
            <circle cx="744" cy="230" r="1.4" />
            <circle cx="726" cy="290" r="1.6" />
            <circle cx="830" cy="262" r="1.3" />
            <circle cx="792" cy="306" r="1.5" />
            <circle cx="756" cy="182" r="1.2" />
          </g>
        </>
      )}
    </>
  );
}

function FloorPlant() {
  return (
    <g>
      <path d="M772 448 V404" stroke={c('tertiary')} strokeWidth="4" strokeLinecap="round" />
      <polygon points={shapeSvgPoints('flower', 772, 394, 30, 0.2)} fill={c('tertiary-container')} />
      <circle cx="772" cy="394" r="8" fill={c('tertiary')} />
      <path d="M748 440 L796 440 L790 470 L754 470 Z" fill={c('secondary-container')} />
      <rect x="744" y="434" width="56" height="10" rx="5" fill={c('secondary')} />
    </g>
  );
}

function Kitchen() {
  return (
    <g>
      {/* Shelf with jars */}
      <rect x="884" y="300" width="190" height="8" rx="4" fill={c('surface-container-highest')} />
      <rect x="900" y="270" width="26" height="30" rx="7" fill={c('surface-container-lowest')} stroke={c('outline-variant')} strokeWidth="2" />
      <polygon points={shapeSvgPoints('cookie6', 913, 268, 9)} fill={c('primary')} />
      <rect x="938" y="262" width="30" height="38" rx="8" fill={c('surface-container-lowest')} stroke={c('outline-variant')} strokeWidth="2" />
      <polygon points={shapeSvgPoints('cookie9', 953, 260, 10)} fill={c('tertiary')} />
      <rect x="1014" y="278" width="40" height="22" rx="6" fill={c('secondary-container')} />
      {/* Cabinets and counter */}
      <rect x="872" y="384" width="220" height="86" rx="4" fill={c('secondary-container')} />
      <path d="M982 390 V464" stroke={c('outline-variant')} strokeWidth="3" />
      <rect x="966" y="404" width="4" height="22" rx="2" fill={c('secondary')} />
      <rect x="994" y="404" width="4" height="22" rx="2" fill={c('secondary')} />
      <rect x="864" y="372" width="236" height="14" rx="5" fill={c('surface-container-highest')} stroke={c('outline')} strokeWidth="2" />
      {/* Kettle */}
      <path d="M914 346 L930 334" stroke={c('primary')} strokeWidth="6" strokeLinecap="round" />
      <rect x="882" y="330" width="44" height="42" rx="15" fill={c('primary')} />
      <path d="M890 334 Q904 314 918 334" fill="none" stroke={c('on-surface-variant')} strokeWidth="4" strokeLinecap="round" />
      <circle cx="904" cy="329" r="4" fill={c('on-surface-variant')} />
      {/* Mugs */}
      <rect x="958" y="350" width="22" height="22" rx="5" fill={c('tertiary')} />
      <path d="M980 355 Q989 361 980 367" fill="none" stroke={c('tertiary')} strokeWidth="4" />
      <rect x="1000" y="350" width="22" height="22" rx="5" fill={c('primary-container')} />
      <path d="M1022 355 Q1031 361 1022 367" fill="none" stroke={c('primary-container')} strokeWidth="4" />
      {/* Snack jar */}
      <rect x="1046" y="338" width="30" height="34" rx="9" fill={c('surface-container-lowest')} stroke={c('outline-variant')} strokeWidth="2" />
      <rect x="1044" y="332" width="34" height="8" rx="4" fill={c('secondary')} />
    </g>
  );
}

/** A clock on the wall that shows the actual time in Boston. */
function WallClock({ time }: { time: BostonTime }) {
  const hourAngle = ((time.hour % 12) + time.minute / 60) * 30;
  const minuteAngle = time.minute * 6;
  return (
    <g>
      <circle cx="1236" cy="300" r="28" fill={c('surface-container-lowest')} stroke={c('outline')} strokeWidth="4" />
      <g stroke={c('on-surface')} strokeLinecap="round">
        <path d="M1236 300 V284" strokeWidth="4" transform={`rotate(${hourAngle} 1236 300)`} />
        <path d="M1236 300 V278" strokeWidth="2.5" transform={`rotate(${minuteAngle} 1236 300)`} />
      </g>
      <circle cx="1236" cy="300" r="3" fill={c('primary')} />
    </g>
  );
}

/** The TV is an object, not UI, so its colors are fixed: dark in either theme. */
const TV = { bezel: '#1d2024', off: '#2b3136', stand: '#3a3f44', game: '#1b2a4a', coin: '#ffd76a' };
const TV_SCREEN = '1294,357 1330,347 1330,425 1294,418';

/**
 * Couch and TV. The couch is sized so that seated, his feet reach the floor;
 * the TV is turned three-quarters so the screen shows. While he's gaming the
 * screen runs a tiny platformer and the controller is in his hands (Person).
 */
function Lounge({ gaming }: { gaming: boolean }) {
  return (
    <g>
      {/* Couch, in profile, facing the TV */}
      <g fill={c('primary-container')}>
        <rect x="1086" y="380" width="32" height="90" rx="15" />
        <rect x="1086" y="448" width="168" height="22" rx="10" />
        <rect x="1230" y="420" width="24" height="50" rx="11" />
      </g>
      <rect x="1114" y="436" width="120" height="14" rx="7" fill={c('surface-container-lowest')} opacity="0.55" />
      <circle cx="1126" cy="424" r="12" fill={c('tertiary-container')} />
      {!gaming && <rect x="1232" y="412" width="22" height="9" rx="4.5" fill={c('on-surface-variant')} />}
      {/* TV on a low stand */}
      <rect x="1282" y="438" width="56" height="32" rx="6" fill={c('secondary-container')} />
      <rect x="1304" y="428" width="10" height="10" fill={TV.stand} />
      <polygon points="1290,352 1334,340 1334,430 1290,422" fill={TV.bezel} />
      <polygon points={TV_SCREEN} fill={TV.off} />
      {gaming && (
        <g>
          <clipPath id="md-room-tv-screen">
            <polygon points={TV_SCREEN} />
          </clipPath>
          <g clipPath="url(#md-room-tv-screen)">
            <rect x="1290" y="340" width="44" height="90" fill={TV.game} />
            <rect x="1290" y="404" width="44" height="26" fill={c('primary')} />
            <rect x="1316" y="388" width="14" height="5" rx="2" fill={c('primary-container')} />
            <circle className="md-game-coin" cx="1323" cy="378" r="3" fill={TV.coin} />
            <rect className="md-game-player" x="1302" y="396" width="7" height="8" rx="2" fill={c('tertiary-container')} />
          </g>
        </g>
      )}
    </g>
  );
}
function Bed() {
  return (
    <g>
      <rect x="1554" y="350" width="22" height="120" rx="8" fill={c('secondary')} />
      <rect x="1380" y="428" width="196" height="24" rx="6" fill={c('secondary-container')} />
      <rect x="1388" y="410" width="168" height="22" rx="8" fill={c('surface-container-lowest')} />
      <rect x="1506" y="394" width="46" height="20" rx="9" fill={c('surface-container-highest')} />
      <rect x="1388" y="404" width="112" height="30" rx="11" fill={c('primary-container')} />
      <rect x="1388" y="452" width="10" height="18" rx="3" fill={c('outline')} />
      <rect x="1562" y="452" width="10" height="18" rx="3" fill={c('outline')} />
    </g>
  );
}

/** Light sources, drawn above the night dimming so they glow through it. */
export function RoomLights() {
  return (
    <>
      <radialGradient id="md-room-lamp">
        <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.55" />
        <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="md-room-tv">
        <stop offset="0" stopColor="#a8d8ff" stopOpacity="0.5" />
        <stop offset="1" stopColor="#a8d8ff" stopOpacity="0" />
      </radialGradient>
      <ellipse className="md-room-light md-room-light-lamp" cx="598" cy="372" rx="150" ry="110" fill="url(#md-room-lamp)" />
      <ellipse className="md-room-light md-room-light-tv" cx="1262" cy="392" rx="150" ry="100" fill="url(#md-room-tv)" />
    </>
  );
}
