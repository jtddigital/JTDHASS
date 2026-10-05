import type { ReactiveController, ReactiveControllerHost } from "lit";
import {
  dayFromIsoDate,
  dayFromYmd,
  dayInZone,
  hourInZone,
  isoDateFromDay,
  startOfDayInZone,
  ymdFromDay,
} from "./date-utils";
import type { DayWeather, HomeAssistant, UnsubscribeFunc } from "./types";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

export type ForecastType = "daily" | "twice_daily" | "hourly";

export interface ForecastAttribute {
  datetime: string;
  temperature?: number | null;
  templow?: number | null;
  condition?: string | null;
  precipitation?: number | null;
  precipitation_probability?: number | null;
  is_daytime?: boolean | null;
}

const FORECAST_DAILY = 1;
const FORECAST_HOURLY = 2;
const FORECAST_TWICE_DAILY = 4;

const DAYTIME_START_HOUR = 7;
const DAYTIME_END_HOUR = 19;

const UNAVAILABLE_STATES = new Set(["unavailable", "unknown", ""]);

const isNum = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const convertTemperature = (
  value: unknown,
  fromUnit: string | undefined,
  toUnit: string,
): number | undefined => {
  if (!isNum(value)) return undefined;
  const fromF = (fromUnit ?? toUnit).includes("F");
  const toF = toUnit.includes("F");
  if (fromF === toF) return value;
  return toF ? (value * 9) / 5 + 32 : ((value - 32) * 5) / 9;
};

/** Daily icons show the day, so a clear night counts as a sunny day. */
const dayCondition = (condition: string | null | undefined): string | undefined =>
  !condition || UNAVAILABLE_STATES.has(condition)
    ? undefined
    : condition === "clear-night"
      ? "sunny"
      : condition;

const dominant = (weights: Map<string, number>): string | undefined => {
  let best: string | undefined;
  let bestWeight = -1;
  for (const [condition, weight] of weights) {
    if (weight > bestWeight) {
      best = condition;
      bestWeight = weight;
    }
  }
  return best;
};

const max = (values: Array<number | undefined>) => {
  const nums = values.filter(isNum);
  return nums.length ? Math.max(...nums) : undefined;
};

const min = (values: Array<number | undefined>) => {
  const nums = values.filter(isNum);
  return nums.length ? Math.min(...nums) : undefined;
};

const sum = (values: Array<number | null | undefined>) => {
  const nums = values.filter(isNum);
  return nums.length ? nums.reduce((a, b) => a + b, 0) : undefined;
};

export const pickForecastType = (
  supportedFeatures: number | undefined,
): ForecastType | undefined => {
  const features = supportedFeatures ?? 0;
  if (features & FORECAST_DAILY) return "daily";
  if (features & FORECAST_TWICE_DAILY) return "twice_daily";
  if (features & FORECAST_HOURLY) return "hourly";
  return undefined;
};

// ---------------------------------------------------------------------------
// Home Assistant forecast -> days
// ---------------------------------------------------------------------------

