import { useEffect, useImperativeHandle, useRef, type Ref } from 'react';
import { FIELD_ROLES, ShapeField, type Palette, type Rgb } from './shapeField';

export interface HeroFieldHandle {
  pointerMove: (clientX: number, clientY: number) => void;
  pointerLeave: () => void;
  tap: (clientX: number, clientY: number) => void;
}

interface HeroFieldProps {
  paused: boolean;
  /** False under reduced motion: the field is drawn still. */
  animate: boolean;
  ref?: Ref<HeroFieldHandle>;
}

/** Event sent by withThemeReveal (src/theme/reveal.ts), so a new theme rolls out from where it was chosen. */
const THEME_CHANGE = 'md:theme-change';
/** How long a reveal's origin stays the origin for the color change that follows it. */
const ORIGIN_WINDOW = 1500;

function parseRgb(value: string): Rgb {
  const channels = value.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
  return [channels[0] ?? 0, channels[1] ?? 0, channels[2] ?? 0];
}

/** Resolves each role through a probe element, so light-dark() and the active scheme are applied. */
function readPalette(probe: HTMLElement): Palette {
  const palette = {} as Record<(typeof FIELD_ROLES)[number], Rgb>;
  for (const role of FIELD_ROLES) {
    probe.style.color = `var(--md-sys-color-${role})`;
    palette[role] = parseRgb(getComputedStyle(probe).color);
  }
  return palette;
}

const expressiveMotion = () => document.documentElement.dataset.motionScheme !== 'standard';

/**
 * The hero's shape field (see ./shapeField.ts), drawn on a canvas. It reads the
 * theme's colors from the page and redraws whenever they change, and only asks
 * for frames while something is moving and the field is on screen.
 */
export function HeroField({ paused, animate, ref }: HeroFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const pausedRef = useRef(paused);
  const api = useRef<{ field: ShapeField; wake: () => void; canvas: HTMLCanvasElement } | null>(null);

  useImperativeHandle(ref, () => {
    const local = (clientX: number, clientY: number) => {
      const current = api.current;
      if (!current) return null;
      const box = current.canvas.getBoundingClientRect();
      return { current, x: clientX - box.left, y: clientY - box.top };
    };
    return {
      pointerMove: (clientX, clientY) => {
        const at = local(clientX, clientY);
        if (!at) return;
        at.current.field.pointerMove(at.x, at.y, performance.now());
        at.current.wake();
      },
      pointerLeave: () => {
        api.current?.field.pointerLeave();
        api.current?.wake();
      },
      tap: (clientX, clientY) => {
        const at = local(clientX, clientY);
        if (!at) return;
        at.current.field.tap(at.x, at.y, performance.now());
        at.current.wake();
      },
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const probe = probeRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !probe || !context) return;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    let dpr = Math.min(2, window.devicePixelRatio || 1);
    const field = new ShapeField(width, height, readPalette(probe), animate, performance.now());
    let frame = 0;
    let visible = true;
    let origin: { x: number; y: number; time: number } | null = null;

    const draw = () => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      field.draw(context, width, height);
    };
    const tick = (now: number) => {
      frame = 0;
      const moving = field.step(now, { ambient: animate && !pausedRef.current, expressive: expressiveMotion() });
      draw();
      if (moving && visible && document.visibilityState === 'visible') frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!frame && visible && document.visibilityState === 'visible') frame = requestAnimationFrame(tick);
    };
    api.current = { field, wake, canvas };

    const fit = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      field.resize(width, height);
      draw();
      wake();
    };
    fit();

    // A theme change, a light or dark switch, or the end of the bloom: read the
    // colors again. This runs as a microtask inside the change, so the field is
    // redrawn before a view transition captures the new page.
    const recolor = () => {
      const now = performance.now();
      let at: { x: number; y: number } | null = null;
      if (origin && now - origin.time < ORIGIN_WINDOW) {
        const box = canvas.getBoundingClientRect();
        at = { x: origin.x - box.left, y: origin.y - box.top };
      }
      if (field.setPalette(readPalette(probe), at, now)) {
        draw();
        wake();
      }
    };
    const mutations = new MutationObserver(recolor);
    mutations.observe(document.head, { childList: true, subtree: true, characterData: true, attributes: true });
    mutations.observe(document.documentElement, { attributes: true });
    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    scheme.addEventListener('change', recolor);
    const onThemeChange = (event: Event) => {
      const detail = (event as CustomEvent<{ x: number; y: number } | null>).detail;
      origin = detail ? { ...detail, time: performance.now() } : null;
    };
    window.addEventListener(THEME_CHANGE, onThemeChange);

    const resize = new ResizeObserver(fit);
    resize.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) wake();
    });
    intersection.observe(canvas);
    const onVisibility = () => wake();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      resize.disconnect();
      intersection.disconnect();
      scheme.removeEventListener('change', recolor);
      window.removeEventListener(THEME_CHANGE, onThemeChange);
      document.removeEventListener('visibilitychange', onVisibility);
      api.current = null;
    };
  }, [animate]);

  useEffect(() => {
    pausedRef.current = paused;
    api.current?.wake();
  }, [paused]);

  return (
    <div className="hero-field" aria-hidden="true">
      <canvas ref={canvasRef} />
      <span ref={probeRef} hidden />
    </div>
  );
}
