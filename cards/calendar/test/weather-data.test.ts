import { describe, expect, it } from "vitest";
import { dayFromYmd, isoDateFromDay } from "../src/date-utils";
import {
  aggregateForecast,
  aggregateWeatherHistory,
  computeNormals,
  convertTemperature,
  mergeWeather,
  normalsArchiveRange,
  openMeteoToDays,
  pickForecastType,
  statisticsToDays,
  wmoToCondition,
  type CompressedState,
  type OpenMeteoDaily,
} from "../src/weather-data";

const TZ = "America/Chicago";
const F = { temperature: "°F", precipitation: "in", display: "°F" };
const day = (iso: string) => dayFromYmd(...(iso.split("-").map(Number) as [number, number, number]));

describe("helpers", () => {
  it("converts temperatures", () => {
    expect(convertTemperature(100, "°C", "°F")).toBe(212);
    expect(convertTemperature(32, "°F", "°C")).toBe(0);
    expect(convertTemperature(20, "°C", "°C")).toBe(20);
    expect(convertTemperature(20, undefined, "°F")).toBe(20);
    expect(convertTemperature(null, "°C", "°F")).toBeUndefined();
  });

  it("prefers daily forecasts", () => {
    expect(pickForecastType(1 | 2 | 4)).toBe("daily");
    expect(pickForecastType(2 | 4)).toBe("twice_daily");
    expect(pickForecastType(2)).toBe("hourly");
    expect(pickForecastType(0)).toBeUndefined();
  });

  it("maps WMO codes", () => {
    expect(wmoToCondition(0)).toBe("sunny");
    expect(wmoToCondition(3)).toBe("cloudy");
    expect(wmoToCondition(95)).toBe("lightning-rainy");
    expect(wmoToCondition(null)).toBeUndefined();
  });
});

describe("aggregateForecast", () => {
  it("maps daily entries to local days", () => {
    const days = aggregateForecast(
      [
        { datetime: "2026-10-05T12:00:00-05:00", temperature: 70, templow: 50, condition: "clear-night" },
        { datetime: "2026-10-06T12:00:00-05:00", temperature: 72, templow: 52, condition: "rainy", precipitation_probability: 80 },
      ],
      "daily",
      TZ,
      F,
      "weather.home",
    );
    expect(days.get(day("2026-10-05"))).toMatchObject({ high: 70, low: 50, condition: "sunny", source: "forecast" });
    expect(days.get(day("2026-10-06"))?.precipitationProbability).toBe(80);
  });

  it("uses the UTC date for providers stamping UTC midnight", () => {
    const days = aggregateForecast(
      [
        { datetime: "2026-10-05T00:00:00+00:00", temperature: 70 },
        { datetime: "2026-10-06T00:00:00+00:00", temperature: 71 },
      ],
      "daily",
      TZ,
      F,
      "weather.home",
    );
    expect([...days.keys()].map(isoDateFromDay)).toEqual(["2026-10-05", "2026-10-06"]);
  });

  it("converts units", () => {
    const days = aggregateForecast(
      [{ datetime: "2026-10-05T12:00:00-05:00", temperature: 20, templow: 10 }],
      "daily",
      TZ,
      { temperature: "°C", display: "°F" },
      "weather.home",
    );
    expect(days.get(day("2026-10-05"))).toMatchObject({ high: 68, low: 50 });
  });

  it("combines twice-daily entries", () => {
    const days = aggregateForecast(
      [
        { datetime: "2026-10-05T07:00:00-05:00", temperature: 75, condition: "partlycloudy", is_daytime: true, precipitation_probability: 10 },
        { datetime: "2026-10-05T19:00:00-05:00", temperature: 55, condition: "clear-night", is_daytime: false, precipitation_probability: 30 },
      ],
      "twice_daily",
      TZ,
      F,
      "weather.home",
    );
    expect(days.get(day("2026-10-05"))).toMatchObject({
      high: 75,
      low: 55,
      condition: "partlycloudy",
      precipitationProbability: 30,
    });
  });

  it("summarizes hourly entries using daytime conditions", () => {
    const hourly = Array.from({ length: 24 }, (_, hour) => ({
      datetime: `2026-10-05T${String(hour).padStart(2, "0")}:00:00-05:00`,
      temperature: 50 + hour,
      condition: hour >= 7 && hour < 19 ? (hour < 10 ? "rainy" : "cloudy") : "clear-night",
      precipitation: hour < 10 && hour >= 7 ? 0.1 : 0,
    }));
    const result = aggregateForecast(hourly, "hourly", TZ, F, "weather.home").get(day("2026-10-05"))!;
    expect(result.high).toBe(73);
    expect(result.low).toBe(50);
    expect(result.condition).toBe("cloudy");
    expect(result.precipitation).toBeCloseTo(0.3);
  });
});

