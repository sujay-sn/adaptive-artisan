/** A calendar month as "YYYY-MM", e.g. "2026-12". */
export type YearMonth = `${number}-${number}`;

function parse(month: YearMonth): { year: number; index: number } {
  const [year = 0, monthNumber = 1] = month.split('-').map(Number);
  return { year, index: monthNumber - 1 };
}

/** Months since year 0, counting the fraction of the current month already gone. */
function monthsAt(date: Date): number {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return date.getFullYear() * 12 + date.getMonth() + (date.getDate() - 1) / daysInMonth;
}

export interface DegreeProgress {
  /** 0 to 1: how far `now` is from the start of the first month to the end of the last. */
  fraction: number;
  complete: boolean;
  /** The final month, spelled out: "December 2026". */
  endLabel: string;
}

/** How far through a program `now` is. Programs run from the first day of `start` to the last day of `end`. */
export function degreeProgress(start: YearMonth, end: YearMonth, now: Date = new Date()): DegreeProgress {
  const from = parse(start);
  const to = parse(end);
  const first = from.year * 12 + from.index;
  const last = to.year * 12 + to.index + 1;
  const fraction = Math.min(1, Math.max(0, (monthsAt(now) - first) / (last - first)));
  const endLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(to.year, to.index, 1));
  return { fraction, complete: fraction >= 1, endLabel };
}