export const aggregateForecast = (
  forecast: ForecastAttribute[],
  type: ForecastType,
  timeZone: string,
  units: { temperature?: string; precipitation?: string; display: string },
  provider: string,
): Map<number, DayWeather> => {
  // Some integrations stamp daily forecasts at UTC midnight; their date part
  // is the forecast day regardless of the local time zone.
  const utcDates =
    type === "daily" &&
    forecast.length > 0 &&
    forecast.every((f) => /T00:00(:00(\.0+)?)?(Z|\+00:00)$/.test(f.datetime));

  const groups = new Map<number, ForecastAttribute[]>();
  for (const item of forecast) {
    const ms = Date.parse(item.datetime);
    if (Number.isNaN(ms)) continue;
    const day = utcDates ? dayFromIsoDate(item.datetime) : dayInZone(ms, timeZone);
    const group = groups.get(day);
    if (group) group.push(item);
    else groups.set(day, [item]);
  }

  const temp = (value: unknown) =>
    convertTemperature(value, units.temperature, units.display);

  const result = new Map<number, DayWeather>();
  for (const [day, items] of groups) {
    const base = {
      source: "forecast" as const,
      provider,
      precipitationUnit: units.precipitation,
      precipitation: sum(items.map((i) => i.precipitation)),
      precipitationProbability: max(items.map((i) => i.precipitation_probability ?? undefined)),
    };

    if (type === "daily") {
      const item = items[0];
      result.set(day, {
        ...base,
        precipitation: isNum(item.precipitation) ? item.precipitation : undefined,
        condition: dayCondition(item.condition),
        high: temp(item.temperature),
        low: temp(item.templow),
      });
      continue;
    }

    const daytime =
      type === "twice_daily"
        ? items.filter((i) => i.is_daytime !== false)
        : items.filter((i) => {
            const hour = hourInZone(Date.parse(i.datetime), timeZone);
            return hour >= DAYTIME_START_HOUR && hour < DAYTIME_END_HOUR;
          });
    const conditionSource = daytime.length ? daytime : items;
    const weights = new Map<string, number>();
    for (const item of conditionSource) {
      const condition = dayCondition(item.condition);
      if (condition) weights.set(condition, (weights.get(condition) ?? 0) + 1);
    }

    let high: number | undefined;
    let low: number | undefined;
    if (type === "twice_daily") {
      const nights = items.filter((i) => i.is_daytime === false);
      high = max((daytime.length ? daytime : items).map((i) => temp(i.temperature)));
      low = nights.length
        ? min(nights.map((i) => temp(i.templow ?? i.temperature)))
        : min(items.map((i) => temp(i.templow)));
    } else {
      high = max(items.map((i) => temp(i.temperature)));
      low = min(items.map((i) => temp(i.temperature)));
    }
    result.set(day, { ...base, condition: dominant(weights), high, low });
  }
  return result;
};

// ---------------------------------------------------------------------------
// Recorder history / statistics -> days
// ---------------------------------------------------------------------------

/** Compressed state as returned by `history/history_during_period`. */
export interface CompressedState {
  s: string;
  a?: Record<string, any>;
  lu: number;
  lc?: number;
}

/**
 * Per day: the condition the weather entity reported for the longest time and
 * the range of its `temperature` attribute.
 */
export const aggregateWeatherHistory = (
  states: CompressedState[],
  timeZone: string,
  endMs: number,
  displayUnit: string,
  provider: string,
): Map<number, DayWeather> => {
  const sorted = [...states].sort((a, b) => a.lu - b.lu);
  const acc = new Map<number, { weights: Map<string, number>; temps: number[] }>();
  let attributes: Record<string, any> = {};

  for (let i = 0; i < sorted.length; i++) {
    const state = sorted[i];
    if (state.a) attributes = state.a;
    const from = state.lu * 1000;
    const to = i + 1 < sorted.length ? sorted[i + 1].lu * 1000 : endMs;
    if (!(to > from)) continue;
    const condition = dayCondition(state.s);
    const temperature = UNAVAILABLE_STATES.has(state.s)
      ? undefined
      : convertTemperature(attributes.temperature, attributes.temperature_unit, displayUnit);

    let cursor = from;
    while (cursor < to) {
      const day = dayInZone(cursor, timeZone);
      const next = Math.min(to, startOfDayInZone(day + 1, timeZone));
      let entry = acc.get(day);
      if (!entry) {
        entry = { weights: new Map(), temps: [] };
        acc.set(day, entry);
      }
      if (condition) {
        // Daytime conditions decide the icon; nights only break ties.
        const hour = hourInZone(cursor, timeZone);
        const factor = hour >= DAYTIME_START_HOUR && hour < DAYTIME_END_HOUR ? 1 : 0.1;
        entry.weights.set(
          condition,
          (entry.weights.get(condition) ?? 0) + (next - cursor) * factor,
        );
      }
      if (temperature !== undefined) entry.temps.push(temperature);
      cursor = next > cursor ? next : to;
    }
  }

  const result = new Map<number, DayWeather>();
  for (const [day, { weights, temps }] of acc) {
    result.set(day, {
      source: "history",
      provider,
      condition: dominant(weights),
      high: max(temps),
      low: min(temps),
    });
  }
  return result;
};

