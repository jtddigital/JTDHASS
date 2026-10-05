// Minimal stand-ins for Home Assistant's ha-card and ha-icon, so cards can be
// developed and screenshotted outside Home Assistant. Also applies the demo
// URL options: ?theme=dark and ?width=<px>.
import * as mdi from "/node_modules/@mdi/js/mdi.js";

customElements.define(
  "ha-card",
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" }).innerHTML = `<style>
        :host { display: block; background: var(--ha-card-background); border-radius: var(--ha-card-border-radius);
          border: 1px solid var(--ha-card-border-color); color: var(--primary-text-color); }
      </style><slot></slot>`;
    }
  },
);

customElements.define(
  "ha-icon",
  class extends HTMLElement {
    static observedAttributes = ["icon"];

    set icon(value) {
      this._icon = value;
      this._render();
    }

    get icon() {
      return this._icon;
    }

    attributeChangedCallback(_name, _old, value) {
      this.icon = value;
    }

    _render() {
      const name =
        "mdi" +
        (this._icon || "")
          .replace("mdi:", "")
          .split("-")
          .map((part) => part[0].toUpperCase() + part.slice(1))
          .join("");
      // Render into shadow DOM like the real ha-icon; touching light DOM
      // would break Lit's template cloning in the card.
      const root = this.shadowRoot || this.attachShadow({ mode: "open" });
      root.innerHTML = `<svg viewBox="0 0 24 24" style="width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px);fill:currentColor;display:block"><path d="${mdi[name] || ""}"/></svg>`;
    }
  },
);

const params = new URLSearchParams(location.search);
if (params.get("theme") === "dark") document.documentElement.classList.add("dark");
if (params.get("width")) {
  document.documentElement.style.setProperty("--demo-width", `${params.get("width")}px`);
}
