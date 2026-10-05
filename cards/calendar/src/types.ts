// Minimal Home Assistant frontend types used by the card. The full types live
// in the home-assistant/frontend repository; only what the card touches is
// declared here so the bundle has no dependency on HA internals.

export type UnsubscribeFunc = () => void;

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

export interface HassConnection {
  subscribeMessage<T>(
    callback: (message: T) => void,
    message: Record<string, unknown>,
  ): Promise<UnsubscribeFunc>;
}

export interface HassConfig {
  latitude: number;
  longitude: number;
  time_zone: string;
  unit_system: {
    temperature: string;
    length: string;
    accumulated_precipitation?: string;
  };
}

export interface HassLocale {
  language: string;
  time_format?: "language" | "system" | "12" | "24";
  time_zone?: "local" | "server";
  first_weekday?: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  config: HassConfig;
  locale: HassLocale;
  language: string;
  connection: HassConnection;
  localize(key: string, ...args: unknown[]): string;
  callWS<T>(message: Record<string, unknown>): Promise<T>;
  callApi<T>(method: "GET" | "POST", path: string, data?: unknown): Promise<T>;
  formatEntityState?(stateObj: HassEntity, state?: string): string;
}

export interface LovelaceGridOptions {
  columns?: number | "full";
  rows?: number | "auto";
  min_columns?: number;
  max_columns?: number;
  min_rows?: number;
  max_rows?: number;
}

// ---------------------------------------------------------------------------
// Card configuration
// ---------------------------------------------------------------------------

export interface CalendarEntityConfig {
  entity: string;
  name?: string;
  color?: string;
}

export type CalendarView = "month" | "weeks";
export type FirstDayOfWeek = "sunday" | "monday";

export interface CardConfig {
  type: string;
  title?: string;
  entities: Array<string | CalendarEntityConfig>;
  view?: CalendarView;
  weeks?: number;
  past_weeks?: number;
  first_day_of_week?: FirstDayOfWeek;
  max_events_per_day?: number;
  show_controls?: boolean;
  show_legend?: boolean;
  show_event_time?: boolean;
  dim_past?: boolean;
  weather_entity?: string;
  temperature_entity?: string;
  show_forecast?: boolean;
  show_history?: boolean;
  open_meteo?: boolean;
  show_normals?: boolean;
  show_precipitation?: boolean;
}

// ---------------------------------------------------------------------------
// Data model
// ---------------------------------------------------------------------------

/** Event payload as returned by the REST API or the websocket subscription. */
export type CalendarDateValue = string | { dateTime: string } | { date: string };

export interface CalendarEventApiData {
  summary: string;
  start: CalendarDateValue;
  end: CalendarDateValue;
  description?: string | null;
  location?: string | null;
  uid?: string | null;
  recurrence_id?: string | null;
  rrule?: string | null;
  status?: string | null;
  all_day?: boolean;
}

/** Normalized event used for rendering. Days are day numbers (see date-utils). */
export interface CalEvent {
  id: string;
  calendar: string;
  summary: string;
  description?: string;
  location?: string;
  allDay: boolean;
  tentative: boolean;
  /** Start instant (ms) for timed events, start of day for all-day ones. */
  start: number;
  end: number;
  /** First and last day (inclusive) the event covers in the display zone. */
  startDay: number;
  endDay: number;
}

export interface CalendarInfo {
  entity: string;
  name: string;
  color: string;
}

export type WeatherSource = "forecast" | "history" | "normal";

export interface DayWeather {
  condition?: string;
  high?: number;
  low?: number;
  precipitation?: number;
  precipitationUnit?: string;
  precipitationProbability?: number;
  source: WeatherSource;
  /** Where the data came from, e.g. "weather.home" or "Open-Meteo". */
  provider: string;
}
