import type { ReactiveController, ReactiveControllerHost } from "lit";
import {
  dayFromIsoDate,
  dayInZone,
  isDateOnly,
  startOfDayInZone,
} from "./date-utils";
import type {
  CalEvent,
  CalendarDateValue,
  CalendarEventApiData,
  HomeAssistant,
  UnsubscribeFunc,
} from "./types";

const dateValue = (value: CalendarDateValue | undefined): string | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if ("dateTime" in value) return value.dateTime;
  if ("date" in value) return value.date;
  return undefined;
};

/** Convert an event from the REST API or websocket subscription. */
export const normalizeEvent = (
  raw: CalendarEventApiData,
  calendar: string,
  timeZone: string,
  index: number,
): CalEvent | null => {
  const startStr = dateValue(raw.start);
  const endStr = dateValue(raw.end);
  if (!startStr) return null;

  const allDay = raw.all_day ?? isDateOnly(startStr);
  const base = {
    id: `${calendar}|${raw.uid ?? ""}|${raw.recurrence_id ?? ""}|${startStr}|${index}`,
    calendar,
    summary: raw.summary || "",
    description: raw.description || undefined,
    location: raw.location || undefined,
    tentative: raw.status === "tentative" || raw.status === "TENTATIVE",
  };

  if (allDay) {
    const startDay = dayFromIsoDate(startStr);
    let endExclusive = endStr ? dayFromIsoDate(endStr) : startDay + 1;
    if (!(endExclusive > startDay)) endExclusive = startDay + 1;
    return {
      ...base,
      allDay: true,
      startDay,
      endDay: endExclusive - 1,
      start: startOfDayInZone(startDay, timeZone),
      end: startOfDayInZone(endExclusive, timeZone),
    };
  }

  const start = Date.parse(startStr);
  if (Number.isNaN(start)) return null;
  let end = endStr ? Date.parse(endStr) : start;
  if (Number.isNaN(end) || end < start) end = start;
  const startDay = dayInZone(start, timeZone);
  // An event ending exactly at midnight does not spill into the next day.
  const endDay = end > start ? dayInZone(end - 1, timeZone) : startDay;
  return { ...base, allDay: false, start, end, startDay, endDay };
};

/** Display order inside a day: all-day/multi-day first, then by start time. */
export const compareEvents = (a: CalEvent, b: CalEvent): number => {
  const aSpan = a.allDay || a.endDay > a.startDay;
  const bSpan = b.allDay || b.endDay > b.startDay;
  if (aSpan !== bSpan) return aSpan ? -1 : 1;
  return a.start - b.start || b.end - a.end || a.summary.localeCompare(b.summary);
};

export const eventsForDay = (events: CalEvent[], day: number): CalEvent[] =>
  events.filter((ev) => ev.startDay <= day && ev.endDay >= day).sort(compareEvents);

// ---------------------------------------------------------------------------
// Week layout: assigns every event segment of a week row to a lane (row).
// ---------------------------------------------------------------------------

export interface EventSegment {
  event: CalEvent;
  /** Column 0-6 inside the week row. */
  col: number;
  span: number;
  lane: number;
  continuesBefore: boolean;
  continuesAfter: boolean;
}

export interface WeekLayout {
  segments: EventSegment[];
  /** Hidden event count per column ("+N more"). */
  more: number[];
  /** Lanes used, including the "+N more" lane. */
  lanes: number;
}

const isSpanning = (seg: EventSegment) => seg.event.allDay || seg.span > 1;

const compareSegments = (a: EventSegment, b: EventSegment): number =>
  a.col - b.col ||
  Number(isSpanning(b)) - Number(isSpanning(a)) ||
  b.span - a.span ||
  compareEvents(a.event, b.event);

export const layoutWeek = (
  events: CalEvent[],
  weekStart: number,
  maxLanes: number,
): WeekLayout => {
  const weekEnd = weekStart + 6;
  const segments: EventSegment[] = [];
  for (const event of events) {
    if (event.endDay < weekStart || event.startDay > weekEnd) continue;
    const first = Math.max(event.startDay, weekStart);
    const last = Math.min(event.endDay, weekEnd);
    segments.push({
      event,
      col: first - weekStart,
      span: last - first + 1,
      lane: -1,
      continuesBefore: event.startDay < weekStart,
      continuesAfter: event.endDay > weekEnd,
    });
  }
  segments.sort(compareSegments);

  const occupied: boolean[][] = [];
  for (const seg of segments) {
    let lane = 0;
    for (;;) {
      const row = (occupied[lane] ??= new Array(7).fill(false));
      let free = true;
      for (let c = seg.col; c < seg.col + seg.span; c++) {
        if (row[c]) {
          free = false;
          break;
        }
      }
      if (free) {
        for (let c = seg.col; c < seg.col + seg.span; c++) row[c] = true;
        seg.lane = lane;
        break;
      }
      lane++;
    }
  }

  const more = new Array(7).fill(0);
  const used = segments.reduce((max, seg) => Math.max(max, seg.lane + 1), 0);
  if (!(maxLanes > 0) || used <= maxLanes) {
    return { segments, more, lanes: used };
  }

  // Columns where something does not fit get a "+N more" in the last lane;
  // whatever sat in that lane over those columns is hidden as well.
  const overflowCols = new Set<number>();
  for (const seg of segments) {
    if (seg.lane >= maxLanes) {
      for (let c = seg.col; c < seg.col + seg.span; c++) overflowCols.add(c);
    }
  }
  const visible: EventSegment[] = [];
  for (const seg of segments) {
    const cols = Array.from({ length: seg.span }, (_, i) => seg.col + i);
    const hidden =
      seg.lane >= maxLanes ||
      (seg.lane === maxLanes - 1 && cols.some((c) => overflowCols.has(c)));
    if (hidden) {
      for (const c of cols) more[c]++;
    } else {
      visible.push(seg);
    }
  }
  return { segments: visible, more, lanes: maxLanes };
};

