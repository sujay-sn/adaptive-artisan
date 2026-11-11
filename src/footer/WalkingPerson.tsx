import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { Person } from './Person';
import type { Pose } from './routine';

/** Where he comes in: the middle of the door. */
const DOOR_X = 96;
/** His feet, just in front of the baseboard. */
const FLOOR_Y = 478;
/** Units per second, matched to the stride (md-walk-* in index.css) so his feet don't skate. */
const SPEED = 145;
const ROOM_WIDTH = 1600;
const FADE_IN_MS = 350;
/** Getting up from a pose before walking off; matches the pose transition in index.css. */
const STAND_UP_MS = 450;

const at = (x: number) => `translate(${x}px, ${FLOOR_Y}px)`;

interface WalkingPersonProps {
  /** Where the current block happens, in room units. */
  station: number;
  /** How he settles there once he arrives. */
  pose: Pose;
  /** True once the footer has come into view; he enters then. */
  started: boolean;
  /** Reduced motion: no walking, he's simply at his station. */
  still: boolean;
  /** The site-wide pause: holds a walk mid-step. */
  paused: boolean;
  /** The room's crop on phones, whose --cam follows him. */
  room: RefObject<HTMLElement | null>;
}

/**
 * Sujay in the room. When the footer arrives he walks in from the door to
 * wherever he should be at this hour; if the hour changes while the page is
 * open, he walks on to the next spot.
 */
export function WalkingPerson({ station, pose, started, still, paused, room }: WalkingPersonProps) {
  const figure = useRef<SVGGElement>(null);
  /** Where he is now, or null before he has come in. */
  const x = useRef<number | null>(null);
  const running = useRef<Animation[]>([]);
  const pausedRef = useRef(paused);
  const [walking, setWalking] = useState(false);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [inRoom, setInRoom] = useState(false);
  /** The pose he has settled into, or null while he's on his feet. */
  const [settled, setSettled] = useState<Pose | null>(null);
  const settledRef = useRef<Pose | null>(null);
  const settle = (next: Pose | null) => {
    settledRef.current = next;
    setSettled(next);
  };
  const standTimer = useRef<number | undefined>(undefined);

  const setCamera = (to: number) => room.current?.style.setProperty('--cam', String(to / ROOM_WIDTH));

  const place = (to: number) => {
    if (figure.current) figure.current.style.transform = at(to);
    setCamera(to);
    x.current = to;
  };

  const stop = () => {
    const element = figure.current;
    if (element && running.current.length) {
      // Keep wherever he got to, so a new walk starts from there.
      x.current = new DOMMatrixReadOnly(getComputedStyle(element).transform).m41;
    }
    running.current.forEach((animation) => animation.cancel());
    running.current = [];
    window.clearTimeout(standTimer.current);
  };

  // Before he comes in, wait at the door, and point the phone's crop at it.
  useLayoutEffect(() => {
    if (x.current !== null || !figure.current) return;
    figure.current.style.transform = at(DOOR_X);
    setCamera(DOOR_X);
    // Runs once, before the first paint.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const element = figure.current;
    if (!element) return;

    // Reduced motion, or paused before he came in: no walk, he's just there.
    if (still || (pausedRef.current && x.current === null && started)) {
      stop();
      place(station);
      setInRoom(true);
      setWalking(false);
      settle(pose);
      return;
    }
    if (!started) return;

    const entering = x.current === null;
    const from = x.current ?? DOOR_X;
    if (!entering && Math.abs(from - station) < 1) {
      settle(pose);
      return;
    }

    // Seated or otherwise posed: get up first, then set off.
    const standUp = settledRef.current && settledRef.current !== 'stand' ? STAND_UP_MS : 0;
    settle(null);
    setFacing(station >= from ? 1 : -1);
    setInRoom(true);
    if (standUp) standTimer.current = window.setTimeout(() => setWalking(true), standUp);
    else setWalking(true);

    const timing = {
      duration: (Math.abs(station - from) / SPEED) * 1000,
      delay: entering ? FADE_IN_MS : standUp,
      easing: 'linear',
      fill: 'both' as const,
    };
    const walk = element.animate([{ transform: at(from) }, { transform: at(station) }], timing);
    const animations = [walk];
    if (entering) animations.push(element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FADE_IN_MS, fill: 'both' }));
    const camera = room.current?.animate([{ '--cam': from / ROOM_WIDTH }, { '--cam': station / ROOM_WIDTH }], timing);
    if (camera) animations.push(camera);
    running.current = animations;
    if (pausedRef.current) animations.forEach((animation) => animation.pause());

    walk.finished
      .then(() => {
        place(station);
        running.current.forEach((animation) => animation.cancel());
        running.current = [];
        setWalking(false);
        settle(pose);
      })
      .catch(() => {
        // Cancelled: a newer walk, reduced motion, or unmounting took over.
      });

    return stop;
    // place and stop only touch refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station, pose, started, still]);

  useEffect(() => {
    pausedRef.current = paused;
    running.current.forEach((animation) => (paused ? animation.pause() : animation.play()));
  }, [paused]);

  return (
    <g
      ref={figure}
      className="md-person"
      opacity={inRoom ? 1 : 0}
      data-walking={walking ? '' : undefined}
      data-pose={settled && settled !== 'stand' ? settled : undefined}
    >
      <g transform={facing === -1 ? 'scale(-1 1)' : undefined}>
        <Person />
      </g>
    </g>
  );
}
