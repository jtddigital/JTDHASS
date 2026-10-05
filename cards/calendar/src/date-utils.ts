// Calendar math on "day numbers": whole days since 1970-01-01. A day number
// names a calendar date independent of any time zone, which keeps grid math
// free of DST surprises. Converting between instants and day numbers always
// goes through an explicit IANA time zone.

export const MS_PER_DAY = 86_400_000;

export interface Ymd {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
}

export const dayFromYmd = (year: number, month: number, day: number): number =>
  Math.round(Date.UTC(year, month - 1, day) / MS_PER_DAY);

export const ymdFromDay = (dayNum: number): Ymd => {
  const date = new Date(dayNum * MS_PER_DAY);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
};

/** 0 = Sunday … 6 = Saturday. */
export const weekdayOf = (dayNum: number): number => (((dayNum + 4) % 7) + 7) % 7;

/** Parse "YYYY-MM-DD" (extra characters after the date are ignored). */
export const dayFromIsoDate = (value: string): number => {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return dayFromYmd(year, month, day);
};

export const isoDateFromDay = (dayNum: number): string => {
  const { year, month, day } = ymdFromDay(dayNum);
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

/** A Date at UTC midnight of the day; format it with `timeZone: "UTC"`. */
export const utcDateForDay = (dayNum: number): Date => new Date(dayNum * MS_PER_DAY);

export const isDateOnly = (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value);

// ---------------------------------------------------------------------------
// Time zone conversion via Intl (no tz database bundled)
// ---------------------------------------------------------------------------

const partsFormatters = new Map<string, Intl.DateTimeFormat>();

const partsFormatter = (timeZone: string): Intl.DateTimeFormat => {
  let formatter = partsFormatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    partsFormatters.set(timeZone, formatter);
  }
  return formatter;
};

interface ZonedParts extends Ymd {
  hour: number;
  minute: number;
  second: number;
}

export const zonedParts = (ms: number, timeZone: string): ZonedParts => {
  const parts: Record<string, number> = {};
  for (const part of partsFormatter(timeZone).formatToParts(new Date(ms))) {
    if (part.type !== "literal") {
      parts[part.type] = Number(part.value);
    }
  }
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour === 24 ? 0 : parts.hour,
    minute: parts.minute,
    second: parts.second,
  };
};

/** Day number of the calendar date an instant falls on in `timeZone`. */
export const dayInZone = (ms: number, timeZone: string): number => {
  const { year, month, day } = zonedParts(ms, timeZone);
  return dayFromYmd(year, month, day);
};

/** Hour of day (0-23) of an instant in `timeZone`. */
export const hourInZone = (ms: number, timeZone: string): number =>
  zonedParts(ms, timeZone).hour;

/** Offset of `timeZone` from UTC at the given instant, in ms. */
export const zoneOffset = (ms: number, timeZone: string): number => {
  const p = zonedParts(ms, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - Math.floor(ms / 1000) * 1000;
};

/** The instant (ms) the given day starts in `timeZone`. */
export const startOfDayInZone = (dayNum: number, timeZone: string): number => {
  const utcMidnight = dayNum * MS_PER_DAY;
  const firstGuess = utcMidnight - zoneOffset(utcMidnight, timeZone);
  let result = utcMidnight - zoneOffset(firstGuess, timeZone);
  // Zones that switch DST at midnight skip 00:00; the day then starts later.
  while (dayInZone(result, timeZone) < dayNum) {
    result += 3_600_000;
  }
  return result;
};

export const browserTimeZone = (): string =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

// ---------------------------------------------------------------------------
// Grid helpers
// ---------------------------------------------------------------------------

/** First day of the week containing `dayNum`; firstWeekday 0 = Sunday. */
export const startOfWeek = (dayNum: number, firstWeekday: number): number =>
  dayNum - ((weekdayOf(dayNum) - firstWeekday + 7) % 7);

export const firstOfMonth = (year: number, month: number): number =>
  dayFromYmd(year, month, 1);

/** Normalizes month overflow, e.g. (2026, 13) -> (2027, 1). */
export const addMonths = (
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } => {
  const index = year * 12 + (month - 1) + delta;
  return { year: Math.floor(index / 12), month: (((index % 12) + 12) % 12) + 1 };
};

export interface GridRange {
  /** First visible day (always the configured first weekday). */
  start: number;
  /** Number of week rows. */
  weeks: number;
}

/** Week rows covering every day of the month. */
export const monthGrid = (
  year: number,
  month: number,
  firstWeekday: number,
): GridRange => {
  const first = firstOfMonth(year, month);
  const next = addMonths(year, month, 1);
  const last = firstOfMonth(next.year, next.month) - 1;
  const start = startOfWeek(first, firstWeekday);
  const end = startOfWeek(last, firstWeekday) + 6;
  return { start, weeks: (end - start + 1) / 7 };
};