export interface StatisticValue {
  start: number | string;
  min?: number | null;
  max?: number | null;
  mean?: number | null;
}

/** Daily long-term statistics (period "day") -> highs and lows. */
export const statisticsToDays = (
  stats: StatisticValue[],
  serverTimeZone: string,
  provider: string,
): Map<number, DayWeather> => {
  const result = new Map<number, DayWeather>();
  for (const stat of stats) {
    const start = typeof stat.start === "number" ? stat.start : Date.parse(stat.start);
    if (Number.isNaN(start)) continue;
    const high = isNum(stat.max) ? stat.max : undefined;
    const low = isNum(stat.min) ? stat.min : undefined;
    if (high === undefined && low === undefined) continue;
    // Day periods start at local midnight of the server; nudge past DST edges.
    result.set(dayInZone(start + 3_600_000, serverTimeZone), {
      source: "history",
      provider,
      high,
      low,
    });
  }
  return result;
};

// ---------------------------------------------------------------------------
// Open-Meteo (optional, keyless): fills days Home Assistant has no data for
// ---------------------------------------------------------------------------

export const OPEN_METEO = "Open-Meteo";

/** WMO weather interpretation codes -> Home Assistant conditions. */
const WMO_CONDITIONS: Record<number, string> = {
  0: "sunny",
  1: "sunny",
  2: "partlycloudy",
  3: "cloudy",
  45: "fog",
  48: "fog",
  51: "rainy",
  53: "rainy",
  55: "rainy",
  56: "snowy-rainy",
  57: "snowy-rainy",
  61: "rainy",
  63: "rainy",
  65: "pouring",
  66: "snowy-rainy",
  67: "snowy-rainy",
  71: "snowy",
  73: "snowy",
  75: "snowy",
  77: "snowy",
  80: "rainy",
  81: "rainy",
  82: "pouring",
  85: "snowy",
  86: "snowy",
  95: "lightning-rainy",
  96: "lightning-rainy",
  99: "lightning-rainy",
};

export const wmoToCondition = (code: number | null | undefined): string | undefined =>
  isNum(code) ? WMO_CONDITIONS[code] : undefined;

export interface OpenMeteoDaily {
  time: string[];
  weather_code?: Array<number | null>;
  temperature_2m_max?: Array<number | null>;
  temperature_2m_min?: Array<number | null>;
  precipitation_sum?: Array<number | null>;
  precipitation_probability_max?: Array<number | null>;
}

const at = (values: Array<number | null> | undefined, index: number) => {
  const value = values?.[index];
  return isNum(value) ? value : undefined;
};

export const openMeteoToDays = (
  daily: OpenMeteoDaily,
  today: number,
  precipitationUnit: string,
): Map<number, DayWeather> => {
  const result = new Map<number, DayWeather>();
  daily.time.forEach((date, i) => {
    const day = dayFromIsoDate(date);
    const weather: DayWeather = {
      source: day < today ? "history" : "forecast",
      provider: OPEN_METEO,
      condition: wmoToCondition(daily.weather_code?.[i]),
      high: at(daily.temperature_2m_max, i),
      low: at(daily.temperature_2m_min, i),
      precipitation: at(daily.precipitation_sum, i),
      precipitationUnit,
      precipitationProbability: at(daily.precipitation_probability_max, i),
    };
    if (weather.condition || weather.high !== undefined || weather.low !== undefined) {
      result.set(day, weather);
    }
  });
  return result;
};

