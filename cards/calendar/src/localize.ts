import type { HomeAssistant } from "./types";

const STRINGS = {
  today: "Today",
  all_day: "All day",
  more: "+{count} more",
  weeks_label: "{count} weeks",
  one_week: "1 week",
  month_view: "Month view",
  week_view: "Week view",
  previous: "Previous",
  next: "Next",
  expand: "Show more weeks",
  collapse: "Show fewer weeks",
  forecast: "Forecast",
  observed: "Observed",
  typical: "Typical (5-year average)",
  high: "High",
  low: "Low",
  precipitation: "Precipitation",
  chance: "Chance of precipitation",
  no_events: "No events",
  location: "Location",
  description: "Description",
  tentative: "Tentative",
  close: "Close",
  back: "Back",
  source: "Source",
  error: "Could not load events for {entities}",
  no_entities: "Add calendar entities to the card configuration.",
} as const;

export type StringKey = keyof typeof STRINGS;

/** Keys that Home Assistant already translates into the user's language. */
const HA_KEYS: Partial<Record<StringKey, string>> = {
  today: "ui.components.calendar.today",
  all_day: "ui.components.calendar.event.all_day",
  location: "ui.components.calendar.event.location",
  description: "ui.components.calendar.event.description",
  tentative: "ui.components.calendar.event.tentative",
  close: "ui.common.close",
  back: "ui.common.back",
  previous: "ui.common.previous",
  next: "ui.common.next",
  forecast: "ui.card.weather.forecast",
  high: "ui.card.weather.high",
  low: "ui.card.weather.low",
  precipitation: "ui.card.weather.attributes.precipitation",
};

export const localize = (
  hass: HomeAssistant | undefined,
  key: StringKey,
  params: Record<string, string | number> = {},
): string => {
  const haKey = HA_KEYS[key];
  let text = (haKey && hass?.localize?.(haKey)) || STRINGS[key];
  for (const [name, value] of Object.entries(params)) {
    text = text.replace(`{${name}}`, String(value));
  }
  return text;
};

// English names for when Home Assistant has no translation loaded.
const CONDITION_NAMES: Record<string, string> = {
  "clear-night": "Clear, night",
  cloudy: "Cloudy",
  exceptional: "Exceptional",
  fog: "Fog",
  hail: "Hail",
  lightning: "Lightning",
  "lightning-rainy": "Lightning, rainy",
  partlycloudy: "Partly cloudy",
  pouring: "Pouring",
  rainy: "Rainy",
  snowy: "Snowy",
  "snowy-rainy": "Snowy, rainy",
  sunny: "Sunny",
  windy: "Windy",
  "windy-variant": "Windy, cloudy",
};

export const localizeCondition = (
  hass: HomeAssistant | undefined,
  condition: string,
  weatherEntity?: string,
): string => {
  const stateObj = weatherEntity ? hass?.states[weatherEntity] : undefined;
  if (stateObj && hass?.formatEntityState) {
    const formatted = hass.formatEntityState(stateObj, condition);
    if (formatted && formatted !== condition) return formatted;
  }
  return (
    hass?.localize?.(`component.weather.entity_component._.state.${condition}`) ||
    CONDITION_NAMES[condition] ||
    condition
  );
};
