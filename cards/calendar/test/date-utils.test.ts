import { describe, expect, it } from "vitest";
import {
  addMonths,
  dayFromIsoDate,
  dayFromYmd,
  dayInZone,
  isoDateFromDay,
  monthGrid,
  startOfDayInZone,
  startOfWeek,
  weekdayOf,
  ymdFromDay,
} from "../src/date-utils";

describe("day numbers", () => {
  it("round-trips dates", () => {
    const day = dayFromYmd(2026, 10, 5);
    expect(ymdFromDay(day)).toEqual({ year: 2026, month: 10, day: 5 });
    expect(isoDateFromDay(day)).toBe("2026-10-05");
    expect(dayFromIsoDate("2026-10-05")).toBe(day);
    expect(dayFromIsoDate("2026-10-05T09:00:00-05:00")).toBe(day);
  });

  it("computes weekdays (0 = Sunday)", () => {
    expect(weekdayOf(dayFromYmd(2026, 10, 4))).toBe(0);
    expect(weekdayOf(dayFromYmd(2026, 10, 10))).toBe(6);
    expect(weekdayOf(dayFromYmd(1969, 12, 31))).toBe(3);
  });

  it("finds the start of the week", () => {
    const wed = dayFromYmd(2026, 10, 7);
    expect(isoDateFromDay(startOfWeek(wed, 0))).toBe("2026-10-04");
    expect(isoDateFromDay(startOfWeek(wed, 1))).toBe("2026-10-05");
    expect(startOfWeek(dayFromYmd(2026, 10, 4), 0)).toBe(dayFromYmd(2026, 10, 4));
  });

  it("adds months across years", () => {
    expect(addMonths(2026, 12, 1)).toEqual({ year: 2027, month: 1 });
    expect(addMonths(2026, 1, -1)).toEqual({ year: 2025, month: 12 });
    expect(addMonths(2026, 10, -22)).toEqual({ year: 2024, month: 12 });
  });
});

describe("monthGrid", () => {
  it("covers October 2026 with Sunday-first weeks", () => {
    const grid = monthGrid(2026, 10, 0);
    expect(isoDateFromDay(grid.start)).toBe("2026-09-27");
    expect(grid.weeks).toBe(5);
  });

  it("uses four rows when a month fits exactly", () => {
    // February 2026 starts on a Sunday and has 28 days.
    const grid = monthGrid(2026, 2, 0);
    expect(isoDateFromDay(grid.start)).toBe("2026-02-01");
    expect(grid.weeks).toBe(4);
  });

  it("uses six rows when needed", () => {
    // May 2026 starts on a Friday and has 31 days.
    expect(monthGrid(2026, 5, 0).weeks).toBe(6);
  });

  it("supports Monday-first weeks", () => {
    const grid = monthGrid(2026, 10, 1);
    expect(isoDateFromDay(grid.start)).toBe("2026-09-28");
  });
});

describe("time zones", () => {
  it("finds local midnight", () => {
    const day = dayFromYmd(2026, 10, 5);
    expect(new Date(startOfDayInZone(day, "America/Chicago")).toISOString()).toBe(
      "2026-10-05T05:00:00.000Z",
    );
    expect(new Date(startOfDayInZone(day, "Europe/Berlin")).toISOString()).toBe(
      "2026-10-04T22:00:00.000Z",
    );
    expect(new Date(startOfDayInZone(day, "UTC")).toISOString()).toBe("2026-10-05T00:00:00.000Z");
  });

  it("handles DST transition days", () => {
    // US DST ends 2026-11-01; the day is 25 hours long in Chicago.
    const day = dayFromYmd(2026, 11, 1);
    const start = startOfDayInZone(day, "America/Chicago");
    const next = startOfDayInZone(day + 1, "America/Chicago");
    expect(new Date(start).toISOString()).toBe("2026-11-01T05:00:00.000Z");
    expect((next - start) / 3_600_000).toBe(25);
  });

  it("handles zones that skip midnight", () => {
    // Chile moves clocks from 00:00 to 01:00 on 2026-09-06.
    const day = dayFromYmd(2026, 9, 6);
    const start = startOfDayInZone(day, "America/Santiago");
    expect(dayInZone(start, "America/Santiago")).toBe(day);
    expect(dayInZone(start - 1, "America/Santiago")).toBe(day - 1);
  });

  it("maps instants to local days", () => {
    const instant = Date.parse("2026-10-05T03:00:00Z");
    expect(isoDateFromDay(dayInZone(instant, "America/Chicago"))).toBe("2026-10-04");
    expect(isoDateFromDay(dayInZone(instant, "Asia/Tokyo"))).toBe("2026-10-05");
  });
});
