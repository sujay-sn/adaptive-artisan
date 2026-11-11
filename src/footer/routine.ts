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

/**
 * Where each block happens along the room, in its 1600-unit-wide coordinates.
 * On a phone the room is cropped, and these are what the crop centers on.
 */
export const STATIONS: Record<RoutineId, number> = {
  gym: 265,
  study: 461,
  projects: 461,
  tea: 920,
  gaming: 1150,
  sleep: 1480,
};

export const TIME_ZONE = 'America/New_York';

/** How he settles once he reaches a station. Blocks without a pose drawn yet stand. */
export type Pose = 'stand' | 'desk' | 'couch';

export const POSES: Record<RoutineId, Pose> = {
  gym: 'stand',
  study: 'desk',
  projects: 'desk',
  tea: 'stand',
  gaming: 'couch',
  sleep: 'stand',
};

export interface BostonTime {
  hour: number;
  minute: number;
}

const partsFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hourCycle: 'h23', timeZone: TIME_ZONE });

/** The time in Boston. Daylight saving comes from the time zone database. */
export function bostonTime(date: Date): BostonTime {
  const parts = partsFormat.formatToParts(date);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return { hour: value('hour') % 24, minute: value('minute') };
}

/** The block Sujay is in at `time`. */
export function routineAt(time: BostonTime): RoutineBlock {
  let current: RoutineBlock = ROUTINE[0];
  for (const block of ROUTINE) if (time.hour >= block.from) current = block;
  return current;
}

export type Sky = 'dawn' | 'day' | 'dusk' | 'night';

/** What the window shows. Fixed hours that roughly average Boston through the year. */
export function skyAt(time: BostonTime): Sky {
  const { hour } = time;
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 16) return 'day';
  if (hour >= 16 && hour < 19) return 'dusk';
  return 'night';
}

/** "3:12 PM". */
export function clockLabel({ hour, minute }: BostonTime): string {
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
}

/** Reads `?time=21:30`, for previewing other hours. Returns null when absent or malformed. */
export function parseTimeOverride(search: string): BostonTime | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(new URLSearchParams(search).get('time') ?? '');
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  return hour < 24 && minute < 60 ? { hour, minute } : null;
}
