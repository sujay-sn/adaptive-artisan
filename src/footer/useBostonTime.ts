import { useState } from 'react';
import { useHydrated } from '@/lib/useHydrated';
import { useMinuteClock } from '@/lib/useMinuteClock';
import { bostonTime, parseTimeOverride, type BostonTime } from './routine';

/**
 * Boston time, updated on the minute. `?time=21:30` pins it, for previewing
 * other hours. Null until hydration: the prerendered page can't know when it
 * will be read.
 */
export function useBostonTime(): BostonTime | null {
  const hydrated = useHydrated();
  const now = useMinuteClock();
  const [override] = useState(() => (typeof window === 'undefined' ? null : parseTimeOverride(window.location.search)));
  if (!hydrated) return null;
  return override ?? bostonTime(now);
}