/** Same month/day in an earlier year (Feb 29 falls back to Feb 28). */
const sameDateInYear = (dayNum: number, year: number): number => {
  const { month, day } = ymdFromDay(dayNum);
  const daysInMonth = dayFromYmd(year, month + 1, 1) - dayFromYmd(year, month, 1);
  return dayFromYmd(year, month, Math.min(day, daysInMonth));
};

export const NORMAL_YEARS = 5;
const NORMAL_WINDOW = 3;

/** Range of archive data needed to compute normals for the given days. */
export const normalsArchiveRange = (firstDay: number, lastDay: number) => {
  const { year: firstYear } = ymdFromDay(firstDay);
  const { year: lastYear } = ymdFromDay(lastDay);
  return {
    start: sameDateInYear(firstDay, firstYear - NORMAL_YEARS) - NORMAL_WINDOW,
    end: sameDateInYear(lastDay, lastYear - 1) + NORMAL_WINDOW,
  };
};

/**
 * Typical weather for each day: average high/low of the same dates (±3 days)
 * over the previous five years, and how often it rained.
 */
export const computeNormals = (
  daily: OpenMeteoDaily,
  days: number[],
  rainThreshold: number,
  precipitationUnit: string,
): Map<number, DayWeather> => {
  const index = new Map<number, number>();
  daily.time.forEach((date, i) => index.set(dayFromIsoDate(date), i));

  const result = new Map<number, DayWeather>();
  for (const day of days) {
    const { year } = ymdFromDay(day);
    const highs: number[] = [];
    const lows: number[] = [];
    let wet = 0;
    let measured = 0;
    for (let k = 1; k <= NORMAL_YEARS; k++) {
      const center = sameDateInYear(day, year - k);
      for (let w = -NORMAL_WINDOW; w <= NORMAL_WINDOW; w++) {
        const i = index.get(center + w);
        if (i === undefined) continue;
        const high = at(daily.temperature_2m_max, i);
        const low = at(daily.temperature_2m_min, i);
        const rain = at(daily.precipitation_sum, i);
        if (high !== undefined) highs.push(high);
        if (low !== undefined) lows.push(low);
        if (rain !== undefined) {
          measured++;
          if (rain >= rainThreshold) wet++;
        }
      }
    }
    if (!highs.length && !lows.length) continue;
    const avg = (values: number[]) =>
      values.length ? values.reduce((a, b) => a + b, 0) / values.length : undefined;
    result.set(day, {
      source: "normal",
      provider: OPEN_METEO,
      high: avg(highs),
      low: avg(lows),
      precipitationUnit,
      precipitationProbability: measured ? Math.round((wet / measured) * 100) : undefined,
    });
  }
  return result;
};

const responseCache = new Map<string, { expires: number; promise: Promise<any> }>();

