import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { DEFAULTS } from "./const";
import type { CardConfig, HomeAssistant } from "./types";
import { normalizeEntities } from "./util";

// Visual editor: Home Assistant's own form engine (ha-form) with selectors, so
// the editor looks and behaves like the built-in card editors.
const LABELS: Record<string, string> = {
  title: "Title",
  entities: "Calendars",
  view: "Initial view",
  weeks: "Weeks shown in week view",
  past_weeks: "Past weeks in week view",
  first_day_of_week: "First day of the week",
  max_events_per_day: "Max events per day",
  show_controls: "Navigation controls",
  show_legend: "Calendar legend",
  show_event_time: "Event start times",
  dim_past: "Dim past days",
  weather_entity: "Weather entity (forecast)",
  temperature_entity: "Outdoor temperature sensor (history)",
  show_forecast: "Show forecast",
  show_history: "Show historical weather",
  show_precipitation: "Show chance of precipitation",
  open_meteo: "Fill gaps with Open-Meteo",
  show_normals: "Typical weather beyond the forecast",
};

const HELPERS: Record<string, string> = {
  entities: "Colors default to the color set in each calendar's entity settings.",
  weeks: "How many Sunday–Saturday rows the week view shows. Expand or shrink it from the card.",
  past_weeks: "Start the week view this many weeks before the current week.",
  max_events_per_day: "Extra events collapse into a “+N more” link.",
  weather_entity: "Daily forecast from a Home Assistant weather entity. Past days use its recorded history.",
  temperature_entity:
    "Long-term statistics of this sensor give exact highs and lows for any past day.",
  open_meteo:
    "Keyless Open-Meteo data for your home location fills days Home Assistant has no weather for: older history and a 16-day forecast.",
  show_normals:
    "Requires Open-Meteo. Days past the forecast show the 5-year average high/low so the whole month has weather.",
};

const ENTITY_FIELDS = {
  entity: {
    label: "Calendar",
    required: true,
    selector: { entity: { filter: { domain: "calendar" } } },
  },
  name: { label: "Name", selector: { text: {} } },
  color: { label: "Color", selector: { ui_color: {} } },
};

const SCHEMA = [
    { name: "title", selector: { text: {} } },
    {
      name: "entities",
      required: true,
      selector: {
        object: {
          multiple: true,
          label_field: "entity",
          description_field: "name",
          fields: ENTITY_FIELDS,
        },
      },
    },
    {
      name: "",
      type: "expandable",
      flatten: true,
      title: "Layout",
      icon: "mdi:calendar-week",
      schema: [
        {
          name: "view",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "month", label: "Month" },
                { value: "weeks", label: "Weeks" },
              ],
            },
          },
        },
        {
          name: "",
          type: "grid",
          schema: [
            { name: "weeks", selector: { number: { min: 1, max: 6, mode: "box" } } },
            { name: "past_weeks", selector: { number: { min: 0, max: 5, mode: "box" } } },
          ],
        },
        {
          name: "",
          type: "grid",
          schema: [
            {
              name: "first_day_of_week",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "sunday", label: "Sunday" },
                    { value: "monday", label: "Monday" },
                  ],
                },
              },
            },
            {
              name: "max_events_per_day",
              selector: { number: { min: 1, max: 12, mode: "box" } },
            },
          ],
        },
        {
          name: "",
          type: "grid",
          schema: [
            { name: "show_controls", selector: { boolean: {} } },
            { name: "show_legend", selector: { boolean: {} } },
            { name: "show_event_time", selector: { boolean: {} } },
            { name: "dim_past", selector: { boolean: {} } },
          ],
        },
      ],
    },
    {
      name: "",
      type: "expandable",
      flatten: true,
      title: "Weather",
      icon: "mdi:weather-partly-cloudy",
      schema: [
        { name: "weather_entity", selector: { entity: { filter: { domain: "weather" } } } },
        {
          name: "temperature_entity",
          selector: {
            entity: { filter: { domain: "sensor", device_class: "temperature" } },
          },
        },
        {
          name: "",
          type: "grid",
          schema: [
            { name: "show_forecast", selector: { boolean: {} } },
            { name: "show_history", selector: { boolean: {} } },
            { name: "show_precipitation", selector: { boolean: {} } },
          ],
        },
        { name: "open_meteo", selector: { boolean: {} } },
        { name: "show_normals", selector: { boolean: {} } },
      ],
    },
];

declare global {
  interface Window {
    loadCardHelpers?: () => Promise<{
      createCardElement(config: Record<string, unknown>): HTMLElement;
    }>;
  }
}

/** ha-form is lazy-loaded by Home Assistant; built-in card editors pull it in. */
const ensureHaForm = async (): Promise<void> => {
  if (customElements.get("ha-form")) return;
  try {
    const helpers = await window.loadCardHelpers?.();
    const card = helpers?.createCardElement({ type: "entities", entities: [] });
    await (card?.constructor as any)?.getConfigElement?.();
  } catch (_err) {
    // Fall through: the form renders once ha-form gets defined.
  }
};

export class JtdCalendarCardEditor extends LitElement {
  @property({ attribute: false }) accessor hass: HomeAssistant | undefined;

  @state() private accessor _config: CardConfig | undefined;

  @state() private accessor _ready = Boolean(customElements.get("ha-form"));

  public setConfig(config: CardConfig): void {
    this._config = config;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this._ready) {
      ensureHaForm()
        .then(() => customElements.whenDefined("ha-form"))
        .then(() => {
          this._ready = true;
        });
    }
  }

  protected override render() {
    if (!this.hass || !this._config || !this._ready) return nothing;
    // Config keys first (so `type` stays on top), then defaults for the rest.
    const data = {
      ...this._config,
      ...Object.fromEntries(
        Object.entries(DEFAULTS).filter(([key]) => !(key in this._config!)),
      ),
      entities: normalizeEntities(this._config.entities),
    };
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${SCHEMA}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _computeLabel = (schema: { name: string }) => LABELS[schema.name] ?? schema.name;

  private _computeHelper = (schema: { name: string }) => HELPERS[schema.name];

  private _valueChanged(ev: CustomEvent<{ value: Record<string, unknown> }>): void {
    ev.stopPropagation();
    const original = (this._config ?? {}) as Record<string, unknown>;
    const config: Record<string, unknown> = { ...ev.detail.value };
    // Keep the YAML tidy: defaults the user never set stay out of it.
    for (const [key, value] of Object.entries(DEFAULTS)) {
      if (config[key] === value && !(key in original)) delete config[key];
    }
    for (const [key, value] of Object.entries(config)) {
      if (value === "" || value === undefined) delete config[key];
    }
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  static override styles = css`
    :host {
      display: block;
    }
  `;
}
