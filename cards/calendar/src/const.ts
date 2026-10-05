import { version } from "../package.json";
import type { CardConfig } from "./types";

export const CARD_TYPE = "jtd-calendar-card";
export const EDITOR_TYPE = "jtd-calendar-card-editor";
export const CARD_NAME = "Month Calendar & Weather";

export const CARD_VERSION = version;

/** Values used when a key is missing from the card configuration. */
export const DEFAULTS = {
  view: "month",
  weeks: 2,
  past_weeks: 0,
  first_day_of_week: "sunday",
  max_events_per_day: 4,
  show_controls: true,
  show_legend: true,
  show_event_time: true,
  dim_past: true,
  show_forecast: true,
  show_history: true,
  show_precipitation: true,
  open_meteo: false,
  show_normals: true,
} as const satisfies Partial<CardConfig>;

export type ResolvedConfig = CardConfig & {
  [K in keyof typeof DEFAULTS]-?: NonNullable<CardConfig[K]>;
};

export const MIN_WEEKS = 1;
export const MAX_WEEKS = 6;
