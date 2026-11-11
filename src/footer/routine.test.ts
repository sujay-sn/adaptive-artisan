import { describe, expect, it } from 'vitest';
import { bostonTime, clockLabel, parseTimeOverride, routineAt, skyAt } from './routine';

const at = (iso: string) => bostonTime(new Date(iso));

describe('routine', () => {
  it('reads the time in Boston, across daylight saving', () => {
    // November is EST (UTC-5); July is EDT (UTC-4).
    expect(at('2026-11-11T20:12:00Z')).toEqual({ hour: 15, minute: 12 });
    expect(at('2026-07-01T20:12:00Z')).toEqual({ hour: 16, minute: 12 });
    expect(at('2026-11-12T05:00:00Z')).toEqual({ hour: 0, minute: 0 });
  });

  it('switches blocks on the hour', () => {
    const block = (hour: number, minute = 0) => routineAt({ hour, minute }).id;
    expect(block(5, 59)).toBe('sleep');
    expect(block(6)).toBe('gym');
    expect(block(9)).toBe('study');
    expect(block(12)).toBe('projects');
    expect(block(17)).toBe('tea');
    expect(block(20)).toBe('gaming');
    expect(block(23, 59)).toBe('gaming');
    expect(block(0)).toBe('sleep');
  });

  it('picks the sky', () => {
    expect(skyAt({ hour: 6, minute: 0 })).toBe('dawn');
    expect(skyAt({ hour: 12, minute: 0 })).toBe('day');
    expect(skyAt({ hour: 17, minute: 30 })).toBe('dusk');
    expect(skyAt({ hour: 2, minute: 0 })).toBe('night');
  });

  it('formats the clock', () => {
    expect(clockLabel({ hour: 15, minute: 12 })).toBe('3:12 PM');
    expect(clockLabel({ hour: 0, minute: 5 })).toBe('12:05 AM');
    expect(clockLabel({ hour: 12, minute: 0 })).toBe('12:00 PM');
  });

  it('reads a preview time from the query string', () => {
    expect(parseTimeOverride('?time=21:30')).toEqual({ hour: 21, minute: 30 });
    expect(parseTimeOverride('?time=7:05')).toEqual({ hour: 7, minute: 5 });
    expect(parseTimeOverride('?time=25:00')).toBeNull();
    expect(parseTimeOverride('')).toBeNull();
  });
});
