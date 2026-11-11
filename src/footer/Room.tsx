import { shapeSvgPoints } from '@/shape/shapes';
import type { BostonTime, Sky } from './routine';

// The room is 1600 x 620 units, floor at y = 470, with a deep strip of floor
// in front for the footer bar to sit on without covering anything. The wall itself isn't
// painted: it's the footer's own background, so it runs on seamlessly above
// the drawing when the footer is taller than the room.
const ROOM = { width: 1600, height: 620, floor: 470 } as const;

const c = (role: string) => `var(--md-sys-color-${role})`;

/** Everything in the room except the person. */
export function RoomArt({ time, sky }: { time: BostonTime; sky: Sky }) {
  return (
    <>
      <Floor />
      <Door />
      <GymCorner />
      <Desk />
      <Window sky={sky} />
      <FloorPlant />
      <Kitchen />
      <WallClock time={time} />
      <Lounge />
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
  { x: 488, w: 40, role: 'primary' },
  { x: 500, w: 34, role: 'tertiary' },
  { x: 500, w: 56, role: 'secondary' },
  { x: 512, w: 26, role: 'primary' },
  { x: 488, w: 38, role: 'on-surface-variant' },
];

function Desk() {
  return (
    <g>
      {/* Monitor */}
      <rect x="474" y="268" width="128" height="84" rx="10" fill={c('surface-container-lowest')} stroke={c('outline')} strokeWidth="3" />
      {CODE.map((line, i) => (
        <rect key={i} x={line.x} y={283 + i * 12} width={line.w} height="6" rx="3" fill={c(line.role)} />
      ))}
      <rect x="531" y="352" width="14" height="14" fill={c('outline-variant')} />
      <rect x="514" y="364" width="48" height="6" rx="3" fill={c('outline-variant')} />
      {/* Lamp */}
      <rect x="392" y="360" width="38" height="10" rx="5" fill={c('secondary')} />
      <path d="M411 362 L398 318 L430 296" fill="none" stroke={c('secondary')} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M414 300 Q428 274 454 288 L442 308 Z" fill={c('primary')} />
      {/* Desk, drawers, keyboard, mug */}
      <rect x="380" y="370" width="276" height="12" rx="5" fill={c('surface-container-highest')} stroke={c('outline')} strokeWidth="2" />
      <rect x="392" y="382" width="10" height="88" fill={c('outline-variant')} />
      <rect x="634" y="382" width="10" height="88" fill={c('outline-variant')} />
      <rect x="566" y="382" width="68" height="54" rx="4" fill={c('surface-container-highest')} />
      <rect x="590" y="404" width="20" height="4" rx="2" fill={c('outline')} />
      <rect x="496" y="364" width="66" height="6" rx="3" fill={c('outline')} />
      {/* Chair, in profile, facing the desk */}
      <g fill={c('secondary-container')}>
        <rect x="430" y="330" width="14" height="80" rx="7" />
        <rect x="430" y="398" width="72" height="14" rx="7" />
      </g>
      <rect x="462" y="412" width="8" height="40" fill={c('outline')} />
      <rect x="436" y="450" width="60" height="6" rx="3" fill={c('outline')} />
      <circle cx="440" cy="462" r="6" fill={c('on-surface-variant')} />
      <circle cx="492" cy="462" r="6" fill={c('on-surface-variant')} />
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
      <circle cx="1180" cy="300" r="28" fill={c('surface-container-lowest')} stroke={c('outline')} strokeWidth="4" />
      <g stroke={c('on-surface')} strokeLinecap="round">
        <path d="M1180 300 V284" strokeWidth="4" transform={`rotate(${hourAngle} 1180 300)`} />
        <path d="M1180 300 V278" strokeWidth="2.5" transform={`rotate(${minuteAngle} 1180 300)`} />
      </g>
      <circle cx="1180" cy="300" r="3" fill={c('primary')} />
    </g>
  );
}

function Lounge() {
  return (
    <g>
      {/* Couch, in profile, facing the TV */}
      <g fill={c('primary-container')}>
        <rect x="1086" y="362" width="34" height="92" rx="16" />
        <rect x="1086" y="418" width="164" height="36" rx="12" />
        <rect x="1228" y="398" width="26" height="56" rx="12" />
      </g>
      <rect x="1116" y="404" width="116" height="18" rx="9" fill={c('surface-container-lowest')} opacity="0.55" />
      <circle cx="1130" cy="394" r="14" fill={c('tertiary-container')} />
      <rect x="1096" y="454" width="8" height="16" rx="3" fill={c('outline')} />
      <rect x="1236" y="454" width="8" height="16" rx="3" fill={c('outline')} />
      {/* TV on a low stand, seen nearly side-on */}
      <rect x="1280" y="430" width="56" height="40" rx="6" fill={c('secondary-container')} />
      <rect x="1302" y="418" width="12" height="12" fill={c('outline')} />
      <path d="M1296 336 L1312 330 L1312 420 L1296 414 Z" fill={c('on-surface')} />
      {/* Controller resting on the arm */}
      <rect x="1230" y="390" width="22" height="10" rx="5" fill={c('on-surface-variant')} />
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
      <ellipse className="md-room-light md-room-light-lamp" cx="446" cy="330" rx="150" ry="120" fill="url(#md-room-lamp)" />
      <ellipse className="md-room-light md-room-light-tv" cx="1270" cy="378" rx="150" ry="100" fill="url(#md-room-tv)" />
    </>
  );
}
