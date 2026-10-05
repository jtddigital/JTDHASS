// A fake `hass` object for developing the card outside Home Assistant.
// It answers the websocket/REST calls the card makes with generated data.

const DAY = 86_400_000;
const TZ = "America/Chicago";

const pad = (n) => String(n).padStart(2, "0");
const isoDate = (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

/** Local wall time in America/Chicago (CDT, -05:00) as an ISO string. */
const chicago = (dateStr, hour, minute = 0) => `${dateStr}T${pad(hour)}:${pad(minute)}:00-05:00`;

const addDays = (dateStr, days) => isoDate(new Date(Date.parse(`${dateStr}T00:00:00Z`) + days * DAY));

// Deterministic pseudo-random numbers so screenshots are stable.
const seeded = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const todayStr = (() => {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
  return parts;
})();

const monthStart = `${todayStr.slice(0, 7)}-01`;

/** Event templates relative to the first of the current month. */
const EVENTS = {
  "calendar.family": [
    { offset: 0, summary: "Farmers market", start: [9, 0], end: [11, 0], location: "Main St Plaza" },
    { offset: 3, summary: "Soccer practice", start: [17, 30], end: [19, 0] },
    { offset: 4, summary: "Grandma's birthday", allDay: 1, description: "Bring the photo album!" },
    { offset: 6, summary: "Dinner with the Parkers", start: [18, 30], end: [21, 0], location: "Luigi's" },
    { offset: 9, summary: "Fall break", allDay: 3 },
    { offset: 10, summary: "Soccer practice", start: [17, 30], end: [19, 0] },
    { offset: 13, summary: "Pumpkin patch", start: [10, 0], end: [13, 0] },
    { offset: 13, summary: "Book club", start: [19, 0], end: [20, 30] },
    { offset: 17, summary: "Soccer tournament", allDay: 2, location: "Riverside Fields" },
    { offset: 20, summary: "Dentist", start: [8, 15], end: [9, 0] },
    { offset: 24, summary: "Soccer practice", start: [17, 30], end: [19, 0] },
    { offset: 27, summary: "Parent-teacher night", start: [18, 0], end: [19, 30], status: "tentative" },
    { offset: 30, summary: "Halloween party", start: [18, 0], end: [22, 0], location: "Community center" },
  ],
  "calendar.work": [
    { offset: 1, summary: "Sprint planning", start: [9, 0], end: [10, 30] },
    { offset: 1, summary: "1:1 with Sam", start: [14, 0], end: [14, 30] },
    { offset: 2, summary: "Design review", start: [11, 0], end: [12, 0] },
    { offset: 4, summary: "Quarterly all-hands", start: [13, 0], end: [14, 0] },
    { offset: 4, summary: "Team lunch", start: [12, 0], end: [13, 0] },
    { offset: 4, summary: "Launch retro", start: [15, 0], end: [16, 0] },
    { offset: 4, summary: "Customer call", start: [16, 30], end: [17, 0] },
    { offset: 8, summary: "Offsite", allDay: 2, location: "Lake Geneva" },
    { offset: 15, summary: "Sprint planning", start: [9, 0], end: [10, 30] },
    { offset: 16, summary: "Conference", allDay: 5, location: "Austin, TX" },
    { offset: 22, summary: "Release v4.2", start: [10, 0], end: [11, 0] },
    { offset: 29, summary: "Sprint planning", start: [9, 0], end: [10, 30] },
  ],
  "calendar.holidays": [
    { offset: 11, summary: "Indigenous Peoples' Day", allDay: 1 },
    { offset: 30, summary: "Halloween", allDay: 1 },
  ],
};

const buildEvents = (entity, startMs, endMs) =>
  (EVENTS[entity] ?? [])
    .map((tpl, idx) => {
      const date = addDays(monthStart, tpl.offset);
      const base = {
        summary: tpl.summary,
        description: tpl.description ?? null,
        location: tpl.location ?? null,
        uid: `${entity}-${idx}`,
        recurrence_id: null,
        rrule: null,
        status: tpl.status ?? null,
      };
      if (tpl.allDay) {
        return { ...base, start: date, end: addDays(date, tpl.allDay), all_day: true };
      }
      return {
        ...base,
        start: chicago(date, ...tpl.start),
        end: chicago(date, ...tpl.end),
        all_day: false,
      };
    })
    .filter((ev) => {
      const s = Date.parse(ev.all_day ? `${ev.start}T00:00:00-05:00` : ev.start);
      const e = Date.parse(ev.all_day ? `${ev.end}T00:00:00-05:00` : ev.end);
      return e > startMs && s < endMs;
    });

const CONDITIONS = ["sunny", "partlycloudy", "cloudy", "rainy", "sunny", "partlycloudy", "pouring", "lightning-rainy", "fog", "windy"];

const dailyForecast = () => {
  const rand = seeded(42);
  return Array.from({ length: 8 }, (_, i) => {
    const date = addDays(todayStr, i);
    const high = 64 + Math.round(rand() * 14);
    const condition = CONDITIONS[Math.floor(rand() * CONDITIONS.length)];
    return {
      datetime: chicago(date, 12),
      condition,
      temperature: high,
      templow: high - 10 - Math.round(rand() * 8),
      precipitation: condition.includes("rain") || condition === "pouring" ? 0.3 : 0,
      precipitation_probability: condition.includes("rain") || condition === "pouring" ? 70 : Math.round(rand() * 20),
    };
  });
};

const weatherHistory = (startIso, endIso) => {
  const rand = seeded(7);
  const states = [];
  for (let t = Date.parse(startIso); t < Date.parse(endIso); t += 3 * 3600_000) {
    const hour = new Date(t).getUTCHours() - 5;
    const day = Math.floor(t / DAY);
    const condition = CONDITIONS[(day * 7) % CONDITIONS.length];
    const swing = Math.sin(((hour - 9) / 24) * 2 * Math.PI) * 8;
    states.push({
      s: hour >= 19 || hour < 6 ? (condition === "sunny" ? "clear-night" : condition) : condition,
      a: { temperature: Math.round(62 + swing + rand() * 4), temperature_unit: "°F", friendly_name: "Home" },
      lu: t / 1000,
    });
  }
  return states;
};

const statistics = (startIso, endIso) => {
  const rand = seeded(99);
  const out = [];
  for (let t = Date.parse(startIso); t < Date.parse(endIso); t += DAY) {
    const max = 66 + Math.round(rand() * 10);
    out.push({ start: t, end: t + DAY, max, min: max - 14 - Math.round(rand() * 4), mean: max - 7 });
  }
  return out;
};

// Fake Open-Meteo responses (the card calls it from the browser).
const realFetch = window.fetch.bind(window);
window.fetch = async (input, init) => {
  const url = new URL(typeof input === "string" ? input : input.url);
  if (!url.hostname.endsWith("open-meteo.com")) return realFetch(input, init);
  const start = url.searchParams.get("start_date");
  const end = url.searchParams.get("end_date");
  const rand = seeded(start.split("-").join("") % 100000);
  const time = [];
  for (let d = start; d <= end; d = addDays(d, 1)) time.push(d);
  const daily = {
    time,
    weather_code: time.map(() => [0, 1, 2, 3, 61, 80][Math.floor(rand() * 6)]),
    temperature_2m_max: time.map((d) => 72 - (Number(d.slice(8, 10)) / 3) + rand() * 6),
    temperature_2m_min: time.map((d) => 52 - (Number(d.slice(8, 10)) / 3) + rand() * 6),
    precipitation_sum: time.map(() => (rand() < 0.3 ? rand() * 0.5 : 0)),
    precipitation_probability_max: time.map(() => Math.round(rand() * 60)),
  };
  return new Response(JSON.stringify({ daily }), { status: 200 });
};

const state = (entity_id, s, attributes) => ({
  entity_id,
  state: s,
  attributes,
  last_changed: new Date().toISOString(),
  last_updated: new Date().toISOString(),
});

export const createHass = (overrides = {}) => ({
  states: {
    "calendar.family": state("calendar.family", "off", { friendly_name: "Family" }),
    "calendar.work": state("calendar.work", "off", { friendly_name: "Work" }),
    "calendar.holidays": state("calendar.holidays", "off", { friendly_name: "US Holidays" }),
    "weather.home": state("weather.home", "sunny", {
      friendly_name: "Home",
      temperature: 68,
      temperature_unit: "°F",
      precipitation_unit: "in",
      supported_features: 1,
    }),
    "sensor.outdoor_temperature": state("sensor.outdoor_temperature", "67.1", {
      unit_of_measurement: "°F",
      device_class: "temperature",
      state_class: "measurement",
    }),
  },
  config: {
    latitude: 41.88,
    longitude: -87.63,
    time_zone: TZ,
    unit_system: { temperature: "°F", length: "mi", accumulated_precipitation: "in" },
  },
  locale: { language: "en", time_format: "language", time_zone: "server" },
  language: "en",
  localize: () => "",
  formatEntityState: (_stateObj, value) =>
    ({ partlycloudy: "Partly cloudy", "lightning-rainy": "Lightning, rainy", "clear-night": "Clear, night" })[value] ??
    value.charAt(0).toUpperCase() + value.slice(1),
  callApi: async (_method, path) => {
    const [entity, query] = path.replace("calendars/", "").split("?");
    const params = new URLSearchParams(query);
    return buildEvents(entity, Date.parse(params.get("start")), Date.parse(params.get("end")));
  },
  callWS: async (msg) => {
    switch (msg.type) {
      case "history/history_during_period":
        return { [msg.entity_ids[0]]: weatherHistory(msg.start_time, msg.end_time) };
      case "recorder/statistics_during_period":
        return { [msg.statistic_ids[0]]: statistics(msg.start_time, msg.end_time) };
      case "config/entity_registry/get_entries":
        return { "calendar.holidays": { options: { calendar: { color: "#2e7d32" } } } };
      default:
        throw { code: "unknown_command", message: msg.type };
    }
  },
  connection: {
    subscribeMessage: async (callback, msg) => {
      if (msg.type === "calendar/event/subscribe") {
        setTimeout(() =>
          callback({ events: buildEvents(msg.entity_id, Date.parse(msg.start), Date.parse(msg.end)) }),
        );
      } else if (msg.type === "weather/subscribe_forecast") {
        setTimeout(() => callback({ type: msg.forecast_type, forecast: dailyForecast() }));
      } else {
        throw { code: "unknown_command", message: msg.type };
      }
      return () => {};
    },
  },
  ...overrides,
});
