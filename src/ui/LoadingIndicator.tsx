import { useEffect, useRef } from 'react';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { shapeClipPath, type ShapeName } from '@/shape/shapes';

const SEQUENCE: ShapeName[] = ['softBurst', 'cookie9', 'flower', 'sunny', 'clover4'];

/**
 * MD3 Expressive loading indicator: a shape that morphs through the shape
 * library as it turns. Decorative; pair it with text saying what is loading.
 * With reduced motion it holds still.
 */
export function LoadingIndicator({ size = 24, className = '' }: { size?: number; className?: string }) {
  const element = useRef<HTMLSpanElement>(null);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    const target = element.current;
    if (!target || reducedMotion) return;
    const morph = target.animate(
      [...SEQUENCE, SEQUENCE[0]].map((name) => ({ clipPath: shapeClipPath(name ?? 'circle') })),
      { duration: 2800, iterations: Infinity, easing: 'ease-in-out' },
    );
    const spin = target.animate([{ rotate: '0turn' }, { rotate: '1turn' }], { duration: 1600, iterations: Infinity });
    return () => {
      morph.cancel();
      spin.cancel();
    };
  }, [reducedMotion]);

  return (
    <span
      ref={element}
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{ width: size, height: size, clipPath: shapeClipPath('softBurst') }}
    />
  );
}