import { useEffect, useRef, type CSSProperties } from 'react';
import { shapeClipPath, type ShapeName } from '@/shape/shapes';

interface ShapeLayer {
  /** Shapes this layer morphs through, in order, before looping. */
  sequence: [ShapeName, ...ShapeName[]];
  color: string;
  left: string;
  top: string;
  size: string;
  /** Parallax depth: higher moves further with the cursor. */
  depth: number;
  /** Milliseconds for one full morph loop. */
  duration: number;
  spin: string;
  reverse?: boolean;
}

const LAYERS: ShapeLayer[] = [
  { sequence: ['cookie9', 'flower', 'sunny'], color: 'bg-primary-container', left: '28%', top: '8%', size: '64%', depth: 1, duration: 21000, spin: '120s' },
  { sequence: ['sunny', 'clover4', 'cookie6'], color: 'bg-tertiary-container', left: '2%', top: '50%', size: '42%', depth: 1.8, duration: 17000, spin: '90s', reverse: true },
  { sequence: ['flower', 'softBurst', 'cookie12'], color: 'bg-secondary-container', left: '62%', top: '64%', size: '30%', depth: 2.6, duration: 15000, spin: '70s' },
  { sequence: ['circle', 'squircle', 'cookie4'], color: 'bg-primary', left: '12%', top: '16%', size: '14%', depth: 3.4, duration: 13000, spin: '60s', reverse: true },
];

interface HeroShapesProps {
  paused: boolean;
  /** False under reduced motion: the shapes stay still. */
  animate: boolean;
}

/**
 * The hero's shape cluster: four shapes from the MD3 shape library in theme
 * colors, slowly morphing and turning, each at its own depth for parallax.
 * Every shape shares one point count, so the morphs interpolate cleanly.
 */
export function HeroShapes({ paused, animate }: HeroShapesProps) {
  const shapes = useRef<Array<HTMLDivElement | null>>([]);
  const animations = useRef<Animation[]>([]);

  useEffect(() => {
    if (!animate) return;
    const running = LAYERS.flatMap((layer, index) => {
      const element = shapes.current[index];
      if (!element) return [];
      const frames = [...layer.sequence, layer.sequence[0]].map((name) => ({ clipPath: shapeClipPath(name) }));
      return [element.animate(frames, { duration: layer.duration, iterations: Infinity, easing: 'ease-in-out' })];
    });
    animations.current = running;
    return () => {
      for (const animation of running) animation.cancel();
      animations.current = [];
    };
  }, [animate]);

  useEffect(() => {
    for (const animation of animations.current) {
      if (paused) animation.pause();
      else animation.play();
    }
  }, [paused, animate]);

  return (
    <div className="hero-cluster" data-paused={paused || !animate ? '' : undefined} aria-hidden="true">
      {LAYERS.map((layer, index) => (
        <div
          key={layer.color}
          ref={(element) => {
            shapes.current[index] = element;
          }}
          className={`hero-shape ${layer.color}`}
          style={
            {
              left: layer.left,
              top: layer.top,
              width: layer.size,
              clipPath: shapeClipPath(layer.sequence[0]),
              '--depth': layer.depth,
              '--i': index,
              '--spin': layer.spin,
              '--spin-direction': layer.reverse ? 'reverse' : 'normal',
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}