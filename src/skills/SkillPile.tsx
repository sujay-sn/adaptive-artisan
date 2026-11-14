import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { SKILL_CATEGORIES, skills, type SkillCategory } from '@/content/skills';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { shapeClipPath, type ShapeName } from '@/shape/shapes';
import { categoryLabel, relatedTo, usesOf } from './graph';
import { moveTo, push, scatterAbove, settle, step, STILL, type World } from './pile';
import { useSkillStore } from './store';

/**
 * Each category's shape and tonal pair. Shapes with shallow lobes only, so a
 * label never runs into a valley and onto the background. Container and
 * accent roles alternate, so neighbors in the pile stay distinct.
 */
const LOOKS: ReadonlyArray<{ shape: ShapeName; fill: string; ink: string }> = [
  { shape: 'cookie9', fill: 'primary-container', ink: 'on-primary-container' },
  { shape: 'softBurst', fill: 'tertiary-container', ink: 'on-tertiary-container' },
  { shape: 'cookie4', fill: 'secondary-container', ink: 'on-secondary-container' },
  { shape: 'sunny', fill: 'primary', ink: 'on-primary' },
  { shape: 'cookie6', fill: 'tertiary', ink: 'on-tertiary' },
  { shape: 'cookie12', fill: 'secondary', ink: 'on-secondary' },
  { shape: 'squircle', fill: 'surface-container-highest', ink: 'on-surface' },
];
/** What a selected skill morphs into. Every shape has the same point count, so the browser can tween between them. */
const SELECTED_SHAPE: ShapeName = 'verySunny';

const TICK = 1000 / 60;
/**
 * The loop stops this long after anything last woke it, settled or not: a
 * random pile can end in a standoff that nudges a shape by fractions of a
 * pixel forever, and nobody should pay for that in battery.
 */
const MAX_AWAKE_MS = 8000;
/** How much of the jar the pile should fill at rest; shapes scale to fit. */
const FILL = 0.52;
/** A selected skill grows this much, and is drawn above the rest. */
const SELECTED_GROWTH = 1.6;
const SELECTED_MINIMUM = 64;
/** Labels must sit inside the shape's shallowest valley. */
const SAFE = 0.74;
const LINE = 14;

interface PileSkill {
  id: string;
  name: string;
  lines: string[];
  category: SkillCategory;
  look: (typeof LOOKS)[number];
  /** Radius at scale 1. */
  base: number;
  /** Label size relative to the rest, below 1 for long single words. */
  text: number;
  uses: number;
}

/** Wraps a name onto up to three lines of about eleven characters, so it fits a round shape. */
function lines(name: string): string[] {
  const words = name.split(' ');
  const out: string[] = [];
  for (const word of words) {
    const last = out.at(-1);
    if (last !== undefined && last.length + 1 + word.length <= 11) out[out.length - 1] = `${last} ${word}`;
    else out.push(word);
  }
  // Past three lines, fold the rest onto the third and let the label shrink.
  return out.length > 3 ? [...out.slice(0, 2), out.slice(2).join(' ')] : out;
}

function prepare(only: SkillCategory | null): PileSkill[] {
  return skills.filter((skill) => only === null || skill.category === only).map((skill) => {
    const index = SKILL_CATEGORIES.findIndex((category) => category.id === skill.category);
    const split = lines(skill.name);
    const longest = Math.max(...split.map((line) => line.length));
    // Shrink the label rather than the shape past eleven characters on a line.
    const text = longest > 11 ? 11 / longest + 0.08 : 1;
    const width = longest * 6.4 * text;
    const base = Math.min(52, Math.max(27, width / 2 / SAFE + 3, (split.length * LINE) / 2 / SAFE));
    return { id: skill.id, name: skill.name, lines: split, category: skill.category, look: LOOKS[index % LOOKS.length]!, base, text, uses: usesOf(skill.id).length };
  });
}

interface SkillPileProps {
  /** Brings one category forward; the rest shrink back and fade. */
  category: SkillCategory | null;
  /**
   * Fills the jar with one category only. A phone-sized jar can't hold all of
   * them legibly, so there the section picks one at a time; giving each
   * category its own key makes every pick a fresh drop.
   */
  only?: SkillCategory | null;
}

/**
 * Every skill as a Material shape in a jar: they drop in when the jar comes
 * into view and pile up, and can be picked up, thrown, and tapped. Selecting
 * one opens it in the evidence panel; its shape grows and morphs, and the
 * skills it was used alongside stay bright. The physics lives in pile.ts; this
 * component draws it, and stops drawing when the pile settles or leaves the screen.
 */
