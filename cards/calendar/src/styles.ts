import { css } from "lit";

// Styling uses Home Assistant theme variables and the 2025+ design tokens
// (--ha-space-*, --ha-font-size-*, --ha-border-radius-*) with fallbacks, so the
// card follows any theme in light and dark mode.

export const cardStyles = css`
  :host {
    display: block;
    height: 100%;
    --jtd-event-height: 20px;
    --jtd-gap: 2px;
    --jtd-border: var(--divider-color, rgba(127, 127, 127, 0.2));
    --jtd-today: var(--primary-color);
    --jtd-sun: var(--jtd-calendar-sun-color, #f9a825);
    --jtd-night: var(--jtd-calendar-night-color, #7e8fbf);
    --jtd-cloud: var(--jtd-calendar-cloud-color, var(--secondary-text-color));
    --jtd-rain: var(--jtd-calendar-rain-color, #1e88e5);
    --jtd-snow: var(--jtd-calendar-snow-color, #4fc3f7);
    --jtd-storm: var(--jtd-calendar-storm-color, #7e57c2);
    --jtd-wind: var(--jtd-calendar-wind-color, #26a69a);
    --jtd-alert: var(--error-color, #db4437);
  }

  ha-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  .card {
    container: jtd-calendar / inline-size;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
  }

  button {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  button:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }
  button:disabled {
    cursor: default;
    opacity: 0.38;
  }

  ha-icon {
    --mdc-icon-size: 20px;
    display: inline-flex;
    flex: none;
  }

  /* ----------------------------------------------------------- header */

  .header {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-2, 8px);
    padding: var(--ha-space-3, 12px) var(--ha-space-3, 12px) var(--ha-space-2, 8px);
  }

  .title {
    font-size: var(--ha-font-size-xl, 20px);
    font-weight: var(--ha-font-weight-heading, var(--ha-font-weight-bold, 700));
    line-height: var(--ha-line-height-condensed, 1.2);
    color: var(--ha-card-header-color, var(--primary-text-color));
    padding: 0 var(--ha-space-1, 4px);
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--ha-space-2, 8px);
  }

  .nav,
  .actions {
    display: flex;
    align-items: center;
    gap: var(--ha-space-1, 4px);
    min-width: 0;
  }

  .range {
    margin: 0 var(--ha-space-1, 4px);
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon-button {
    width: 36px;
    height: 36px;
    border-radius: var(--ha-border-radius-circle, 50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color);
    transition: background-color 120ms ease;
  }
  .icon-button:hover:not(:disabled),
  .pill:hover:not(:disabled),
  .segmented button:hover:not([aria-pressed="true"]) {
    background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
  }

  .pill {
    height: 32px;
    padding: 0 var(--ha-space-3, 12px);
    border-radius: var(--ha-border-radius-pill, 9999px);
    border: 1px solid var(--jtd-border);
    display: inline-flex;
    align-items: center;
    gap: var(--ha-space-1, 4px);
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    white-space: nowrap;
  }
  .pill ha-icon {
    --mdc-icon-size: 18px;
  }

  .segmented {
    display: inline-flex;
    border: 1px solid var(--jtd-border);
    border-radius: var(--ha-border-radius-pill, 9999px);
    overflow: hidden;
    height: 32px;
  }
  .segmented button {
    display: inline-flex;
    align-items: center;
    gap: var(--ha-space-1, 4px);
    padding: 0 var(--ha-space-3, 12px);
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .segmented button + button {
    border-inline-start: 1px solid var(--jtd-border);
  }
  .segmented button[aria-pressed="true"] {
    background: color-mix(in srgb, var(--primary-color) 18%, transparent);
    color: var(--primary-color);
  }
  .segmented ha-icon {
    --mdc-icon-size: 18px;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ha-space-1, 4px) var(--ha-space-2, 8px);
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 26px;
    padding: 0 10px 0 8px;
    border-radius: var(--ha-border-radius-pill, 9999px);
    background: color-mix(in srgb, var(--event-color) 14%, transparent);
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    max-width: 100%;
  }
  .chip span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .chip[aria-pressed="false"] {
    background: none;
    color: var(--secondary-text-color);
    text-decoration: line-through;
    box-shadow: inset 0 0 0 1px var(--jtd-border);
  }
  .chip[aria-pressed="false"] .dot {
    background: transparent;
    box-shadow: inset 0 0 0 2px var(--event-color);
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--event-color);
    flex: none;
  }

  .notice {
    margin: 0 var(--ha-space-3, 12px) var(--ha-space-2, 8px);
    padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
    border-radius: var(--ha-border-radius-md, 8px);
    font-size: var(--ha-font-size-s, 12px);
    background: color-mix(in srgb, var(--warning-color, #ffa600) 14%, transparent);
  }

  .loading {
    position: absolute;
    inset: 0 0 auto 0;
    height: 2px;
    overflow: hidden;
    z-index: 1;
  }
  .loading::after {
    content: "";
    position: absolute;
    inset: 0;
    width: 30%;
    background: var(--primary-color);
    animation: slide 1.1s ease-in-out infinite;
  }
  @keyframes slide {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(400%);
    }
  }

  /* ------------------------------------------------------------- grid */

  .weekdays,
  .week {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  .weekdays {
    border-bottom: 1px solid var(--jtd-border);
    padding: 0 0 var(--ha-space-1, 4px);
  }
  .weekdays div {
    text-align: center;
    font-size: var(--ha-font-size-xs, 11px);
    font-weight: var(--ha-font-weight-medium, 500);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--secondary-text-color);
  }
  .weekdays .narrow {
    display: none;
  }

  .weeks {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
  }

  .week {
    flex: 1 1 auto;
    min-height: var(--jtd-week-min-height, 96px);
    row-gap: var(--jtd-gap);
    border-bottom: 1px solid var(--jtd-border);
    position: relative;
  }
  .week:last-child {
    border-bottom: none;
  }

  .day {
    grid-row: 1 / -1;
    border-inline-end: 1px solid var(--jtd-border);
    border-radius: 0;
    transition: background-color 120ms ease;
  }
  .day.last-col {
    border-inline-end: none;
  }
  .day:hover {
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
  }
  .day.other-month {
    background: color-mix(in srgb, var(--primary-text-color) 3%, transparent);
  }
  .day.today {
    background: color-mix(in srgb, var(--jtd-today) 8%, transparent);
  }

  .day-head {
    grid-row: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2px;
    padding: 4px 4px 2px 6px;
    min-width: 0;
    pointer-events: none;
    z-index: 1;
  }

  .date {
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    min-width: 24px;
    height: 24px;
    padding: 0 4px;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--ha-border-radius-pill, 9999px);
    white-space: nowrap;
    flex: none;
  }
  .other-month-head .date {
    color: var(--secondary-text-color);
    opacity: 0.7;
  }
  .today-head .date {
    background: var(--jtd-today);
    color: var(--text-primary-color, #fff);
  }
  .past-head .date {
    color: var(--secondary-text-color);
  }

  /* ---------------------------------------------------------- weather */

  .wx {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    min-width: 0;
    overflow: hidden;
    font-size: var(--ha-font-size-s, 12px);
    line-height: 1;
    white-space: nowrap;
  }
  .wx-icon {
    --mdc-icon-size: 18px;
  }
  .tone-sun {
    color: var(--jtd-sun);
  }
  .tone-night {
    color: var(--jtd-night);
  }
  .tone-cloud {
    color: var(--jtd-cloud);
  }
  .tone-rain {
    color: var(--jtd-rain);
  }
  .tone-snow {
    color: var(--jtd-snow);
  }
  .tone-storm {
    color: var(--jtd-storm);
  }
  .tone-wind {
    color: var(--jtd-wind);
  }
  .tone-alert {
    color: var(--jtd-alert);
  }
  .temps {
    display: inline-flex;
    gap: 3px;
  }
  .hi {
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .lo {
    color: var(--secondary-text-color);
  }
  .wx.history .wx-icon {
    opacity: 0.75;
  }
  .wx.normal .temps {
    font-style: italic;
    color: var(--secondary-text-color);
  }
  .wx.normal .hi::before {
    content: "~";
  }
  .pop {
    display: inline-flex;
    align-items: center;
    color: var(--jtd-rain);
    font-size: var(--ha-font-size-xs, 10px);
  }
  .pop ha-icon {
    --mdc-icon-size: 12px;
  }

  /* ----------------------------------------------------------- events */

  .event {
    position: relative;
    z-index: 1;
    height: var(--jtd-event-height);
    margin: 0 4px;
    padding: 0 6px;
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
    font-size: var(--ha-font-size-s, 12px);
    line-height: var(--jtd-event-height);
    text-align: start;
    border-radius: var(--ha-border-radius-sm, 4px);
    overflow: hidden;
  }
  .event .label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }
  .event.spanning {
    background: color-mix(in srgb, var(--event-color) 24%, transparent);
    box-shadow: inset 3px 0 0 var(--event-color);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .event.spanning:hover {
    background: color-mix(in srgb, var(--event-color) 34%, transparent);
  }
  .event.cont-before {
    margin-inline-start: 0;
    border-start-start-radius: 0;
    border-end-start-radius: 0;
    box-shadow: none;
  }
  .event.cont-after {
    margin-inline-end: 0;
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }
  .event.timed {
    padding: 0 4px;
  }
  .event.timed:hover {
    background: color-mix(in srgb, var(--event-color) 14%, transparent);
  }
  .event .time {
    color: var(--secondary-text-color);
    flex: none;
    font-variant-numeric: tabular-nums;
  }
  .event.tentative {
    font-style: italic;
  }
  .event.tentative.spanning {
    background: repeating-linear-gradient(
      -45deg,
      color-mix(in srgb, var(--event-color) 22%, transparent) 0 6px,
      color-mix(in srgb, var(--event-color) 10%, transparent) 6px 12px
    );
  }
  .dim .event.past {
    opacity: 0.55;
  }

  .more {
    position: relative;
    z-index: 1;
    margin: 0 4px;
    padding: 0 6px;
    height: var(--jtd-event-height);
    border-radius: var(--ha-border-radius-sm, 4px);
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    color: var(--secondary-text-color);
    text-align: start;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .more:hover {
    background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
  }

  .expander {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ha-space-2, 8px);
    padding: var(--ha-space-2, 8px);
    border-top: 1px solid var(--jtd-border);
    font-size: var(--ha-font-size-s, 12px);
    color: var(--secondary-text-color);
  }

  .empty-hint {
    padding: var(--ha-space-4, 16px);
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-m, 14px);
  }

  /* ------------------------------------------------- narrow containers */

  @container jtd-calendar (max-width: 1000px) {
    .pop {
      display: none;
    }
  }

  @container jtd-calendar (max-width: 880px) {
    .wx .lo {
      display: none;
    }
  }

  @container jtd-calendar (max-width: 520px) {
    :host {
      --jtd-event-height: 18px;
    }
    .weekdays .wide {
      display: none;
    }
    .weekdays .narrow {
      display: block;
    }
    .day-head {
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
      padding: 2px 2px 0;
    }
    .date {
      min-width: 22px;
      height: 22px;
    }
    .wx {
      padding-inline-start: 2px;
      font-size: var(--ha-font-size-xs, 10px);
    }
    .wx-icon {
      --mdc-icon-size: 15px;
    }
    .event,
    .more {
      margin: 0 1px;
      padding: 0 3px;
      font-size: var(--ha-font-size-xs, 10px);
    }
    .event .time {
      display: none;
    }
    .event.timed .dot {
      width: 6px;
      height: 6px;
    }
    .segmented span,
    .pill .label {
      display: none;
    }
    .segmented button {
      padding: 0 var(--ha-space-2, 8px);
    }
  }

  /* ----------------------------------------------------------- dialog */

  dialog {
    border: none;
    padding: 0;
    width: min(460px, calc(100vw - 32px));
    max-height: min(85vh, 720px);
    border-radius: var(--ha-dialog-border-radius, var(--ha-border-radius-4xl, 28px));
    background: var(
      --ha-dialog-surface-background,
      var(--card-background-color, var(--ha-card-background, #fff))
    );
    color: var(--primary-text-color);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }
  dialog::backdrop {
    background: var(--ha-dialog-scrim-backdrop, rgba(0, 0, 0, 0.32));
  }
  dialog[open] {
    animation: dialog-in 160ms ease-out;
  }
  @keyframes dialog-in {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
  }

  .dlg:focus {
    outline: none;
  }
  .dlg {
    display: flex;
    flex-direction: column;
    max-height: inherit;
    padding: var(--ha-space-5, 20px) var(--ha-space-5, 20px) var(--ha-space-4, 16px);
    box-sizing: border-box;
    gap: var(--ha-space-4, 16px);
    overflow: auto;
  }
  .dlg-head {
    display: flex;
    align-items: flex-start;
    gap: var(--ha-space-2, 8px);
  }
  .dlg-head .grow {
    flex: 1;
    min-width: 0;
  }
  .dlg-head h3 {
    margin: 0;
    font-size: var(--ha-font-size-2xl, 24px);
    font-weight: var(--ha-font-weight-normal, 400);
    line-height: 1.25;
    overflow-wrap: anywhere;
  }
  .dlg-sub {
    font-size: var(--ha-font-size-s, 12px);
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 2px;
  }
  .dlg-head .icon-button {
    margin: -6px -8px 0 0;
  }
  .dlg-head .back {
    margin: -6px 0 0 -8px;
  }

  .wx-card {
    display: flex;
    align-items: center;
    gap: var(--ha-space-3, 12px);
    padding: var(--ha-space-3, 12px);
    border-radius: var(--ha-border-radius-lg, 12px);
    background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
  }
  .wx-card ha-icon {
    --mdc-icon-size: 40px;
  }
  .wx-card .grow {
    flex: 1;
    min-width: 0;
  }
  .wx-card .cond {
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .wx-card .meta,
  .wx-card .src {
    font-size: var(--ha-font-size-s, 12px);
    color: var(--secondary-text-color);
  }
  .wx-card .temps-big {
    font-size: var(--ha-font-size-xl, 20px);
    white-space: nowrap;
  }
  .wx-card .temps-big .lo {
    font-size: var(--ha-font-size-l, 16px);
  }

  .dlg-events {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0 calc(-1 * var(--ha-space-2, 8px));
  }
  .dlg-event {
    display: flex;
    align-items: center;
    gap: var(--ha-space-3, 12px);
    padding: var(--ha-space-2, 8px);
    border-radius: var(--ha-border-radius-md, 8px);
    text-align: start;
  }
  .dlg-event:hover {
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
  }
  .dlg-event .bar {
    width: 4px;
    align-self: stretch;
    border-radius: 2px;
    background: var(--event-color);
    flex: none;
  }
  .dlg-event .grow {
    flex: 1;
    min-width: 0;
  }
  .dlg-event .summary {
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    overflow-wrap: anywhere;
  }
  .dlg-event .meta {
    font-size: var(--ha-font-size-s, 12px);
    color: var(--secondary-text-color);
    overflow-wrap: anywhere;
  }
  .dlg-event > ha-icon {
    color: var(--secondary-text-color);
  }
  .dlg-empty {
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-m, 14px);
    padding: var(--ha-space-2, 8px) 0;
  }

  .detail-rows {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-3, 12px);
  }
  .detail {
    display: flex;
    gap: var(--ha-space-3, 12px);
    align-items: flex-start;
    font-size: var(--ha-font-size-m, 14px);
    line-height: 1.45;
  }
  .detail > ha-icon {
    color: var(--secondary-text-color);
    margin-top: 1px;
  }
  .detail .text {
    min-width: 0;
    overflow-wrap: anywhere;
    white-space: pre-line;
  }
  .detail .dot {
    width: 12px;
    height: 12px;
    margin: 4px;
  }
  .badge {
    align-self: flex-start;
    font-size: var(--ha-font-size-xs, 11px);
    font-weight: var(--ha-font-weight-medium, 500);
    padding: 2px 8px;
    border-radius: var(--ha-border-radius-pill, 9999px);
    border: 1px dashed var(--secondary-text-color);
    color: var(--secondary-text-color);
  }
`;
