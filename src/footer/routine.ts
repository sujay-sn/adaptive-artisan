/** Sujay's weekday, in Boston time. Each block runs from its hour until the next block's. */
export const ROUTINE = [
  { id: 'sleep', from: 0, caption: 'Asleep. Gym at 6.' },
  { id: 'gym', from: 6, caption: 'At the gym.' },
  { id: 'study', from: 9, caption: 'Coffee, coursework, TA work, and email.' },
  { id: 'projects', from: 12, caption: 'Working on a project.' },
  { id: 'tea', from: 17, caption: 'Tea and snacks.' },
  { id: 'gaming', from: 20, caption: 'Gaming.' },
] as const;

export type RoutineBlock = (typeof ROUTINE)[number];
export type RoutineId = RoutineBlock['id'];

export const TIME_ZONE = 'America/New_York';

const hourFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hourCycle: 'h23', timeZone: TIME_ZONE });
const clockFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TIME_ZONE });

/** The hour in Boston, 0 to 23. Daylight saving comes from the time zone database. */
export function bostonHour(date: Date): number {
  return Number(hourFormat.formatToParts(date).find((part) => part.type === 'hour')?.value ?? 0) % 24;
}

/** The block Sujay is in at `date`. */
export function routineAt(date: Date): RoutineBlock {
  const hour = bostonHour(date);
  let current: RoutineBlock = ROUTINE[0];
  for (const block of ROUTINE) if (hour >= block.from) current = block;
  return current;
}

/** "3:12 PM". */
export function bostonClock(date: Date): string {
  return clockFormat.format(date);
}
