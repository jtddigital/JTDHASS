import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { CalendarEventsController, eventsForDay, layoutWeek, type EventSegment } from "./calendar-data";
import {
  CARD_NAME,
  CARD_TYPE,
  CARD_VERSION,
  DEFAULTS,
  EDITOR_TYPE,
  MAX_WEEKS,
  MIN_WEEKS,
  type ResolvedConfig,
} from "./const";
import {
  addMonths,
  browserTimeZone,
  dayInZone,
  firstOfMonth,
  monthGrid,
  startOfDayInZone,
  startOfWeek,
  ymdFromDay,
} from "./date-utils";
import { JtdCalendarCardEditor } from "./editor";
import { localize, localizeCondition, type StringKey } from "./localize";
import { cardStyles } from "./styles";
import type {
  CalEvent,
  CalendarInfo,
  CalendarView,
  CardConfig,
  DayWeather,
  HomeAssistant,
  LovelaceGridOptions,
} from "./types";
import { Formatter, computeCssColor, formatTemperature, normalizeEntities, paletteColor } from "./util";
import { WeatherController } from "./weather-data";

const WEATHER_ICONS: Record<string, string> = {
  "clear-night": "mdi:weather-night",
  cloudy: "mdi:weather-cloudy",
  exceptional: "mdi:alert-circle-outline",
  fog: "mdi:weather-fog",
  hail: "mdi:weather-hail",
  lightning: "mdi:weather-lightning",
  "lightning-rainy": "mdi:weather-lightning-rainy",
  partlycloudy: "mdi:weather-partly-cloudy",
  pouring: "mdi:weather-pouring",
  rainy: "mdi:weather-rainy",
  snowy: "mdi:weather-snowy",
  "snowy-rainy": "mdi:weather-snowy-rainy",
  sunny: "mdi:weather-sunny",
  windy: "mdi:weather-windy",
  "windy-variant": "mdi:weather-windy-variant",
};

const WEATHER_TONES: Record<string, string> = {
  sunny: "sun",
  partlycloudy: "sun",
  "clear-night": "night",
  cloudy: "cloud",
  fog: "cloud",
  rainy: "rain",
  pouring: "rain",
  snowy: "snow",
  "snowy-rainy": "snow",
  hail: "snow",
  lightning: "storm",
  "lightning-rainy": "storm",
  windy: "wind",
  "windy-variant": "wind",
  exceptional: "alert",
};

const SOURCE_LABELS: Record<DayWeather["source"], StringKey> = {
  forecast: "forecast",
  history: "observed",
  normal: "typical",
};

type DialogState =
  | { kind: "day"; day: number }
  | { kind: "event"; event: CalEvent; fromDay?: number };

const clampWeeks = (value: unknown): number => {
  const weeks = Math.round(Number(value));
  return Number.isFinite(weeks)
    ? Math.min(MAX_WEEKS, Math.max(MIN_WEEKS, weeks))
    : DEFAULTS.weeks;
};

export class JtdCalendarCard extends LitElement {
  static override styles = cardStyles;