export function SkillPile({ category, only = null }: SkillPileProps) {
  const pile = useMemo(() => prepare(only), [only]);
  const selected = useSkillStore((state) => state.selected);
  const select = useSkillStore((state) => state.select);
  const hover = useSkillStore((state) => state.hover);
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const jar = useRef<HTMLDivElement>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const world = useRef<World>({
    width: 0,
    height: 0,
    held: null,
    anchor: null,
    bodies: pile.map((skill) => ({ id: skill.id, x: 0, y: -200, px: 0, py: -200, r: skill.base, target: skill.base, angle: 0, inside: false })),
  });
  const scale = useRef(1);
  const dropped = useRef(false);
  const visible = useRef(false);
  const still = useRef(reduceMotion);
  useEffect(() => {
    still.current = reduceMotion;
  }, [reduceMotion]);
  const loop = useRef({ running: false, frame: 0, last: 0, debt: 0, quiet: 0, since: 0 });
  const [focusId, setFocusId] = useState(pile[0]?.id ?? '');

  const related = useMemo(() => (selected ? new Set(relatedTo(selected).map((node) => node.id)) : null), [selected]);
  const byId = useMemo(() => new Map(pile.map((skill) => [skill.id, skill])), [pile]);

  const paint = () => {
    for (const body of world.current.bodies) {
      const button = buttons.current.get(body.id);
      if (!button) continue;
      const size = Math.round(body.r * 2);
      if (button.dataset.size !== String(size)) {
        button.style.width = button.style.height = `${size}px`;
        button.dataset.size = String(size);
      }
      button.style.transform = `translate3d(${body.x - body.r}px, ${body.y - body.r}px, 0)`;
      (button.firstElementChild as HTMLElement | null)?.style.setProperty('rotate', `${body.angle}rad`);
    }
  };

  const run = (now: number) => {
    const state = loop.current;
    state.debt += Math.min(64, now - state.last);
    state.last = now;
    let motion = 0;
    while (state.debt >= TICK) {
      motion = Math.max(motion, step(world.current));
      state.debt -= TICK;
    }
    paint();
    state.quiet = motion < STILL && !world.current.held ? state.quiet + 1 : 0;
    const tooLong = !world.current.held && now - state.since > MAX_AWAKE_MS;
    if (state.quiet > 45 || tooLong || !visible.current) {
      state.running = false;
      return;
    }
    state.frame = requestAnimationFrame(run);
  };

  /** Starts drawing if anything might move. Under reduced motion, jumps straight to the settled pile instead. */
  const wake = () => {
    if (!dropped.current) return;
    if (still.current) {
      for (const body of world.current.bodies) body.r = body.target;
      settle(world.current);
      paint();
      return;
    }
    const state = loop.current;
    state.quiet = 0;
    state.since = performance.now();
    if (state.running || !visible.current) return;
    state.running = true;
    state.last = performance.now();
    state.debt = 0;
    state.frame = requestAnimationFrame(run);
  };

  // Sizes: what each skill should be now, from the jar's size, the category, and the selection.
  const targetFor = (skill: PileSkill) => {
    const size = skill.base * scale.current;
    // A short name would still be small at 1.6x, so a selected skill has a floor.
    if (skill.id === selected) return Math.max(size * SELECTED_GROWTH, SELECTED_MINIMUM * scale.current);
    if (category) return skill.category === category ? size * 1.15 : size * 0.7;
    return size;
  };
  const retarget = () => {
    for (const body of world.current.bodies) {
      const skill = byId.get(body.id);
      if (skill) body.target = targetFor(skill);
    }
  };

  // Fit the pile to the jar, and follow it as it resizes.
  useLayoutEffect(() => {
    const element = jar.current;
    if (!element) return;
    const fit = () => {
      world.current.width = element.clientWidth;
      world.current.height = element.clientHeight;
      const area = pile.reduce((sum, skill) => sum + Math.PI * skill.base * skill.base, 0);
      scale.current = Math.min(1, Math.max(0.6, Math.sqrt((FILL * world.current.width * world.current.height) / area)));
      element.style.setProperty('--pile-scale', String(scale.current));
      retarget();
      const anchor = world.current.anchor;
      if (anchor) {
        anchor.x = world.current.width / 2;
        anchor.y = anchor.body.target + 20;
      }
      wake();
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    return () => observer.disconnect();
    // Fit only touches refs; retarget reads the latest category and selection when it runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pile]);

  // Drop the pile once the jar is well into view; pause drawing whenever it isn't.
  useEffect(() => {
    const element = jar.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = Boolean(entry?.isIntersecting);
        if (!visible.current) return;
        if (!dropped.current && (entry?.intersectionRatio ?? 0) >= 0.3) {
          dropped.current = true;
          for (const body of world.current.bodies) body.r = body.target;
          scatterAbove(world.current);
        }
        wake();
      },
      { threshold: [0, 0.3] },
    );
    observer.observe(element);
    const state = loop.current;
    return () => {
      observer.disconnect();
      cancelAnimationFrame(state.frame);
      state.running = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A category or a selection changes sizes; the ones brought forward hop. A
  // selected skill rises to the top of the jar and hangs there at full size;
  // deselected, it drops back into the pile.
  useEffect(() => {
    retarget();
    const body = selected ? world.current.bodies.find((b) => b.id === selected) : undefined;
    world.current.anchor = body ? { body, x: world.current.width / 2, y: body.target + 20 } : null;
    if (category && !still.current) {
      for (const body of world.current.bodies) if (byId.get(body.id)?.category === category) push(body, (Math.random() - 0.5) * 2, -(5 + Math.random() * 4));
    }
    wake();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, selected]);

  // Dragging: the held shape follows the pointer and shoves the rest; letting go throws it.
  const gesture = useRef<{ id: string; startX: number; startY: number; lastX: number; lastY: number; dx: number; dy: number; dragged: boolean } | null>(null);
  const suppressClick = useRef(false);
  const local = (event: PointerEvent) => {
    const rect = jar.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const onPointerDown = (id: string) => (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || still.current) return;
    const body = world.current.bodies.find((b) => b.id === id);
    if (!body) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = { id, startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastY: event.clientY, dx: 0, dy: 0, dragged: false };
    world.current.held = body;
    wake();
  };
  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const g = gesture.current;
    const body = world.current.held;
    if (!g || !body) return;
    g.dx = event.clientX - g.lastX;
    g.dy = event.clientY - g.lastY;
    g.lastX = event.clientX;
    g.lastY = event.clientY;
    if (Math.hypot(event.clientX - g.startX, event.clientY - g.startY) > 5) g.dragged = true;
    const { x, y } = local(event);
    const { width, height } = world.current;
    moveTo(body, Math.min(width - body.r, Math.max(body.r, x)), Math.min(height - body.r, Math.max(body.r, y)), g.dx, g.dy);
    wake();
  };
  const onPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const g = gesture.current;
    const body = world.current.held;
    gesture.current = null;
    world.current.held = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (g?.dragged && body) {
      push(body, g.dx * 1.2, g.dy * 1.2);
      suppressClick.current = true;
    }
    wake();
  };
  const onClick = (id: string) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    select(selected !== id ? id : null);
  };

  // One tab stop for the whole pile; arrow keys move through it in category order.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = pile.findIndex((skill) => skill.id === focusId);
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? index + 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? index - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? pile.length - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    const target = pile[(next + pile.length) % pile.length];
    if (!target) return;
    setFocusId(target.id);
    buttons.current.get(target.id)?.focus();
  };

  return (
    <div ref={jar} className="md-pile" role="group" aria-label="Skills" onKeyDown={onKeyDown}>
      {pile.map((skill) => {
        const isSelected = skill.id === selected;
        const dim = (category !== null && skill.category !== category) || (related !== null && !isSelected && !related.has(skill.id));
        const evidence = skill.uses === 0 ? 'not tied to a role or project yet' : skill.uses === 1 ? 'used in 1 place' : `used in ${skill.uses} places`;
        return (
          <button
            key={skill.id}
            ref={(element) => {
              if (element) buttons.current.set(skill.id, element);
              else buttons.current.delete(skill.id);
            }}
            type="button"
            className="md-pile-skill"
            tabIndex={skill.id === focusId ? 0 : -1}
            aria-pressed={isSelected}
            aria-label={`${skill.name}, ${categoryLabel(skill.category)}, ${evidence}`}
            data-dim={dim ? '' : undefined}
            style={
              {
                // Selected takes the theme's strongest pair, so it stands out from every category.
                '--fill': `var(--md-sys-color-${isSelected ? 'primary' : skill.look.fill})`,
                '--ink': `var(--md-sys-color-${isSelected ? 'on-primary' : skill.look.ink})`,
                '--text': skill.text,
              } as CSSProperties
            }
            onPointerDown={onPointerDown(skill.id)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerEnter={(event) => event.pointerType === 'mouse' && hover(skill.id)}
            onPointerLeave={(event) => event.pointerType === 'mouse' && hover(null)}
            onFocus={() => {
              setFocusId(skill.id);
              hover(skill.id);
            }}
            onBlur={() => hover(null)}
            onClick={() => onClick(skill.id)}
          >
            <span className="md-pile-shape" style={{ clipPath: shapeClipPath(isSelected ? SELECTED_SHAPE : skill.look.shape) }} />
            <span className="md-pile-label" aria-hidden="true">
              {skill.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Loaded lazily by SkillsSection as the section nears the viewport.
export default SkillPile;