describe("aggregateWeatherHistory", () => {
  it("picks the longest daytime condition and the temperature range per day", () => {
    const at = (iso: string) => Date.parse(iso) / 1000;
    const states: CompressedState[] = [
      { s: "clear-night", a: { temperature: 50, temperature_unit: "°F" }, lu: at("2026-10-03T00:00:00-05:00") },
      { s: "rainy", a: { temperature: 55, temperature_unit: "°F" }, lu: at("2026-10-03T08:00:00-05:00") },
      { s: "sunny", a: { temperature: 66, temperature_unit: "°F" }, lu: at("2026-10-03T10:00:00-05:00") },
      { s: "unavailable", lu: at("2026-10-03T20:00:00-05:00") },
      { s: "cloudy", a: { temperature: 48, temperature_unit: "°F" }, lu: at("2026-10-04T06:00:00-05:00") },
    ];
    const days = aggregateWeatherHistory(
      states,
      TZ,
      Date.parse("2026-10-04T12:00:00-05:00"),
      "°F",
      "weather.home",
    );
    expect(days.get(day("2026-10-03"))).toMatchObject({ condition: "sunny", high: 66, low: 50, source: "history" });
    expect(days.get(day("2026-10-04"))).toMatchObject({ condition: "cloudy", high: 48, low: 48 });
  });
});

describe("statisticsToDays", () => {
  it("reads daily min/max", () => {
    const start = Date.parse("2026-10-03T00:00:00-05:00");
    const days = statisticsToDays([{ start, min: 45.2, max: 70.1, mean: 58 }], TZ, "sensor.t");
    expect(days.get(day("2026-10-03"))).toMatchObject({ high: 70.1, low: 45.2, provider: "sensor.t" });
  });
});

describe("Open-Meteo", () => {
  const daily: OpenMeteoDaily = {
    time: ["2026-10-04", "2026-10-05", "2026-10-06"],
    weather_code: [0, 61, null],
    temperature_2m_max: [70, 65, null],
    temperature_2m_min: [50, 48, null],
    precipitation_sum: [0, 0.4, null],
    precipitation_probability_max: [0, 90, null],
  };

  it("splits past and forecast days and skips empty days", () => {
    const days = openMeteoToDays(daily, day("2026-10-05"), "in");
    expect(days.get(day("2026-10-04"))).toMatchObject({ source: "history", condition: "sunny" });
    expect(days.get(day("2026-10-05"))).toMatchObject({ source: "forecast", condition: "rainy", precipitation: 0.4 });
    expect(days.has(day("2026-10-06"))).toBe(false);
  });

  it("computes normals from earlier years", () => {
    const target = day("2026-10-20");
    const range = normalsArchiveRange(target, target);
    expect(isoDateFromDay(range.start)).toBe("2021-10-17");
    expect(isoDateFromDay(range.end)).toBe("2025-10-23");

    const time: string[] = [];
    const max: number[] = [];
    const min: number[] = [];
    const rain: number[] = [];
    for (let d = range.start; d <= range.end; d++) {
      time.push(isoDateFromDay(d));
      max.push(70);
      min.push(50);
      rain.push(d % 2 === 0 ? 2 : 0);
    }
    const normals = computeNormals(
      { time, temperature_2m_max: max, temperature_2m_min: min, precipitation_sum: rain },
      [target],
      1,
      "mm",
    );
    const result = normals.get(target)!;
    expect(result).toMatchObject({ source: "normal", high: 70, low: 50 });
    expect(result.precipitationProbability).toBeGreaterThan(30);
    expect(result.precipitationProbability).toBeLessThan(70);
  });
});

describe("mergeWeather", () => {
  it("fills missing fields from later sources", () => {
    const merged = mergeWeather([
      undefined,
      { source: "history", provider: "sensor.t", high: 70, low: 50 },
      { source: "history", provider: "weather.home", condition: "rainy", high: 68 },
    ]);
    expect(merged).toEqual({
      source: "history",
      provider: "sensor.t",
      high: 70,
      low: 50,
      condition: "rainy",
    });
    expect(mergeWeather([undefined])).toBeUndefined();
  });
});