// ---------------------------------------------------------------------------
// Live event subscription
// ---------------------------------------------------------------------------

interface EventsSubscription {
  events: CalendarEventApiData[] | null;
}

const POLL_INTERVAL = 5 * 60 * 1000;

/**
 * Keeps events for a set of calendars and a time range up to date using the
 * `calendar/event/subscribe` websocket command. Falls back to polling the REST
 * API on Home Assistant versions without the subscription.
 */
export class CalendarEventsController implements ReactiveController {
  public events = new Map<string, CalEvent[]>();

  public errors = new Set<string>();

  public loaded = false;

  private _key = "";

  private _generation = 0;

  private _unsubs: Array<Promise<UnsubscribeFunc | undefined>> = [];

  private _pollTimer?: ReturnType<typeof setInterval>;

  private _received = new Set<string>();

  private _hass?: HomeAssistant;

  private _params?: { entities: string[]; start: number; end: number; timeZone: string };

  constructor(private readonly _host: ReactiveControllerHost) {
    _host.addController(this);
  }

  hostConnected(): void {
    // Resubscribe after the card is re-attached to the DOM.
    this._key = "";
    if (this._hass && this._params) {
      const { entities, start, end, timeZone } = this._params;
      this.update(this._hass, entities, start, end, timeZone);
    }
  }

  hostDisconnected(): void {
    this._teardown();
  }

  /** Call on every render; only acts when the inputs change. */
  public update(
    hass: HomeAssistant,
    entities: string[],
    start: number,
    end: number,
    timeZone: string,
  ): void {
    this._hass = hass;
    this._params = { entities, start, end, timeZone };
    const key = JSON.stringify([entities, start, end, timeZone]);
    if (key === this._key) return;
    this._key = key;
    this._teardown();
    const generation = ++this._generation;
    this.loaded = false;
    this.errors = new Set();
    // Keep events of the same calendars while the new range loads, so
    // navigating does not flash an empty grid.
    for (const entity of [...this.events.keys()]) {
      if (!entities.includes(entity)) this.events.delete(entity);
    }

    this._received = new Set();
    if (entities.length === 0) this.loaded = true;

    const startIso = new Date(start).toISOString();
    const endIso = new Date(end).toISOString();

    entities.forEach((entity) => {
      const apply = (raw: CalendarEventApiData[] | null) =>
        this._apply(generation, entity, raw);

      const subscription = hass.connection
        .subscribeMessage<EventsSubscription>((msg) => apply(msg.events), {
          type: "calendar/event/subscribe",
          entity_id: entity,
          start: startIso,
          end: endIso,
        })
        .catch((err: { code?: string }) => {
          if (generation !== this._generation) return undefined;
          if (err?.code === "unknown_command") {
            this._startPolling(hass, entities, startIso, endIso);
          } else {
            apply(null);
          }
          return undefined;
        });
      this._unsubs.push(subscription);
    });
  }

  public allEvents(hidden: Set<string>): CalEvent[] {
    const result: CalEvent[] = [];
    for (const [entity, events] of this.events) {
      if (!hidden.has(entity)) result.push(...events);
    }
    return result;
  }

  private _startPolling(
    hass: HomeAssistant,
    entities: string[],
    startIso: string,
    endIso: string,
  ): void {
    // Every subscription fails the same way; one poller serves them all.
    if (this._pollTimer) return;
    const generation = this._generation;
    const params = `?start=${encodeURIComponent(startIso)}&end=${encodeURIComponent(endIso)}`;
    const fetchAll = () => {
      entities.forEach((entity) => {
        hass
          .callApi<CalendarEventApiData[]>("GET", `calendars/${entity}${params}`)
          .then(
            (events) => this._apply(generation, entity, events),
            () => this._apply(generation, entity, null),
          );
      });
    };
    fetchAll();
    this._pollTimer = setInterval(fetchAll, POLL_INTERVAL);
  }

  private _apply(
    generation: number,
    entity: string,
    raw: CalendarEventApiData[] | null,
  ): void {
    if (generation !== this._generation || !this._params) return;
    const { timeZone, entities } = this._params;
    if (raw === null) {
      this.errors.add(entity);
    } else {
      this.errors.delete(entity);
      this.events.set(
        entity,
        raw
          .map((ev, idx) => normalizeEvent(ev, entity, timeZone, idx))
          .filter((ev): ev is CalEvent => ev !== null),
      );
    }
    this._received.add(entity);
    if (entities.every((e) => this._received.has(e))) this.loaded = true;
    this._host.requestUpdate();
  }

  private _teardown(): void {
    this._generation++;
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = undefined;
    }
    const unsubs = this._unsubs;
    this._unsubs = [];
    for (const unsub of unsubs) {
      unsub.then((fn) => fn?.()).catch(() => undefined);
    }
  }
}
