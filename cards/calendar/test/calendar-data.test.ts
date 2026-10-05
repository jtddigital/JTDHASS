import { describe, expect, it } from "vitest";
import { eventsForDay, layoutWeek, normalizeEvent } from "../src/calendar-data";
import { dayFromYmd, isoDateFromDay } from "../src/date-utils";
import type { CalEvent } from "../src/types";

const TZ = "America/Chicago";

const make = (start: string, end: string, summary = "Event", allDay?: boolean): CalEvent =>
  normalizeEvent({ summary, start, end, all_day: allDay }, "calendar.test", TZ, 0)!;

describe("normalizeEvent", () => {
  it("reads all-day events with exclusive end dates", () => {
    const ev = make("2026-10-09", "2026-10-12", "Fall break", true);
    expect(ev.allDay).toBe(true);
    expect(isoDateFromDay(ev.startDay)).toBe("2026-10-09");
    expect(isoDateFromDay(ev.endDay)).toBe("2026-10-11");
  });

  it("detects all-day events from the REST format", () => {
    const ev = normalizeEvent(
      { summary: "Holiday", start: { date: "2026-10-12" }, end: { date: "2026-10-13" } },
      "calendar.test",
      TZ,
      0,
    )!;
    expect(ev.allDay).toBe(true);
    expect(ev.startDay).toBe(ev.endDay);
  });

  it("fixes all-day events whose end equals the start", () => {
    const ev = make("2026-10-12", "2026-10-12", "Holiday", true);
    expect(ev.endDay).toBe(ev.startDay);
  });

  it("places timed events in the display time zone", () => {
    const ev = make("2026-10-05T22:30:00-05:00", "2026-10-05T23:30:00-05:00");
    expect(isoDateFromDay(ev.startDay)).toBe("2026-10-05");
    expect(ev.endDay).toBe(ev.startDay);
    const tokyo = normalizeEvent(
      { summary: "x", start: "2026-10-05T22:30:00-05:00", end: "2026-10-05T23:30:00-05:00" },
      "calendar.test",
      "Asia/Tokyo",
      0,
    )!;
    expect(isoDateFromDay(tokyo.startDay)).toBe("2026-10-06");
  });

  it("does not spill events ending at midnight into the next day", () => {
    const ev = make("2026-10-05T20:00:00-05:00", "2026-10-06T00:00:00-05:00");
    expect(ev.endDay).toBe(ev.startDay);
  });

  it("spans overnight events across days", () => {
    const ev = make("2026-10-05T22:00:00-05:00", "2026-10-06T02:00:00-05:00");
    expect(ev.endDay).toBe(ev.startDay + 1);
  });

  it("marks tentative events", () => {
    const ev = normalizeEvent(
      { summary: "Maybe", start: "2026-10-05", end: "2026-10-06", status: "tentative" },
      "calendar.test",
      TZ,
      0,
    )!;
    expect(ev.tentative).toBe(true);
  });

  it("rejects events without a start", () => {
    expect(
      normalizeEvent({ summary: "x", start: "", end: "" }, "calendar.test", TZ, 0),
    ).toBeNull();
  });
});

describe("eventsForDay", () => {
  it("lists all-day first, then by start time", () => {
    const events = [
      make("2026-10-05T15:00:00-05:00", "2026-10-05T16:00:00-05:00", "Late"),
      make("2026-10-05T09:00:00-05:00", "2026-10-05T10:00:00-05:00", "Early"),
      make("2026-10-04", "2026-10-07", "Trip", true),
      make("2026-10-06T09:00:00-05:00", "2026-10-06T10:00:00-05:00", "Tomorrow"),
    ];
    const day = dayFromYmd(2026, 10, 5);
    expect(eventsForDay(events, day).map((e) => e.summary)).toEqual(["Trip", "Early", "Late"]);
  });
});

describe("layoutWeek", () => {
  const weekStart = dayFromYmd(2026, 10, 4); // Sunday

  it("stacks overlapping events into lanes", () => {
    const events = [
      make("2026-10-05", "2026-10-08", "Trip", true), // Mon-Wed
      make("2026-10-06T09:00:00-05:00", "2026-10-06T10:00:00-05:00", "Meeting"),
      make("2026-10-09T09:00:00-05:00", "2026-10-09T10:00:00-05:00", "Friday"),
    ];
    const layout = layoutWeek(events, weekStart, 4);
    const bySummary = Object.fromEntries(layout.segments.map((s) => [s.event.summary, s]));
    expect(bySummary.Trip).toMatchObject({ col: 1, span: 3, lane: 0 });
    expect(bySummary.Meeting).toMatchObject({ col: 2, span: 1, lane: 1 });
    expect(bySummary.Friday).toMatchObject({ col: 5, span: 1, lane: 0 });
    expect(layout.lanes).toBe(2);
    expect(layout.more).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });

  it("clips events to the week and flags continuation", () => {
    const events = [make("2026-10-01", "2026-10-07", "Long", true)];
    const [seg] = layoutWeek(events, weekStart, 4).segments;
    expect(seg).toMatchObject({ col: 0, span: 3, continuesBefore: true, continuesAfter: false });
    const [next] = layoutWeek([make("2026-10-09", "2026-10-13", "Wrap", true)], weekStart, 4)
      .segments;
    expect(next).toMatchObject({ col: 5, span: 2, continuesBefore: false, continuesAfter: true });
  });

  it("collapses overflow into a +N more lane", () => {
    const events = Array.from({ length: 5 }, (_, i) =>
      make(`2026-10-05T0${i + 1}:00:00-05:00`, `2026-10-05T0${i + 1}:30:00-05:00`, `E${i}`),
    );
    const layout = layoutWeek(events, weekStart, 3);
    expect(layout.lanes).toBe(3);
    expect(layout.segments.map((s) => s.event.summary)).toEqual(["E0", "E1"]);
    expect(layout.more[1]).toBe(3);
  });

  it("hides a spanning event in the overflow lane on every day it covers", () => {
    const events = [
      make("2026-10-05T01:00:00-05:00", "2026-10-05T02:00:00-05:00", "A"),
      make("2026-10-04", "2026-10-07", "Span", true), // Sun-Tue, lane 0
      make("2026-10-05T03:00:00-05:00", "2026-10-05T04:00:00-05:00", "B"),
      make("2026-10-05T05:00:00-05:00", "2026-10-05T06:00:00-05:00", "C"),
    ];
    const layout = layoutWeek(events, weekStart, 2);
    // Monday holds 4 items in a 2-lane limit: Span (lane 0) stays, A/B/C hide.
    expect(layout.segments.map((s) => s.event.summary)).toEqual(["Span"]);
    expect(layout.more[1]).toBe(3);
  });

  it("allows unlimited lanes when maxLanes is 0", () => {
    const events = Array.from({ length: 6 }, (_, i) =>
      make(`2026-10-05T0${i + 1}:00:00-05:00`, `2026-10-05T0${i + 1}:30:00-05:00`, `E${i}`),
    );
    const layout = layoutWeek(events, weekStart, 0);
    expect(layout.lanes).toBe(6);
    expect(layout.segments).toHaveLength(6);
  });
});
