import { useState } from 'react';
import { useMinuteClock } from '@/lib/useMinuteClock';
import { bostonTime, parseTimeOverride, type BostonTime } from './routine';

/** Boston time, updated on the minute. `?time=21:30` pins it, for previewing other hours. */
export function useBostonTime(): BostonTime {
  const now = useMinuteClock();
  const [override] = useState(() => (typeof window === 'undefined' ? null : parseTimeOverride(window.location.search)));
  return override ?? bostonTime(now);
}