const fetchJson = <T>(url: string, ttl: number): Promise<T> => {
  const hit = responseCache.get(url);
  if (hit && hit.expires > Date.now()) return hit.promise;
  const promise = fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${OPEN_METEO} HTTP ${response.status}`);
    return response.json();
  });
  responseCache.set(url, { expires: Date.now() + ttl, promise });
  promise.catch(() => responseCache.delete(url));
  return promise;
};

/** Forecast API serves the last 92 days and the next 16 days. */
const OM_PAST_DAYS = 92;
const OM_FUTURE_DAYS = 15;

// ---------------------------------------------------------------------------
// Merge
// ---------------------------------------------------------------------------

const FIELDS = [
  "condition",
  "high",
  "low",
  "precipitation",
  "precipitationUnit",
  "precipitationProbability",
] as const;

/** First source is primary; later sources only fill fields it lacks. */
export const mergeWeather = (
  chain: Array<DayWeather | undefined>,
): DayWeather | undefined => {
  const present = chain.filter((item): item is DayWeather => item !== undefined);
  if (!present.length) return undefined;
  const result: DayWeather = { source: present[0].source, provider: present[0].provider };
  for (const field of FIELDS) {
    for (const item of present) {
      if (item[field] !== undefined) {
        (result as any)[field] = item[field];
        break;
      }
    }
  }
  return result;
};

// ---------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------

export interface WeatherParams {
  weatherEntity?: string;
  temperatureEntity?: string;
  firstDay: number;
  lastDay: number;
  today: number;
  timeZone: string;
  serverTimeZone: string;
  showForecast: boolean;
  showHistory: boolean;
  openMeteo: boolean;
  showNormals: boolean;
}

interface ForecastEvent {
  type: ForecastType;
  forecast: ForecastAttribute[] | null;
}

const RANGE_REFRESH = 30 * 60 * 1000;

export class WeatherController implements ReactiveController {
  private _hass?: HomeAssistant;

  private _params?: WeatherParams;

  private _forecast = new Map<number, DayWeather>();

  private _history = new Map<number, DayWeather>();

  private _stats = new Map<number, DayWeather>();

  private _omForecast = new Map<number, DayWeather>();

  private _omPast = new Map<number, DayWeather>();

  private _normals = new Map<number, DayWeather>();

  private _forecastKey = "";

  private _forecastUnsub?: Promise<UnsubscribeFunc | undefined>;

  private _rangeKey = "";

  private _rangeFetchedAt = 0;

  private _rangeGeneration = 0;

  constructor(private readonly _host: ReactiveControllerHost) {
    _host.addController(this);
  }

  hostConnected(): void {
    this._forecastKey = "";
    this._rangeKey = "";
    if (this._hass && this._params) this.update(this._hass, this._params);
  }

  hostDisconnected(): void {
    this._unsubscribeForecast();
    this._rangeGeneration++;
  }

  /** Call on every render; only fetches when inputs change or data is stale. */
  public update(hass: HomeAssistant, params: WeatherParams): void {
    this._hass = hass;
    this._params = params;
    this._updateForecast(hass, params);

    const rangeKey = JSON.stringify([
      params.weatherEntity,
      params.temperatureEntity,
      params.firstDay,
      params.lastDay,
      params.today,
      params.timeZone,
      params.showHistory,
      params.openMeteo,
      params.showNormals,
      hass.config.unit_system.temperature,
    ]);
    if (rangeKey !== this._rangeKey || Date.now() - this._rangeFetchedAt > RANGE_REFRESH) {
      if (rangeKey !== this._rangeKey) {
        this._history = new Map();
        this._stats = new Map();
        this._omForecast = new Map();
        this._omPast = new Map();
        this._normals = new Map();
      }
      this._rangeKey = rangeKey;
      this._rangeFetchedAt = Date.now();
      this._fetchRange(hass, params);
    }
  }

  public dayWeather(day: number): DayWeather | undefined {
    const params = this._params;
    if (!params) return undefined;
    const chain: Array<DayWeather | undefined> = [];
    if (day >= params.today && params.showForecast) {
      chain.push(this._forecast.get(day), this._omForecast.get(day));
    }
    if (day <= params.today && params.showHistory) {
      // Sensor statistics give measured highs/lows; the weather entity's
      // history fills in the condition.
      chain.push(this._stats.get(day), this._history.get(day), this._omPast.get(day));
    }
    if (day > params.today && params.showNormals && !chain.some(Boolean)) {
      chain.push(this._normals.get(day));
    }
    return mergeWeather(chain);
  }

  private _displayUnit(hass: HomeAssistant): string {
    return hass.config.unit_system?.temperature || "°C";
  }

  private _updateForecast(hass: HomeAssistant, params: WeatherParams): void {
    const entity = params.weatherEntity;
    const stateObj = entity ? hass.states[entity] : undefined;
    const type =
      params.showForecast && stateObj
        ? pickForecastType(stateObj.attributes.supported_features)
        : undefined;
    const key = type ? JSON.stringify([entity, type, params.serverTimeZone]) : "";
    if (key === this._forecastKey) return;
    this._forecastKey = key;
    this._unsubscribeForecast();
    this._forecast = new Map();
    if (!type || !entity) return;

    this._forecastUnsub = hass.connection
      .subscribeMessage<ForecastEvent>(
        (event) => {
          if (this._forecastKey !== key) return;
          const current = this._hass?.states[entity]?.attributes ?? {};
          this._forecast = aggregateForecast(
            event.forecast ?? [],
            type,
            params.serverTimeZone,
            {
              temperature: current.temperature_unit,
              precipitation: current.precipitation_unit,
              display: this._displayUnit(this._hass ?? hass),
            },
            entity,
          );
          this._host.requestUpdate();
        },
        { type: "weather/subscribe_forecast", forecast_type: type, entity_id: entity },
      )
      .catch((err) => {
        console.warn("jtd-calendar-card: forecast subscription failed", err);
        return undefined;
      });
  }

  private _unsubscribeForecast(): void {
    const unsub = this._forecastUnsub;
    this._forecastUnsub = undefined;
    unsub?.then((fn) => fn?.()).catch(() => undefined);
  }

  private _fetchRange(hass: HomeAssistant, params: WeatherParams): void {
    const generation = ++this._rangeGeneration;
    const current = () => generation === this._rangeGeneration;
    const displayUnit = this._displayUnit(hass);
    const { firstDay, lastDay, today, timeZone, serverTimeZone } = params;
    const now = Date.now();

    if (params.showHistory && firstDay <= today) {
      const startMs = startOfDayInZone(firstDay, timeZone);
      const endMs = Math.min(now, startOfDayInZone(Math.min(lastDay, today) + 1, timeZone));

      if (params.weatherEntity && endMs > startMs) {
        const entity = params.weatherEntity;
        hass
          .callWS<Record<string, CompressedState[]>>({
            type: "history/history_during_period",
            start_time: new Date(startMs).toISOString(),
            end_time: new Date(endMs).toISOString(),
            entity_ids: [entity],
            include_start_time_state: true,
            // Attribute-only updates carry the temperature; skip them when a
            // temperature sensor supplies highs and lows instead.
            significant_changes_only: Boolean(params.temperatureEntity),
            minimal_response: false,
            no_attributes: false,
          })
          .then((result) => {
            if (!current()) return;
            this._history = aggregateWeatherHistory(
              result[entity] ?? [],
              timeZone,
              endMs,
              displayUnit,
              entity,
            );
            this._host.requestUpdate();
          })
          .catch((err) => console.warn("jtd-calendar-card: weather history failed", err));
      }

      if (params.temperatureEntity) {
        const entity = params.temperatureEntity;
        const statsStart = startOfDayInZone(firstDay, serverTimeZone);
        const statsEnd = startOfDayInZone(Math.min(lastDay, today) + 1, serverTimeZone);
        hass
          .callWS<Record<string, StatisticValue[]>>({
            type: "recorder/statistics_during_period",
            start_time: new Date(statsStart).toISOString(),
            end_time: new Date(statsEnd).toISOString(),
            statistic_ids: [entity],
            period: "day",
            types: ["min", "max", "mean"],
            units: { temperature: displayUnit },
          })
          .then((result) => {
            if (!current()) return;
            this._stats = statisticsToDays(result[entity] ?? [], serverTimeZone, entity);
            this._host.requestUpdate();
          })
          .catch((err) => console.warn("jtd-calendar-card: temperature statistics failed", err));
      }
    }

    if (params.openMeteo && hass.config.latitude !== undefined) {
      this._fetchOpenMeteo(hass, params, current);
    }
  }

  private _fetchOpenMeteo(
    hass: HomeAssistant,
    params: WeatherParams,
    current: () => boolean,
  ): void {
    const { firstDay, lastDay, today, serverTimeZone } = params;
    const imperialTemp = this._displayUnit(hass).includes("F");
    const imperialRain =
      hass.config.unit_system.accumulated_precipitation === "in" ||
      hass.config.unit_system.length === "mi";
    const precipitationUnit = imperialRain ? "in" : "mm";
    const query = new URLSearchParams({
      // Two decimals (~1 km) is plenty for weather and shares less.
      latitude: hass.config.latitude.toFixed(2),
      longitude: hass.config.longitude.toFixed(2),
      timezone: serverTimeZone,
      temperature_unit: imperialTemp ? "fahrenheit" : "celsius",
      precipitation_unit: imperialRain ? "inch" : "mm",
    });
    const url = (base: string, start: number, end: number, daily: string) =>
      `${base}?${query}&daily=${daily}&start_date=${isoDateFromDay(start)}&end_date=${isoDateFromDay(end)}`;
    const fail = (err: unknown) => console.warn("jtd-calendar-card: Open-Meteo request failed", err);

    const forecastFields =
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max";
    const historyFields = "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum";
    const addPast = (daily: OpenMeteoDaily) => {
      if (!current()) return;
      this._omPast = new Map([...this._omPast, ...openMeteoToDays(daily, today, precipitationUnit)]);
      this._host.requestUpdate();
    };

    // Forecast and recent history are separate requests, so one failing
    // never hides the other.
    const forecastStart = Math.max(firstDay, today);
    const forecastEnd = Math.min(lastDay, today + OM_FUTURE_DAYS);
    if (forecastStart <= forecastEnd) {
      fetchJson<{ daily: OpenMeteoDaily }>(
        url("https://api.open-meteo.com/v1/forecast", forecastStart, forecastEnd, forecastFields),
        60 * 60 * 1000,
      )
        .then(({ daily }) => {
          if (!current()) return;
          this._omForecast = openMeteoToDays(daily, today, precipitationUnit);
          this._host.requestUpdate();
        })
        .catch(fail);
    }

    const recentStart = Math.max(firstDay, today - OM_PAST_DAYS);
    const recentEnd = Math.min(lastDay, today - 1);
    if (params.showHistory && recentStart <= recentEnd) {
      fetchJson<{ daily: OpenMeteoDaily }>(
        url("https://api.open-meteo.com/v1/forecast", recentStart, recentEnd, historyFields),
        60 * 60 * 1000,
      )
        .then(({ daily }) => addPast(daily))
        .catch(fail);
    }

    const archiveEnd = Math.min(lastDay, today - OM_PAST_DAYS - 1);
    if (params.showHistory && firstDay <= archiveEnd) {
      fetchJson<{ daily: OpenMeteoDaily }>(
        url("https://archive-api.open-meteo.com/v1/archive", firstDay, archiveEnd, historyFields),
        24 * 60 * 60 * 1000,
      )
        .then(({ daily }) => addPast(daily))
        .catch(fail);
    }

    const normalsStart = Math.max(firstDay, today + OM_FUTURE_DAYS + 1);
    if (params.showNormals && normalsStart <= lastDay) {
      const range = normalsArchiveRange(normalsStart, lastDay);
      const targetDays = Array.from({ length: lastDay - normalsStart + 1 }, (_, i) => normalsStart + i);
      fetchJson<{ daily: OpenMeteoDaily }>(
        url(
          "https://archive-api.open-meteo.com/v1/archive",
          range.start,
          range.end,
          "temperature_2m_max,temperature_2m_min,precipitation_sum",
        ),
        24 * 60 * 60 * 1000,
      )
        .then(({ daily }) => {
          if (!current()) return;
          this._normals = computeNormals(
            daily,
            targetDays,
            imperialRain ? 0.04 : 1,
            precipitationUnit,
          );
          this._host.requestUpdate();
        })
        .catch(fail);
    }
  }
}
