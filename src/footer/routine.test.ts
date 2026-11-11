import { describe, expect, it } from 'vitest';
import { bostonClock, bostonHour, routineAt } from './routine';

describe('routine', () => {
  it('reads the hour in Boston, across daylight saving', () => {
    // November is EST (UTC-5); July is EDT (UTC-4).
    expect(bostonHour(new Date('2026-11-11T20:00:00Z'))).toBe(15);
    expect(bostonHour(new Date('2026-07-01T20:00:00Z'))).toBe(16);
  });

  it('switches blocks on the hour', () => {
    expect(routineAt(new Date('2026-11-11T10:59:00Z')).id).toBe('sleep'); // 5:59 am
    expect(routineAt(new Date('2026-11-11T11:00:00Z')).id).toBe('gym'); // 6:00 am
    expect(routineAt(new Date('2026-11-11T14:00:00Z')).id).toBe('study'); // 9:00 am
    expect(routineAt(new Date('2026-11-11T17:00:00Z')).id).toBe('projects'); // noon
    expect(routineAt(new Date('2026-11-11T22:00:00Z')).id).toBe('tea'); // 5:00 pm
    expect(routineAt(new Date('2026-11-12T01:00:00Z')).id).toBe('gaming'); // 8:00 pm
    expect(routineAt(new Date('2026-11-12T04:59:00Z')).id).toBe('gaming'); // 11:59 pm
    expect(routineAt(new Date('2026-11-12T05:00:00Z')).id).toBe('sleep'); // midnight
  });

  it('formats the Boston clock', () => {
    expect(bostonClock(new Date('2026-11-11T20:12:00Z'))).toBe('3:12 PM');
  });
});
