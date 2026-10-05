import { utcDateForDay } from "./date-utils";
import type { CalEvent, CalendarEntityConfig, HassLocale } from "./types";

export const normalizeEntities = (
  entities: Array<string | CalendarEntityConfig> | undefined,
): CalendarEntityConfig[] =>
  (entities ?? [])
    .map((item) => (typeof item === "string" ? { entity: item } : item))
    .filter((item): item is CalendarEntityConfig => Boolean(item?.entity));

// Named colors offered by Home Assistant's color picker (ui_color selector).
const THEME_COLORS = new Set([
  "primary",
  "accent",
  "red",
  "pink",
  "purple",
  "deep-purple",
  "indigo",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange",
  "brown",
  "light-grey",
  "grey",
  "dark-grey",
  "blue-grey",
  "black",
  "white",
]);

export const computeCssColor = (color: string): string =>
  THEME_COLORS.has(color) ? `var(--${color}-color)` : color;

// Home Assistant's categorical palette (--color-1 …); hex values are fallbacks.
const PALETTE = [
  "#4269d0",
  "#f4bd4a",
  "#ff725c",
  "#6cc5b0",
  "#a463f2",
  "#ff8ab7",
  "#9c6b4e",
  "#97bbf5",
  "#01ab63",
  "#094bad",
  "#c99000",
  "#d84f3e",
];

export const paletteColor = (index: number): string =>
  `var(--color-${(index % 54) + 1}, ${PALETTE[index % PALETTE.length]})`;

// ---------------------------------------------------------------------------
// Date/time formatting following the user's Home Assistant profile
// ---------------------------------------------------------------------------

const safeLocale = (language: string | undefined): string => {
  try {
    return Intl.DateTimeFormat.supportedLocalesOf(language ?? "en").length
      ? (language as string)
      : "en";
  } catch (_err) {
    return "en";
  }
};

const resolveHour12 = (locale: HassLocale): boolean | undefined => {
  switch (locale.time_format) {
    case "12":
      return true;
    case "24":
      return false;
    case "system": {
      const cycle = new Intl.DateTimeFormat(undefined, { hour: "numeric" }).resolvedOptions()
        .hourCycle;
      return cycle === "h11" || cycle === "h12";
    }
    default:
      return undefined;
  }
};

export class Formatter {
  readonly language: string;

  private readonly _hour12?: boolean;

  private readonly _cache = new Map<string, Intl.DateTimeFormat>();

  constructor(
    locale: HassLocale,
    readonly timeZone: string,
  ) {
    this.language = safeLocale(locale.language);
    this._hour12 = resolveHour12(locale);
  }

  private _fmt(key: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
    let formatter = this._cache.get(key);
    if (!formatter) {
      formatter = new Intl.DateTimeFormat(this.language, options);
      this._cache.set(key, formatter);
    }
    return formatter;
  }

  /** Calendar dates are formatted in UTC (see utcDateForDay). */
  private _date(key: string, options: Intl.DateTimeFormatOptions) {
    return this._fmt(`d:${key}`, { ...options, timeZone: "UTC" });
  }

  private _time(key: string, options: Intl.DateTimeFormatOptions) {
    return this._fmt(`t:${key}`, {
      ...options,
      hour12: this._hour12,
      timeZone: this.timeZone,
    });
  }

  monthYear(day: number): string {
    return this._date("my", { month: "long", year: "numeric" }).format(utcDateForDay(day));
  }

  monthShort(day: number): string {
    return this._date("ms", { month: "short" }).format(utcDateForDay(day));
  }

  weekday(day: number, width: "short" | "narrow" | "long"): string {
    return this._date(`wd${width}`, { weekday: width }).format(utcDateForDay(day));
  }

  dayRange(startDay: number, endDay: number): string {
    const formatter = this._date("range", { month: "short", day: "numeric", year: "numeric" });
    return formatter.formatRange(utcDateForDay(startDay), utcDateForDay(endDay));
  }

  dayLong(day: number): string {
    return this._date("long", { weekday: "long", month: "long", day: "numeric" }).format(
      utcDateForDay(day),
    );
  }

  time(ms: number): string {
    return this._time("time", { hour: "numeric", minute: "2-digit" }).format(ms);
  }

  /** Short start time for month cells, e.g. "9a" / "9:30p" in English 12h. */
  compactTime(ms: number): string {
    const formatter = this._time("time", { hour: "numeric", minute: "2-digit" });
    if (!this.language.startsWith("en")) return formatter.format(ms);
    const parts = formatter.formatToParts(ms);
    const get = (type: string) => parts.find((p) => p.type === type)?.value;
    const period = get("dayPeriod");
    if (!period) return formatter.format(ms);
    const minute = get("minute");
    return `${get("hour")}${minute && minute !== "00" ? `:${minute}` : ""}${period[0].toLowerCase()}`;
  }

  eventRange(event: CalEvent, allDayLabel: string): string {
    if (event.allDay) {
      if (event.startDay === event.endDay) return allDayLabel;
      return this._date("adr", { month: "short", day: "numeric" }).formatRange(
        utcDateForDay(event.startDay),
        utcDateForDay(event.endDay),
      );
    }
    if (event.startDay === event.endDay) {
      return this._time("tr", { hour: "numeric", minute: "2-digit" }).formatRange(
        event.start,
        Math.max(event.start, event.end),
      );
    }
    return this._time("dtr", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).formatRange(event.start, event.end);
  }
}

export const formatTemperature = (value: number | undefined): string =>
  value === undefined ? "–" : `${Math.round(value)}°`;