  public static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_TYPE);
  }

  public static getStubConfig(hass: HomeAssistant): Partial<CardConfig> {
    const ids = Object.keys(hass.states);
    const calendars = ids.filter((id) => id.startsWith("calendar.")).slice(0, 3);
    const weather = ids.find((id) => id.startsWith("weather."));
    return {
      entities: calendars.map((entity) => ({ entity })),
      ...(weather ? { weather_entity: weather } : {}),
    };
  }

  @property({ attribute: false }) accessor hass: HomeAssistant | undefined;

  @state() private accessor _config: ResolvedConfig | undefined;

  @state() private accessor _view: CalendarView = "month";

  @state() private accessor _weeks: number = DEFAULTS.weeks;

  /** Day the view is anchored on; undefined follows today. */
  @state() private accessor _anchor: number | undefined;

  @state() private accessor _hidden = new Set<string>();

  @state() private accessor _dialog: DialogState | undefined;

  @state() private accessor _registryColors: Record<string, string> = {};

  @query("dialog") private accessor _dialogEl: HTMLDialogElement | null = null;

  private readonly _events = new CalendarEventsController(this);

  private readonly _weather = new WeatherController(this);

  private _today = 0;

  private _clock?: ReturnType<typeof setInterval>;

  private _registryKey = "";

  private _formatter?: Formatter;

  // ------------------------------------------------------------- lifecycle

  public setConfig(config: CardConfig): void {
    if (!config || typeof config !== "object") {
      throw new Error("Invalid configuration");
    }
    if (config.entities !== undefined && !Array.isArray(config.entities)) {
      throw new Error("`entities` must be a list of calendar entities");
    }
    for (const item of normalizeEntities(config.entities)) {
      if (!item.entity.startsWith("calendar.")) {
        throw new Error(`${item.entity} is not a calendar entity`);
      }
    }
    if (config.view && !["month", "weeks"].includes(config.view)) {
      throw new Error("`view` must be `month` or `weeks`");
    }
    const previous = this._config;
    const resolved = { ...DEFAULTS, ...config } as ResolvedConfig;
    resolved.weeks = clampWeeks(resolved.weeks);
    resolved.past_weeks = Math.max(0, Math.round(Number(resolved.past_weeks)) || 0);
    resolved.max_events_per_day = Math.max(1, Math.round(Number(resolved.max_events_per_day)) || 1);
    this._config = resolved;
    if (!previous || previous.view !== resolved.view) this._view = resolved.view;
    if (!previous || previous.weeks !== resolved.weeks) this._weeks = resolved.weeks;
    if (
      previous &&
      (previous.view !== resolved.view ||
        previous.past_weeks !== resolved.past_weeks ||
        previous.first_day_of_week !== resolved.first_day_of_week)
    ) {
      this._anchor = undefined;
    }
  }

  public getCardSize(): number {
    const weeks = this._view === "month" ? 5 : this._weeks;
    return 2 + weeks * 2;
  }

  public getGridOptions(): LovelaceGridOptions {
    return { columns: 12, rows: "auto", min_columns: 6 };
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Roll over to the next day at midnight.
    this._clock = setInterval(() => {
      if (this.hass && this._computeToday() !== this._today) this.requestUpdate();
    }, 60_000);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    clearInterval(this._clock);
  }

  protected override shouldUpdate(changed: PropertyValues): boolean {
    if (changed.size !== 1 || !changed.has("hass")) return true;
    const previous = changed.get("hass") as HomeAssistant | undefined;
    const hass = this.hass;
    if (!previous || !hass || !this._config) return true;
    if (
      previous.locale !== hass.locale ||
      previous.config !== hass.config ||
      previous.language !== hass.language
    ) {
      return true;
    }
    return this._watchedEntities().some((id) => previous.states[id] !== hass.states[id]);
  }

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    const hass = this.hass;
    const config = this._config;
    if (!hass || !config) return;

    const timeZone = this._timeZone(hass);
    const localeChanged =
      changed.has("hass") &&
      (changed.get("hass") as HomeAssistant | undefined)?.locale !== hass.locale;
    if (!this._formatter || this._formatter.timeZone !== timeZone || localeChanged) {
      this._formatter = new Formatter(hass.locale ?? { language: hass.language }, timeZone);
    }
    this._today = this._computeToday();

    const { start, weeks } = this._range();
    const lastDay = start + weeks * 7 - 1;
    const entities = normalizeEntities(config.entities).map((item) => item.entity);
    this._events.update(
      hass,
      entities,
      startOfDayInZone(start, timeZone),
      startOfDayInZone(lastDay + 1, timeZone),
      timeZone,
    );

    const hasWeather = Boolean(config.weather_entity || config.temperature_entity || config.open_meteo);
    this._weather.update(hass, {
      weatherEntity: config.weather_entity,
      temperatureEntity: config.temperature_entity,
      firstDay: start,
      lastDay,
      today: this._today,
      timeZone,
      serverTimeZone: hass.config.time_zone || timeZone,
      showForecast: hasWeather && config.show_forecast,
      showHistory: hasWeather && config.show_history,
      openMeteo: config.open_meteo,
      showNormals: config.open_meteo && config.show_normals,
    });

    this._loadRegistryColors(hass, entities);
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    if (!changed.has("_dialog")) return;
    const dialog = this._dialogEl;
    if (!dialog) return;
    if (this._dialog && !dialog.open) dialog.showModal();
    if (!this._dialog && dialog.open) dialog.close();
  }

  // --------------------------------------------------------------- helpers

  private _timeZone(hass: HomeAssistant): string {
    return hass.locale?.time_zone === "server" && hass.config.time_zone
      ? hass.config.time_zone
      : browserTimeZone();
  }

  private _computeToday(): number {
    return this.hass ? dayInZone(Date.now(), this._timeZone(this.hass)) : 0;
  }

  private _watchedEntities(): string[] {
    const config = this._config;
    if (!config) return [];
    return [
      ...normalizeEntities(config.entities).map((item) => item.entity),
      config.weather_entity,
      config.temperature_entity,
    ].filter((id): id is string => Boolean(id));
  }

  private get _firstWeekday(): number {
    return this._config?.first_day_of_week === "monday" ? 1 : 0;
  }

  /** Visible grid: first day and number of week rows. */
  private _range(): { start: number; weeks: number; month?: { year: number; month: number } } {
    const today = this._today;
    if (this._view === "month") {
      const { year, month } = ymdFromDay(this._anchor ?? today);
      return { ...monthGrid(year, month, this._firstWeekday), month: { year, month } };
    }
    const start =
      this._anchor !== undefined
        ? startOfWeek(this._anchor, this._firstWeekday)
        : startOfWeek(today, this._firstWeekday) - (this._config?.past_weeks ?? 0) * 7;
    return { start, weeks: this._weeks };
  }

  /** Rows of events per day; the zoomed-in week view (1–2 weeks) shows twice as many. */
  private _maxLanes(): number {
    const max = this._config?.max_events_per_day ?? DEFAULTS.max_events_per_day;
    return this._view === "weeks" && this._weeks <= 2 ? max * 2 : max;
  }

  private _calendars(): CalendarInfo[] {
    const config = this._config;
    if (!config) return [];
    return normalizeEntities(config.entities).map((item, index) => {
      const color = item.color || this._registryColors[item.entity];
      return {
        entity: item.entity,
        name:
          item.name ||
          this.hass?.states[item.entity]?.attributes.friendly_name ||
          item.entity,
        color: color ? computeCssColor(color) : paletteColor(index),
      };
    });
  }

  /** Calendar colors chosen in each entity's settings (like the built-in card). */
  private _loadRegistryColors(hass: HomeAssistant, entities: string[]): void {
    const key = entities.join(",");
    if (key === this._registryKey || !entities.length) return;
    this._registryKey = key;
    hass
      .callWS<Record<string, { options?: { calendar?: { color?: string } } } | null>>({
        type: "config/entity_registry/get_entries",
        entity_ids: entities,
      })
      .then((entries) => {
        const colors: Record<string, string> = {};
        for (const [entity, entry] of Object.entries(entries ?? {})) {
          const color = entry?.options?.calendar?.color;
          if (color) colors[entity] = color;
        }
        this._registryColors = colors;
      })
      .catch(() => undefined);
  }

  private _t(key: StringKey, params?: Record<string, string | number>): string {
    return localize(this.hass, key, params);
  }

  // ------------------------------------------------------------ navigation

  private _navigate(direction: -1 | 1): void {
    if (this._view === "month") {
      const { year, month } = ymdFromDay(this._anchor ?? this._today);
      const next = addMonths(year, month, direction);
      this._setAnchor(firstOfMonth(next.year, next.month));
    } else {
      this._setAnchor(this._range().start + direction * this._weeks * 7);
    }
  }

  /** Anchors the view; landing back on today's month/weeks follows today again. */
  private _setAnchor(anchor: number): void {
    const today = this._today;
    if (this._view === "month") {
      const a = ymdFromDay(anchor);
      const t = ymdFromDay(today);
      this._anchor = a.year === t.year && a.month === t.month ? undefined : anchor;
    } else {
      const defaultStart =
        startOfWeek(today, this._firstWeekday) - (this._config?.past_weeks ?? 0) * 7;
      this._anchor = startOfWeek(anchor, this._firstWeekday) === defaultStart ? undefined : anchor;
    }
  }

  private _goToday(): void {
    this._anchor = undefined;
  }

  private _setView(view: CalendarView): void {
    if (view === this._view) return;
    const anchor = this._anchor;
    this._view = view;
    if (anchor !== undefined) {
      // Month -> weeks starts at the first week of the shown month; weeks ->
      // month shows the month the first visible week mostly belongs to.
      const { year, month } = ymdFromDay(anchor);
      this._setAnchor(view === "weeks" ? firstOfMonth(year, month) : startOfWeek(anchor, this._firstWeekday) + 3);
    }
  }

  private _setWeeks(weeks: number): void {
    this._weeks = clampWeeks(weeks);
  }

  private _toggleCalendar(entity: string): void {
    const hidden = new Set(this._hidden);
    if (hidden.has(entity)) hidden.delete(entity);
    else hidden.add(entity);
    this._hidden = hidden;
  }

  private _openDay(day: number): void {
    this._dialog = { kind: "day", day };
  }

  private _openEvent(event: CalEvent, fromDay?: number): void {
    this._dialog = { kind: "event", event, fromDay };
  }

  private _closeDialog(): void {
    this._dialog = undefined;
  }

  // ---------------------------------------------------------------- render

  protected override render() {
    const config = this._config;
    const hass = this.hass;
    if (!config || !hass || !this._formatter) return nothing;

    const range = this._range();
    const calendars = this._calendars();
    const colors = new Map(calendars.map((cal) => [cal.entity, cal.color]));
    const events = this._events.allEvents(this._hidden);
    const errors = [...this._events.errors];
    const isWeeks = this._view === "weeks";
    const weekMinHeight = !isWeeks ? 96 : this._weeks <= 2 ? 150 : this._weeks <= 4 ? 118 : 96;

    return html`
      <ha-card>
        ${this._events.loaded ? nothing : html`<div class="loading" role="progressbar"></div>`}
        <div class="card ${config.dim_past ? "dim" : ""}">
          ${this._renderHeader(config, range, calendars)}
          ${errors.length
            ? html`<div class="notice">${this._t("error", { entities: errors.join(", ") })}</div>`
            : nothing}
          ${calendars.length === 0 && !config.weather_entity && !config.open_meteo
            ? html`<div class="notice">${this._t("no_entities")}</div>`
            : nothing}
          ${this._renderWeekdays(range.start)}
          <div class="weeks" style="--jtd-week-min-height: ${weekMinHeight}px">
            ${Array.from({ length: range.weeks }, (_, week) =>
              this._renderWeek(range.start + week * 7, range.start, range.month, events, colors),
            )}
          </div>
          ${isWeeks && config.show_controls ? this._renderExpander() : nothing}
        </div>
        <dialog
          @close=${this._closeDialog}
          @click=${(ev: Event) => {
            if (ev.target === ev.currentTarget) this._closeDialog();
          }}
        >
          ${this._dialog ? this._renderDialog(this._dialog, events, calendars) : nothing}
        </dialog>
      </ha-card>
    `;
  }

  private _renderHeader(
    config: ResolvedConfig,
    range: ReturnType<JtdCalendarCard["_range"]>,
    calendars: CalendarInfo[],
  ) {
    const fmt = this._formatter!;
    const label = range.month
      ? fmt.monthYear(firstOfMonth(range.month.year, range.month.month))
      : fmt.dayRange(range.start, range.start + range.weeks * 7 - 1);
    const showLegend = config.show_legend && calendars.length > 1;

    return html`
      <div class="header">
        ${config.title ? html`<div class="title">${config.title}</div>` : nothing}
        <div class="toolbar">
          <div class="nav">
            ${config.show_controls
              ? html`
                  <button
                    class="icon-button"
                    aria-label=${this._t("previous")}
                    title=${this._t("previous")}
                    @click=${() => this._navigate(-1)}
                  >
                    <ha-icon icon="mdi:chevron-left"></ha-icon>
                  </button>
                  <button
                    class="icon-button"
                    aria-label=${this._t("next")}
                    title=${this._t("next")}
                    @click=${() => this._navigate(1)}
                  >
                    <ha-icon icon="mdi:chevron-right"></ha-icon>
                  </button>
                `
              : nothing}
            <h2 class="range">${label}</h2>
          </div>
          ${config.show_controls
            ? html`
                <div class="actions">
                  <button
                    class="pill"
                    @click=${this._goToday}
                    title=${this._t("today")}
                  >
                    <ha-icon icon="mdi:calendar-today"></ha-icon>
                    <span class="label">${this._t("today")}</span>
                  </button>
                  <div class="segmented" role="group">
                    <button
                      aria-pressed=${String(this._view === "weeks")}
                      title=${this._t("week_view")}
                      @click=${() => this._setView("weeks")}
                    >
                      <ha-icon icon="mdi:calendar-week"></ha-icon>
                      <span>${this._t("week_view")}</span>
                    </button>
                    <button
                      aria-pressed=${String(this._view === "month")}
                      title=${this._t("month_view")}
                      @click=${() => this._setView("month")}
                    >
                      <ha-icon icon="mdi:calendar-month"></ha-icon>
                      <span>${this._t("month_view")}</span>
                    </button>
                  </div>
                </div>
              `
            : nothing}
        </div>
        ${showLegend
          ? html`
              <div class="legend">
                ${calendars.map(
                  (cal) => html`
                    <button
                      class="chip"
                      style="--event-color: ${cal.color}"
                      aria-pressed=${String(!this._hidden.has(cal.entity))}
                      @click=${() => this._toggleCalendar(cal.entity)}
                    >
                      <span class="dot"></span><span>${cal.name}</span>
                    </button>
                  `,
                )}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _renderWeekdays(start: number) {
    const fmt = this._formatter!;
    return html`
      <div class="weekdays" aria-hidden="true">
        ${Array.from(
          { length: 7 },
          (_, i) => html`
            <div>
              <span class="wide">${fmt.weekday(start + i, "short")}</span
              ><span class="narrow">${fmt.weekday(start + i, "narrow")}</span>
            </div>
          `,
        )}
      </div>
    `;
  }

  private _renderWeek(
    weekStart: number,
    rangeStart: number,
    focusMonth: { year: number; month: number } | undefined,
    events: CalEvent[],
    colors: Map<string, string>,
  ) {
    const config = this._config!;
    const fmt = this._formatter!;
    const today = this._today;
    const layout = layoutWeek(events, weekStart, this._maxLanes());
    const rows = [
      "auto",
      ...(layout.lanes ? [`repeat(${layout.lanes}, var(--jtd-event-height))`] : []),
      "minmax(4px, 1fr)",
    ].join(" ");

    const days = Array.from({ length: 7 }, (_, col) => {
      const day = weekStart + col;
      const ymd = ymdFromDay(day);
      const otherMonth = focusMonth !== undefined && ymd.month !== focusMonth.month;
      return { day, col, ymd, otherMonth };
    });

    return html`
      <div class="week" style="grid-template-rows: ${rows}">
        ${days.map(
          ({ day, col, otherMonth }) => html`
            <button
              class=${classMap({
                day: true,
                today: day === today,
                "other-month": otherMonth,
                "last-col": col === 6,
              })}
              style="grid-column: ${col + 1}"
              aria-label=${fmt.dayLong(day)}
              @click=${() => this._openDay(day)}
            ></button>
          `,
        )}
        ${days.map(
          ({ day, col, ymd, otherMonth }) => html`
            <div
              class=${classMap({
                "day-head": true,
                "today-head": day === today,
                "other-month-head": otherMonth,
                "past-head": config.dim_past && day < today,
              })}
              style="grid-column: ${col + 1}"
            >
              <span class="date"
                >${ymd.day === 1 || (day === rangeStart && this._view === "weeks")
                  ? `${fmt.monthShort(day)} ${ymd.day}`
                  : ymd.day}</span
              >
              ${this._renderCellWeather(day)}
            </div>
          `,
        )}
        ${layout.segments.map((seg) => this._renderSegment(seg, colors, today))}
        ${layout.more.map((count, col) =>
          count
            ? html`
                <button
                  class="more"
                  style="grid-column: ${col + 1}; grid-row: ${layout.lanes + 1}"
                  @click=${() => this._openDay(weekStart + col)}
                >
                  ${this._t("more", { count })}
                </button>
              `
            : nothing,
        )}
      </div>
    `;
  }

  private _renderSegment(seg: EventSegment, colors: Map<string, string>, today: number) {
    const { event } = seg;
    const config = this._config!;
    const fmt = this._formatter!;
    const spanning = event.allDay || event.endDay > event.startDay;
    const time = event.allDay ? undefined : fmt.compactTime(event.start);
    const tooltip = [
      event.summary,
      fmt.eventRange(event, this._t("all_day")),
      event.location,
    ]
      .filter(Boolean)
      .join("\n");

    return html`
      <button
        class=${classMap({
          event: true,
          spanning,
          timed: !spanning,
          tentative: event.tentative,
          past: event.endDay < today || (!event.allDay && event.end < Date.now()),
          "cont-before": seg.continuesBefore,
          "cont-after": seg.continuesAfter,
        })}
        style="grid-column: ${seg.col + 1} / span ${seg.span}; grid-row: ${seg.lane + 2}; --event-color: ${colors.get(event.calendar) ?? "var(--primary-color)"}"
        title=${tooltip}
        @click=${(ev: Event) => {
          ev.stopPropagation();
          this._openEvent(event);
        }}
      >
        ${spanning
          ? html`<span class="label"
              >${time && !seg.continuesBefore && config.show_event_time ? `${time} ` : ""}${event.summary}</span
            >`
          : html`
              <span class="dot"></span>
              ${config.show_event_time && time ? html`<span class="time">${time}</span>` : nothing}
              <span class="label">${event.summary}</span>
            `}
      </button>
    `;
  }

  private _weatherTooltip(weather: DayWeather): string {
    const parts = [
      weather.condition ? localizeCondition(this.hass, weather.condition, this._config?.weather_entity) : "",
      weather.high !== undefined ? `${this._t("high")} ${formatTemperature(weather.high)}` : "",
      weather.low !== undefined ? `${this._t("low")} ${formatTemperature(weather.low)}` : "",
      weather.precipitationProbability !== undefined
        ? `${this._t("chance")} ${weather.precipitationProbability}%`
        : "",
      this._t(SOURCE_LABELS[weather.source]),
    ];
    return parts.filter(Boolean).join("\n");
  }

  private _renderCellWeather(day: number) {
    const weather = this._weather.dayWeather(day);
    if (!weather) return nothing;
    const icon = weather.condition ? WEATHER_ICONS[weather.condition] : undefined;
    const pop = weather.precipitationProbability;
    return html`
      <span class="wx ${weather.source}" title=${this._weatherTooltip(weather)}>
        ${icon
          ? html`<ha-icon
              class="wx-icon tone-${WEATHER_TONES[weather.condition!] ?? "cloud"}"
              .icon=${icon}
            ></ha-icon>`
          : nothing}
        ${weather.high !== undefined || weather.low !== undefined
          ? html`<span class="temps"
              ><span class="hi">${formatTemperature(weather.high)}</span
              ><span class="lo">${formatTemperature(weather.low)}</span></span
            >`
          : nothing}
        ${this._config!.show_precipitation && pop !== undefined && pop >= 20 && weather.source === "forecast"
          ? html`<span class="pop"><ha-icon icon="mdi:water"></ha-icon>${pop}%</span>`
          : nothing}
      </span>
    `;
  }

  private _renderExpander() {
    const weeks = this._weeks;
    return html`
      <div class="expander">
        <button
          class="pill"
          ?disabled=${weeks <= MIN_WEEKS}
          title=${this._t("collapse")}
          @click=${() => this._setWeeks(weeks - 1)}
        >
          <ha-icon icon="mdi:chevron-up"></ha-icon>
        </button>
        <span>${weeks === 1 ? this._t("one_week") : this._t("weeks_label", { count: weeks })}</span>
        <button
          class="pill"
          ?disabled=${weeks >= MAX_WEEKS}
          title=${this._t("expand")}
          @click=${() => this._setWeeks(weeks + 1)}
        >
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </button>
      </div>
    `;
  }

  // ---------------------------------------------------------------- dialog

  private _renderDialog(
    dialog: DialogState,
    events: CalEvent[],
    calendars: CalendarInfo[],
  ): TemplateResult {
    return dialog.kind === "day"
      ? this._renderDayDialog(dialog.day, events, calendars)
      : this._renderEventDialog(dialog.event, calendars, dialog.fromDay);
  }

  private _renderDayDialog(day: number, events: CalEvent[], calendars: CalendarInfo[]) {
    const fmt = this._formatter!;
    const dayEvents = eventsForDay(events, day);
    const byEntity = new Map(calendars.map((cal) => [cal.entity, cal]));
    const weather = this._weather.dayWeather(day);
    const ymd = ymdFromDay(day);

    return html`
      <div class="dlg" tabindex="-1" autofocus>
        <div class="dlg-head">
          <div class="grow">
            <div class="dlg-sub">${fmt.weekday(day, "long")}</div>
            <h3>${fmt.monthShort(day)} ${ymd.day}, ${ymd.year}</h3>
          </div>
          <button class="icon-button" aria-label=${this._t("close")} @click=${this._closeDialog}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        ${weather ? this._renderWeatherCard(weather) : nothing}
        <div class="dlg-events">
          ${dayEvents.length
            ? dayEvents.map((event) => {
                const cal = byEntity.get(event.calendar);
                return html`
                  <button
                    class="dlg-event"
                    style="--event-color: ${cal?.color ?? "var(--primary-color)"}"
                    @click=${() => this._openEvent(event, day)}
                  >
                    <span class="bar"></span>
                    <div class="grow">
                      <div class="summary">${event.summary}</div>
                      <div class="meta">
                        ${fmt.eventRange(event, this._t("all_day"))}${cal ? ` · ${cal.name}` : ""}
                      </div>
                      ${event.location ? html`<div class="meta">${event.location}</div>` : nothing}
                    </div>
                    <ha-icon icon="mdi:chevron-right"></ha-icon>
                  </button>
                `;
              })
            : html`<div class="dlg-empty">${this._t("no_events")}</div>`}
        </div>
      </div>
    `;
  }

  private _renderWeatherCard(weather: DayWeather) {
    const icon = weather.condition ? WEATHER_ICONS[weather.condition] : "mdi:thermometer";
    const tone = weather.condition ? WEATHER_TONES[weather.condition] ?? "cloud" : "cloud";
    const precipitation =
      weather.precipitation !== undefined && weather.precipitation > 0
        ? `${Math.round(weather.precipitation * 100) / 100} ${weather.precipitationUnit ?? ""}`.trim()
        : undefined;
    const pop =
      weather.precipitationProbability !== undefined
        ? `${weather.precipitationProbability}%`
        : undefined;
    return html`
      <div class="wx-card">
        <ha-icon class="tone-${tone}" .icon=${icon}></ha-icon>
        <div class="grow">
          <div class="cond">
            ${weather.condition
              ? localizeCondition(this.hass, weather.condition, this._config?.weather_entity)
              : this._t(SOURCE_LABELS[weather.source])}
          </div>
          ${pop || precipitation
            ? html`<div class="meta">
                ${this._t("precipitation")}: ${[pop, precipitation].filter(Boolean).join(" · ")}
              </div>`
            : nothing}
          <div class="src">${this._t(SOURCE_LABELS[weather.source])} · ${weather.provider}</div>
        </div>
        <div class="temps-big">
          <span class="hi">${formatTemperature(weather.high)}</span>
          <span class="lo">${formatTemperature(weather.low)}</span>
        </div>
      </div>
    `;
  }

  private _renderEventDialog(event: CalEvent, calendars: CalendarInfo[], fromDay?: number) {
    const fmt = this._formatter!;
    const cal = calendars.find((item) => item.entity === event.calendar);
    const ymd = ymdFromDay(event.startDay);
    const when = event.allDay
      ? event.startDay === event.endDay
        ? `${fmt.weekday(event.startDay, "long")}, ${fmt.monthShort(event.startDay)} ${ymd.day} · ${this._t("all_day")}`
        : `${fmt.eventRange(event, this._t("all_day"))} · ${this._t("all_day")}`
      : event.startDay === event.endDay
        ? `${fmt.weekday(event.startDay, "long")}, ${fmt.monthShort(event.startDay)} ${ymd.day} · ${fmt.eventRange(event, "")}`
        : fmt.eventRange(event, "");

    return html`
      <div class="dlg" tabindex="-1" autofocus>
        <div class="dlg-head">
          ${fromDay !== undefined
            ? html`<button
                class="icon-button back"
                aria-label=${this._t("back")}
                @click=${() => this._openDay(fromDay)}
              >
                <ha-icon icon="mdi:arrow-left"></ha-icon>
              </button>`
            : nothing}
          <div class="grow"><h3>${event.summary}</h3></div>
          <button class="icon-button" aria-label=${this._t("close")} @click=${this._closeDialog}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        ${event.tentative ? html`<span class="badge">${this._t("tentative")}</span>` : nothing}
        <div class="detail-rows">
          <div class="detail">
            <ha-icon icon="mdi:clock-outline"></ha-icon>
            <div class="text">${when}</div>
          </div>
          ${cal
            ? html`<div class="detail" style="--event-color: ${cal.color}">
                <span class="dot"></span>
                <div class="text">${cal.name}</div>
              </div>`
            : nothing}
          ${event.location
            ? html`<div class="detail">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <div class="text">${event.location}</div>
              </div>`
            : nothing}
          ${event.description
            ? html`<div class="detail">
                <ha-icon icon="mdi:text"></ha-icon>
                <div class="text">${event.description}</div>
              </div>`
            : nothing}
        </div>
      </div>
    `;
  }
}

// ------------------------------------------------------------- registration

if (!customElements.get(CARD_TYPE)) {
  customElements.define(CARD_TYPE, JtdCalendarCard);
}
if (!customElements.get(EDITOR_TYPE)) {
  customElements.define(EDITOR_TYPE, JtdCalendarCardEditor);
}

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === CARD_TYPE)) {
  window.customCards.push({
    type: CARD_TYPE,
    name: CARD_NAME,
    description:
      "Month and expandable week view of your calendars with forecast and historical weather on every day.",
    preview: true,
    documentationURL: "https://github.com/jtddigital/JTDHASS",
  });
}

console.info(
  `%c JTD-CALENDAR-CARD %c ${CARD_VERSION} `,
  "color: white; background: #4269d0; font-weight: 700;",
  "color: #4269d0; background: white; font-weight: 700;",
);
